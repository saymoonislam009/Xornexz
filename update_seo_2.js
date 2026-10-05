const fs = require('fs');
const path = require('path');
const ROOT = '/Users/saymoonshafin/Downloads/Xornexz';

function setStaticMeta(filePath, newMeta) {
  if (!fs.existsSync(filePath)) return;
  let content = fs.readFileSync(filePath, 'utf8');
  content = content.replace(/export const metadata.*?};\n?/s, '');
  content = `import { buildMetadata } from '@/lib/seo';\n\n${newMeta}\n\n` + content;
  fs.writeFileSync(filePath, content);
}

// 8. Static pages
setStaticMeta(path.join(ROOT, 'app/services/page.tsx'), `export const metadata = buildMetadata({
  title: 'Services — Web, Mobile, SaaS, AI Development | Xornexz',
  description:
    'Xornexz offers expert web development, mobile app development, SaaS platforms, UI/UX design, and AI integration services for startups and enterprises.',
  path: '/services',
  keywords: ['web development services', 'mobile app development', 'SaaS development services', 'AI integration services', 'software agency services'],
});`);

setStaticMeta(path.join(ROOT, 'app/portfolio/page.tsx'), `export const metadata = buildMetadata({
  title: 'Portfolio — Client Work & Case Studies | Xornexz',
  description:
    'Explore Xornexz\\'s portfolio of web apps, mobile apps, SaaS platforms, and AI-powered products built for ambitious clients worldwide.',
  path: '/portfolio',
  keywords: ['software portfolio', 'web app case studies', 'SaaS case studies', 'tech studio portfolio'],
});`);

setStaticMeta(path.join(ROOT, 'app/blog/page.tsx'), `export const metadata = buildMetadata({
  title: 'Blog — Engineering Insights & Tech Articles | Xornexz',
  description:
    'Read Xornexz engineering blog — articles on web development, SaaS architecture, AI systems, React, Next.js, TypeScript, and product design.',
  path: '/blog',
  keywords: ['web development blog', 'software engineering blog', 'Next.js articles', 'React blog', 'SaaS engineering'],
});`);

setStaticMeta(path.join(ROOT, 'app/about/page.tsx'), `export const metadata = buildMetadata({
  title: 'About Us — The Team Behind Xornexz',
  description:
    'Meet the team at Xornexz — a world-class technology studio of engineers, designers, and product specialists building what\\'s next.',
  path: '/about',
  keywords: ['about xornexz', 'software development team', 'tech studio team'],
});`);

setStaticMeta(path.join(ROOT, 'app/contact/page.tsx'), `export const metadata = buildMetadata({
  title: 'Contact Us — Start Your Project | Xornexz',
  description:
    'Ready to build something great? Contact Xornexz to start your web, mobile, SaaS, or AI project. We respond within 24 hours.',
  path: '/contact',
  keywords: ['contact xornexz', 'hire software agency', 'start a web project', 'software development quote'],
});`);

setStaticMeta(path.join(ROOT, 'app/pricing/page.tsx'), `export const metadata = buildMetadata({
  title: 'Pricing — Transparent Software Development Pricing | Xornexz',
  description:
    'Xornexz offers transparent pricing for web development, mobile apps, SaaS, and AI projects. Fixed scope, dedicated team, and enterprise plans available.',
  path: '/pricing',
  keywords: ['software development pricing', 'web development cost', 'SaaS development pricing', 'hire developer price'],
});`);

setStaticMeta(path.join(ROOT, 'app/process/page.tsx'), `export const metadata = buildMetadata({
  title: 'Our Process — How We Build Software | Xornexz',
  description:
    'Discover how Xornexz builds world-class software — from discovery and design to development, launch, and ongoing growth. A transparent, proven process.',
  path: '/process',
  keywords: ['software development process', 'how we build software', 'agile development process', 'product development methodology'],
});`);

