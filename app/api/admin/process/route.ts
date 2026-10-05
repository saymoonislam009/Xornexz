import { NextResponse } from 'next/server';
import { prisma } from '@/lib/db';
import { getAdminSession } from '@/lib/admin-jwt';
import { revalidateTag } from 'next/cache';

export const dynamic = 'force-dynamic';

export async function GET() {
  try {
    const steps = await prisma.processStep.findMany({ orderBy: { order: 'asc' } });
    return NextResponse.json(steps);
  } catch {
    return NextResponse.json({ error: 'Failed to fetch process steps' }, { status: 500 });
  }
}

export async function POST(req: Request) {
  const session = await getAdminSession();
  if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  try {
    const body = await req.json();
    const step = await prisma.processStep.create({
      data: {
        icon: body.icon || 'Code2',
        title: body.title,
        description: body.description,
        order: body.order ?? 0,
      },
    });
    revalidateTag('process');
    return NextResponse.json(step, { status: 201 });
  } catch {
    return NextResponse.json({ error: 'Failed to create process step' }, { status: 500 });
  }
}
