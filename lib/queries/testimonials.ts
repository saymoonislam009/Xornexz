import { prisma } from '@/lib/db'
import { unstable_cache } from 'next/cache'

export const getTestimonials = unstable_cache(
  async () => {
    return await prisma.testimonial.findMany({ orderBy: { createdAt: 'desc' } })
  },
  ['testimonials'],
  { tags: ['testimonials'], revalidate: 300 }
)