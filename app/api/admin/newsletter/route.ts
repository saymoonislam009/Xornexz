import { requireRole, isAuthError } from '@/lib/requireRole';
import { prisma } from "@/lib/db";
import { NextResponse } from "next/server";

export async function GET() {
  const auth = await requireRole('VIEWER');
  if (isAuthError(auth)) return auth;

  try {
    const subscribers = await prisma.newsletterSubscriber.findMany({
      orderBy: { subscribedAt: "desc" },
    });
    return NextResponse.json(subscribers);
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function DELETE(req: Request) {
  const auth = await requireRole('EDITOR');
  if (isAuthError(auth)) return auth;

  try {
    const { searchParams } = new URL(req.url);
    const id = searchParams.get('id');
    if (!id) return NextResponse.json({ error: "Missing ID" }, { status: 400 });

    await prisma.newsletterSubscriber.delete({
      where: { id },
    });
    return NextResponse.json({ success: true });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
