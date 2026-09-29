import { NextRequest, NextResponse } from 'next/server'

const ADMIN_GATE_TOKEN = 'FaltuXornexz'
const ADMIN_GATE_COOKIE = 'admin_gate'

export async function POST(req: NextRequest) {
  try {
    const { token } = await req.json()

    if (token !== ADMIN_GATE_TOKEN) {
      return NextResponse.json({ error: 'Invalid token' }, { status: 401 })
    }

    const res = NextResponse.json({ ok: true })

    // httpOnly so JS can't read it; Secure in production; SameSite=Strict
    res.cookies.set(ADMIN_GATE_COOKIE, ADMIN_GATE_TOKEN, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
      // 7-day session — remove maxAge if you want a session-only cookie
      maxAge: 60 * 60 * 24 * 7,
      path: '/',
    })

    return res
  } catch {
    return NextResponse.json({ error: 'Bad request' }, { status: 400 })
  }
}
