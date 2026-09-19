import { requireRole, isAuthError } from '@/lib/requireRole';
import { prisma } from "@/lib/db";
import { NextResponse } from "next/server";
import { revalidateTag } from "next/cache";

export async function GET() {
  const auth = await requireRole('VIEWER');
  if (isAuthError(auth)) return auth;

  try {
    const services = await prisma.service.findMany({
      orderBy: { order: "asc" },
    });
    return NextResponse.json(services);
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function POST(req: Request) {
  const auth = await requireRole('EDITOR');
  if (isAuthError(auth)) return auth;

  try {
    const body = await req.json();

    if (!body.title || !body.slug || !body.tagline || !body.description || !body.icon) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
    }

    const service = await prisma.service.create({
      data: {
        slug: body.slug,
        title: body.title,
        tagline: body.tagline,
        description: body.description,
        icon: body.icon,
        features: body.features || [],
        deliverables: body.deliverables || [],
        techStack: body.techStack || [],
        processSteps: body.processSteps ?? undefined,
        isActive: body.isActive ?? true,
        order: body.order ? parseInt(body.order) : 0,
        metaTitle: body.metaTitle || null,
        metaDescription: body.metaDescription || null,
      },
    });

    revalidateTag('services');
    return NextResponse.json(service);
  } catch (error: any) {
    console.error("Error creating service:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
