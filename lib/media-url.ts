/**
 * Utilities for serving inline / uploaded images via lightweight binary HTTP
 * endpoints instead of multi-megabyte base64 strings inside RSC & HTML payloads.
 */

export type InlineEntityKind =
  | "project"
  | "blog"
  | "team"
  | "testimonial";

/** Bump NEXT_PUBLIC_MEDIA_VERSION to force a fresh fetch of all legacy (unstamped) images. */
const MEDIA_VERSION = process.env.NEXT_PUBLIC_MEDIA_VERSION || "2";

function withMediaCacheVersion(url: string): string {
  if (url.startsWith("/api/media/item/") && !url.includes("?")) {
    return `${url}?v=${MEDIA_VERSION}`;
  }
  return url;
}

export function resolveEntityImageUrl(
  rawUrl: string | null | undefined,
  kind: InlineEntityKind,
  id: string,
  updatedAt?: Date | string | null,
  fallback = ""
): string {
  if (!rawUrl || !rawUrl.trim() || rawUrl.startsWith("linear-gradient")) {
    return fallback;
  }
  if (rawUrl.startsWith("data:")) {
    const version = updatedAt ? new Date(updatedAt).getTime() : 2;
    return `/api/media/entity/${kind}/${encodeURIComponent(id)}?v=${version}`;
  }
  return withMediaCacheVersion(rawUrl);
}

export function resolveGalleryUrls(
  gallery: string[] | null | undefined,
  projectId: string,
  updatedAt?: Date | string | null,
  fallback: string[] = []
): string[] {
  if (!gallery || gallery.length === 0) return fallback;
  const version = updatedAt ? new Date(updatedAt).getTime() : 2;
  return gallery.map((item, index) => {
    if (!item) return item;
    if (item.startsWith("data:")) {
      return `/api/media/entity/project-gallery/${encodeURIComponent(projectId)}?i=${index}&v=${version}`;
    }
    return withMediaCacheVersion(item);
  });
}

export function isUnoptimizedImageSrc(src: string | null | undefined): boolean {
  if (!src) return false;
  return (
    src.startsWith("data:") ||
    src.startsWith("blob:") ||
    src.endsWith(".svg") ||
    src.includes("ext=svg")
  );
}
