import { NextRequest, NextResponse } from "next/server"
import { prisma } from "@/lib/db"
import bcrypt from "bcryptjs"
import { signAdminToken, COOKIE_NAME } from "@/lib/admin-jwt"

export async function POST(req: NextRequest) {
  try {
    const { email, password } = await req.json()

    if (!email || !password) {
      return NextResponse.json({ error: "Please provide both email and password." }, { status: 400 })
    }

    const normalizedEmail = String(email).trim().toLowerCase()

    const user = await prisma.user.findFirst({
      where: {
        email: { equals: normalizedEmail, mode: "insensitive" },
      },
    })

    if (!user) {
      return NextResponse.json({ error: `No admin account found for "${normalizedEmail}". Check the email or run the setup.` }, { status: 401 })
    }

    if (user.isActive === false) {
      return NextResponse.json({ error: "This admin account is disabled." }, { status: 401 })
    }

    if (!user.password) {
      return NextResponse.json({ error: "This account does not have a password set." }, { status: 401 })
    }

    const valid = await bcrypt.compare(String(password), user.password)
    if (!valid) {
      return NextResponse.json({ error: "Incorrect password. Please try again." }, { status: 401 })
    }

    await prisma.user.update({
      where: { id: user.id },
      data: { lastLoginAt: new Date() },
    })

    const token = await signAdminToken({
      id: user.id,
      email: user.email ?? normalizedEmail,
      name: user.name,
      role: user.role,
    })

    const res = NextResponse.json({ ok: true })
    res.cookies.set("admin_gate", "FaltuXornexz", {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      maxAge: 60 * 60 * 24 * 7,
      path: "/",
    })
    res.cookies.set(COOKIE_NAME, token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      maxAge: 60 * 60 * 24 * 7, // 7 days
      path: "/",
    })
    return res
  } catch (e) {
    console.error("[admin-login]", e)
    return NextResponse.json({ error: "Server authentication error. Please try again." }, { status: 500 })
  }
}
