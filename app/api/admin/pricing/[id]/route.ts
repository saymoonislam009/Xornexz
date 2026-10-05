import { requireRole, isAuthError } from "@/lib/requireRole";
import { prisma } from "@/lib/db";
import { NextResponse } from "next/server";
import { revalidateTag } from "next/cache";

export async function GET(req: Request, { params }: { params: Promise<{ id: string }> }) {
  const auth = await requireRole("VIEWER");
  if (isAuthError(auth)) return auth;

  try {
    const { id } = await params;
    const plan = await prisma.pricingPlan.findUnique({
      where: { id },
    });
    if (!plan) {
      return NextResponse.json({ error: "Pricing plan not found" }, { status: 404 });
    }
    return NextResponse.json(plan);
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : "Failed to fetch pricing plan";
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
    if (body.tagline !== undefined) data.tagline = body.tagline;
    if (body.price !== undefined) data.price = body.price;
    if (body.period !== undefined) data.period = body.period;
    if (body.features !== undefined) data.features = Array.isArray(body.features) ? body.features : [];
    if (body.ctaLabel !== undefined) data.ctaLabel = body.ctaLabel;
    if (body.ctaHref !== undefined) data.ctaHref = body.ctaHref;
    if (body.highlighted !== undefined) data.highlighted = Boolean(body.highlighted);
    if (body.order !== undefined) data.order = parseInt(body.order);

    const plan = await prisma.pricingPlan.update({
      where: { id },
      data,
    });

    revalidateTag("pricing");
    return NextResponse.json(plan);
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : "Failed to update pricing plan";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}

export const PUT = PATCH;

export async function DELETE(req: Request, { params }: { params: Promise<{ id: string }> }) {
  const auth = await requireRole("EDITOR");
  if (isAuthError(auth)) return auth;

  try {
    const { id } = await params;
    await prisma.pricingPlan.delete({
      where: { id },
    });

    revalidateTag("pricing");
    revalidateTag('pricing');
    return NextResponse.json({ success: true });
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : "Failed to delete pricing plan";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
