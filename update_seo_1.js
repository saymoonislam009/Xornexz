const fs = require('fs');
const path = require('path');

const ROOT = '/Users/saymoonshafin/Downloads/Xornexz';

// 1. app/layout.tsx
const layoutPath = path.join(ROOT, 'app/layout.tsx');
let layoutContent = fs.readFileSync(layoutPath, 'utf8');

// Replace metadata
layoutContent = layoutContent.replace(/export const metadata: Metadata = \{[\s\S]*?\}\n/, `const BASE_URL = process.env.NEXT_PUBLIC_APP_URL || 'https://xornexz.com';

export const metadata: Metadata = {
  metadataBase: new URL(BASE_URL),
  title: {
    template: '%s | Xornexz',
    default: 'Xornexz — We Build What\\'s Next',
  },
  description:
    'Xornexz is a premium technology studio building websites, web apps, mobile apps, SaaS platforms, and AI-powered systems for ambitious founders and enterprises.',
  keywords: [
    'web development agency',
    'software development studio',
    'SaaS development',
    'mobile app development',
    'React Next.js development',
    'UI UX design agency',
    'AI automation development',
    'custom software development',
    'web application development',
    'startup tech studio',
    'enterprise software development',
    'TypeScript React agency',
  ],
  authors: [{ name: 'Xornexz', url: BASE_URL }],
  creator: 'Xornexz',
  publisher: 'Xornexz',
  category: 'Technology',
  classification: 'Business',
  alternates: {
    canonical: BASE_URL,
  },
  openGraph: {
    type: 'website',
    locale: 'en_US',
    url: BASE_URL,
    siteName: 'Xornexz',
    title: 'Xornexz — We Build What\\'s Next',
    description:
      'A premium technology studio building world-class websites, SaaS platforms, mobile apps, and AI systems.',
    images: [
      {
        url: '/og-image.png',
        width: 1200,
        height: 630,
        alt: 'Xornexz — We Build What\\'s Next',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    site: '@xornexz',
    creator: '@xornexz',
    title: 'Xornexz — We Build What\\'s Next',
    description:
      'A premium technology studio building world-class websites, SaaS platforms, mobile apps, and AI systems.',
    images: ['/og-image.png'],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  icons: {
    icon: '/favicon.ico',
    shortcut: '/favicon.ico',
    apple: '/apple-touch-icon.png',
  },
  manifest: '/site.webmanifest',
  verification: {
    google: process.env.GOOGLE_SITE_VERIFICATION || '',
  },
};
`);

// Add JSON-LD and preconnect
if (!layoutContent.includes('buildOrganizationSchema')) {
  layoutContent = layoutContent.replace('import type { Metadata', 'import { buildOrganizationSchema, buildWebsiteSchema } from "@/lib/seo"\nimport type { Metadata');
}

layoutContent = layoutContent.replace(/<head>/g, '<head>\n<link rel="preconnect" href="https://fonts.googleapis.com" />\n<link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />');
if (!layoutContent.includes('https://fonts.googleapis.com')) {
    layoutContent = layoutContent.replace(/<html[^>]*>/, `$&
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
      </head>`);
}

layoutContent = layoutContent.replace(/<body[^>]*>/, `$&
        {/* JSON-LD: Organization + WebSite structured data */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify([
              buildOrganizationSchema(),
              buildWebsiteSchema(),
            ]),
          }}
        />`);
fs.writeFileSync(layoutPath, layoutContent);

// 4. app/page.tsx
const pagePath = path.join(ROOT, 'app/page.tsx');
if (fs.existsSync(pagePath)) {
  let pageContent = fs.readFileSync(pagePath, 'utf8');
  pageContent = pageContent.replace(/export const metadata.*?};/s, '');
  pageContent = `import { buildMetadata, buildFAQSchema, buildLocalBusinessSchema, BASE_URL } from '@/lib/seo';\n\nexport const metadata = buildMetadata({
  title: "Xornexz — We Build What's Next",
  description:
    'Xornexz is a premium technology studio building websites, web apps, mobile apps, SaaS platforms, and AI-powered systems for ambitious founders and enterprises worldwide.',
  path: '/',
  keywords: [
    'web development agency',
    'software development company',
    'SaaS development agency',
    'mobile app development studio',
    'AI development company',
    'custom software development',
    'Next.js React agency',
    'technology studio',
  ],
});\n\n` + pageContent;

  pageContent = pageContent.replace(/return\s*\(\s*(<>\s*|<main[^>]*>\s*)/, `$&\n      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify([
            buildLocalBusinessSchema(),
            buildFAQSchema(faqs.map((f: any) => ({ question: f.question, answer: f.answer }))),
          ]),
        }}
      />\n`);
  fs.writeFileSync(pagePath, pageContent);
}

