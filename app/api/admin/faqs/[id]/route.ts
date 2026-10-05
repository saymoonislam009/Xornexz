import { requireRole, isAuthError } from "@/lib/requireRole";
import { prisma } from "@/lib/db";
import { NextResponse } from "next/server";
import { revalidateTag } from "next/cache";

export async function GET(req: Request, { params }: { params: Promise<{ id: string }> }) {
  const auth = await requireRole("VIEWER");
  if (isAuthError(auth)) return auth;

  try {
    const { id } = await params;
    const faq = await prisma.fAQ.findUnique({
      where: { id },
    });
    if (!faq) {
      return NextResponse.json({ error: "FAQ not found" }, { status: 404 });
    }
    return NextResponse.json(faq);
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : "Failed to fetch FAQ";
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
    if (body.question !== undefined) data.question = body.question;
    if (body.answer !== undefined) data.answer = body.answer;
    if (body.category !== undefined) data.category = body.category;
    if (body.order !== undefined) data.order = parseInt(body.order);
    if (body.isActive !== undefined) data.isActive = Boolean(body.isActive);

    const faq = await prisma.fAQ.update({
      where: { id },
      data,
    });

    revalidateTag("faqs");
    return NextResponse.json(faq);
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : "Failed to update FAQ";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}

export async function DELETE(req: Request, { params }: { params: Promise<{ id: string }> }) {
  const auth = await requireRole("EDITOR");
  if (isAuthError(auth)) return auth;

  try {
    const { id } = await params;
    await prisma.fAQ.delete({
      where: { id },
    });

    revalidateTag("faqs");
    revalidateTag('faqs');
    return NextResponse.json({ success: true });
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : "Failed to delete FAQ";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
