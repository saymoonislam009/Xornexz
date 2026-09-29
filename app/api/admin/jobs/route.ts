import { requireRole, isAuthError } from "@/lib/requireRole";
import { prisma } from "@/lib/db";
import { NextResponse } from "next/server";
import { revalidateTag } from "next/cache";

export async function GET() {
  const auth = await requireRole("VIEWER");
  if (isAuthError(auth)) return auth;

  try {
    const jobs = await prisma.job.findMany({
      orderBy: [{ order: "asc" }, { createdAt: "desc" }],
      include: {
        _count: {
          select: { applications: true },
        },
      },
    });
    return NextResponse.json(jobs);
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : "Failed to fetch jobs";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}

export async function POST(req: Request) {
  const auth = await requireRole("EDITOR");
  if (isAuthError(auth)) return auth;

  try {
    const body = await req.json();

    if (!body.title || !body.slug || !body.department || !body.location || !body.description) {
      return NextResponse.json(
        { error: "Missing required fields (title, slug, department, location, description)" },
        { status: 400 }
      );
    }

    const job = await prisma.job.create({
      data: {
        slug: body.slug,
        title: body.title,
        department: body.department,
        location: body.location,
        type: body.type || "Full-time",
        salaryMin: body.salaryMin ? parseInt(body.salaryMin) : null,
        salaryMax: body.salaryMax ? parseInt(body.salaryMax) : null,
        salaryCurrency: body.salaryCurrency || "USD",
        description: body.description,
        requirements: Array.isArray(body.requirements) ? body.requirements : [],
        niceToHave: Array.isArray(body.niceToHave) ? body.niceToHave : [],
        benefits: Array.isArray(body.benefits) ? body.benefits : [],
        status: body.status || "OPEN",
        featured: body.featured ?? false,
        order: body.order ? parseInt(body.order) : 0,
        publishedAt: body.status === "OPEN" ? new Date() : null,
      },
    });

    revalidateTag("jobs");
    return NextResponse.json(job);
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : "Failed to create job";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
