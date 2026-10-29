import { prisma } from '@/lib/db'
import { unstable_cache } from 'next/cache'

export const getFAQs = unstable_cache(
  async () => {
    try {
      return await prisma.fAQ.findMany({ orderBy: { order: 'asc' } })
    } catch {
      return []
    }
  },
  ['faqs'],
  { tags: ['faqs'], revalidate: 60 }
)
