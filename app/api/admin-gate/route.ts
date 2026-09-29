import { NextRequest, NextResponse } from 'next/server'

const ADMIN_GATE_TOKEN = 'FaltuXornexz'
const ADMIN_GATE_COOKIE = 'admin_gate'

const COOKIE_OPTS = {
  httpOnly: true,
  secure: process.env.NODE_ENV === 'production',
  sameSite: 'strict' as const,
  maxAge: 60 * 60 * 24 * 7, // 7 days
  path: '/',
}

// GET /api/admin-gate?key=FaltuXornexz
// → sets cookie, redirects to /admin/login
// → wrong key or missing → 404
export async function GET(req: NextRequest) {
  const key = req.nextUrl.searchParams.get('key')
  if (key !== ADMIN_GATE_TOKEN) {
    return new NextResponse(null, { status: 404 })
  }

  const res = NextResponse.redirect(new URL('/admin/login', req.url))
  res.cookies.set(ADMIN_GATE_COOKIE, ADMIN_GATE_TOKEN, COOKIE_OPTS)
  return res
}

// POST /api/admin-gate  { token: "..." }
// → kept for future programmatic use, but the GET above is the primary entry point
export async function POST(req: NextRequest) {
  try {
    const { token } = await req.json()
    if (token !== ADMIN_GATE_TOKEN) {
      return new NextResponse(null, { status: 404 })
    }
    const res = NextResponse.json({ ok: true })
    res.cookies.set(ADMIN_GATE_COOKIE, ADMIN_GATE_TOKEN, COOKIE_OPTS)
    return res
  } catch {
    return new NextResponse(null, { status: 404 })
  }
}
