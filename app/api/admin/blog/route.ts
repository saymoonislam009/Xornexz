import { requireRole, isAuthError } from '@/lib/requireRole'
import { prisma } from "@/lib/db";
import { NextResponse } from "next/server";


export async function POST(req: Request) {
  const auth = await requireRole('EDITOR')
  if (isAuthError(auth)) return auth

  try {
    const body = await req.json();
    
    // Default author logic: if authorId is not provided, find the first super admin or use whatever we have
    let authorId = body.authorId;
    if (!authorId) {
      const defaultUser = await prisma.user.findFirst({
        where: { role: "SUPER_ADMIN" }
      }) || await prisma.user.findFirst();
      
      if (!defaultUser) {
        return NextResponse.json({ error: "No user found in database to set as author." }, { status: 400 });
      }
      authorId = defaultUser.id;
    }

    const post = await prisma.blogPost.create({
      data: {
        title: body.title,
        slug: body.slug,
        excerpt: body.excerpt,
        content: body.content,
        coverImage: body.coverImage,
        authorId: authorId,
        category: body.category,
        tags: body.tags || [],
        status: body.status || "DRAFT",
        featured: body.featured || false,
        readingTime: body.readingTime ? parseInt(body.readingTime) : null,
        scheduledAt: body.scheduledAt ? new Date(body.scheduledAt) : null,
        publishedAt: body.status === "PUBLISHED" ? new Date() : null,
      },
    });

    return NextResponse.json(post);
  } catch (error: any) {
    console.error("Error creating blog post:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function GET() {
  const auth = await requireRole('VIEWER')
  if (isAuthError(auth)) return auth

  try {
    const posts = await prisma.blogPost.findMany({
      orderBy: { createdAt: "desc" },
      include: { author: { select: { id: true, name: true, email: true, role: true, isActive: true } } },
    });
    return NextResponse.json(posts);
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
