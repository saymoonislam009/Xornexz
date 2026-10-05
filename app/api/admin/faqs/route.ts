import { requireRole, isAuthError } from "@/lib/requireRole";
import { prisma } from "@/lib/db";
import { NextResponse } from "next/server";
import { revalidateTag } from "next/cache";

export async function GET() {
  const auth = await requireRole("VIEWER");
  if (isAuthError(auth)) return auth;

  try {
    const faqs = await prisma.fAQ.findMany({
      orderBy: [{ order: "asc" }, { createdAt: "asc" }],
    });
    return NextResponse.json(faqs);
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : "Failed to fetch FAQs";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}

export async function POST(req: Request) {
  const auth = await requireRole("EDITOR");
  if (isAuthError(auth)) return auth;

  try {
    const body = await req.json();

    if (!body.question || !body.answer) {
      return NextResponse.json({ error: "Missing required fields (question, answer)" }, { status: 400 });
    }

    const faq = await prisma.fAQ.create({
      data: {
        question: body.question,
        answer: body.answer,
        category: body.category || "general",
        order: body.order ? parseInt(body.order) : 0,
        isActive: body.isActive ?? true,
      },
    });

    revalidateTag("faqs");
    revalidateTag('faqs');
    return NextResponse.json(faq);
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : "Failed to create FAQ";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
