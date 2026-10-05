import { requireRole, isAuthError } from "@/lib/requireRole";
import { prisma } from "@/lib/db";
import { NextResponse } from "next/server";
import { revalidateTag } from "next/cache";

export async function GET() {
  const auth = await requireRole("VIEWER");
  if (isAuthError(auth)) return auth;

  try {
    const plans = await prisma.pricingPlan.findMany({
      orderBy: [{ order: "asc" }, { createdAt: "asc" }],
    });
    return NextResponse.json(plans);
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : "Failed to fetch pricing plans";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}

export async function POST(req: Request) {
  const auth = await requireRole("EDITOR");
  if (isAuthError(auth)) return auth;

  try {
    const body = await req.json();

    if (!body.name || !body.tagline || !body.price) {
      return NextResponse.json({ error: "Missing required fields (name, tagline, price)" }, { status: 400 });
    }

    const plan = await prisma.pricingPlan.create({
      data: {
        name: body.name,
        tagline: body.tagline,
        price: body.price,
        period: body.period || null,
        features: Array.isArray(body.features) ? body.features : [],
        ctaLabel: body.ctaLabel || "Get Started",
        ctaHref: body.ctaHref || "/contact",
        highlighted: body.highlighted ?? false,
        order: body.order ? parseInt(body.order) : 0,
      },
    });

    revalidateTag("pricing");
    revalidateTag('pricing');
    return NextResponse.json(plan);
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : "Failed to create pricing plan";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
