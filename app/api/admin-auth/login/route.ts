import { NextRequest, NextResponse } from "next/server"
import { prisma } from "@/lib/db"
import bcrypt from "bcryptjs"
import { signAdminToken, COOKIE_NAME } from "@/lib/admin-jwt"
import { GATE_COOKIE, GATE_COOKIE_OPTS, signGateCookie, getClientIp } from "@/lib/admin-gate"


const COOKIE_OPTS = {
  httpOnly: true,
  secure: process.env.NODE_ENV === "production",
  sameSite: "lax" as const,
  maxAge: 60 * 60 * 24 * 7, // 7 days
  path: "/",
}

const WINDOW_MS = 15 * 60 * 1000

async function recordAttempt(ip: string, identifier: string, success: boolean) {
  try {
    await prisma.loginAttempt.create({
      data: { email: identifier.toLowerCase().slice(0, 200), ip, success },
    })
  } catch {
    /* table may be missing — never block login on logging */
  }
}

/** Lock out after 5 failures per account or 10 per IP within 15 minutes. */
async function tooManyAttempts(ip: string, identifier: string): Promise<boolean> {
  try {
    const since = new Date(Date.now() - WINDOW_MS)
    const [byAccount, byIp] = await Promise.all([
      prisma.loginAttempt.count({
        where: { email: identifier.toLowerCase().slice(0, 200), success: false, createdAt: { gt: since } },
      }),
      prisma.loginAttempt.count({ where: { ip, success: false, createdAt: { gt: since } } }),
    ])
    return byAccount >= 5 || byIp >= 10
  } catch {
    return false
  }
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

    if (!email || !password) {
      return loginError(req, "Please enter both email/username and password.")
    }

    const ip = getClientIp(req)
    if (await tooManyAttempts(ip, email)) {
      return loginError(req, "Too many failed attempts. Please wait 15 minutes and try again.")
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
      return loginError(req, "Service temporarily unavailable. Please try again.")
    }

    console.log("[admin-login] user found:", !!user)

    if (!user) {
      await recordAttempt(ip, email, false)
      return loginError(req, "Invalid credentials.")
    }

    if (user.isActive === false) {
      return loginError(req, "Invalid credentials.")
    }

    if (!user.password) {
      return loginError(req, "Invalid credentials.")
    }

    const valid = await bcrypt.compare(password, user.password).catch(() => false)
    console.log("[admin-login] password valid:", valid)

    if (!valid) {
      await recordAttempt(ip, email, false)
      return loginError(req, "Invalid credentials.")
    }

    await recordAttempt(ip, email, true)

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
    res.cookies.set(GATE_COOKIE, await signGateCookie(), GATE_COOKIE_OPTS)
    res.cookies.set(COOKIE_NAME, token, COOKIE_OPTS)
    return res
  } catch (err) {
    console.error("[admin-login] unexpected error:", err)
    return loginError(req, "Unexpected server error. Please try again.")
  }
}
