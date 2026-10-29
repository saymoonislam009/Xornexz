import { revalidatePath, revalidateTag } from "next/cache";

/**
 * Invalidates Next.js data cache tags AND route caches across both the homepage
 * and public sub-pages so admin saves appear immediately on the public site.
 */
export function revalidatePublicSite(tags: string[] = [], paths: string[] = []) {
  try {
    const allTags = new Set(["home-content", ...tags]);
    for (const tag of allTags) {
      revalidateTag(tag);
    }
    revalidatePath("/", "layout");
    revalidatePath("/", "page");
    for (const p of paths) {
      revalidatePath(p, "page");
    }
  } catch (err) {
    console.warn("[revalidate] cache invalidation warning:", err);
  }
}
