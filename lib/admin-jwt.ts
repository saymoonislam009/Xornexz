import { SignJWT, jwtVerify } from "jose"
import { cookies } from "next/headers"
import { getServerSecret } from "@/lib/admin-gate"

export const COOKIE_NAME = "admin_session"

function getSecret() {
  // No hardcoded fallback: a secret committed to git would let anyone forge admin sessions.
  return new TextEncoder().encode(getServerSecret())
}

export interface AdminSession {
  id: string
  email: string
  name: string | null
  role: string
}

export async function signAdminToken(session: AdminSession): Promise<string> {
  return new SignJWT({
    id: session.id,
    email: session.email,
    name: session.name,
    role: session.role,
  })
    .setProtectedHeader({ alg: "HS256" })
    .setIssuedAt()
    .setExpirationTime("7d")
    .sign(getSecret())
}

export async function verifyAdminToken(token: string): Promise<AdminSession | null> {
  try {
    const { payload } = await jwtVerify(token, getSecret())
    if (!payload || typeof payload !== "object" || !payload.id) {
      console.warn("[admin-jwt] token payload missing id")
      return null
    }
    return {
      id: String(payload.id),
      email: String(payload.email ?? ""),
      name: payload.name ? String(payload.name) : null,
      role: String(payload.role ?? "ADMIN"),
    }
  } catch (err) {
    // Log the specific JWT error so it's visible in Vercel function logs
    console.error("[admin-jwt] verifyAdminToken failed:", err instanceof Error ? err.message : err)
    return null
  }
}

export async function getAdminSession(): Promise<AdminSession | null> {
  try {
    const cookieStore = await cookies()
    const token = cookieStore.get(COOKIE_NAME)?.value
    if (!token) {
      return null
    }
    return await verifyAdminToken(token)
  } catch (err) {
    console.error("[admin-jwt] getAdminSession error:", err instanceof Error ? err.message : err)
    return null
  }
}

/** Edge-safe verification used by middleware (no next/headers). */
export async function verifyAdminTokenEdge(token: string): Promise<boolean> {
  return (await verifyAdminToken(token)) !== null
}
