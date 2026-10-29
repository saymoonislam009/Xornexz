import { buildMetadata } from '@/lib/seo';
import Link from 'next/link';
import Image from 'next/image';
import { ArrowRight, Calendar, Clock } from 'lucide-react';
import { getPublicBlogPosts } from '@/lib/content';
import { isUnoptimizedImageSrc } from '@/lib/media-url';
import { NewsletterCTA } from '@/components/blog/NewsletterCTA';

export const metadata = buildMetadata({
  title: 'Blog — Engineering Insights & Tech Articles | Xornexz',
  description:
    'Read Xornexz engineering blog — articles on web development, SaaS architecture, AI systems, React, Next.js, TypeScript, and product design.',
  path: '/blog',
  keywords: [
    'web development blog',
    'software engineering blog',
    'Next.js articles',
    'React blog',
    'SaaS engineering',
  ],
});

export const revalidate = 30;

export default async function BlogPage() {
  const blogPosts = await getPublicBlogPosts();
  const featuredPost = blogPosts[0];
  const gridPosts = blogPosts.slice(1);
  const categories = ['All', ...Array.from(new Set(blogPosts.map((p) => p.category)))];

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-[#05060A] text-slate-700 dark:text-slate-300 font-sans selection:bg-violet-500/30">
      {/* Hero Section */}
      <section className="relative pt-32 pb-16 overflow-hidden">
        <div className="max-w-7xl mx-auto px-6 lg:px-8 text-center">
          <h1 className="text-4xl md:text-6xl font-bold tracking-tighter text-slate-950 dark:text-white font-display mb-6">
            Insights &{' '}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#7C3AED] to-[#06B6D4]">
              Innovations
            </span>
          </h1>
          <p className="max-w-2xl mx-auto text-lg text-slate-600 dark:text-slate-400">
            Explore our latest thinking on web development, design systems, and AI-native software architecture.
          </p>
        </div>
      </section>

      {/* Category Pills */}
      <section className="max-w-7xl mx-auto px-6 lg:px-8 mb-14">
        <div className="flex flex-wrap items-center justify-center gap-2.5">
          {categories.map((category, idx) => (
            <span
              key={category}
              className={`px-4 py-2 rounded-full text-xs sm:text-sm font-medium ${
                idx === 0
                  ? 'btn-gradient bg-gradient-to-r from-[#7C3AED] to-[#06B6D4] text-white shadow-sm'
                  : 'bg-white dark:bg-white/5 text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-white/10'
              }`}
            >
              {category}
            </span>
          ))}
        </div>
      </section>

      {/* Featured Post */}
      {!featuredPost && (
        <p className="text-center text-slate-500 pb-32">
          No articles published yet. Check back soon.
        </p>
      )}
      {featuredPost && (
        <section className="max-w-7xl mx-auto px-6 lg:px-8 mb-24">
          <Link href={`/blog/${featuredPost.slug}`} className="group block">
            <div className="relative rounded-3xl overflow-hidden bg-white dark:bg-white/5 border border-slate-200 dark:border-white/10 flex flex-col lg:flex-row transition-transform duration-500 hover:-translate-y-1 shadow-lg dark:shadow-none">
              <div
                className={`w-full lg:w-1/2 min-h-[280px] lg:h-auto bg-gradient-to-br ${featuredPost.coverGradient} flex items-center justify-center relative overflow-hidden`}
              >
                {featuredPost.coverImage ? (
                  <Image
                    src={featuredPost.coverImage}
                    alt={featuredPost.title}
                    fill
                    className="object-cover transition-transform duration-500 group-hover:scale-105"
                    sizes="(max-width: 1024px) 100vw, 50vw"
                    priority
                    unoptimized={isUnoptimizedImageSrc(featuredPost.coverImage)}
                  />
                ) : (
                  <div className="w-28 h-28 rounded-full border-4 border-white/20 border-t-white/80 animate-[spin_10s_linear_infinite]" />
                )}
              </div>

              <div className="w-full lg:w-1/2 p-8 lg:p-12 flex flex-col justify-center">
                <div className="flex items-center gap-3 mb-6">
                  <span className="px-3 py-1 text-xs font-semibold uppercase tracking-wider text-violet-700 dark:text-violet-300 bg-violet-500/10 dark:bg-violet-900/30 rounded-full border border-violet-500/20 dark:border-violet-700/50">
                    {featuredPost.category}
                  </span>
                  <span className="flex items-center text-sm text-slate-500 dark:text-slate-400">
                    <Clock className="w-4 h-4 mr-1.5" />
                    {featuredPost.readingTime}
                  </span>
                </div>

                <h2 className="text-3xl lg:text-4xl font-bold text-slate-900 dark:text-white mb-4 group-hover:text-[#06B6D4] transition-colors font-display">
                  {featuredPost.title}
                </h2>

                <p className="text-slate-600 dark:text-slate-400 mb-8 line-clamp-3 text-base sm:text-lg">
                  {featuredPost.excerpt}
                </p>

                <div className="flex items-center justify-between mt-auto">
                  <div className="flex items-center gap-3">
                    <div className="relative w-10 h-10 rounded-full bg-gradient-to-br from-violet-600 to-cyan-500 overflow-hidden border border-white/10 flex items-center justify-center text-xs font-bold text-white">
                      {featuredPost.author.avatar.startsWith('http') ||
                      featuredPost.author.avatar.startsWith('/') ? (
                        <Image
                          src={featuredPost.author.avatar}
                          alt={featuredPost.author.name}
                          fill
                          className="object-cover"
                          unoptimized={isUnoptimizedImageSrc(featuredPost.author.avatar)}
                        />
                      ) : (
                        featuredPost.author.avatar
                      )}
                    </div>
                    <div>
                      <div className="text-sm font-semibold text-slate-900 dark:text-white">
                        {featuredPost.author.name}
                      </div>
                      <div className="text-xs text-slate-500">
                        {new Date(featuredPost.publishedAt).toLocaleDateString('en-US', {
                          month: 'short',
                          day: 'numeric',
                          year: 'numeric',
                        })}
                      </div>
                    </div>
                  </div>

                  <div className="hidden sm:flex items-center text-sm font-semibold text-violet-600 dark:text-white group-hover:text-[#06B6D4] transition-colors">
                    Read Article{' '}
                    <ArrowRight className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" />
                  </div>
                </div>
              </div>
            </div>
          </Link>
        </section>
      )}

      {/* Post Grid */}
      <section className="max-w-7xl mx-auto px-6 lg:px-8 mb-32">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {gridPosts.map((post) => (
            <Link
              key={post.slug}
              href={`/blog/${post.slug}`}
              className="group flex flex-col h-full bg-white dark:bg-white/[0.02] border border-slate-200 dark:border-white/5 rounded-2xl overflow-hidden hover:border-violet-500/30 dark:hover:border-white/10 transition-all duration-300 shadow-sm dark:shadow-none"
            >
              <div
                className={`h-48 w-full bg-gradient-to-br ${post.coverGradient} relative overflow-hidden`}
              >
                {post.coverImage && (
                  <Image
                    src={post.coverImage}
                    alt={post.title}
                    fill
                    className="object-cover transition-transform duration-500 group-hover:scale-105"
                    sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                    unoptimized={isUnoptimizedImageSrc(post.coverImage)}
                  />
                )}
              </div>

              <div className="p-6 flex flex-col flex-grow">
                <div className="flex items-center justify-between mb-4">
                  <span className="text-xs font-semibold text-cyan-600 dark:text-[#06B6D4]">
                    {post.category}
                  </span>
                  <span className="text-xs text-slate-500 flex items-center">
                    <Calendar className="w-3 h-3 mr-1" />
                    {new Date(post.publishedAt).toLocaleDateString('en-US', {
                      month: 'short',
                      day: 'numeric',
                    })}
                  </span>
                </div>

                <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-3 group-hover:text-[#7C3AED] transition-colors font-display line-clamp-2">
                  {post.title}
                </h3>

                <p className="text-sm text-slate-600 dark:text-slate-400 mb-6 line-clamp-3 flex-grow">
                  {post.excerpt}
                </p>

                <div className="mt-auto pt-5 border-t border-slate-100 dark:border-white/5 flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <div className="w-6 h-6 rounded-full bg-gradient-to-br from-violet-600 to-cyan-500 overflow-hidden flex items-center justify-center text-[10px] font-bold text-white shrink-0">
                      {post.author.avatar.startsWith('http') ||
                      post.author.avatar.startsWith('/') ? (
                        <Image
                          src={post.author.avatar}
                          alt={post.author.name}
                          width={24}
                          height={24}
                          className="rounded-full"
                          unoptimized={isUnoptimizedImageSrc(post.author.avatar)}
                        />
                      ) : (
                        post.author.avatar
                      )}
                    </div>
                    <span className="text-xs font-medium text-slate-700 dark:text-slate-300">
                      {post.author.name}
                    </span>
                  </div>
                  <span className="text-xs text-slate-500">{post.readingTime}</span>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </section>

      {/* Newsletter CTA */}
      <section className="max-w-5xl mx-auto px-6 lg:px-8 pb-24">
        <NewsletterCTA />
      </section>
    </div>
  );
}
