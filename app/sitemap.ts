import type { MetadataRoute } from 'next';

const BASE_URL = process.env.NEXT_PUBLIC_APP_URL || 'https://xornexz.com';

type ChangeFrequency = 'always' | 'hourly' | 'daily' | 'weekly' | 'monthly' | 'yearly' | 'never';

function entry(
  path: string,
  priority: number,
  changeFreq: ChangeFrequency = 'weekly',
  lastMod: Date = new Date()
): MetadataRoute.Sitemap[number] {
  return {
    url: `${BASE_URL}${path}`,
    lastModified: lastMod,
    changeFrequency: changeFreq,
    priority,
  };
}

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const staticRoutes: MetadataRoute.Sitemap = [
    entry('/', 1.0, 'daily'),
    entry('/services', 0.95, 'weekly'),
    entry('/services/web-development', 0.9, 'monthly'),
    entry('/services/mobile-apps', 0.9, 'monthly'),
    entry('/services/saas-software', 0.9, 'monthly'),
    entry('/services/ui-ux-design', 0.9, 'monthly'),
    entry('/services/ai-automation', 0.9, 'monthly'),
    entry('/services/api-integrations', 0.9, 'monthly'),
    entry('/services/custom-software', 0.9, 'monthly'),
    entry('/portfolio', 0.9, 'weekly'),
    entry('/blog', 0.85, 'daily'),
    entry('/about', 0.8, 'monthly'),
    entry('/process', 0.8, 'monthly'),
    entry('/pricing', 0.85, 'monthly'),
    entry('/contact', 0.8, 'monthly'),
    entry('/careers', 0.75, 'weekly'),
    entry('/estimator', 0.7, 'monthly'),
    entry('/legal/privacy', 0.3, 'yearly'),
    entry('/legal/terms', 0.3, 'yearly'),
    entry('/legal/cookies', 0.3, 'yearly'),
  ];

  try {
    const { prisma } = await import('@/lib/db');
    
    const [posts, projects, services, jobs] = await Promise.all([
      prisma.blogPost.findMany({
        where: { status: 'PUBLISHED', publishedAt: { lte: new Date() } },
        select: { slug: true, updatedAt: true },
        orderBy: { publishedAt: 'desc' },
      }),
      prisma.project.findMany({
        select: { slug: true, updatedAt: true },
        orderBy: { order: 'asc' },
      }),
      prisma.service.findMany({
        where: { isActive: true },
        select: { slug: true, updatedAt: true },
      }),
      prisma.job.findMany({
        where: { status: 'OPEN' },
        select: { slug: true, updatedAt: true },
      }),
    ]);

    const blogRoutes = posts.map((p: any) => entry(`/blog/${p.slug}`, 0.8, 'weekly', p.updatedAt));
    const projectRoutes = projects.map((p: any) => entry(`/portfolio/${p.slug}`, 0.75, 'monthly', p.updatedAt));
    const serviceRoutes = services.map((s: any) => entry(`/services/${s.slug}`, 0.9, 'monthly', s.updatedAt));
    const jobRoutes = jobs.map((j: any) => entry(`/careers/${j.slug}`, 0.7, 'weekly', j.updatedAt));

    const allServiceUrls = new Set([
      ...staticRoutes.filter((r: any) => r.url.includes('/services/')).map((r: any) => r.url),
      ...serviceRoutes.map((r: any) => r.url),
    ]);
    const mergedServiceRoutes = Array.from(allServiceUrls).map(url => {
      const db = serviceRoutes.find((r: any) => r.url === url);
      const stat = staticRoutes.find((r: any) => r.url === url);
      return db || stat!;
    });

    const nonServiceStatic = staticRoutes.filter((r: any) => !r.url.includes('/services/'));

    return [
      ...nonServiceStatic,
      ...mergedServiceRoutes,
      ...blogRoutes,
      ...projectRoutes,
      ...jobRoutes,
    ];
  } catch {
    return staticRoutes;
  }
}
