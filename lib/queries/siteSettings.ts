import { prisma } from '@/lib/db'
import { unstable_cache } from 'next/cache'

export const getSiteSettings = unstable_cache(
  async () => {
    return await prisma.siteSettings.upsert({
      where: { id: 'default' },
      create: {},
      update: {},
    })
  },
  ['site-settings'],
  { tags: ['site-settings'], revalidate: 300 }
)