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
      orderBy: { createdAt: "desc" },
    });
    return NextResponse.json(media);
  } catch (error: any) {
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

    // Try to delete from Cloudflare R2
    try {
      if (process.env.R2_ACCOUNT_ID) {
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

    // Delete record from DB
    await prisma.media.delete({
      where: { id },
    });

    return NextResponse.json({ success: true });
  } catch (error: any) {
    console.error("Delete media error:", error);
    return NextResponse.json({ error: error.message || "Failed to delete media" }, { status: 500 });
  }
}
