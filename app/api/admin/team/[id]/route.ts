import { requireRole, isAuthError } from "@/lib/requireRole";
import { prisma } from "@/lib/db";
import { NextResponse } from "next/server";
import { revalidateTag } from "next/cache";

export async function GET(req: Request, { params }: { params: Promise<{ id: string }> }) {
  const auth = await requireRole("VIEWER");
  if (isAuthError(auth)) return auth;

  try {
    const { id } = await params;
    const member = await prisma.teamMember.findUnique({
      where: { id },
    });
    if (!member) {
      return NextResponse.json({ error: "Team member not found" }, { status: 404 });
    }
    return NextResponse.json(member);
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : "Failed to fetch team member";
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
    if (body.role !== undefined) data.role = body.role;
    if (body.bio !== undefined) data.bio = body.bio;
    if (body.avatarUrl !== undefined) data.avatarUrl = body.avatarUrl;
    if (body.skills !== undefined) data.skills = Array.isArray(body.skills) ? body.skills : [];
    if (body.linkedinUrl !== undefined) data.linkedinUrl = body.linkedinUrl;
    if (body.twitterUrl !== undefined) data.twitterUrl = body.twitterUrl;
    if (body.githubUrl !== undefined) data.githubUrl = body.githubUrl;
    if (body.portfolioUrl !== undefined) data.portfolioUrl = body.portfolioUrl;
    if (body.isActive !== undefined) data.isActive = Boolean(body.isActive);
    if (body.order !== undefined) data.order = parseInt(body.order);

    const member = await prisma.teamMember.update({
      where: { id },
      data,
    });

    revalidateTag("team");
    return NextResponse.json(member);
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : "Failed to update team member";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}

export const PUT = PATCH;

export async function DELETE(req: Request, { params }: { params: Promise<{ id: string }> }) {
  const auth = await requireRole("EDITOR");
  if (isAuthError(auth)) return auth;

  try {
    const { id } = await params;
    await prisma.teamMember.delete({
      where: { id },
    });

    revalidateTag("team");
    revalidateTag('team');
    return NextResponse.json({ success: true });
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : "Failed to delete team member";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
