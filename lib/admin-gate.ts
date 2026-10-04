/**
 * Admin "gate" — the first lock in front of the admin area.
 *
 * Visitors who haven't unlocked the gate get a plain 404 for EVERYTHING under
 * /admin and /api/admin*, including the login page. The gate is unlocked by
 * visiting /api/admin-gate?key=<ADMIN_GATE_KEY>.
 *
 * The cookie is an HMAC-signed, expiring token — it is NOT the key itself, so it
 * cannot be forged or read back from the browser, and rotating ADMIN_GATE_KEY
 * invalidates every previously-issued cookie.
 *
 * Uses only Web Crypto, so it works in both the Edge middleware and Node routes.
 */

export const GATE_COOKIE = "admin_gate"
export const GATE_MAX_AGE_SECONDS = 60 * 60 * 24 * 7 // 7 days

// Backwards-compatible default so the existing key keeps working until you set
// ADMIN_GATE_KEY in Vercel. That old value has been exposed — ROTATE IT.
const LEGACY_GATE_KEY = "FaltuXornexz"

export function getGateKey(): string {
  return process.env.ADMIN_GATE_KEY?.trim() || LEGACY_GATE_KEY
}

/** Server secret used for signing. Never falls back to a value stored in git. */
export function getServerSecret(): string {
  const s = process.env.AUTH_SECRET || process.env.NEXTAUTH_SECRET
  if (s) return s
  const db = process.env.DATABASE_URL
  if (db) return `derived:${db}` // private per-deployment value
  if (process.env.NODE_ENV === "production") {
    throw new Error("AUTH_SECRET is not configured")
  }
  return "dev-only-insecure-secret"
}

const enc = new TextEncoder()

function toHex(buf: ArrayBuffer): string {
  return Array.from(new Uint8Array(buf))
    .map((b) => b.toString(16).padStart(2, "0"))
    .join("")
}

async function hmac(message: string): Promise<string> {
  const key = await crypto.subtle.importKey(
    "raw",
    enc.encode(`${getServerSecret()}|${getGateKey()}`),
    { name: "HMAC", hash: "SHA-256" },
    false,
    ["sign"]
  )
  return toHex(await crypto.subtle.sign("HMAC", key, enc.encode(`gate.${message}`)))
}

/** Constant-time string comparison. */
export function safeEqual(a: string, b: string): boolean {
  const len = Math.max(a.length, b.length)
  let diff = a.length ^ b.length
  for (let i = 0; i < len; i++) {
    diff |= (a.charCodeAt(i) || 0) ^ (b.charCodeAt(i) || 0)
  }
  return diff === 0
}

export function keyMatches(input: string | null | undefined): boolean {
  if (!input) return false
  return safeEqual(input, getGateKey())
}

export async function signGateCookie(): Promise<string> {
  const exp = String(Date.now() + GATE_MAX_AGE_SECONDS * 1000)
  return `${exp}.${await hmac(exp)}`
}

export async function verifyGateCookie(value: string | undefined | null): Promise<boolean> {
  if (!value) return false
  const dot = value.indexOf(".")
  if (dot < 1) return false
  const exp = value.slice(0, dot)
  const sig = value.slice(dot + 1)
  if (!/^\d+$/.test(exp) || Number(exp) < Date.now()) return false
  try {
    return safeEqual(sig, await hmac(exp))
  } catch {
    return false
  }
}

export const GATE_COOKIE_OPTS = {
  httpOnly: true,
  secure: process.env.NODE_ENV === "production",
  sameSite: "lax" as const, // 'strict' is dropped by Safari on redirects
  maxAge: GATE_MAX_AGE_SECONDS,
  path: "/",
}

export function getClientIp(req: { headers: Headers }): string {
  return (
    req.headers.get("x-real-ip") ||
    req.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ||
    "unknown"
  )
}
