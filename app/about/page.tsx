import { getPublicTeam } from '@/lib/content';
import AboutClient from './AboutClient';

export const dynamic = 'force-dynamic';

export const metadata = {
  title: 'About | Xornexz',
  description: 'Meet the team behind Xornexz.',
};

export default async function AboutPage() {
  const team = await getPublicTeam();
  return <AboutClient team={team} />;
}
