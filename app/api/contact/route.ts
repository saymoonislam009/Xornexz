import { NextRequest, NextResponse } from 'next/server'
import { z } from 'zod'
import { prisma } from '@/lib/db'
import { Resend } from 'resend'

const resend = new Resend(process.env.RESEND_API_KEY)

const ContactSchema = z.object({
  name: z.string().min(1).max(100),
  email: z.string().email().max(200),
  company: z.string().max(100).optional(),
  service: z.string().max(100).optional(),
  budget: z.string().max(50).optional(),
  timeline: z.string().max(50).optional(),
  message: z.string().min(10).max(5000),
  _honey: z.string().max(0).optional(), // honeypot — must be empty
})

function escapeHtml(str: string): string {
  return str
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#039;')
}

export async function POST(req: NextRequest) {
  try {
    // Rate limiting via Upstash (optional — skips gracefully if not configured)
    if (process.env.UPSTASH_REDIS_REST_URL && process.env.UPSTASH_REDIS_REST_TOKEN) {
      const { Ratelimit } = await import('@upstash/ratelimit')
      const { Redis } = await import('@upstash/redis')
      const ratelimit = new Ratelimit({
        redis: new Redis({ url: process.env.UPSTASH_REDIS_REST_URL, token: process.env.UPSTASH_REDIS_REST_TOKEN }),
        limiter: Ratelimit.slidingWindow(3, '10 m'),
        prefix: 'contact',
      })
      const ip = req.headers.get('x-real-ip') ?? req.headers.get('x-forwarded-for')?.split(',')[0] ?? '127.0.0.1'
      const { success } = await ratelimit.limit(ip)
      if (!success) {
        return NextResponse.json({ error: 'Too many requests. Please wait before submitting again.' }, { status: 429 })
      }
    }

    const body = await req.json()
    const parsed = ContactSchema.safeParse(body)
    if (!parsed.success) {
      return NextResponse.json({ error: 'Invalid input.' }, { status: 400 })
    }
    const { _honey, name, email, company, service, budget, timeline, message } = parsed.data

    // Honeypot check
    if (_honey && _honey.length > 0) {
      return NextResponse.json({ success: true }) // silently discard
    }

    // Save to DB with whitelisted fields only
    await prisma.contactSubmission.create({
      data: { 
        name, 
        email, 
        company, 
        subject: service || 'General Inquiry', 
        budget, 
        message: timeline ? `[Timeline: ${timeline}]\n\n${message}` : message 
      },
    })

    // Send email via Resend — all user input HTML-escaped
    if (process.env.RESEND_API_KEY) {
      await resend.emails.send({
        from: `${process.env.RESEND_FROM_NAME ?? 'Xornexz'} <${process.env.RESEND_FROM_EMAIL ?? 'hello@xornexz.com'}>`,
        to: [process.env.RESEND_FROM_EMAIL ?? 'hello@xornexz.com'],
        subject: `New contact from ${escapeHtml(name)}`,
        html: `
          <h2>New Contact Submission</h2>
          <p><strong>Name:</strong> ${escapeHtml(name)}</p>
          <p><strong>Email:</strong> ${escapeHtml(email)}</p>
          ${company ? `<p><strong>Company:</strong> ${escapeHtml(company)}</p>` : ''}
          ${service ? `<p><strong>Service:</strong> ${escapeHtml(service)}</p>` : ''}
          ${budget ? `<p><strong>Budget:</strong> ${escapeHtml(budget)}</p>` : ''}
          ${timeline ? `<p><strong>Timeline:</strong> ${escapeHtml(timeline)}</p>` : ''}
          <p><strong>Message:</strong></p>
          <blockquote>${escapeHtml(message).replace(/\n/g, '<br>')}</blockquote>
        `,
      })
    }

    // Return ONLY success — no DB row, no IDs
    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('[contact]', error)
    return NextResponse.json({ error: 'Something went wrong. Please try again.' }, { status: 500 })
  }
}