setStaticMeta(path.join(ROOT, 'app/careers/page.tsx'), `export const metadata = buildMetadata({
  title: 'Careers — Join the Xornexz Team | Xornexz',
  description:
    'Join a world-class technology studio. Xornexz is hiring engineers, designers, and product specialists. See open roles and apply today.',
  path: '/careers',
  keywords: ['software engineering jobs', 'tech startup careers', 'developer jobs remote', 'design jobs tech studio'],
});`);

// 9. sitemap.ts
fs.writeFileSync(path.join(ROOT, 'app/sitemap.ts'), `import type { MetadataRoute } from 'next';

const BASE_URL = process.env.NEXT_PUBLIC_APP_URL || 'https://xornexz.com';

type ChangeFrequency = 'always' | 'hourly' | 'daily' | 'weekly' | 'monthly' | 'yearly' | 'never';

function entry(
  path: string,
  priority: number,
  changeFreq: ChangeFrequency = 'weekly',
  lastMod: Date = new Date()
): MetadataRoute.Sitemap[number] {
  return {
    url: \`\${BASE_URL}\${path}\`,
    lastModified: lastMod,
    changeFrequency: changeFreq,
    priority,
  };
}

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const staticRoutes: MetadataRoute.Sitemap = [
    entry('/', 1.0, 'daily'),
    entry('/services', 0.95, 'weekly'),
    entry('/services/web-development', 0.9, 'monthly'),
    entry('/services/mobile-apps', 0.9, 'monthly'),
    entry('/services/saas-software', 0.9, 'monthly'),
    entry('/services/ui-ux-design', 0.9, 'monthly'),
    entry('/services/ai-automation', 0.9, 'monthly'),
    entry('/services/api-integrations', 0.9, 'monthly'),
    entry('/services/custom-software', 0.9, 'monthly'),
    entry('/portfolio', 0.9, 'weekly'),
    entry('/blog', 0.85, 'daily'),
    entry('/about', 0.8, 'monthly'),
    entry('/process', 0.8, 'monthly'),
    entry('/pricing', 0.85, 'monthly'),
    entry('/contact', 0.8, 'monthly'),
    entry('/careers', 0.75, 'weekly'),
    entry('/estimator', 0.7, 'monthly'),
    entry('/legal/privacy', 0.3, 'yearly'),
    entry('/legal/terms', 0.3, 'yearly'),
    entry('/legal/cookies', 0.3, 'yearly'),
  ];

  try {
    const { prisma } = await import('@/lib/db');
    
    const [posts, projects, services, jobs] = await Promise.all([
      prisma.blogPost.findMany({
        where: { status: 'PUBLISHED', publishedAt: { lte: new Date() } },
        select: { slug: true, updatedAt: true },
        orderBy: { publishedAt: 'desc' },
      }),
      prisma.project.findMany({
        select: { slug: true, updatedAt: true },
        orderBy: { order: 'asc' },
      }),
      prisma.service.findMany({
        where: { isActive: true },
        select: { slug: true, updatedAt: true },
      }),
      prisma.job.findMany({
        where: { status: 'OPEN' },
        select: { slug: true, updatedAt: true },
      }),
    ]);

    const blogRoutes = posts.map((p: any) => entry(\`/blog/\${p.slug}\`, 0.8, 'weekly', p.updatedAt));
    const projectRoutes = projects.map((p: any) => entry(\`/portfolio/\${p.slug}\`, 0.75, 'monthly', p.updatedAt));
    const serviceRoutes = services.map((s: any) => entry(\`/services/\${s.slug}\`, 0.9, 'monthly', s.updatedAt));
    const jobRoutes = jobs.map((j: any) => entry(\`/careers/\${j.slug}\`, 0.7, 'weekly', j.updatedAt));

    const allServiceUrls = new Set([
      ...staticRoutes.filter((r: any) => r.url.includes('/services/')).map((r: any) => r.url),
      ...serviceRoutes.map((r: any) => r.url),
    ]);
    const mergedServiceRoutes = Array.from(allServiceUrls).map(url => {
      const db = serviceRoutes.find((r: any) => r.url === url);
      const stat = staticRoutes.find((r: any) => r.url === url);
      return db || stat!;
    });

    const nonServiceStatic = staticRoutes.filter((r: any) => !r.url.includes('/services/'));

    return [
      ...nonServiceStatic,
      ...mergedServiceRoutes,
      ...blogRoutes,
      ...projectRoutes,
      ...jobRoutes,
    ];
  } catch {
    return staticRoutes;
  }
}
`);

