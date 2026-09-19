import { prisma } from '@/lib/db'
import { unstable_cache } from 'next/cache'

export const getProcessSteps = unstable_cache(
  async () => {
    return await prisma.processStep.findMany({ orderBy: { order: 'asc' } })
  },
  ['process'],
  { tags: ['process'], revalidate: 300 }
)