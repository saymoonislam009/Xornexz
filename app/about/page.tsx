import { buildMetadata } from '@/lib/seo';

export const metadata = buildMetadata({
  title: 'About Us — The Team Behind Xornexz',
  description:
    'Meet the team at Xornexz — a world-class technology studio of engineers, designers, and product specialists building what\'s next.',
  path: '/about',
  keywords: ['about xornexz', 'software development team', 'tech studio team'],
});

import { getPublicTeam } from '@/lib/content';
import AboutClient from './AboutClient';

export const dynamic = 'force-dynamic';


export default async function AboutPage() {
  const team = await getPublicTeam();
  return <AboutClient team={team} />;
}
