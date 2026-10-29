import { buildMetadata } from '@/lib/seo';
import { getHomeProcessSteps } from '@/lib/content';
import ProcessClient from './ProcessClient';

export const metadata = buildMetadata({
  title: 'Our Process — How We Build Software | Xornexz',
  description:
    'Discover how Xornexz builds world-class software — from discovery and design to development, launch, and ongoing growth. A transparent, proven process.',
  path: '/process',
  keywords: [
    'software development process',
    'how we build software',
    'agile development process',
    'product development methodology',
  ],
});

export const revalidate = 30;

export default async function ProcessPage() {
  const steps = await getHomeProcessSteps();
  return <ProcessClient steps={steps} />;
}
