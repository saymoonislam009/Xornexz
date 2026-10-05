import { requireRole, isAuthError } from "@/lib/requireRole";
import { prisma } from "@/lib/db";
import { NextResponse } from "next/server";
import { revalidateTag } from "next/cache";

export async function GET(req: Request, { params }: { params: Promise<{ id: string }> }) {
  const auth = await requireRole("VIEWER");
  if (isAuthError(auth)) return auth;

  try {
    const { id } = await params;
    const testimonial = await prisma.testimonial.findUnique({
      where: { id },
    });
    if (!testimonial) {
      return NextResponse.json({ error: "Testimonial not found" }, { status: 404 });
    }
    return NextResponse.json(testimonial);
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : "Failed to fetch testimonial";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}

export async function PATCH(req: Request, { params }: { params: Promise<{ id: string }> }) {
  const auth = await requireRole("EDITOR");
  if (isAuthError(auth)) return auth;

  try {
    const { id } = await params;
    const body = await req.json();

    const data: Record<string, unknown> = {};
    if (body.name !== undefined) data.name = body.name;
    if (body.title !== undefined) data.title = body.title;
    if (body.company !== undefined) data.company = body.company;
    if (body.avatarUrl !== undefined) data.avatarUrl = body.avatarUrl;
    if (body.content !== undefined) data.content = body.content;
    if (body.rating !== undefined) data.rating = parseInt(body.rating);
    if (body.featured !== undefined) data.featured = Boolean(body.featured);
    if (body.isActive !== undefined) data.isActive = Boolean(body.isActive);
    if (body.order !== undefined) data.order = parseInt(body.order);

    const testimonial = await prisma.testimonial.update({
      where: { id },
      data,
    });

    revalidateTag("testimonials");
    return NextResponse.json(testimonial);
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : "Failed to update testimonial";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}

export const PUT = PATCH;

export async function DELETE(req: Request, { params }: { params: Promise<{ id: string }> }) {
  const auth = await requireRole("EDITOR");
  if (isAuthError(auth)) return auth;

  try {
    const { id } = await params;
    await prisma.testimonial.delete({
      where: { id },
    });

    revalidateTag("testimonials");
    revalidateTag('testimonials');
    return NextResponse.json({ success: true });
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : "Failed to delete testimonial";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
