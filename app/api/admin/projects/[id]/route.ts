import { requireRole, isAuthError } from '@/lib/requireRole'
import { prisma } from "@/lib/db";
import { NextResponse } from "next/server";
import { revalidatePublicSite } from "@/lib/revalidate";


export async function PATCH(req: Request, { params }: { params: Promise<{ id: string }> }) {
  const auth = await requireRole('EDITOR')
  if (isAuthError(auth)) return auth

  try {
    const { id } = await params;
    const body = await req.json();
    
    const dataToUpdate: any = { ...body };
    if (dataToUpdate.order) {
      dataToUpdate.order = parseInt(dataToUpdate.order);
    }
    
    if (dataToUpdate.status === "PUBLISHED" && !dataToUpdate.publishedAt) {
      dataToUpdate.publishedAt = new Date();
    }

    const project = await prisma.project.update({
      where: { id },
      data: dataToUpdate,
    });

    revalidatePublicSite(
      ["projects"],
      ["/portfolio", ...(project?.slug ? [`/portfolio/${project.slug}`] : [])]
    );

    return NextResponse.json(project);
  } catch (error: any) {
    console.error("Error updating project:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export const PUT = PATCH;

export async function DELETE(req: Request, { params }: { params: Promise<{ id: string }> }) {
  const auth = await requireRole('EDITOR')
  if (isAuthError(auth)) return auth

  try {
    const { id } = await params;
    const project = await prisma.project.delete({
      where: { id },
    });
    revalidatePublicSite(
      ["projects"],
      ["/portfolio", ...(project?.slug ? [`/portfolio/${project.slug}`] : [])]
    );
    return NextResponse.json({ success: true });
  } catch (error: any) {
    console.error("Error deleting project:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
