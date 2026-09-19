import { requireRole, isAuthError } from '@/lib/requireRole';
import { prisma } from "@/lib/db";
import { NextResponse } from "next/server";
import { revalidateTag } from "next/cache";

const DEFAULT_SECTIONS = [
  { key: 'hero', order: 0, enabled: true },
  { key: 'stats', order: 1, enabled: true },
  { key: 'services', order: 2, enabled: true },
  { key: 'projects', order: 3, enabled: true },
  { key: 'process', order: 4, enabled: true },
  { key: 'techstack', order: 5, enabled: true },
  { key: 'testimonials', order: 6, enabled: true },
  { key: 'pricing', order: 7, enabled: true },
  { key: 'faq', order: 8, enabled: true },
  { key: 'cta', order: 9, enabled: true },
];

export async function GET() {
  const auth = await requireRole('VIEWER');
  if (isAuthError(auth)) return auth;

  try {
    let sections = await prisma.homeSection.findMany({
      orderBy: { order: "asc" },
    });

    if (sections.length === 0) {
      // Seed default sections in DB
      for (const s of DEFAULT_SECTIONS) {
        await prisma.homeSection.upsert({
          where: { key: s.key },
          update: {},
          create: { key: s.key, order: s.order, enabled: s.enabled },
        });
      }
      sections = await prisma.homeSection.findMany({
        orderBy: { order: "asc" },
      });
    }

    return NextResponse.json(sections);
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function PUT(req: Request) {
  const auth = await requireRole('ADMIN');
  if (isAuthError(auth)) return auth;

  try {
    const body = await req.json();
    const { sections } = body;

    if (!Array.isArray(sections)) {
      return NextResponse.json({ error: "Invalid sections array" }, { status: 400 });
    }

    for (let i = 0; i < sections.length; i++) {
      const sec = sections[i];
      await prisma.homeSection.upsert({
        where: { key: sec.key },
        update: {
          order: i,
          enabled: sec.enabled !== false,
          content: sec.content ?? undefined,
        },
        create: {
          key: sec.key,
          order: i,
          enabled: sec.enabled !== false,
          content: sec.content ?? undefined,
        },
      });
    }

    revalidateTag('home-sections');
    return NextResponse.json({ success: true });
  } catch (error: any) {
    console.error("Failed to update home sections:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
