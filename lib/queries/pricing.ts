import { prisma } from '@/lib/db'
import { unstable_cache } from 'next/cache'

export const getPricingPlans = unstable_cache(
  async () => {
    try {
      return await prisma.pricingPlan.findMany({ orderBy: { order: 'asc' } })
    } catch {
      return []
    }
  },
  ['pricing'],
  { tags: ['pricing'], revalidate: 60 }
)
