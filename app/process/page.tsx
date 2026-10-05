import { getProcessSteps } from '@/lib/queries/process';
import { ensureContentSeeded } from '@/lib/content';
import ProcessClient from './ProcessClient';

export const dynamic = 'force-dynamic';

export const metadata = {
  title: 'Our Process | Xornexz',
  description: 'How we work — our proven methodology for building great digital products.',
};

export default async function ProcessPage() {
  await ensureContentSeeded();
  const steps = await getProcessSteps();
  return <ProcessClient steps={steps} />;
}
