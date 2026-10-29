import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { requireRole, isAuthError } from "@/lib/requireRole";
import { parseDataUrl } from "@/lib/media-mime";

export const runtime = "nodejs";

function dataUrlToResponse(
  dataUrl: string,
  {
    isPrivate = false,
    isVersioned = true,
  }: { isPrivate?: boolean; isVersioned?: boolean } = {}
): NextResponse | null {
  const parsed = parseDataUrl(dataUrl);
  if (!parsed) return null;

  const { bytes, mimeType } = parsed;

  const cacheControl = isPrivate
    ? "private, no-store, max-age=0"
    : isVersioned
      ? "public, max-age=31536000, immutable"
      : "public, max-age=60, stale-while-revalidate=86400";

  return new NextResponse(new Uint8Array(bytes), {
    status: 200,
    headers: {
      "Content-Type": mimeType,
      "Content-Length": String(bytes.byteLength),
      "X-Content-Type-Options": "nosniff",
      "Cache-Control": cacheControl,
    },
  });
}

async function serveMediaItemById(id: string): Promise<NextResponse> {
  const item = await prisma.media.findUnique({
    where: { id },
    select: { url: true, mimeType: true, folder: true },
  });
  if (!item?.url) {
    return new NextResponse("Not Found", { status: 404 });
  }

  const isPrivateResume = item.folder === "resumes";
  if (isPrivateResume) {
    const auth = await requireRole("VIEWER");
    if (isAuthError(auth)) return auth;
  }

  const inlineResp = dataUrlToResponse(item.url, {
    isPrivate: isPrivateResume,
    isVersioned: true,
  });
  if (inlineResp) return inlineResp;

  if (item.url.startsWith("http://") || item.url.startsWith("https://")) {
    return NextResponse.redirect(item.url, 302);
  }
  return new NextResponse("Not Found", { status: 404 });
}

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ slug: string[] }> }
) {
  try {
    const { slug } = await params;
    if (!slug || slug.length < 2) {
      return new NextResponse("Not Found", { status: 404 });
    }

    // ── /api/media/item/[id] ────────────────────────────────────────────────
    if (slug[0] === "item" && slug[1]) {
      return await serveMediaItemById(slug[1]);
    }

    // ── /api/media/entity/[kind]/[id] ───────────────────────────────────────
    if (slug[0] === "entity" && slug[1] && slug[2]) {
      const kind = slug[1];
      const id = slug[2];
      const hasVersion = req.nextUrl.searchParams.has("v");
      let rawUrl: string | null | undefined = null;

      if (kind === "project") {
        const row = await prisma.project.findUnique({
          where: { id },
          select: { coverImage: true },
        });
        rawUrl = row?.coverImage;
      } else if (kind === "project-gallery") {
        const idx = Number(req.nextUrl.searchParams.get("i") ?? "0");
        const row = await prisma.project.findUnique({
          where: { id },
          select: { gallery: true },
        });
        rawUrl = row?.gallery?.[idx];
      } else if (kind === "blog") {
        const row = await prisma.blogPost.findUnique({
          where: { id },
          select: { coverImage: true },
        });
        rawUrl = row?.coverImage;
      } else if (kind === "team") {
        const row = await prisma.teamMember.findUnique({
          where: { id },
          select: { avatarUrl: true },
        });
        rawUrl = row?.avatarUrl;
      } else if (kind === "testimonial") {
        const row = await prisma.testimonial.findUnique({
          where: { id },
          select: { avatarUrl: true },
        });
        rawUrl = row?.avatarUrl;
      }

      if (!rawUrl) {
        return new NextResponse("Not Found", { status: 404 });
      }

      if (rawUrl.startsWith("/api/media/item/")) {
        const mediaId = rawUrl.slice("/api/media/item/".length).split("?")[0];
        if (mediaId) return await serveMediaItemById(mediaId);
      }

      const inlineResp = dataUrlToResponse(rawUrl, {
        isPrivate: false,
        isVersioned: hasVersion,
      });
      if (inlineResp) return inlineResp;

      if (rawUrl.startsWith("http://") || rawUrl.startsWith("https://")) {
        return NextResponse.redirect(rawUrl, 302);
      }
    }

    return new NextResponse("Not Found", { status: 404 });
  } catch (err) {
    console.error("[api/media]", err);
    return new NextResponse("Internal Server Error", { status: 500 });
  }
}
