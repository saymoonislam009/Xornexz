import { NextRequest, NextResponse } from "next/server"
import { prisma } from "@/lib/db"
import bcrypt from "bcryptjs"
import { signAdminToken, COOKIE_NAME } from "@/lib/admin-jwt"

const ADMIN_GATE_TOKEN = "FaltuXornexz"

const COOKIE_OPTS = {
  httpOnly: true,
  secure: process.env.NODE_ENV === "production",
  sameSite: "lax" as const,
  maxAge: 60 * 60 * 24 * 30, // 30 days
  path: "/",
}

/** Redirect back to login with an error message in the URL */
function loginError(req: NextRequest, msg: string): NextResponse {
  const url = new URL("/admin/login", req.url)
  url.searchParams.set("error", msg)
  console.log("[admin-login] error →", msg)
  return NextResponse.redirect(url, 303)
}

export async function POST(req: NextRequest) {
  let email = ""
  let password = ""
  let callbackUrl = "/admin/dashboard"

  try {
    const ct = req.headers.get("content-type") || ""
    console.log("[admin-login] content-type:", ct)

    if (ct.includes("application/json")) {
      // JSON body (e.g. from a fetch() call)
      const body = await req.json().catch(() => ({}))
      email = String(body.identifier || body.email || "").trim()
      password = String(body.password || "")
      callbackUrl = String(body.callbackUrl || "/admin/dashboard")
    } else {
      // Native HTML form POST: application/x-www-form-urlencoded
      const raw = await req.text().catch(() => "")
      console.log("[admin-login] raw body length:", raw.length)
      const params = new URLSearchParams(raw)
      email = (params.get("identifier") || params.get("email") || "").trim()
      password = params.get("password") || ""
      callbackUrl = params.get("callbackUrl") || "/admin/dashboard"
    }

    console.log("[admin-login] identifier:", email ? email.substring(0, 3) + "***" : "(empty)")
    console.log("[admin-login] password length:", password.length)

    if (!email || !password) {
      return loginError(req, "Please enter both email/username and password.")
    }

    // ── DB lookup (by email OR username/name) ─────────────────────────────
    let user: {
      id: string
      email: string | null
      name: string | null
      password: string | null
      role: string
      isActive: boolean | null
    } | null = null

    try {
      const searchTerms: any[] = [
        { email: { equals: email, mode: "insensitive" } },
        { name: { equals: email, mode: "insensitive" } },
      ]

      if (!email.includes("@")) {
        searchTerms.push({ email: { startsWith: `${email}@`, mode: "insensitive" } })
      }

      user = await prisma.user.findFirst({
        where: { OR: searchTerms },
        select: { id: true, email: true, name: true, password: true, role: true, isActive: true },
      })

      // If still not found and identifier is "admin", match the active admin user
      if (!user && email.toLowerCase() === "admin") {
        user = await prisma.user.findFirst({
          where: { role: { in: ["SUPER_ADMIN", "ADMIN"] }, isActive: true },
          select: { id: true, email: true, name: true, password: true, role: true, isActive: true },
        })
      }
    } catch (dbErr) {
      console.error("[admin-login] prisma error:", dbErr)
      return loginError(req, "Database connection error. Check DATABASE_URL in Vercel environment variables.")
    }

    console.log("[admin-login] user found:", !!user)

    if (!user) {
      return loginError(req, `No account found for "${email}". Visit /api/admin-gate/setup?key=FaltuXornexz to configure one.`)
    }

    if (user.isActive === false) {
      return loginError(req, "This account has been disabled.")
    }

    if (!user.password) {
      return loginError(req, "No password set. Visit /api/admin-gate/setup?key=FaltuXornexz to reset credentials.")
    }

    const valid = await bcrypt.compare(password, user.password).catch(() => false)
    console.log("[admin-login] password valid:", valid)

    if (!valid) {
      return loginError(req, "Incorrect password. Please try again.")
    }

    // ── Sign JWT ──────────────────────────────────────────────────────────
    const token = await signAdminToken({
      id: user.id,
      email: user.email ?? email,
      name: user.name,
      role: user.role,
    })
    console.log("[admin-login] token signed, length:", token.length)

    // Non-critical — don't let this fail the login
    prisma.user.update({ where: { id: user.id }, data: { lastLoginAt: new Date() } }).catch(() => {})

    // ── Build redirect response with cookies ──────────────────────────────
    const dest = callbackUrl.startsWith("/admin") ? callbackUrl : "/admin/dashboard"
    console.log("[admin-login] success → redirecting to:", dest)

    const res = NextResponse.redirect(new URL(dest, req.url), 303)
    res.cookies.set("admin_gate", ADMIN_GATE_TOKEN, COOKIE_OPTS)
    res.cookies.set(COOKIE_NAME, token, COOKIE_OPTS)
    return res
  } catch (err) {
    console.error("[admin-login] unexpected error:", err)
    return loginError(req, "Unexpected server error. Please try again.")
  }
}
