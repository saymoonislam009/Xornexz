"use server"

import { cookies } from "next/headers"
import { redirect } from "next/navigation"
import { prisma } from "@/lib/db"
import bcrypt from "bcryptjs"
import { signAdminToken, COOKIE_NAME } from "@/lib/admin-jwt"

const ADMIN_GATE_TOKEN = "FaltuXornexz"
const ADMIN_GATE_COOKIE = "admin_gate"

export async function adminLoginAction(prevState: any, formData: FormData) {
  let shouldRedirect = false
  let errorMsg = ""

  const email = (formData.get("email") as string || "").trim().toLowerCase()
  const password = (formData.get("password") as string || "")

  if (!email || !password) {
    return { error: "Please enter both email and password." }
  }

  try {
    const user = await prisma.user.findFirst({
      where: {
        email: { equals: email, mode: "insensitive" },
      },
    })

    if (!user) {
      return { error: `No admin account found for "${email}". If this is your first time, configure credentials via the setup link.` }
    }

    if (user.isActive === false) {
      return { error: "This admin account is disabled." }
    }

    if (!user.password) {
      return { error: "This account does not have a password configured." }
    }

    const valid = await bcrypt.compare(password, user.password)
    if (!valid) {
      return { error: "Incorrect password. Please verify and try again." }
    }

    await prisma.user.update({
      where: { id: user.id },
      data: { lastLoginAt: new Date() },
    })

    const token = await signAdminToken({
      id: user.id,
      email: user.email ?? email,
      name: user.name,
      role: user.role,
    })

    const cookieStore = await cookies()

    // Ensure gate cookie is set and refreshed
    cookieStore.set(ADMIN_GATE_COOKIE, ADMIN_GATE_TOKEN, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      maxAge: 60 * 60 * 24 * 7, // 7 days
      path: "/",
    })

    // Set session cookie
    cookieStore.set(COOKIE_NAME, token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      maxAge: 60 * 60 * 24 * 7, // 7 days
      path: "/",
    })

    shouldRedirect = true
  } catch (err: any) {
    console.error("[adminLoginAction]", err)
    errorMsg = err?.message || "Server authentication error."
  }

  // Redirect outside try/catch so Next.js NEXT_REDIRECT is not caught
  if (shouldRedirect) {
    redirect("/admin/dashboard")
  }

  return { error: errorMsg }
}
