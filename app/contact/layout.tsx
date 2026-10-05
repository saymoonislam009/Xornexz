import { buildMetadata } from '@/lib/seo';

export const metadata = buildMetadata({
  title: 'Contact Us — Start Your Project | Xornexz',
  description:
    'Ready to build something great? Contact Xornexz to start your web, mobile, SaaS, or AI project. We respond within 24 hours.',
  path: '/contact',
  keywords: ['contact xornexz', 'hire software agency', 'start a web project', 'software development quote'],
});

export default function ContactLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return <>{children}</>;
}
