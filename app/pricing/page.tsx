import { getPricingPlans } from '@/lib/queries/pricing';
import { getFAQs } from '@/lib/queries/faqs';
import { ensureContentSeeded } from '@/lib/content';
import PricingClient from './PricingClient';

export const dynamic = 'force-dynamic';

export const metadata = {
  title: 'Pricing | Xornexz',
  description: 'Transparent pricing for web development, mobile apps, SaaS, and AI projects.',
};

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
