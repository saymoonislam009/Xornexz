import { NextRequest, NextResponse } from 'next/server'
import { z } from 'zod'
import { prisma } from '@/lib/db'
import { Resend } from 'resend'

const ContactSchema = z.object({
  name: z.string().trim().min(1, 'Name is required').max(120),
  email: z.string().trim().email('Please enter a valid email address').max(200),
  company: z.string().max(120).optional().default(''),
  phone: z.string().max(60).optional().default(''),
  service: z.string().max(150).optional().default(''),
  budget: z.string().max(80).optional().default(''),
  timeline: z.string().max(80).optional().default(''),
  requirements: z.array(z.string().max(120)).optional().default([]),
  message: z.string().trim().min(1, 'Please add a short message about your project').max(5000),
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
    const ip =
      req.headers.get('x-real-ip') ??
      req.headers.get('x-forwarded-for')?.split(',')[0]?.trim() ??
      '127.0.0.1'

    // Rate limiting via Upstash (optional — skips gracefully if not configured)
    if (process.env.UPSTASH_REDIS_REST_URL && process.env.UPSTASH_REDIS_REST_TOKEN) {
      try {
        const { Ratelimit } = await import('@upstash/ratelimit')
        const { Redis } = await import('@upstash/redis')
        const ratelimit = new Ratelimit({
          redis: new Redis({
            url: process.env.UPSTASH_REDIS_REST_URL,
            token: process.env.UPSTASH_REDIS_REST_TOKEN,
          }),
          limiter: Ratelimit.slidingWindow(5, '10 m'),
          prefix: 'contact',
        })
        const { success } = await ratelimit.limit(ip)
        if (!success) {
          return NextResponse.json(
            { error: 'Too many requests. Please wait a few minutes before submitting again.' },
            { status: 429 }
          )
        }
      } catch (rlErr) {
        console.warn('[contact] rate limit skipped:', rlErr)
      }
    }

    const body = await req.json()
    const parsed = ContactSchema.safeParse(body)
    if (!parsed.success) {
      const firstIssue = parsed.error.issues[0]?.message || 'Please check your input fields.'
      return NextResponse.json({ error: firstIssue }, { status: 400 })
    }
    const { _honey, name, email, company, phone, service, budget, timeline, requirements, message } =
      parsed.data

    // Honeypot check
    if (_honey && _honey.length > 0) {
      return NextResponse.json({ success: true }) // silently discard spam bots
    }

    const metaLines: string[] = []
    if (timeline) metaLines.push(`Timeline: ${timeline}`)
    if (phone) metaLines.push(`Phone: ${phone}`)
    if (requirements && requirements.length > 0) {
      metaLines.push(`Requirements: ${requirements.join(', ')}`)
    }
    const fullMessage =
      metaLines.length > 0 ? `[${metaLines.join(' | ')}]\n\n${message}` : message

    // Save to DB: ContactSubmission AND Lead so it appears in both Contact & Leads CRM
    await prisma.contactSubmission.create({
      data: {
        name,
        email,
        company: company || null,
        subject: service || 'Project Inquiry',
        budget: budget || null,
        message: fullMessage,
        ipAddress: ip,
      },
    })

    try {
      await prisma.lead.create({
        data: {
          name,
          email,
          phone: phone || null,
          company: company || null,
          message: fullMessage,
          budget: budget || null,
          timeline: timeline || null,
          projectType: service || 'Project Inquiry',
          tags: requirements && requirements.length > 0 ? requirements : [],
          source: 'WEBSITE',
          status: 'NEW',
          ipAddress: ip,
        },
      })
    } catch (leadErr) {
      console.warn('[contact] Could not create lead record:', leadErr)
    }

    // Send email via Resend — non-blocking if Resend is unconfigured or fails
    if (process.env.RESEND_API_KEY) {
      try {
        const resend = new Resend(process.env.RESEND_API_KEY)
        await resend.emails.send({
          from: `${process.env.RESEND_FROM_NAME ?? 'Xornexz'} <${process.env.RESEND_FROM_EMAIL ?? 'hello@xornexz.com'}>`,
          to: [process.env.RESEND_FROM_EMAIL ?? 'hello@xornexz.com'],
          subject: `New project inquiry from ${escapeHtml(name)}`,
          html: `
            <h2>New Project Inquiry</h2>
            <p><strong>Name:</strong> ${escapeHtml(name)}</p>
            <p><strong>Email:</strong> ${escapeHtml(email)}</p>
            ${company ? `<p><strong>Company:</strong> ${escapeHtml(company)}</p>` : ''}
            ${phone ? `<p><strong>Phone:</strong> ${escapeHtml(phone)}</p>` : ''}
            ${service ? `<p><strong>Service:</strong> ${escapeHtml(service)}</p>` : ''}
            ${budget ? `<p><strong>Budget:</strong> ${escapeHtml(budget)}</p>` : ''}
            ${timeline ? `<p><strong>Timeline:</strong> ${escapeHtml(timeline)}</p>` : ''}
            ${
              requirements.length
                ? `<p><strong>Requirements:</strong> ${escapeHtml(requirements.join(', '))}</p>`
                : ''
            }
            <p><strong>Message:</strong></p>
            <blockquote>${escapeHtml(message).replace(/\n/g, '<br>')}</blockquote>
          `,
        })
      } catch (emailErr) {
        console.warn('[contact] email notification failed:', emailErr)
      }
    }

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('[contact]', error)
    return NextResponse.json(
      { error: 'Something went wrong while sending your message. Please try again.' },
      { status: 500 }
    )
  }
}
