import { NextRequest, NextResponse } from 'next/server'
import { z } from 'zod'
import { prisma } from '@/lib/db'

const Schema = z.object({
  email: z.string().email().max(200),
  _honey: z.string().max(0).optional(),
})

export async function POST(req: NextRequest) {
  try {
    const body = await req.json()
    const parsed = Schema.safeParse(body)
    if (!parsed.success) return NextResponse.json({ error: 'Invalid email.' }, { status: 400 })
    const { email, _honey } = parsed.data
    if (_honey && _honey.length > 0) return NextResponse.json({ success: true })

    await prisma.newsletterSubscriber.upsert({
      where: { email },
      create: { email },
      update: {},
    })
    return NextResponse.json({ success: true })
  } catch {
    return NextResponse.json({ error: 'Something went wrong.' }, { status: 500 })
  }
}
