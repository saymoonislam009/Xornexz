import { NextResponse } from 'next/server';
import { prisma } from '@/lib/db';
import { requireRole, isAuthError } from '@/lib/requireRole';
import { revalidateTag } from 'next/cache';

export const dynamic = 'force-dynamic';

export async function PUT(req: Request, { params }: { params: Promise<{ id: string }> }) {
  const auth = await requireRole('EDITOR');
  if (isAuthError(auth)) return auth;

  try {
    const { id } = await params;
    const body = await req.json();
    const step = await prisma.processStep.update({
      where: { id },
      data: {
        icon: body.icon,
        title: body.title,
        description: body.description,
        order: body.order !== undefined ? parseInt(body.order) : 0,
      },
    });
    revalidateTag('process');
    return NextResponse.json(step);
  } catch {
    return NextResponse.json({ error: 'Failed to update process step' }, { status: 500 });
  }
}

export const PATCH = PUT;

export async function DELETE(req: Request, { params }: { params: Promise<{ id: string }> }) {
  const auth = await requireRole('EDITOR');
  if (isAuthError(auth)) return auth;

  try {
    const { id } = await params;
    await prisma.processStep.delete({ where: { id } });
    revalidateTag('process');
    return NextResponse.json({ success: true });
  } catch {
    return NextResponse.json({ error: 'Failed to delete process step' }, { status: 500 });
  }
}
