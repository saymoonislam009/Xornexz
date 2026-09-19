import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/db'
import { revalidateTag } from 'next/cache'

export const dynamic = 'force-dynamic'

export async function POST(req: NextRequest) {
  const cronSecret = req.headers.get('x-cron-secret')
  if (!process.env.CRON_SECRET || cronSecret !== process.env.CRON_SECRET) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const now = new Date()
  const published = await prisma.blogPost.updateMany({
    where: {
      status: 'DRAFT',
      scheduledAt: { lte: now },
    },
    data: { status: 'PUBLISHED', publishedAt: now },
  })

  if (published.count > 0) {
    revalidateTag('blog')
  }

  return NextResponse.json({ published: published.count })
}
