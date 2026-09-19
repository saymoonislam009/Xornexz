import { prisma } from '@/lib/db'
import { unstable_cache } from 'next/cache'

export const getFAQs = unstable_cache(
  async () => {
    return await prisma.fAQ.findMany({ orderBy: { order: 'asc' } })
  },
  ['faqs'],
  { tags: ['faqs'], revalidate: 300 }
)