import { requireRole, isAuthError } from '@/lib/requireRole'
import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/db";

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const auth = await requireRole('VIEWER')
  if (isAuthError(auth)) return auth

  try {
    const resolvedParams = await params;
    const lead = await prisma.lead.findUnique({
      where: { id: resolvedParams.id },
      include: { notes: { orderBy: { createdAt: "desc" } } },
    });
    if (!lead) return NextResponse.json({ error: "Not found" }, { status: 404 });
    return NextResponse.json(lead);
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function PATCH(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const auth = await requireRole('EDITOR')
  if (isAuthError(auth)) return auth

  try {
    const resolvedParams = await params;
    const body = await req.json();
    const lead = await prisma.lead.update({
      where: { id: resolvedParams.id },
      data: body,
    });
    return NextResponse.json(lead);
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function DELETE(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const auth = await requireRole('EDITOR')
  if (isAuthError(auth)) return auth

  try {
    const resolvedParams = await params;
    await prisma.lead.delete({
      where: { id: resolvedParams.id },
    });
    return NextResponse.json({ success: true });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
