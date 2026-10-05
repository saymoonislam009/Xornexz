import { requireRole, isAuthError } from "@/lib/requireRole";
import { prisma } from "@/lib/db";
import { NextResponse } from "next/server";
import { revalidateTag } from "next/cache";

export async function GET() {
  const auth = await requireRole("VIEWER");
  if (isAuthError(auth)) return auth;

  try {
    const teamMembers = await prisma.teamMember.findMany({
      orderBy: [{ order: "asc" }, { createdAt: "desc" }],
    });
    return NextResponse.json(teamMembers);
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : "Failed to fetch team members";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}

export async function POST(req: Request) {
  const auth = await requireRole("EDITOR");
  if (isAuthError(auth)) return auth;

  try {
    const body = await req.json();

    if (!body.name || !body.role) {
      return NextResponse.json({ error: "Missing required fields (name, role)" }, { status: 400 });
    }

    const member = await prisma.teamMember.create({
      data: {
        name: body.name,
        role: body.role,
        bio: body.bio || null,
        avatarUrl: body.avatarUrl || null,
        skills: Array.isArray(body.skills) ? body.skills : [],
        linkedinUrl: body.linkedinUrl || null,
        twitterUrl: body.twitterUrl || null,
        githubUrl: body.githubUrl || null,
        portfolioUrl: body.portfolioUrl || null,
        isActive: body.isActive ?? true,
        order: body.order ? parseInt(body.order) : 0,
      },
    });

    revalidateTag("team");
    revalidateTag('team');
    return NextResponse.json(member);
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : "Failed to create team member";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
