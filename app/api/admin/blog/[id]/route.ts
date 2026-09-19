import { requireRole, isAuthError } from '@/lib/requireRole'
import { prisma } from "@/lib/db";
import { NextResponse } from "next/server";
import { revalidateTag } from "next/cache";


export async function PATCH(req: Request, { params }: { params: Promise<{ id: string }> }) {
  const auth = await requireRole('EDITOR')
  if (isAuthError(auth)) return auth

  try {
    const { id } = await params;
    const body = await req.json();
    
    const dataToUpdate: any = { ...body };
    if (dataToUpdate.readingTime) {
      dataToUpdate.readingTime = parseInt(dataToUpdate.readingTime);
    }
    if (dataToUpdate.scheduledAt) {
      dataToUpdate.scheduledAt = new Date(dataToUpdate.scheduledAt);
    }
    
    if (dataToUpdate.status === "PUBLISHED" && !dataToUpdate.publishedAt) {
      dataToUpdate.publishedAt = new Date();
    }

    const post = await prisma.blogPost.update({
      where: { id },
      data: dataToUpdate,
    });

    revalidateTag('blog');
    return NextResponse.json(post);
  } catch (error: any) {
    console.error("Error updating blog post:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function DELETE(req: Request, { params }: { params: Promise<{ id: string }> }) {
  const auth = await requireRole('EDITOR')
  if (isAuthError(auth)) return auth

  try {
    const { id } = await params;
    await prisma.blogPost.delete({
      where: { id },
    });
    revalidateTag('blog');
    return NextResponse.json({ success: true });
  } catch (error: any) {
    console.error("Error deleting blog post:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
