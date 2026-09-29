import { requireRole, isAuthError } from "@/lib/requireRole";
import { prisma } from "@/lib/db";
import { NextResponse } from "next/server";
import { revalidateTag } from "next/cache";

export async function GET() {
  const auth = await requireRole("VIEWER");
  if (isAuthError(auth)) return auth;

  try {
    const testimonials = await prisma.testimonial.findMany({
      orderBy: [{ order: "asc" }, { createdAt: "desc" }],
    });
    return NextResponse.json(testimonials);
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : "Failed to fetch testimonials";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}

export async function POST(req: Request) {
  const auth = await requireRole("EDITOR");
  if (isAuthError(auth)) return auth;

  try {
    const body = await req.json();

    if (!body.name || !body.title || !body.company || !body.content) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
    }

    const testimonial = await prisma.testimonial.create({
      data: {
        name: body.name,
        title: body.title,
        company: body.company,
        avatarUrl: body.avatarUrl || null,
        content: body.content,
        rating: body.rating ? parseInt(body.rating) : 5,
        featured: body.featured ?? false,
        isActive: body.isActive ?? true,
        order: body.order ? parseInt(body.order) : 0,
      },
    });

    revalidateTag("testimonials");
    return NextResponse.json(testimonial);
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : "Failed to create testimonial";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
