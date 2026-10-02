import { SignJWT, jwtVerify } from "jose"
import { cookies } from "next/headers"

const COOKIE_NAME = "admin_session"

function getSecret() {
  const secretKey = process.env.AUTH_SECRET || "fallback-secret-xornexz-production-key-2025"
  return new TextEncoder().encode(secretKey)
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
      return null
    }
    return {
      id: String(payload.id),
      email: String(payload.email ?? ""),
      name: payload.name ? String(payload.name) : null,
      role: String(payload.role ?? "ADMIN"),
    }
  } catch {
    return null
  }
}

export async function getAdminSession(): Promise<AdminSession | null> {
  try {
    const cookieStore = await cookies()
    const token = cookieStore.get(COOKIE_NAME)?.value
    if (!token) return null
    return await verifyAdminToken(token)
  } catch {
    return null
  }
}

export { COOKIE_NAME }