// 10. robots.ts
fs.writeFileSync(path.join(ROOT, 'app/robots.ts'), `import type { MetadataRoute } from 'next';

const BASE_URL = process.env.NEXT_PUBLIC_APP_URL || 'https://xornexz.com';

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: '*',
        allow: '/',
        disallow: [
          '/admin/',
          '/admin-blocked',
          '/api/',
          '/_next/',
          '/estimator/thank-you',
        ],
      },
      {
        userAgent: 'GPTBot',
        disallow: '/',
      },
      {
        userAgent: 'CCBot',
        disallow: '/',
      },
    ],
    sitemap: \`\${BASE_URL}/sitemap.xml\`,
    host: BASE_URL,
  };
}
`);

// 11. Manifest
fs.mkdirSync(path.join(ROOT, 'public'), { recursive: true });
fs.writeFileSync(path.join(ROOT, 'public/site.webmanifest'), JSON.stringify({
  "name": "Xornexz",
  "short_name": "Xornexz",
  "description": "A premium technology studio building what's next.",
  "start_url": "/",
  "display": "standalone",
  "background_color": "#05060A",
  "theme_color": "#7C3AED",
  "icons": [
    {
      "src": "/favicon.ico",
      "sizes": "48x48",
      "type": "image/x-icon"
    },
    {
      "src": "/icon-192.png",
      "sizes": "192x192",
      "type": "image/png",
      "purpose": "maskable any"
    },
    {
      "src": "/icon-512.png",
      "sizes": "512x512",
      "type": "image/png",
      "purpose": "maskable any"
    }
  ]
}, null, 2));

// 12. OG route
fs.mkdirSync(path.join(ROOT, 'app/og'), { recursive: true });
fs.writeFileSync(path.join(ROOT, 'app/og/route.tsx'), `import { ImageResponse } from 'next/og';
import type { NextRequest } from 'next/server';

export const runtime = 'edge';

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const title = searchParams.get('title') || "We Build What's Next";
  const subtitle = searchParams.get('subtitle') || 'Xornexz — Premium Technology Studio';
  const type = searchParams.get('type') || 'default'; // 'blog' | 'service' | 'portfolio' | 'default'

  return new ImageResponse(
    (
      <div
        style={{
          display: 'flex',
          width: '1200px',
          height: '630px',
          background: 'linear-gradient(135deg, #05060A 0%, #0D0820 50%, #05060A 100%)',
          fontFamily: 'sans-serif',
          position: 'relative',
          overflow: 'hidden',
        }}
      >
        <div
          style={{
            position: 'absolute',
            inset: 0,
            backgroundImage:
              'linear-gradient(rgba(255,255,255,0.04) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.04) 1px, transparent 1px)',
            backgroundSize: '40px 40px',
          }}
        />
        <div
          style={{
            position: 'absolute',
            top: '-100px',
            right: '-100px',
            width: '500px',
            height: '500px',
            background: 'radial-gradient(circle, rgba(124,58,237,0.3) 0%, transparent 70%)',
            borderRadius: '50%',
          }}
        />
        <div
          style={{
            position: 'absolute',
            bottom: '-80px',
            left: '-80px',
            width: '400px',
            height: '400px',
            background: 'radial-gradient(circle, rgba(6,182,212,0.2) 0%, transparent 70%)',
            borderRadius: '50%',
          }}
        />

        <div
          style={{
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'space-between',
            padding: '64px 80px',
            width: '100%',
            position: 'relative',
            zIndex: 1,
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <div
              style={{
                width: '44px',
                height: '44px',
                background: 'linear-gradient(135deg, #7C3AED, #06B6D4)',
                borderRadius: '10px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: '22px',
                fontWeight: '900',
                color: 'white',
              }}
            >
              X
            </div>
            <span style={{ fontSize: '24px', fontWeight: '700', color: 'white' }}>Xornexz</span>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '16px', maxWidth: '900px' }}>
            {type !== 'default' && (
              <div
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '8px',
                  background: 'rgba(124,58,237,0.15)',
                  border: '1px solid rgba(124,58,237,0.3)',
                  borderRadius: '100px',
                  padding: '6px 16px',
                  width: 'fit-content',
                }}
              >
                <span style={{ color: '#a78bfa', fontSize: '14px', fontWeight: '600', textTransform: 'uppercase', letterSpacing: '0.08em' }}>
                  {type === 'blog' ? 'Blog' : type === 'service' ? 'Service' : 'Portfolio'}
                </span>
              </div>
            )}
            <h1
              style={{
                fontSize: title.length > 50 ? '42px' : '56px',
                fontWeight: '900',
                color: 'white',
                lineHeight: 1.1,
                margin: 0,
              }}
            >
              {title}
            </h1>
            <p style={{ fontSize: '22px', color: 'rgba(156,163,175,1)', margin: 0, lineHeight: 1.4 }}>
              {subtitle}
            </p>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <span style={{ fontSize: '16px', color: 'rgba(107,114,128,1)' }}>xornexz.com</span>
          </div>
        </div>
      </div>
    ),
    {
      width: 1200,
      height: 630,
    }
  );
}
`);

