import { getPublicProjects } from '@/lib/content';
import PortfolioClient from './PortfolioClient';

export const dynamic = 'force-dynamic';

export const metadata = {
  title: 'Portfolio | Xornexz',
  description: 'Selected work from the Xornexz team.',
};

export default async function PortfolioPage() {
  const projects = await getPublicProjects();
  return <PortfolioClient projects={projects} />;
}
