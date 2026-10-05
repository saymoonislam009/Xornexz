import { buildBreadcrumbSchema } from '@/lib/seo';
import { buildMetadata } from '@/lib/seo';

export const metadata = buildMetadata({
  title: 'Services — Web, Mobile, SaaS, AI Development | Xornexz',
  description:
    'Xornexz offers expert web development, mobile app development, SaaS platforms, UI/UX design, and AI integration services for startups and enterprises.',
  path: '/services',
  keywords: ['web development services', 'mobile app development', 'SaaS development services', 'AI integration services', 'software agency services'],
});

import { getPublicServices } from '@/lib/content';
import ServicesClient from './ServicesClient';

export const dynamic = 'force-dynamic';


export default async function ServicesPage() {
  const services = await getPublicServices();
  return <ServicesClient services={services} />;
}
