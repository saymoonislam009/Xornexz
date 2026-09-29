import { requireRole, isAuthError } from "@/lib/requireRole";
import { prisma } from "@/lib/db";
import { NextResponse } from "next/server";
import { revalidateTag } from "next/cache";

export async function GET(req: Request, { params }: { params: Promise<{ id: string }> }) {
  const auth = await requireRole("VIEWER");
  if (isAuthError(auth)) return auth;

  try {
    const { id } = await params;
    const job = await prisma.job.findUnique({
      where: { id },
      include: {
        applications: {
          orderBy: { createdAt: "desc" },
        },
      },
    });
    if (!job) {
      return NextResponse.json({ error: "Job not found" }, { status: 404 });
    }
    return NextResponse.json(job);
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : "Failed to fetch job";
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
    if (body.slug !== undefined) data.slug = body.slug;
    if (body.title !== undefined) data.title = body.title;
    if (body.department !== undefined) data.department = body.department;
    if (body.location !== undefined) data.location = body.location;
    if (body.type !== undefined) data.type = body.type;
    if (body.salaryMin !== undefined) data.salaryMin = body.salaryMin ? parseInt(body.salaryMin) : null;
    if (body.salaryMax !== undefined) data.salaryMax = body.salaryMax ? parseInt(body.salaryMax) : null;
    if (body.description !== undefined) data.description = body.description;
    if (body.requirements !== undefined) data.requirements = Array.isArray(body.requirements) ? body.requirements : [];
    if (body.niceToHave !== undefined) data.niceToHave = Array.isArray(body.niceToHave) ? body.niceToHave : [];
    if (body.benefits !== undefined) data.benefits = Array.isArray(body.benefits) ? body.benefits : [];
    if (body.status !== undefined) data.status = body.status;
    if (body.featured !== undefined) data.featured = Boolean(body.featured);
    if (body.order !== undefined) data.order = parseInt(body.order);

    const job = await prisma.job.update({
      where: { id },
      data,
    });

    revalidateTag("jobs");
    return NextResponse.json(job);
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : "Failed to update job";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}

export async function DELETE(req: Request, { params }: { params: Promise<{ id: string }> }) {
  const auth = await requireRole("EDITOR");
  if (isAuthError(auth)) return auth;

  try {
    const { id } = await params;
    await prisma.job.delete({
      where: { id },
    });

    revalidateTag("jobs");
    return NextResponse.json({ success: true });
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : "Failed to delete job";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
