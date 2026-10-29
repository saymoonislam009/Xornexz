import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { requireRole, isAuthError } from "@/lib/requireRole";

export const runtime = "nodejs";

function dataUrlToResponse(dataUrl: string, isPrivate = false): NextResponse | null {
  if (!dataUrl.startsWith("data:")) return null;
  const commaIdx = dataUrl.indexOf(",");
  if (commaIdx === -1) return null;

  const meta = dataUrl.slice(5, commaIdx); // e.g. "image/webp;base64"
  const [mimeRaw, encoding] = meta.split(";");
  const mimeType = mimeRaw || "image/webp";
  const payload = dataUrl.slice(commaIdx + 1);

  const bytes =
    encoding === "base64"
      ? Buffer.from(payload, "base64")
      : Buffer.from(decodeURIComponent(payload), "utf8");

  return new NextResponse(new Uint8Array(bytes), {
    status: 200,
    headers: {
      "Content-Type": mimeType,
      "Content-Length": String(bytes.byteLength),
      "X-Content-Type-Options": "nosniff",
      "Cache-Control": isPrivate
        ? "private, no-store, max-age=0"
        : "public, max-age=31536000, immutable",
    },
  });
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
      const item = await prisma.media.findUnique({
        where: { id: slug[1] },
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

      const inlineResp = dataUrlToResponse(item.url, isPrivateResume);
      if (inlineResp) return inlineResp;
      if (item.url.startsWith("http://") || item.url.startsWith("https://")) {
        return NextResponse.redirect(item.url, 302);
      }
      return new NextResponse("Not Found", { status: 404 });
    }

    // ── /api/media/entity/[kind]/[id] ───────────────────────────────────────
    if (slug[0] === "entity" && slug[1] && slug[2]) {
      const kind = slug[1];
      const id = slug[2];
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

      const inlineResp = dataUrlToResponse(rawUrl, false);
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
