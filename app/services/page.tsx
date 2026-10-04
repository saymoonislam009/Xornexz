import { getPublicServices } from '@/lib/content';
import ServicesClient from './ServicesClient';

export const dynamic = 'force-dynamic';

export const metadata = {
  title: 'Services | Xornexz',
  description: 'Web, mobile, SaaS, AI and design services from Xornexz.',
};

export default async function ServicesPage() {
  const services = await getPublicServices();
  return <ServicesClient services={services} />;
}
