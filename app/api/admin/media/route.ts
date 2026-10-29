import { requireRole, isAuthError } from '@/lib/requireRole';
import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { r2, R2_BUCKET } from "@/lib/r2";
import { DeleteObjectCommand } from "@aws-sdk/client-s3";

export async function GET(_req: NextRequest) {
  const auth = await requireRole('VIEWER');
  if (isAuthError(auth)) return auth;

  try {
    const media = await prisma.media.findMany({
      where: { folder: { not: "resumes" } },
      orderBy: { createdAt: "desc" },
      select: {
        id: true,
        key: true,
        url: true,
        mimeType: true,
        size: true,
        width: true,
        height: true,
        folder: true,
        alt: true,
        caption: true,
        createdAt: true,
        updatedAt: true,
      },
    });
    const normalized = media.map((m) => {
      const extParam = m.mimeType === "image/svg+xml" ? "&ext=svg" : "";
      const url = m.url.startsWith("data:")
        ? `/api/media/item/${m.id}?v=2${extParam}`
        : m.url.startsWith("/api/media/item/") && !m.url.includes("?")
          ? `${m.url}?v=2${extParam}`
          : m.url;
      return {
        ...m,
        filename: m.alt || m.key,
        url,
      };
    });
    return NextResponse.json(normalized);
  } catch (_error) {
    return NextResponse.json({ error: "Failed to fetch media" }, { status: 500 });
  }
}

export async function DELETE(req: NextRequest) {
  const auth = await requireRole('EDITOR');
  if (isAuthError(auth)) return auth;

  try {
    const { searchParams } = new URL(req.url);
    const id = searchParams.get('id');

    if (!id) {
      return NextResponse.json({ error: "Media ID is required" }, { status: 400 });
    }

    const mediaItem = await prisma.media.findUnique({
      where: { id },
    });

    if (!mediaItem) {
      return NextResponse.json({ error: "Media not found" }, { status: 404 });
    }

    try {
      if (process.env.R2_ACCOUNT_ID && !mediaItem.key.startsWith('inline-')) {
        await r2.send(
          new DeleteObjectCommand({
            Bucket: R2_BUCKET,
            Key: mediaItem.key,
          })
        );
      }
    } catch (r2Err) {
      console.warn("Could not delete from R2 bucket directly:", r2Err);
    }

    await prisma.media.delete({
      where: { id },
    });

    return NextResponse.json({ success: true });
  } catch (error: unknown) {
    console.error("Delete media error:", error);
    const message = error instanceof Error ? error.message : "Failed to delete media";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
