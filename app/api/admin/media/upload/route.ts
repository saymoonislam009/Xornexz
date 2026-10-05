import { NextRequest, NextResponse } from "next/server";
import { PutObjectCommand } from "@aws-sdk/client-s3";
import { randomUUID } from "crypto";
import { revalidateTag } from "next/cache";
import { requireRole, isAuthError } from "@/lib/requireRole";
import { prisma } from "@/lib/db";
import { r2, R2_BUCKET, mediaUrl, ALLOWED_IMAGE_TYPES, MAX_IMAGE_SIZE } from "@/lib/r2";

export const dynamic = "force-dynamic";
export const runtime = "nodejs";

const FOLDERS = ["uploads", "blog", "projects", "team", "services", "logos", "testimonials"];
// Vercel serverless request body hard ceiling
const HARD_LIMIT = 4.5 * 1024 * 1024;
// Inline database fallback
const INLINE_LIMIT = 3.5 * 1024 * 1024;

function r2Configured() {
  return Boolean(
    process.env.R2_ACCOUNT_ID &&
      process.env.R2_ACCESS_KEY_ID &&
      process.env.R2_SECRET_ACCESS_KEY &&
      process.env.NEXT_PUBLIC_MEDIA_URL
  );
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
    if (!ALLOWED_IMAGE_TYPES.includes(file.type)) {
      return NextResponse.json(
        { error: `Unsupported image type "${file.type || "unknown"}". Use JPG, PNG, WebP or GIF.` },
        { status: 400 }
      );
    }
    if (file.size > Math.min(HARD_LIMIT, MAX_IMAGE_SIZE)) {
      return NextResponse.json({ error: "Image is too large (max 4.5 MB). Try a smaller image." }, { status: 413 });
    }

    const buffer = Buffer.from(await file.arrayBuffer());

    // ── Preferred: Cloudflare R2 ────────────────────────────────────────────
    if (r2Configured()) {
      const now = new Date();
      const ext = file.type === "image/webp" ? "webp" : (file.name.split(".").pop() || "jpg").toLowerCase();
      const key = `${folder}/${now.getFullYear()}/${String(now.getMonth() + 1).padStart(2, "0")}/${randomUUID()}.${ext}`;
      try {
        await r2.send(
          new PutObjectCommand({
            Bucket: R2_BUCKET,
            Key: key,
            Body: buffer,
            ContentType: file.type,
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
              mimeType: file.type,
              size: file.size,
              folder,
              alt,
              width,
              height,
              uploadedById: authResult.userId,
            },
          });
          revalidateTag("media");
        } catch (dbErr) {
          console.error("[media/upload] db record creation failed", dbErr);
        }
        return NextResponse.json({ media: mediaRecord });
      } catch (r2Err) {
        console.error("[media/upload] R2 failed, falling back to database inline", r2Err);
        // fall through to inline storage
      }
    }

    // ── Fallback: inline data URL (works with zero external services configured) ─
    if (file.size > INLINE_LIMIT) {
      return NextResponse.json(
        { error: "Image is over 3.5 MB. Please use a smaller image." },
        { status: 413 }
      );
    }

    const url = `data:${file.type};base64,${buffer.toString("base64")}`;
    const inlineKey = `inline-${randomUUID()}`;
    let mediaRecord: unknown = { url, key: inlineKey, inline: true };

    try {
      mediaRecord = await prisma.media.create({
        data: {
          key: inlineKey,
          url,
          mimeType: file.type,
          size: file.size,
          folder,
          alt,
          width,
          height,
          uploadedById: authResult.userId,
        },
      });
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
