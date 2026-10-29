import { NextRequest, NextResponse } from "next/server";
import { PutObjectCommand } from "@aws-sdk/client-s3";
import { randomUUID } from "crypto";
import { revalidateTag } from "next/cache";
import { requireRole, isAuthError } from "@/lib/requireRole";
import { prisma } from "@/lib/db";
import { r2, R2_BUCKET, mediaUrl, ALLOWED_IMAGE_TYPES, MAX_IMAGE_SIZE } from "@/lib/r2";
import { detectBufferMimeType } from "@/lib/media-mime";

export const dynamic = "force-dynamic";
export const runtime = "nodejs";

const FOLDERS = ["uploads", "blog", "projects", "team", "services", "logos", "testimonials"];
// Vercel serverless request body hard ceiling
const HARD_LIMIT = 4.5 * 1024 * 1024;
// Inline database fallback
const INLINE_LIMIT = 3.5 * 1024 * 1024;

function isRealEnvValue(val: string | undefined): boolean {
  if (!val) return false;
  const trimmed = val.trim();
  if (!trimmed || trimmed === "missing" || trimmed.startsWith("your_")) return false;
  return true;
}

function r2Configured() {
  return (
    isRealEnvValue(process.env.R2_ACCOUNT_ID) &&
    isRealEnvValue(process.env.R2_ACCESS_KEY_ID) &&
    isRealEnvValue(process.env.R2_SECRET_ACCESS_KEY) &&
    isRealEnvValue(process.env.NEXT_PUBLIC_MEDIA_URL)
  );
}

function extFromMime(mimeType: string, fallbackName: string): string {
  if (mimeType === "image/webp") return "webp";
  if (mimeType === "image/png") return "png";
  if (mimeType === "image/jpeg") return "jpg";
  if (mimeType === "image/gif") return "gif";
  if (mimeType === "image/svg+xml") return "svg";
  return (fallbackName.split(".").pop() || "jpg").toLowerCase();
}

export async function POST(req: NextRequest) {
  const authResult = await requireRole("EDITOR");
  if (isAuthError(authResult)) return authResult;

  try {
    const form = await req.formData();
    const file = form.get("file");
    const folderRaw = String(form.get("folder") ?? "uploads");
    const folder = FOLDERS.includes(folderRaw) ? folderRaw : "uploads";
    const alt = String(form.get("alt") ?? "").slice(0, 500);
    const width = Number(form.get("width")) || null;
    const height = Number(form.get("height")) || null;

    if (!(file instanceof File)) {
      return NextResponse.json({ error: "No file received." }, { status: 400 });
    }
    if (file.size > Math.min(HARD_LIMIT, MAX_IMAGE_SIZE)) {
      return NextResponse.json(
        { error: "Image is too large (max 4.5 MB). Try a smaller image." },
        { status: 413 }
      );
    }

    const buffer = Buffer.from(await file.arrayBuffer());
    const trueMime = detectBufferMimeType(buffer, file.type);

    if (!ALLOWED_IMAGE_TYPES.includes(trueMime)) {
      return NextResponse.json(
        {
          error: `Unsupported image type "${trueMime || "unknown"}". Use JPG, PNG, WebP, SVG or GIF.`,
        },
        { status: 400 }
      );
    }

    // Verify user row exists so uploadedById never triggers a foreign-key error
    let uploadedById: string | undefined = undefined;
    try {
      const existingUser = await prisma.user.findUnique({
        where: { id: authResult.userId },
        select: { id: true },
      });
      if (existingUser) uploadedById = existingUser.id;
    } catch {
      uploadedById = undefined;
    }

    // ── Preferred: Cloudflare R2 ────────────────────────────────────────────
    if (r2Configured()) {
      const now = new Date();
      const ext = extFromMime(trueMime, file.name);
      const key = `${folder}/${now.getFullYear()}/${String(now.getMonth() + 1).padStart(2, "0")}/${randomUUID()}.${ext}`;
      try {
        await r2.send(
          new PutObjectCommand({
            Bucket: R2_BUCKET,
            Key: key,
            Body: buffer,
            ContentType: trueMime,
            CacheControl: "public, max-age=31536000, immutable",
          })
        );
        const url = mediaUrl(key);
        let mediaRecord: unknown = { url, key };
        try {
          mediaRecord = await prisma.media.create({
            data: {
              key,
              url,
              mimeType: trueMime,
              size: buffer.byteLength,
              folder,
              alt: alt || file.name,
              width,
              height,
              ...(uploadedById ? { uploadedById } : {}),
            },
          });
          revalidateTag("media");
        } catch (dbErr) {
          console.error("[media/upload] db record creation failed", dbErr);
        }
        return NextResponse.json({ media: mediaRecord });
      } catch (r2Err) {
        console.error("[media/upload] R2 failed, falling back to database inline", r2Err);
      }
    }

    // ── Fallback: inline database Media row served via /api/media/item/[id] ─
    if (buffer.byteLength > INLINE_LIMIT) {
      return NextResponse.json(
        { error: "Image is over 3.5 MB. Please use a smaller image." },
        { status: 413 }
      );
    }

    const dataUrl = `data:${trueMime};base64,${buffer.toString("base64")}`;
    const inlineKey = `inline-${randomUUID()}`;
    const querySuffix = trueMime === "image/svg+xml" ? "?v=2&ext=svg" : "?v=2";
    let mediaRecord: unknown = { url: dataUrl, key: inlineKey, inline: true };

    try {
      const created = await prisma.media.create({
        data: {
          key: inlineKey,
          url: dataUrl,
          mimeType: trueMime,
          size: buffer.byteLength,
          folder,
          alt: alt || file.name,
          width,
          height,
          ...(uploadedById ? { uploadedById } : {}),
        },
      });
      mediaRecord = {
        ...created,
        url: `/api/media/item/${created.id}${querySuffix}`,
      };
      revalidateTag("media");
    } catch (dbErr) {
      console.warn("[media/upload] could not save fallback to media table:", dbErr);
    }

    return NextResponse.json({ media: mediaRecord });
  } catch (error) {
    console.error("[media/upload]", error);
    return NextResponse.json({ error: "Upload failed. Please try again." }, { status: 500 });
  }
}
