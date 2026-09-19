import { prisma } from '@/lib/db'
import { unstable_cache } from 'next/cache'

export const getServices = unstable_cache(
  async () => {
    return await prisma.service.findMany({
      orderBy: { order: 'asc' },
    })
  },
  ['services'],
  { tags: ['services'], revalidate: 300 }
)

export const getServiceBySlug = unstable_cache(
  async (slug: string) => {
    return await prisma.service.findUnique({ where: { slug } })
  },
  ['service-by-slug'],
  { tags: ['services'], revalidate: 300 }
)