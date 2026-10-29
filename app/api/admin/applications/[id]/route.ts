import { NextRequest, NextResponse } from "next/server";
import { requireRole, isAuthError } from "@/lib/requireRole";
import { prisma } from "@/lib/db";

const VALID_STATUSES = ["PENDING", "REVIEWING", "INTERVIEW", "OFFER", "REJECTED"] as const;

export async function PATCH(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const auth = await requireRole("EDITOR");
  if (isAuthError(auth)) return auth;

  try {
    const { id } = await params;
    const body = await req.json();
    const data: Record<string, unknown> = {};

    if (body.status && VALID_STATUSES.includes(body.status)) {
      data.status = body.status;
    }
    if (body.notes !== undefined) {
      data.notes = String(body.notes);
    }

    const updated = await prisma.application.update({
      where: { id },
      data,
    });
    return NextResponse.json(updated);
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : "Failed to update application";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}

export async function DELETE(
  _req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const auth = await requireRole("EDITOR");
  if (isAuthError(auth)) return auth;

  try {
    const { id } = await params;
    await prisma.application.delete({ where: { id } });
    return NextResponse.json({ success: true });
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : "Failed to delete application";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
