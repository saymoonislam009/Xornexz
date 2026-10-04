import { requireRole, isAuthError } from "@/lib/requireRole";
import { prisma } from "@/lib/db";
import { NextResponse } from "next/server";

export async function GET() {
  const auth = await requireRole("VIEWER");
  if (isAuthError(auth)) return auth;

  try {
    const estimates = await prisma.estimate.findMany({
      orderBy: { createdAt: "desc" },
    });
    return NextResponse.json(estimates);
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}

export async function PATCH(req: Request) {
  const auth = await requireRole("EDITOR");
  if (isAuthError(auth)) return auth;

  try {
    const { id, convertedToLead } = await req.json();
    if (!id) return NextResponse.json({ error: "Missing ID" }, { status: 400 });
    const updated = await prisma.estimate.update({
      where: { id },
      data: { convertedToLead: Boolean(convertedToLead) },
    });
    return NextResponse.json(updated);
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}

export async function DELETE(req: Request) {
  const auth = await requireRole("EDITOR");
  if (isAuthError(auth)) return auth;

  try {
    const { searchParams } = new URL(req.url);
    const id = searchParams.get("id");
    if (!id) return NextResponse.json({ error: "Missing ID" }, { status: 400 });
    await prisma.estimate.delete({ where: { id } });
    return NextResponse.json({ success: true });
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
