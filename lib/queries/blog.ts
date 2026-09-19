import { prisma } from '@/lib/db'
import { unstable_cache } from 'next/cache'

export const getBlogPosts = unstable_cache(
  async () => {
    return await prisma.blogPost.findMany({
      where: { status: 'PUBLISHED', publishedAt: { lte: new Date() } },
      orderBy: { publishedAt: 'desc' },
    })
  },
  ['blog-posts'],
  { tags: ['blog'], revalidate: 300 }
)

export const getBlogPostBySlug = unstable_cache(
  async (slug: string) => {
    return await prisma.blogPost.findFirst({
      where: { slug, status: 'PUBLISHED' },
    })
  },
  ['blog-post-by-slug'],
  { tags: ['blog'], revalidate: 300 }
)