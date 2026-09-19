import { requireRole, isAuthError } from '@/lib/requireRole';
import { prisma } from "@/lib/db";
import { NextResponse } from "next/server";

export async function GET() {
  const auth = await requireRole('VIEWER');
  if (isAuthError(auth)) return auth;

  try {
    const submissions = await prisma.contactSubmission.findMany({
      orderBy: { createdAt: "desc" },
    });
    return NextResponse.json(submissions);
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function PATCH(req: Request) {
  const auth = await requireRole('EDITOR');
  if (isAuthError(auth)) return auth;

  try {
    const { id, read } = await req.json();
    if (!id) {
      return NextResponse.json({ error: "Missing submission ID" }, { status: 400 });
    }

    const updated = await prisma.contactSubmission.update({
      where: { id },
      data: { read: Boolean(read) },
    });

    return NextResponse.json(updated);
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

    await prisma.contactSubmission.delete({
      where: { id },
    });
    return NextResponse.json({ success: true });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
