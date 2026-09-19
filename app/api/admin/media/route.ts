import { requireRole, isAuthError } from '@/lib/requireRole'
import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";

export async function GET(req: NextRequest) {
  const auth = await requireRole('VIEWER')
  if (isAuthError(auth)) return auth

  try {
    const media = await prisma.media.findMany({
      orderBy: { createdAt: "desc" },
    });
    return NextResponse.json(media);
  } catch (error) {
    return NextResponse.json({ error: "Failed to fetch media" }, { status: 500 });
  }
}
