import { prisma } from '@/lib/db'
import { unstable_cache } from 'next/cache'

export const getProjects = unstable_cache(
  async (featured?: boolean) => {
    return await prisma.project.findMany({
      where: featured !== undefined ? { featured } : undefined,
      orderBy: { order: 'asc' },
    })
  },
  ['projects'],
  { tags: ['projects'], revalidate: 300 }
)

export const getProjectBySlug = unstable_cache(
  async (slug: string) => {
    return await prisma.project.findUnique({ where: { slug } })
  },
  ['project-by-slug'],
  { tags: ['projects'], revalidate: 300 }
)