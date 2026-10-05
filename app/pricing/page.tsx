import { buildFAQSchema, buildBreadcrumbSchema } from '@/lib/seo';
import { buildMetadata } from '@/lib/seo';

export const metadata = buildMetadata({
  title: 'Pricing — Transparent Software Development Pricing | Xornexz',
  description:
    'Xornexz offers transparent pricing for web development, mobile apps, SaaS, and AI projects. Fixed scope, dedicated team, and enterprise plans available.',
  path: '/pricing',
  keywords: ['software development pricing', 'web development cost', 'SaaS development pricing', 'hire developer price'],
});

import { getPricingPlans } from '@/lib/queries/pricing';
import { getFAQs } from '@/lib/queries/faqs';
import { ensureContentSeeded } from '@/lib/content';
import PricingClient from './PricingClient';

export const dynamic = 'force-dynamic';


export default async function PricingPage() {
  await ensureContentSeeded();
  const [plans, faqs] = await Promise.all([
    getPricingPlans(),
    getFAQs(),
  ]);

  // Parse features from DB (stored as JSON)
  const parsedPlans = plans.map((p: any) => ({
    ...p,
    features: Array.isArray(p.features) ? p.features as string[] : [],
  }));

  return <PricingClient plans={parsedPlans} faqs={faqs} />;
}
