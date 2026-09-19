import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { PutObjectCommand } from "@aws-sdk/client-s3";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";
import { randomUUID } from "crypto";
import { requireRole, isAuthError } from "@/lib/requireRole";
import {
  r2,
  R2_BUCKET,
  ALLOWED_IMAGE_TYPES,
  ALLOWED_VIDEO_TYPES,
  ALLOWED_DOCUMENT_TYPES,
  MAX_IMAGE_SIZE,
  MAX_VIDEO_SIZE,
  MAX_DOCUMENT_SIZE,
} from "@/lib/r2";

const PresignSchema = z.object({
  filename: z.string().min(1).max(255),
  mimeType: z.string().min(1).max(100),
  size: z.number().int().positive(),
  folder: z.enum(["uploads", "blog", "projects", "team", "services", "resumes", "logos"]),
  // Client-computed metadata (trusted only for UI, server re-verifies on /complete)
  width: z.number().int().positive().optional(),
  height: z.number().int().positive().optional(),
});

function getAllowedMimes(folder: string) {
  if (folder === "resumes") return ALLOWED_DOCUMENT_TYPES;
  return [...ALLOWED_IMAGE_TYPES, ...ALLOWED_VIDEO_TYPES];
}

function getMaxSize(mimeType: string): number {
  if (ALLOWED_VIDEO_TYPES.includes(mimeType)) return MAX_VIDEO_SIZE;
  if (ALLOWED_DOCUMENT_TYPES.includes(mimeType)) return MAX_DOCUMENT_SIZE;
  return MAX_IMAGE_SIZE;
}

function buildObjectKey(folder: string, filename: string, mimeType: string): string {
  const now = new Date();
  const year = now.getFullYear();
  const month = String(now.getMonth() + 1).padStart(2, "0");
  const uuid = randomUUID();
  // Sanitize filename
  const ext = filename.split(".").pop()?.toLowerCase() ?? "bin";
  const safeExt = mimeType === "image/webp" ? "webp" : ext;
  return `${folder}/${year}/${month}/${uuid}.${safeExt}`;
}

export async function POST(req: NextRequest) {
  // Auth check — EDITOR minimum for media uploads
  const authResult = await requireRole("EDITOR");
  if (isAuthError(authResult)) return authResult;

  try {
    const body = await req.json();
    const parsed = PresignSchema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json(
        { error: "Invalid request.", details: parsed.error.flatten() },
        { status: 400 }
      );
    }

    const { filename, mimeType, size, folder } = parsed.data;

    // Validate MIME type for folder
    const allowed = getAllowedMimes(folder);
    if (!allowed.includes(mimeType)) {
      return NextResponse.json(
        { error: `File type "${mimeType}" is not allowed in folder "${folder}".` },
        { status: 400 }
      );
    }

    // Validate size
    const maxSize = getMaxSize(mimeType);
    if (size > maxSize) {
      return NextResponse.json(
        { error: `File too large. Max size: ${Math.round(maxSize / 1024 / 1024)} MB.` },
        { status: 400 }
      );
    }

    // Build object key
    const key = buildObjectKey(folder, filename, mimeType);

    // Generate presigned PUT URL (5 minute expiry)
    const command = new PutObjectCommand({
      Bucket: R2_BUCKET,
      Key: key,
      ContentType: mimeType,
      ContentLength: size,
      // Immutable cache — content-addressed by UUID key
      CacheControl: "public, max-age=31536000, immutable",
    });

    const presignedUrl = await getSignedUrl(r2, command, { expiresIn: 300 });

    return NextResponse.json({
      presignedUrl,
      key,
      // Client uses this to construct the final URL optimistically
      folder,
    });
  } catch (error) {
    console.error("[media/presign]", error);
    return NextResponse.json({ error: "Failed to generate upload URL." }, { status: 500 });
  }
}
