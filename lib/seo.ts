import type { Metadata } from 'next';

export const BASE_URL = process.env.NEXT_PUBLIC_APP_URL || 'https://xornexz.com';

export function buildMetadata({
  title,
  description,
  path,
  ogImage,
  keywords,
  noIndex = false,
  ogType = 'website',
}: {
  title: string;
  description: string;
  path: string;
  ogImage?: string;
  keywords?: string[];
  noIndex?: boolean;
  ogType?: string;
}): Metadata {
  const url = `${BASE_URL}${path}`;
  const image = ogImage || `${BASE_URL}/og?title=${encodeURIComponent(title)}&subtitle=${encodeURIComponent('xornexz.com')}&type=${ogType}`;

  return {
    title,
    description,
    ...(keywords ? { keywords } : {}),
    alternates: { canonical: url },
    openGraph: {
      type: 'website',
      locale: 'en_US',
      url,
      siteName: 'Xornexz',
      title,
      description,
      images: [{ url: image, width: 1200, height: 630, alt: title }],
    },
    twitter: {
      card: 'summary_large_image',
      site: '@xornexz',
      title,
      description,
      images: [image],
    },
    robots: noIndex
      ? { index: false, follow: false }
      : { index: true, follow: true, googleBot: { index: true, follow: true, 'max-image-preview': 'large', 'max-snippet': -1 } },
  };
}

// JSON-LD helpers
export function buildOrganizationSchema() {
  return {
    '@context': 'https://schema.org',
    '@type': 'Organization',
    name: 'Xornexz',
    url: BASE_URL,
    logo: `${BASE_URL}/logo.png`,
    sameAs: [
      'https://twitter.com/xornexz',
      'https://linkedin.com/company/xornexz',
      'https://github.com/xornexz',
    ],
    contactPoint: {
      '@type': 'ContactPoint',
      email: 'hello@xornexz.com',
      contactType: 'customer service',
      availableLanguage: 'English',
    },
    foundingDate: '2017',
    description:
      'A premium technology studio building websites, web apps, SaaS platforms, and AI-powered systems.',
    areaServed: 'Worldwide',
    serviceType: [
      'Web Development',
      'Mobile App Development',
      'SaaS Development',
      'UI/UX Design',
      'AI Integration',
    ],
  };
}

export function buildWebsiteSchema() {
  return {
    '@context': 'https://schema.org',
    '@type': 'WebSite',
    name: 'Xornexz',
    url: BASE_URL,
    description: "A premium technology studio that builds what's next.",
    potentialAction: {
      '@type': 'SearchAction',
      target: {
        '@type': 'EntryPoint',
        urlTemplate: `${BASE_URL}/blog?q={search_term_string}`,
      },
      'query-input': 'required name=search_term_string',
    },
  };
}

export function buildServiceSchema(service: {
  title: string;
  description: string;
  slug: string;
}) {
  return {
    '@context': 'https://schema.org',
    '@type': 'Service',
    name: service.title,
    description: service.description,
    url: `${BASE_URL}/services/${service.slug}`,
    provider: {
      '@type': 'Organization',
      name: 'Xornexz',
      url: BASE_URL,
    },
    areaServed: 'Worldwide',
    serviceType: service.title,
  };
}

export function buildArticleSchema(post: {
  title: string;
  description?: string | null;
  slug: string;
  publishedAt: string;
  authorName: string;
  coverImage?: string | null;
}) {
  return {
    '@context': 'https://schema.org',
    '@type': 'Article',
    headline: post.title,
    description: post.description || '',
    url: `${BASE_URL}/blog/${post.slug}`,
    datePublished: post.publishedAt,
    dateModified: post.publishedAt,
    image: post.coverImage || `${BASE_URL}/og-image.png`,
    author: {
      '@type': 'Person',
      name: post.authorName,
    },
    publisher: {
      '@type': 'Organization',
      name: 'Xornexz',
      logo: { '@type': 'ImageObject', url: `${BASE_URL}/logo.png` },
    },
    mainEntityOfPage: {
      '@type': 'WebPage',
      '@id': `${BASE_URL}/blog/${post.slug}`,
    },
  };
}

export function buildFAQSchema(faqs: Array<{ question: string; answer: string }>) {
  return {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: faqs.map((f) => ({
      '@type': 'Question',
      name: f.question,
      acceptedAnswer: {
        '@type': 'Answer',
        text: f.answer,
      },
    })),
  };
}

export function buildBreadcrumbSchema(items: Array<{ name: string; url: string }>) {
  return {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: items.map((item, i) => ({
      '@type': 'ListItem',
      position: i + 1,
      name: item.name,
      item: item.url,
    })),
  };
}

export function buildLocalBusinessSchema() {
  return {
    '@context': 'https://schema.org',
    '@type': 'ProfessionalService',
    name: 'Xornexz',
    url: BASE_URL,
    email: 'hello@xornexz.com',
    description: 'A premium technology studio building websites, web apps, SaaS platforms, and AI-powered systems.',
    priceRange: '$$$',
    areaServed: 'Worldwide',
    hasOfferCatalog: {
      '@type': 'OfferCatalog',
      name: 'Software Development Services',
      itemListElement: [
        { '@type': 'Offer', itemOffered: { '@type': 'Service', name: 'Web Development' } },
        { '@type': 'Offer', itemOffered: { '@type': 'Service', name: 'Mobile App Development' } },
        { '@type': 'Offer', itemOffered: { '@type': 'Service', name: 'SaaS Development' } },
        { '@type': 'Offer', itemOffered: { '@type': 'Service', name: 'AI Integration' } },
        { '@type': 'Offer', itemOffered: { '@type': 'Service', name: 'UI/UX Design' } },
      ],
    },
  };
}
