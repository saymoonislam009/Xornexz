import { buildMetadata } from '@/lib/seo';
import { getHomePricing, getHomeFaqs } from '@/lib/content';
import PricingClient from './PricingClient';

export const metadata = buildMetadata({
  title: 'Pricing — Transparent Software Development Pricing | Xornexz',
  description:
    'Xornexz offers transparent pricing for web development, mobile apps, SaaS, and AI projects. Fixed scope, dedicated team, and enterprise plans available.',
  path: '/pricing',
  keywords: [
    'software development pricing',
    'web development cost',
    'SaaS development pricing',
    'hire developer price',
  ],
});

export const revalidate = 30;

export default async function PricingPage() {
  const [plans, faqs] = await Promise.all([getHomePricing(), getHomeFaqs()]);

  /* eslint-disable @typescript-eslint/no-explicit-any */
  const parsedPlans = plans.map((p: any, idx: number) => ({
    id: p.id || `plan-${idx}`,
    name: p.name,
    tagline: p.tagline || p.description || '',
    price: p.price || 'Custom',
    period: p.period ?? '/ project',
    ctaLabel: p.ctaLabel || 'Start a Project',
    ctaHref: p.ctaHref || '/contact',
    highlighted: Boolean(p.highlighted),
    order: typeof p.order === 'number' ? p.order : idx,
    features: Array.isArray(p.features) ? (p.features as string[]) : [],
  }));

  const parsedFaqs = faqs.map((f: any, idx: number) => ({
    id: f.id || `faq-${idx}`,
    question: f.question,
    answer: f.answer,
  }));

  return <PricingClient plans={parsedPlans} faqs={parsedFaqs} />;
}
