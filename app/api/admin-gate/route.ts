import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/db'
import {
  GATE_COOKIE,
  GATE_COOKIE_OPTS,
  getClientIp,
  keyMatches,
  signGateCookie,
} from '@/lib/admin-gate'

export const dynamic = 'force-dynamic'

const WINDOW_MS = 15 * 60 * 1000
const MAX_FAILURES = 5

const notFound = () => new NextResponse(null, { status: 404 })

/** Brute-force protection: too many wrong keys from one IP → silent 404 for a while. */
async function isLockedOut(ip: string): Promise<boolean> {
  try {
    const failures = await prisma.loginAttempt.count({
      where: {
        email: 'gate',
        ip,
        success: false,
        createdAt: { gt: new Date(Date.now() - WINDOW_MS) },
      },
    })
    return failures >= MAX_FAILURES
  } catch {
    return false // never lock the owner out because of a DB hiccup
  }
}

async function record(ip: string, success: boolean) {
  try {
    await prisma.loginAttempt.create({ data: { email: 'gate', ip, success } })
  } catch {
    /* ignore */
  }
}

async function unlock(key: string | null, req: NextRequest): Promise<boolean> {
  const ip = getClientIp(req)
  if (await isLockedOut(ip)) return false
  const ok = keyMatches(key)
  await record(ip, ok)
  return ok
}

// GET /api/admin-gate?key=…  → sets signed cookie, redirects to the login page.
// Wrong / missing key → plain 404 (indistinguishable from a non-existent URL).
export async function GET(req: NextRequest) {
  if (!(await unlock(req.nextUrl.searchParams.get('key'), req))) return notFound()
  const res = NextResponse.redirect(new URL('/admin/login', req.url))
  res.cookies.set(GATE_COOKIE, await signGateCookie(), GATE_COOKIE_OPTS)
  res.headers.set('Cache-Control', 'no-store')
  return res
}

export async function POST(req: NextRequest) {
  try {
    const { token } = await req.json()
    if (!(await unlock(token, req))) return notFound()
    const res = NextResponse.json({ ok: true })
    res.cookies.set(GATE_COOKIE, await signGateCookie(), GATE_COOKIE_OPTS)
    return res
  } catch {
    return notFound()
  }
}
