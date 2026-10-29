import { requireRole, isAuthError } from '@/lib/requireRole';
import { prisma } from "@/lib/db";
import { NextResponse } from "next/server";
import { revalidatePublicSite } from "@/lib/revalidate";

export async function GET(req: Request, { params }: { params: Promise<{ id: string }> }) {
  const auth = await requireRole('VIEWER');
  if (isAuthError(auth)) return auth;

  try {
    const { id } = await params;
    const service = await prisma.service.findUnique({
      where: { id },
    });
    if (!service) {
      return NextResponse.json({ error: "Service not found" }, { status: 404 });
    }
    return NextResponse.json(service);
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function PATCH(req: Request, { params }: { params: Promise<{ id: string }> }) {
  const auth = await requireRole('EDITOR');
  if (isAuthError(auth)) return auth;

  try {
    const { id } = await params;
    const body = await req.json();

    const dataToUpdate: any = { ...body };
    if (dataToUpdate.order !== undefined) {
      dataToUpdate.order = parseInt(dataToUpdate.order);
    }

    const service = await prisma.service.update({
      where: { id },
      data: dataToUpdate,
    });

    revalidatePublicSite(["services"], ["/services", `/services/${service.slug}`]);
    return NextResponse.json(service);
  } catch (error: any) {
    console.error("Error updating service:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export const PUT = PATCH;

export async function DELETE(req: Request, { params }: { params: Promise<{ id: string }> }) {
  const auth = await requireRole('EDITOR');
  if (isAuthError(auth)) return auth;

  try {
    const { id } = await params;
    const deleted = await prisma.service.delete({
      where: { id },
    });

    revalidatePublicSite(["services"], ["/services", ...(deleted?.slug ? [`/services/${deleted.slug}`] : [])]);
    return NextResponse.json({ success: true });
  } catch (error: any) {
    console.error("Error deleting service:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
