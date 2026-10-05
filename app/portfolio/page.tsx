import { buildBreadcrumbSchema } from '@/lib/seo';
import { buildMetadata } from '@/lib/seo';

export const metadata = buildMetadata({
  title: 'Portfolio — Client Work & Case Studies | Xornexz',
  description:
    'Explore Xornexz\'s portfolio of web apps, mobile apps, SaaS platforms, and AI-powered products built for ambitious clients worldwide.',
  path: '/portfolio',
  keywords: ['software portfolio', 'web app case studies', 'SaaS case studies', 'tech studio portfolio'],
});

import { getPublicProjects } from '@/lib/content';
import PortfolioClient from './PortfolioClient';

export const dynamic = 'force-dynamic';


export default async function PortfolioPage() {
  const projects = await getPublicProjects();
  return <PortfolioClient projects={projects} />;
}
