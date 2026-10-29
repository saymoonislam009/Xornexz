import Link from 'next/link';
import Image from 'next/image';
import { notFound } from 'next/navigation';
import { ArrowLeft, Calendar, Clock } from 'lucide-react';
import { blogPosts } from '@/lib/data/blog';
import { getPublicBlogPosts } from '@/lib/content';
import IncrementViews from './IncrementViews';
import { prisma } from '@/lib/db';
import { resolveEntityImageUrl, isUnoptimizedImageSrc } from '@/lib/media-url';
import { buildMetadata, buildArticleSchema, buildBreadcrumbSchema } from '@/lib/seo';
import { NewsletterCTA } from '@/components/blog/NewsletterCTA';
import type { Metadata } from 'next';

export const dynamicParams = true;
export const revalidate = 30;

async function getPost(slug: string) {
  const staticFallback = blogPosts.find((p) => p.slug === slug);
  try {
    const dbPost = await prisma.blogPost.findUnique({
      where: { slug },
      include: { author: true },
    });
    if (dbPost && dbPost.status === 'PUBLISHED') {
      const resolvedCover = resolveEntityImageUrl(
        dbPost.coverImage,
        'blog',
        dbPost.id,
        dbPost.updatedAt,
        staticFallback?.coverImage || ''
      );
      return {
        slug: dbPost.slug,
        title: dbPost.title,
        excerpt: dbPost.excerpt,
        content: dbPost.content,
        author: {
          name: dbPost.author?.name || 'Xornexz Editorial',
          role: 'Engineering Team',
          avatar: dbPost.author?.name ? dbPost.author.name.slice(0, 2).toUpperCase() : 'XE',
        },
        publishedAt: dbPost.publishedAt
          ? dbPost.publishedAt.toISOString()
          : dbPost.createdAt.toISOString(),
        readingTime: dbPost.readingTime ? `${dbPost.readingTime} min read` : '5 min read',
        category: dbPost.category,
        tags: dbPost.tags,
        coverGradient: 'from-violet-600 to-cyan-500',
        coverImage: resolvedCover || null,
      };
    }
  } catch {
    // Database query failed, fallback to static
  }

  return staticFallback || null;
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const post = await getPost(slug);
  if (!post) return { title: 'Post Not Found | Xornexz' };
  return buildMetadata({
    title: post.title,
    description: post.excerpt || `Read ${post.title} on the Xornexz engineering blog.`,
    path: `/blog/${slug}`,
    keywords: Array.isArray(post.tags) ? (post.tags as string[]) : [],
  });
}

