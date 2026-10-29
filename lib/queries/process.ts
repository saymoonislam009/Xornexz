import { prisma } from '@/lib/db'
import { unstable_cache } from 'next/cache'

export const getProcessSteps = unstable_cache(
  async () => {
    try {
      return await prisma.processStep.findMany({ orderBy: { order: 'asc' } })
    } catch {
      return []
    }
  },
  ['process'],
  { tags: ['process'], revalidate: 60 }
)
