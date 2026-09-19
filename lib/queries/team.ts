import { prisma } from '@/lib/db'
import { unstable_cache } from 'next/cache'

export const getTeamMembers = unstable_cache(
  async () => {
    return await prisma.teamMember.findMany({ orderBy: { order: 'asc' } })
  },
  ['team'],
  { tags: ['team'], revalidate: 300 }
)