export default async function BlogPostPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const post = await getPost(slug);

  if (!post) {
    notFound();
  }

  const allPosts = await getPublicBlogPosts();
  const relatedPosts = allPosts.filter((p) => p.slug !== post.slug).slice(0, 2);

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-[#05060A] text-slate-700 dark:text-slate-300 font-sans selection:bg-violet-500/30 pb-32">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify([
            buildArticleSchema({
              title: post.title,
              description: post.excerpt || undefined,
              slug: post.slug,
              publishedAt: post.publishedAt || new Date().toISOString(),
              authorName: post.author?.name || 'Xornexz',
              coverImage: post.coverImage || undefined,
            }),
            buildBreadcrumbSchema([
              { name: 'Home', url: 'https://xornexz.com' },
              { name: 'Blog', url: 'https://xornexz.com/blog' },
              { name: post.title, url: `https://xornexz.com/blog/${post.slug}` },
            ]),
          ]),
        }}
      />
      <IncrementViews slug={post.slug} />

      {/* Article Header */}
      <div className="relative pt-32 pb-14 overflow-hidden">
        <div className="max-w-3xl mx-auto px-6 lg:px-8">
          <Link
            href="/blog"
            className="inline-flex items-center text-sm font-medium text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white transition-colors mb-8"
          >
            <ArrowLeft className="w-4 h-4 mr-2" /> Back to Blog
          </Link>

          <div className="flex flex-wrap items-center gap-4 mb-6">
            <span className="px-3 py-1 text-xs font-semibold uppercase tracking-wider text-cyan-700 dark:text-[#06B6D4] bg-cyan-500/10 dark:bg-cyan-900/30 rounded-full border border-cyan-500/20 dark:border-cyan-700/50">
              {post.category}
            </span>
            <span className="flex items-center text-sm text-slate-500 dark:text-slate-400">
              <Calendar className="w-4 h-4 mr-1.5" />
              {new Date(post.publishedAt).toLocaleDateString('en-US', {
                month: 'long',
                day: 'numeric',
                year: 'numeric',
              })}
            </span>
            <span className="flex items-center text-sm text-slate-500 dark:text-slate-400">
              <Clock className="w-4 h-4 mr-1.5" />
              {post.readingTime}
            </span>
          </div>

          <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-slate-950 dark:text-white mb-8 font-display leading-tight">
            {post.title}
          </h1>

          <div className="flex flex-wrap items-center justify-between gap-6 py-6 border-y border-slate-200 dark:border-white/10">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-full border border-white/10 bg-gradient-to-br from-violet-600 to-cyan-500 flex items-center justify-center text-white font-bold text-sm">
                {post.author.avatar}
              </div>
              <div>
                <div className="text-sm font-semibold text-slate-900 dark:text-white">
                  {post.author.name}
                </div>
                <div className="text-xs text-slate-500 dark:text-slate-400">{post.author.role}</div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Cover Image */}
      <div className="max-w-5xl mx-auto px-6 lg:px-8 mb-16">
        <div
          className={`w-full aspect-[16/9] md:aspect-[21/9] rounded-3xl bg-gradient-to-br ${post.coverGradient} shadow-2xl overflow-hidden relative`}
        >
          {post.coverImage ? (
            <Image
              src={post.coverImage}
              alt={post.title}
              fill
              className="object-cover"
              sizes="(max-width: 1024px) 100vw, 1200px"
              priority
              unoptimized={isUnoptimizedImageSrc(post.coverImage)}
            />
          ) : (
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="w-28 h-28 rounded-full border-4 border-white/20 border-t-white/80 animate-[spin_10s_linear_infinite]" />
            </div>
          )}
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-3xl mx-auto px-6 lg:px-8">
        <article className="font-sans text-lg leading-relaxed text-slate-700 dark:text-slate-300">
          <div
            className="prose-custom [&_h2]:text-3xl sm:[&_h2]:text-4xl [&_h2]:text-slate-900 dark:[&_h2]:text-white [&_h2]:font-bold [&_h2]:mt-12 [&_h2]:mb-6 [&_h3]:text-2xl [&_h3]:text-slate-900 dark:[&_h3]:text-white [&_h3]:font-semibold [&_h3]:mt-8 [&_h3]:mb-4 [&_p]:mb-6 [&_p]:text-slate-700 dark:[&_p]:text-slate-300 [&_strong]:text-slate-900 dark:[&_strong]:text-white [&_strong]:font-semibold [&_ul]:list-disc [&_ul]:pl-6 [&_ul]:mb-6 [&_ol]:list-decimal [&_ol]:pl-6 [&_ol]:mb-6 [&_li]:mb-2 [&_a]:text-cyan-600 dark:[&_a]:text-cyan-400 [&_a]:underline [&_blockquote]:border-l-4 [&_blockquote]:border-violet-500 [&_blockquote]:pl-4 [&_blockquote]:italic [&_blockquote]:text-slate-500 dark:[&_blockquote]:text-slate-400"
            dangerouslySetInnerHTML={{ __html: post.content }}
          />

          <div className="mt-12 flex flex-wrap gap-2">
            {post.tags.map((tag) => (
              <span
                key={tag}
                className="px-3 py-1 bg-white dark:bg-white/5 border border-slate-200 dark:border-white/10 rounded-full text-xs text-slate-600 dark:text-slate-400"
              >
                #{tag}
              </span>
            ))}
          </div>
        </article>
      </div>

      {/* Author Bio Footer */}
      <div className="max-w-3xl mx-auto px-6 lg:px-8 mt-20 mb-24">
        <div className="bg-white dark:bg-white/5 border border-slate-200 dark:border-white/10 rounded-3xl p-8 flex flex-col sm:flex-row items-center sm:items-start gap-6 text-center sm:text-left shadow-sm dark:shadow-none">
          <div className="w-20 h-20 rounded-full border-2 border-[#7C3AED] bg-gradient-to-br from-violet-600 to-cyan-500 flex items-center justify-center text-white font-bold text-xl flex-shrink-0">
            {post.author.avatar}
          </div>
          <div>
            <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-2">
              Written by {post.author.name}
            </h3>
            <p className="text-sm text-slate-600 dark:text-slate-400 mb-3">
              {post.author.role} at Xornexz. Passionate about building scalable, accessible, and high-converting digital products.
            </p>
            <Link
              href="/blog"
              className="text-sm font-semibold text-cyan-600 dark:text-[#06B6D4] hover:opacity-80 transition-colors"
            >
              View more articles &rarr;
            </Link>
          </div>
        </div>
      </div>

      {/* Related Posts */}
      {relatedPosts.length > 0 && (
        <div className="max-w-5xl mx-auto px-6 lg:px-8 mb-24">
          <h2 className="text-2xl font-bold text-slate-900 dark:text-white mb-8 font-display">
            Keep Reading
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {relatedPosts.map((relatedPost) => (
              <Link
                key={relatedPost.slug}
                href={`/blog/${relatedPost.slug}`}
                className="group flex bg-white dark:bg-white/[0.02] border border-slate-200 dark:border-white/5 rounded-2xl overflow-hidden hover:border-violet-500/30 transition-all duration-300 h-40 shadow-sm dark:shadow-none"
              >
                <div
                  className={`w-1/3 bg-gradient-to-br ${relatedPost.coverGradient} relative overflow-hidden`}
                >
                  {relatedPost.coverImage && (
                    <Image
                      src={relatedPost.coverImage}
                      alt={relatedPost.title}
                      fill
                      className="object-cover group-hover:scale-105 transition-transform duration-500"
                      sizes="200px"
                      unoptimized={isUnoptimizedImageSrc(relatedPost.coverImage)}
                    />
                  )}
                </div>
                <div className="w-2/3 p-6 flex flex-col justify-center">
                  <span className="text-xs font-semibold text-[#7C3AED] mb-2">
                    {relatedPost.category}
                  </span>
                  <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-2 group-hover:text-[#06B6D4] transition-colors line-clamp-2">
                    {relatedPost.title}
                  </h3>
                  <span className="text-xs text-slate-500">{relatedPost.readingTime}</span>
                </div>
              </Link>
            ))}
          </div>
        </div>
      )}

      {/* Newsletter CTA */}
      <section className="max-w-5xl mx-auto px-6 lg:px-8">
        <NewsletterCTA heading="Subscribe for more insights" />
      </section>
    </div>
  );
}
