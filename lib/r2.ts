/**
 * lib/r2.ts — Cloudflare R2 S3-compatible client
 * Files NEVER go through Vercel. Flow:
 *   1. Client calls /api/admin/media/presign → gets presigned PUT URL
 *   2. Browser uploads directly to R2 with XHR
 *   3. Client calls /api/admin/media/complete → server HeadObjects, creates Media row
 */
import { S3Client } from "@aws-sdk/client-s3";

if (!process.env.R2_ACCOUNT_ID) {
  // Only warn — don't throw at module load time so build still works without env
  if (process.env.NODE_ENV === "production") {
    console.warn("[r2] R2_ACCOUNT_ID is not set. Media uploads will fail.");
  }
}

export const r2 = new S3Client({
  region: "auto",
  endpoint:
    process.env.R2_ENDPOINT ??
    `https://${process.env.R2_ACCOUNT_ID ?? "missing"}.r2.cloudflarestorage.com`,
  credentials: {
    accessKeyId: process.env.R2_ACCESS_KEY_ID ?? "missing",
    secretAccessKey: process.env.R2_SECRET_ACCESS_KEY ?? "missing",
  },
});

export const R2_BUCKET = process.env.R2_BUCKET ?? "xornexz-media";
export const MEDIA_URL = process.env.NEXT_PUBLIC_MEDIA_URL ?? "https://media.xornexz.com";

/** Build the public CDN URL for an R2 object key */
export function mediaUrl(key: string): string {
  return `${MEDIA_URL}/${key}`;
}

/** Allowed MIME types and max sizes */
export const ALLOWED_IMAGE_TYPES = [
  "image/jpeg",
  "image/png",
  "image/webp",
  "image/gif",
  "image/svg+xml",
];
export const ALLOWED_VIDEO_TYPES = [
  "video/mp4",
  "video/webm",
  "video/quicktime",
];
export const ALLOWED_DOCUMENT_TYPES = [
  "application/pdf",
  "application/msword",
  "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
];

export const MAX_IMAGE_SIZE = 10 * 1024 * 1024; // 10 MB
export const MAX_VIDEO_SIZE = 500 * 1024 * 1024; // 500 MB
export const MAX_DOCUMENT_SIZE = 5 * 1024 * 1024; // 5 MB (resumes, docs)
export const MULTIPART_THRESHOLD = 50 * 1024 * 1024; // 50 MB — use multipart above this
export const MULTIPART_CHUNK_SIZE = 10 * 1024 * 1024; // 10 MB chunks
