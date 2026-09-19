import { requireRole, isAuthError } from '@/lib/requireRole'
import { prisma } from "@/lib/db";
import { NextResponse } from "next/server";


export async function POST(req: Request) {
  const auth = await requireRole('EDITOR')
  if (isAuthError(auth)) return auth

  try {
    const body = await req.json();
    const project = await prisma.project.create({
      data: {
        title: body.title,
        slug: body.slug,
        tagline: body.tagline,
        description: body.description,
        content: body.content,
        client: body.client,
        clientLogo: body.clientLogo,
        clientUrl: body.clientUrl,
        coverImage: body.coverImage,
        gallery: body.gallery || [],
        videoUrl: body.videoUrl,
        liveUrl: body.liveUrl,
        category: body.category,
        tags: body.tags || [],
        techStack: body.techStack || [],
        status: body.status || "DRAFT",
        featured: body.featured || false,
        order: body.order ? parseInt(body.order) : 0,
        publishedAt: body.status === "PUBLISHED" ? new Date() : null,
      },
    });

    return NextResponse.json(project);
  } catch (error: any) {
    console.error("Error creating project:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function GET() {
  const auth = await requireRole('VIEWER')
  if (isAuthError(auth)) return auth

  try {
    const projects = await prisma.project.findMany({
      orderBy: { createdAt: "desc" },
    });
    return NextResponse.json(projects);
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
