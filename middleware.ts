import { NextRequest, NextResponse } from 'next/server'
import NextAuth from 'next-auth'
import { authConfig } from '@/lib/auth.config'

const ADMIN_GATE_COOKIE = 'admin_gate'
const ADMIN_GATE_TOKEN = 'FaltuXornexz'
const GATE_PATH = '/admin/gate'

const { auth } = NextAuth(authConfig)

export default auth(function middleware(req) {
  const { pathname } = req.nextUrl

  // ── Gate check ────────────────────────────────────────────────────────────
  // The gate page and its API route are always accessible
  if (pathname === GATE_PATH || pathname.startsWith('/api/admin-gate')) {
    return NextResponse.next()
  }

  // For all admin routes, enforce the gate cookie FIRST
  if (pathname.startsWith('/admin') || pathname.startsWith('/api/admin')) {
    const gateCookie = req.cookies.get(ADMIN_GATE_COOKIE)?.value
    if (gateCookie !== ADMIN_GATE_TOKEN) {
      const gateUrl = req.nextUrl.clone()
      gateUrl.pathname = GATE_PATH
      gateUrl.search = ''
      return NextResponse.redirect(gateUrl)
    }
  }

  // ── NextAuth session check ─────────────────────────────────────────────────
  // Gate passed — NextAuth's authorized() callback in authConfig handles
  // redirecting unauthenticated users to /admin/login
  return NextResponse.next()
})

export const config = {
  matcher: [
    '/admin/:path*',
    '/api/admin/:path*',
    '/api/admin-gate/:path*',
  ],
}
