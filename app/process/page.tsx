import { buildBreadcrumbSchema } from '@/lib/seo';
import { buildMetadata } from '@/lib/seo';

export const metadata = buildMetadata({
  title: 'Our Process — How We Build Software | Xornexz',
  description:
    'Discover how Xornexz builds world-class software — from discovery and design to development, launch, and ongoing growth. A transparent, proven process.',
  path: '/process',
  keywords: ['software development process', 'how we build software', 'agile development process', 'product development methodology'],
});

import { getProcessSteps } from '@/lib/queries/process';
import { ensureContentSeeded } from '@/lib/content';
import ProcessClient from './ProcessClient';

export const dynamic = 'force-dynamic';


export default async function ProcessPage() {
  await ensureContentSeeded();
  const steps = await getProcessSteps();
  return <ProcessClient steps={steps} />;
}
