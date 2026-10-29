import { randomUUID } from "crypto";
import { prisma } from "@/lib/db";
import { parseDataUrl } from "@/lib/media-mime";

/**
 * If `url` is a base64 `data:` URI, stores it in the `Media` table with its
 * verified binary MIME type and returns `/api/media/item/<id>?v=2`.
 * Otherwise returns `url` unchanged.
 */
export async function persistDataUrlIfInline(
  url: string | null | undefined,
  folder = "projects",
  alt = ""
): Promise<string | undefined> {
  if (!url) return url ?? undefined;
  if (!url.startsWith("data:")) return url;

  const parsed = parseDataUrl(url);
  if (!parsed) return url;

  const { bytes, mimeType } = parsed;
  const normalizedDataUrl = `data:${mimeType};base64,${bytes.toString("base64")}`;
  const querySuffix = mimeType === "image/svg+xml" ? "?v=2&ext=svg" : "?v=2";

  try {
    const created = await prisma.media.create({
      data: {
        key: `inline-${randomUUID()}`,
        url: normalizedDataUrl,
        mimeType,
        size: bytes.byteLength,
        folder,
        alt: alt.slice(0, 500),
      },
    });
    return `/api/media/item/${created.id}${querySuffix}`;
  } catch (err) {
    console.warn("[media-persist] fallback keeping inline url:", err);
    return normalizedDataUrl;
  }
}

export async function persistGalleryIfInline(
  gallery: unknown,
  folder = "projects",
  alt = ""
): Promise<string[] | undefined> {
  if (!Array.isArray(gallery)) return undefined;
  const out: string[] = [];
  for (const item of gallery) {
    if (typeof item === "string" && item.trim()) {
      const persisted = await persistDataUrlIfInline(item, folder, alt);
      if (persisted) out.push(persisted);
    }
  }
  return out;
}