// 5. app/blog/[slug]/page.tsx
const blogPagePath = path.join(ROOT, 'app/blog/[slug]/page.tsx');
if (fs.existsSync(blogPagePath)) {
  let blogContent = fs.readFileSync(blogPagePath, 'utf8');
  blogContent = blogContent.replace(/export const metadata.*?};\n?/s, '');
  
  if (!blogContent.includes('generateMetadata')) {
    const genMeta = `
import { buildMetadata, buildArticleSchema, buildBreadcrumbSchema } from '@/lib/seo';
import type { Metadata } from 'next';

export async function generateMetadata(
  { params }: { params: Promise<{ slug: string }> }
): Promise<Metadata> {
  const { slug } = await params;
  const post = await getPost(slug);
  if (!post) return { title: 'Post Not Found | Xornexz' };
  return buildMetadata({
    title: post.title,
    description: post.excerpt || \`Read \${post.title} on the Xornexz engineering blog.\`,
    path: \`/blog/\${slug}\`,
    keywords: Array.isArray(post.tags) ? post.tags as string[] : [],
  });
}
`;
    blogContent = blogContent.replace(/export default async function/, genMeta + '\nexport default async function');
  }

  blogContent = blogContent.replace(/return\s*\(\s*(<article[^>]*>\s*|<>\s*|<div[^>]*>\s*)/, `$&\n      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify([
            buildArticleSchema({
              title: post.title,
              description: post.excerpt || undefined,
              slug: post.slug,
              publishedAt: post.publishedAt || new Date().toISOString(),
              authorName: post.author?.name || 'Xornexz',
              coverImage: undefined,
            }),
            buildBreadcrumbSchema([
              { name: 'Home', url: 'https://xornexz.com' },
              { name: 'Blog', url: 'https://xornexz.com/blog' },
              { name: post.title, url: \`https://xornexz.com/blog/\${post.slug}\` },
            ]),
          ]),
        }}
      />\n`);
  fs.writeFileSync(blogPagePath, blogContent);
}

// 6. app/services/[slug]/page.tsx
const servicePagePath = path.join(ROOT, 'app/services/[slug]/page.tsx');
if (fs.existsSync(servicePagePath)) {
  let serviceContent = fs.readFileSync(servicePagePath, 'utf8');
  serviceContent = serviceContent.replace(/export const metadata.*?};\n?/s, '');
  
  if (!serviceContent.includes('generateMetadata')) {
    const genMeta = `
import { buildMetadata, buildServiceSchema, buildBreadcrumbSchema } from '@/lib/seo';
import type { Metadata } from 'next';

export async function generateMetadata(
  { params }: { params: Promise<{ slug: string }> }
): Promise<Metadata> {
  const { slug } = await params;
  const service = await getService(slug);
  if (!service) return { title: 'Service Not Found | Xornexz' };
  return buildMetadata({
    title: \`\${service.title} | Xornexz\`,
    description:
      service.description ||
      \`Professional \${service.title} services from Xornexz — a premium technology studio.\`,
    path: \`/services/\${slug}\`,
    keywords: [
      service.title.toLowerCase(),
      \`\${service.title.toLowerCase()} agency\`,
      \`\${service.title.toLowerCase()} company\`,
      'xornexz',
      'technology studio',
    ],
  });
}
`;
    serviceContent = serviceContent.replace(/export default async function/, genMeta + '\nexport default async function');
  }

  serviceContent = serviceContent.replace(/return\s*\(\s*(<article[^>]*>\s*|<>\s*|<div[^>]*>\s*)/, `$&\n      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify([
            buildServiceSchema({ title: service.title, description: service.description || '', slug: service.slug }),
            buildBreadcrumbSchema([
              { name: 'Home', url: 'https://xornexz.com' },
              { name: 'Services', url: 'https://xornexz.com/services' },
              { name: service.title, url: \`https://xornexz.com/services/\${service.slug}\` },
            ]),
          ]),
        }}
      />\n`);
  fs.writeFileSync(servicePagePath, serviceContent);
}

// 7. app/portfolio/[slug]/page.tsx
const portfolioPagePath = path.join(ROOT, 'app/portfolio/[slug]/page.tsx');
if (fs.existsSync(portfolioPagePath)) {
  let portfolioContent = fs.readFileSync(portfolioPagePath, 'utf8');
  portfolioContent = portfolioContent.replace(/export const metadata.*?};\n?/s, '');
  
  if (!portfolioContent.includes('generateMetadata')) {
    const genMeta = `
import { buildMetadata, buildBreadcrumbSchema } from '@/lib/seo';
import type { Metadata } from 'next';

export async function generateMetadata(
  { params }: { params: Promise<{ slug: string }> }
): Promise<Metadata> {
  const { slug } = await params;
  const project = await getProject(slug);
  if (!project) return { title: 'Project Not Found | Xornexz' };
  return buildMetadata({
    title: \`\${project.title} | Xornexz Portfolio\`,
    description:
      project.tagline ||
      project.description ||
      \`See how Xornexz built \${project.title} — a case study.\`,
    path: \`/portfolio/\${slug}\`,
    keywords: [
      project.title.toLowerCase(),
      project.category?.toLowerCase() || 'software',
      'case study',
      'xornexz portfolio',
    ],
  });
}
`;
    portfolioContent = portfolioContent.replace(/export default async function/, genMeta + '\nexport default async function');
  }

  portfolioContent = portfolioContent.replace(/return\s*\(\s*(<article[^>]*>\s*|<>\s*|<div[^>]*>\s*)/, `$&\n      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(
            buildBreadcrumbSchema([
              { name: 'Home', url: 'https://xornexz.com' },
              { name: 'Portfolio', url: 'https://xornexz.com/portfolio' },
              { name: project.title, url: \`https://xornexz.com/portfolio/\${project.slug}\` },
            ])
          ),
        }}
      />\n`);
  fs.writeFileSync(portfolioPagePath, portfolioContent);
}
