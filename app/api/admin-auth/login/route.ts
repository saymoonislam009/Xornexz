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

function isJsonRequest(req: NextRequest): boolean {
  const accept = req.headers.get("accept") || ""
  const ct = req.headers.get("content-type") || ""
  return ct.includes("application/json") || accept.includes("application/json")
}

function errorRedirect(req: NextRequest, msg: string, callbackUrl: string): NextResponse {
  const url = new URL("/admin/login", req.url)
  url.searchParams.set("error", msg)
  if (callbackUrl && callbackUrl !== "/admin/dashboard") {
    url.searchParams.set("callbackUrl", callbackUrl)
  }
  return NextResponse.redirect(url, 303)
}

export async function POST(req: NextRequest) {
  let email = ""
  let password = ""
  let callbackUrl = "/admin/dashboard"
  const json = isJsonRequest(req)

  try {
    if (json) {
      const body = await req.json().catch(() => ({}))
      email = String(body.email || "").trim().toLowerCase()
      password = String(body.password || "")
      callbackUrl = String(body.callbackUrl || "/admin/dashboard")
    } else {
      const form = await req.formData().catch(() => null)
      email = String(form?.get("email") || "").trim().toLowerCase()
      password = String(form?.get("password") || "")
      callbackUrl = String(form?.get("callbackUrl") || "/admin/dashboard")
    }

    if (!email || !password) {
      const msg = "Please enter both email and password."
      if (json) return NextResponse.json({ error: msg }, { status: 400 })
      return errorRedirect(req, msg, callbackUrl)
    }

    const user = await prisma.user.findFirst({
      where: { email: { equals: email, mode: "insensitive" } },
    })

    if (!user) {
      const msg = `No admin account found for "${email}". Use the setup link to create one.`
      if (json) return NextResponse.json({ error: msg }, { status: 401 })
      return errorRedirect(req, msg, callbackUrl)
    }

    if (user.isActive === false) {
      const msg = "This account has been disabled."
      if (json) return NextResponse.json({ error: msg }, { status: 401 })
      return errorRedirect(req, msg, callbackUrl)
    }

    if (!user.password) {
      const msg = "No password set on this account. Please use the setup page to configure credentials."
      if (json) return NextResponse.json({ error: msg }, { status: 401 })
      return errorRedirect(req, msg, callbackUrl)
    }

    const valid = await bcrypt.compare(password, user.password)
    if (!valid) {
      const msg = "Incorrect password. Please try again."
      if (json) return NextResponse.json({ error: msg }, { status: 401 })
      return errorRedirect(req, msg, callbackUrl)
    }

    // Non-critical update — don't let this fail the login
    prisma.user.update({ where: { id: user.id }, data: { lastLoginAt: new Date() } }).catch(() => {})

    const token = await signAdminToken({
      id: user.id,
      email: user.email ?? email,
      name: user.name,
      role: user.role,
    })

    if (json) {
      const res = NextResponse.json({ ok: true })
      res.cookies.set("admin_gate", ADMIN_GATE_TOKEN, COOKIE_OPTS)
      res.cookies.set(COOKIE_NAME, token, COOKIE_OPTS)
      return res
    }

    // Native form POST → server-side redirect with cookies in response headers
    const dest = callbackUrl.startsWith("/admin") ? callbackUrl : "/admin/dashboard"
    const res = NextResponse.redirect(new URL(dest, req.url), 303)
    res.cookies.set("admin_gate", ADMIN_GATE_TOKEN, COOKIE_OPTS)
    res.cookies.set(COOKIE_NAME, token, COOKIE_OPTS)
    return res
  } catch (err) {
    console.error("[admin-login]", err)
    const msg = "Server error during authentication. Check your Vercel DATABASE_URL environment variable."
    if (json) return NextResponse.json({ error: msg }, { status: 500 })
    return errorRedirect(req, msg, callbackUrl)
  }
}
