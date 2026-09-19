import { prisma } from '@/lib/db'
import { unstable_cache } from 'next/cache'

export const getPricingPlans = unstable_cache(
  async () => {
    return await prisma.pricingPlan.findMany({ orderBy: { order: 'asc' } })
  },
  ['pricing'],
  { tags: ['pricing'], revalidate: 300 }
)