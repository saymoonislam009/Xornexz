import type { MetadataRoute } from 'next';

export default function sitemap(): MetadataRoute.Sitemap {
  const baseUrl = process.env.NEXT_PUBLIC_APP_URL || 'https://xornexz.com';

  const staticRoutes = [
    '',
    '/services',
    '/services/web-development',
    '/services/mobile-apps',
    '/services/saas-software',
    '/services/api-integrations',
    '/services/ui-ux-design',
    '/services/ai-automation',
    '/services/maintenance-support',
    '/portfolio',
    '/about',
    '/process',
    '/pricing',
    '/estimator',
    '/blog',
    '/contact',
    '/careers',
    '/legal/privacy',
    '/legal/terms',
    '/legal/cookies',
  ].map((route) => ({
    url: `${baseUrl}${route}`,
    lastModified: new Date(),
    changeFrequency: 'weekly' as const,
    priority: route === '' ? 1 : route.startsWith('/services') ? 0.9 : 0.8,
  }));

  return staticRoutes;
}
