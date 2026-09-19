import { prisma } from '@/lib/db'
import { unstable_cache } from 'next/cache'

export const getJobs = unstable_cache(
  async () => {
    return await prisma.job.findMany({
      where: { status: 'OPEN' },
      orderBy: { createdAt: 'desc' },
    })
  },
  ['jobs'],
  { tags: ['jobs'], revalidate: 300 }
)

export const getJobBySlug = unstable_cache(
  async (slug: string) => {
    return await prisma.job.findFirst({
      where: { slug },
    })
  },
  ['job-by-slug'],
  { tags: ['jobs'], revalidate: 300 }
)