import { requireRole, isAuthError } from '@/lib/requireRole'
import { prisma } from "@/lib/db";
import { NextResponse } from "next/server";
import { revalidatePublicSite } from "@/lib/revalidate";
import { persistDataUrlIfInline, persistGalleryIfInline } from "@/lib/media-persist";


export async function PATCH(req: Request, { params }: { params: Promise<{ id: string }> }) {
  const auth = await requireRole('EDITOR')
  if (isAuthError(auth)) return auth

  try {
    const { id } = await params;
    const body = await req.json();
    
    const dataToUpdate: any = { ...body };
    if (dataToUpdate.order !== undefined) {
      dataToUpdate.order = parseInt(String(dataToUpdate.order), 10) || 0;
    }

    // Never allow a synthetic /api/media/entity/project/<id> proxy URL to overwrite stored data
    if (
      typeof dataToUpdate.coverImage === "string" &&
      dataToUpdate.coverImage.startsWith(`/api/media/entity/project/`)
    ) {
      delete dataToUpdate.coverImage;
    } else if (typeof dataToUpdate.coverImage === "string") {
      dataToUpdate.coverImage = await persistDataUrlIfInline(
        dataToUpdate.coverImage,
        "projects",
        dataToUpdate.title || ""
      );
    }

    if (Array.isArray(dataToUpdate.gallery)) {
      dataToUpdate.gallery = await persistGalleryIfInline(
        dataToUpdate.gallery,
        "projects",
        dataToUpdate.title || ""
      );
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
