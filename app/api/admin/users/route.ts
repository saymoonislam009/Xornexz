import { requireRole, isAuthError } from '@/lib/requireRole'
import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";

export async function GET(req: NextRequest) {
  const auth = await requireRole('SUPER_ADMIN')
  if (isAuthError(auth)) return auth

  try {
    const users = await prisma.user.findMany({
      select: {
        id: true, name: true, email: true, role: true,
        isActive: true, lastLoginAt: true, createdAt: true,
        twoFactorEnabled: true,
      },
      orderBy: { createdAt: "desc" },
    });
    return NextResponse.json(users);
  } catch (error) {
    return NextResponse.json({ error: "Failed to fetch users" }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  const auth = await requireRole('SUPER_ADMIN')
  if (isAuthError(auth)) return auth

  try {
    const body = await req.json();
    const { name, email, role } = body;
    const user = await prisma.user.create({
      data: { name, email, role },
    });
    return NextResponse.json(user);
  } catch (error) {
    return NextResponse.json({ error: "Failed to create user" }, { status: 500 });
  }
}
