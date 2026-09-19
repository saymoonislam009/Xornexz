import { prisma } from '@/lib/db'
import { unstable_cache } from 'next/cache'

const DEFAULT_SECTIONS = [
  { key: 'hero', order: 0 },
  { key: 'stats', order: 1 },
  { key: 'services', order: 2 },
  { key: 'projects', order: 3 },
  { key: 'process', order: 4 },
  { key: 'techstack', order: 5 },
  { key: 'testimonials', order: 6 },
  { key: 'pricing', order: 7 },
  { key: 'faq', order: 8 },
  { key: 'cta', order: 9 },
]

export const getHomeSections = unstable_cache(
  async () => {
    const sections = await prisma.homeSection.findMany({
      where: { enabled: true },
      orderBy: { order: 'asc' },
    })
    // Return defaults if no sections configured yet
    if (sections.length === 0) return DEFAULT_SECTIONS
    return sections
  },
  ['home-sections'],
  { tags: ['home-sections'], revalidate: 60 }
)