// 15. .env.example
const envPath = path.join(ROOT, '.env.example');
if (fs.existsSync(envPath)) {
  fs.appendFileSync(envPath, '\n# Google Search Console verification token\nGOOGLE_SITE_VERIFICATION=\n');
} else {
  fs.writeFileSync(envPath, '# Google Search Console verification token\nGOOGLE_SITE_VERIFICATION=\n');
}

// 13 & 14 (FAQ & Breadcrumb on Pricing, Process, Services, Portfolio)
function addScriptToReturn(filePath, imports, scriptHtml) {
  if (!fs.existsSync(filePath)) return;
  let content = fs.readFileSync(filePath, 'utf8');
  if (content.includes(scriptHtml)) return; // already added
  
  if (imports) {
    if (content.includes("import { buildBreadcrumbSchema")) {
       // already imported
    } else {
       content = imports + '\n' + content;
    }
  }

  content = content.replace(/return\s*\(\s*(<>\s*|<main[^>]*>\s*|<div[^>]*>\s*)/, `$&\n      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(${scriptHtml})
        }}
      />\n`);
  fs.writeFileSync(filePath, content);
}

// Pricing
addScriptToReturn(path.join(ROOT, 'app/pricing/page.tsx'), `import { buildFAQSchema, buildBreadcrumbSchema } from '@/lib/seo';`, 
`[
          buildFAQSchema(faqs.map((f: any) => ({ question: f.question, answer: f.answer }))),
          buildBreadcrumbSchema([
            { name: 'Home', url: 'https://xornexz.com' },
            { name: 'Pricing', url: 'https://xornexz.com/pricing' },
          ]),
        ]`);

// Process
addScriptToReturn(path.join(ROOT, 'app/process/page.tsx'), `import { buildBreadcrumbSchema } from '@/lib/seo';`, 
`buildBreadcrumbSchema([
            { name: 'Home', url: 'https://xornexz.com' },
            { name: 'Our Process', url: 'https://xornexz.com/process' },
          ])`);

// Services
addScriptToReturn(path.join(ROOT, 'app/services/page.tsx'), `import { buildBreadcrumbSchema } from '@/lib/seo';`, 
`buildBreadcrumbSchema([{ name: 'Home', url: 'https://xornexz.com' }, { name: 'Services', url: 'https://xornexz.com/services' }])`);

// Portfolio
addScriptToReturn(path.join(ROOT, 'app/portfolio/page.tsx'), `import { buildBreadcrumbSchema } from '@/lib/seo';`, 
`buildBreadcrumbSchema([{ name: 'Home', url: 'https://xornexz.com' }, { name: 'Portfolio', url: 'https://xornexz.com/portfolio' }])`);
