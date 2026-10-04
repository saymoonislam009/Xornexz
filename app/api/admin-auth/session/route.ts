import { NextRequest, NextResponse } from "next/server"
import { cookies } from "next/headers"
import { verifyAdminToken, COOKIE_NAME } from "@/lib/admin-jwt"

// Public diagnostic endpoint — tells you exactly what session state looks like
// Visit: https://xornexz.vercel.app/api/admin-auth/session
export async function GET(req: NextRequest) {
  try {
    const cookieStore = await cookies()
    const allCookieNames = cookieStore.getAll().map((c) => c.name)
    const adminSessionCookie = cookieStore.get(COOKIE_NAME)?.value

    let sessionStatus = "no_cookie"
    let sessionPayload: object | null = null
    let verifyError: string | null = null

    if (adminSessionCookie) {
      try {
        const session = await verifyAdminToken(adminSessionCookie)
        if (session) {
          sessionStatus = "valid"
          sessionPayload = {
            id: session.id,
            email: session.email,
            role: session.role,
            name: session.name,
          }
        } else {
          sessionStatus = "invalid_token"
        }
      } catch (e) {
        sessionStatus = "verify_error"
        verifyError = e instanceof Error ? e.message : String(e)
      }
    }

    return NextResponse.json({
      status: sessionStatus,
      cookies: allCookieNames,
      hasAdminGate: allCookieNames.includes("admin_gate"),
      hasAdminSession: allCookieNames.includes(COOKIE_NAME),
      tokenLength: adminSessionCookie?.length ?? 0,
      session: sessionPayload,
      error: verifyError,
      authSecretSet: !!process.env.AUTH_SECRET,
      // First 8 chars so you can verify the value without exposing the full secret
      authSecretPrefix: process.env.AUTH_SECRET ? process.env.AUTH_SECRET.substring(0, 8) + "..." : "(using fallback)",
      nodeEnv: process.env.NODE_ENV,
    })
  } catch (err) {
    return NextResponse.json({
      status: "server_error",
      error: err instanceof Error ? err.message : String(err),
    }, { status: 500 })
  }
}
