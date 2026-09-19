import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { HeadObjectCommand } from "@aws-sdk/client-s3";
import { requireRole, isAuthError } from "@/lib/requireRole";
import { prisma } from "@/lib/db";
import { r2, R2_BUCKET, mediaUrl } from "@/lib/r2";
import { revalidateTag } from "next/cache";

const CompleteSchema = z.object({
  key: z.string().min(1).max(500),
  folder: z.enum(["uploads", "blog", "projects", "team", "services", "resumes", "logos"]),
  alt: z.string().max(500).default(""),
  caption: z.string().max(1000).default(""),
  // Client-computed (before upload) — used for UX only; server re-verifies real values
  width: z.number().int().positive().optional(),
  height: z.number().int().positive().optional(),
  duration: z.number().positive().optional(),
  blurDataUrl: z.string().max(2000).optional(), // tiny base64 placeholder
  thumbnailKey: z.string().max(500).optional(),
});

export async function POST(req: NextRequest) {
  // Auth — EDITOR minimum
  const authResult = await requireRole("EDITOR");
  if (isAuthError(authResult)) return authResult;

  try {
    const body = await req.json();
    const parsed = CompleteSchema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json(
        { error: "Invalid request.", details: parsed.error.flatten() },
        { status: 400 }
      );
    }

    const {
      key, folder, alt, caption,
      width, height, duration, blurDataUrl, thumbnailKey,
    } = parsed.data;

    // Verify the object exists in R2 and get its real size / content type
    let realSize: number;
    let realMimeType: string;
    try {
      const head = await r2.send(
        new HeadObjectCommand({ Bucket: R2_BUCKET, Key: key })
      );
      realSize = head.ContentLength ?? 0;
      realMimeType = head.ContentType ?? "application/octet-stream";
    } catch {
      return NextResponse.json(
        { error: "Object not found in R2. Upload may have failed." },
        { status: 404 }
      );
    }

    const url = mediaUrl(key);
    const thumbUrl = thumbnailKey ? mediaUrl(thumbnailKey) : undefined;

    const media = await prisma.media.create({
      data: {
        key,
        url,
        thumbnailKey: thumbnailKey ?? null,
        thumbnailUrl: thumbUrl ?? null,
        mimeType: realMimeType,
        size: realSize,
        folder,
        alt,
        caption,
        width: width ?? null,
        height: height ?? null,
        duration: duration ?? null,
        blurDataUrl: blurDataUrl ?? null,
        uploadedById: authResult.userId,
      },
    });

    // Revalidate media library cache
    revalidateTag("media");

    return NextResponse.json({ media });
  } catch (error) {
    console.error("[media/complete]", error);
    return NextResponse.json({ error: "Failed to save media record." }, { status: 500 });
  }
}
