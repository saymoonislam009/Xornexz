import Link from 'next/link';
import { notFound } from 'next/navigation';
import { ArrowLeft, Calendar, Clock, Share2, Twitter, Linkedin, Facebook } from 'lucide-react';
import { blogPosts } from '@/lib/data/blog';
import IncrementViews from './IncrementViews'; // We'll create this client component

export const metadata = {
  title: 'Blog Post | Xornexz',
};

export default async function BlogPostPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  
  const post = blogPosts.find((p) => p.slug === slug);

  if (!post) {
    notFound();
  }

  // Get related posts (just pick 2 other posts)
  const relatedPosts = blogPosts.filter((p) => p.slug !== post.slug).slice(0, 2);

  return (
    <div className="min-h-screen bg-[#05060A] text-slate-300 font-sans selection:bg-violet-500/30 pb-32">
      <IncrementViews slug={post.slug} />
      
      {/* Article Header */}
      <div className="relative pt-32 pb-16 overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-violet-900/10 via-[#05060A] to-[#05060A] -z-10" />
        
        <div className="max-w-3xl mx-auto px-6 lg:px-8">
          <Link href="/blog" className="inline-flex items-center text-sm font-medium text-slate-400 hover:text-white transition-colors mb-8">
            <ArrowLeft className="w-4 h-4 mr-2" /> Back to Blog
          </Link>
          
          <div className="flex items-center gap-4 mb-6">
            <span className="px-3 py-1 text-xs font-semibold uppercase tracking-wider text-[#06B6D4] bg-cyan-900/30 rounded-full border border-cyan-700/50">
              {post.category}
            </span>
            <span className="flex items-center text-sm text-slate-400">
              <Calendar className="w-4 h-4 mr-1.5" />
              {new Date(post.publishedAt).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}
            </span>
            <span className="flex items-center text-sm text-slate-400">
              <Clock className="w-4 h-4 mr-1.5" />
              {post.readingTime}
            </span>
          </div>
          
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-white mb-8 font-display leading-tight">
            {post.title}
          </h1>
          
          <div className="flex flex-wrap items-center justify-between gap-6 py-6 border-y border-white/10">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-full border border-white/10 bg-gradient-to-br from-violet-600 to-cyan-500 flex items-center justify-center text-white font-bold text-sm">
                {post.author.avatar}
              </div>
              <div>
                <div className="text-sm font-medium text-white">{post.author.name}</div>
                <div className="text-xs text-slate-400">{post.author.role}</div>
              </div>
            </div>
            
            <div className="flex items-center gap-3">
              <span className="text-sm text-slate-400 mr-2">Share:</span>
              <button className="p-2 rounded-full bg-white/5 hover:bg-white/10 text-slate-300 hover:text-[#06B6D4] transition-colors">
                <Twitter className="w-4 h-4" />
              </button>
              <button className="p-2 rounded-full bg-white/5 hover:bg-white/10 text-slate-300 hover:text-[#7C3AED] transition-colors">
                <Linkedin className="w-4 h-4" />
              </button>
              <button className="p-2 rounded-full bg-white/5 hover:bg-white/10 text-slate-300 hover:text-blue-500 transition-colors">
                <Facebook className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      </div>
      
      {/* Cover Image Placeholder */}
      <div className="max-w-5xl mx-auto px-6 lg:px-8 mb-16">
        <div className={`w-full aspect-[21/9] rounded-3xl bg-gradient-to-br ${post.coverGradient} shadow-2xl overflow-hidden relative`}>
          <div className="absolute inset-0 bg-black/20" />
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="w-32 h-32 rounded-full border-4 border-white/20 border-t-white/80 animate-[spin_10s_linear_infinite]" />
          </div>
        </div>
      </div>
      
      {/* Content Area with TOC */}
      <div className="max-w-7xl mx-auto px-6 lg:px-8 flex flex-col lg:flex-row gap-12 lg:gap-24">
        {/* Table of Contents - Sidebar */}
        <div className="hidden lg:block w-64 flex-shrink-0">
          <div className="sticky top-32">
            <h4 className="text-sm font-semibold text-white uppercase tracking-wider mb-4">Table of Contents</h4>
            <ul className="space-y-3 text-sm">
              <li><a href="#" className="text-[#06B6D4] hover:text-cyan-300 transition-colors">Introduction</a></li>
              <li><a href="#" className="text-slate-400 hover:text-white transition-colors">The Rise of AI-Assisted Development</a></li>
              <li><a href="#" className="text-slate-400 hover:text-white transition-colors">Edge Computing</a></li>
              <li><a href="#" className="text-slate-400 hover:text-white transition-colors">WebAssembly Mainstream</a></li>
              <li><a href="#" className="text-slate-400 hover:text-white transition-colors">Component-Driven Revolution</a></li>
              <li><a href="#" className="text-slate-400 hover:text-white transition-colors">Conclusion</a></li>
            </ul>
          </div>
        </div>
        
        {/* Main Content */}
        <article className="max-w-3xl flex-grow font-sans text-lg leading-relaxed text-slate-300">
          <div 
            className="prose-custom [&_h2]:text-4xl [&_h2]:text-white [&_h2]:font-bold [&_h2]:mt-12 [&_h2]:mb-6 [&_h3]:text-2xl [&_h3]:text-white [&_h3]:font-semibold [&_h3]:mt-8 [&_h3]:mb-4 [&_p]:mb-6 [&_p]:text-slate-300 [&_strong]:text-white [&_strong]:font-semibold [&_ul]:list-disc [&_ul]:pl-6 [&_ul]:mb-6 [&_ol]:list-decimal [&_ol]:pl-6 [&_ol]:mb-6 [&_li]:mb-2 [&_a]:text-cyan-400 [&_a]:underline [&_blockquote]:border-l-4 [&_blockquote]:border-violet-500 [&_blockquote]:pl-4 [&_blockquote]:italic [&_blockquote]:text-slate-400"
            dangerouslySetInnerHTML={{ __html: post.content }}
          />
          
          <div className="mt-12 flex flex-wrap gap-2">
            {post.tags.map((tag) => (
              <span key={tag} className="px-3 py-1 bg-white/5 border border-white/10 rounded-full text-xs text-slate-400">
                #{tag}
              </span>
            ))}
          </div>
        </article>
      </div>

      {/* Author Bio Footer */}
      <div className="max-w-3xl mx-auto px-6 lg:px-8 mt-24 mb-32">
        <div className="bg-white/5 border border-white/10 rounded-3xl p-8 flex flex-col sm:flex-row items-center sm:items-start gap-6 text-center sm:text-left">
          <div className="w-24 h-24 rounded-full border-2 border-[#7C3AED] bg-gradient-to-br from-violet-600 to-cyan-500 flex items-center justify-center text-white font-bold text-2xl flex-shrink-0">
              {post.author.avatar}
            </div>
          <div>
            <h3 className="text-xl font-bold text-white mb-2">Written by {post.author.name}</h3>
            <p className="text-sm text-slate-400 mb-4">{post.author.role} at Xornexz. Passionate about building scalable, accessible, and beautiful web experiences.</p>
            <button className="text-sm font-medium text-[#06B6D4] hover:text-cyan-300 transition-colors">
              View all posts by {post.author.name} &rarr;
            </button>
          </div>
        </div>
      </div>

      {/* Related Posts */}
      <div className="max-w-7xl mx-auto px-6 lg:px-8 mb-32">
        <h2 className="text-2xl font-bold text-white mb-8 font-display">Keep Reading</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {relatedPosts.map((relatedPost) => (
            <Link key={relatedPost.slug} href={`/blog/${relatedPost.slug}`} className="group flex bg-white/[0.02] border border-white/5 rounded-2xl overflow-hidden hover:bg-white/[0.04] transition-all duration-300 h-40">
              <div className={`w-1/3 bg-gradient-to-br ${relatedPost.coverGradient} opacity-80 group-hover:opacity-100 transition-opacity`} />
              <div className="w-2/3 p-6 flex flex-col justify-center">
                <span className="text-xs font-medium text-[#7C3AED] mb-2">{relatedPost.category}</span>
                <h3 className="text-lg font-bold text-white mb-2 group-hover:text-[#06B6D4] transition-colors line-clamp-2">
                  {relatedPost.title}
                </h3>
                <span className="text-xs text-slate-500">{relatedPost.readingTime} read</span>
              </div>
            </Link>
          ))}
        </div>
      </div>
      
      {/* Newsletter CTA */}
      <section className="max-w-5xl mx-auto px-6 lg:px-8">
        <div className="relative rounded-3xl overflow-hidden bg-gradient-to-r from-violet-900/40 to-cyan-900/40 border border-white/10 p-8 md:p-12 text-center">
          <div className="relative z-10">
            <h2 className="text-3xl font-bold text-white mb-4 font-display">Subscribe for more insights</h2>
            <p className="text-slate-300 mb-8 max-w-xl mx-auto text-sm">
              Get the latest articles, tutorials, and industry insights delivered straight to your inbox.
            </p>
            <form className="flex flex-col sm:flex-row max-w-md mx-auto gap-3">
              <input 
                type="email" 
                placeholder="Enter your email" 
                className="flex-grow bg-black/50 border border-white/20 rounded-xl px-4 py-3 text-white placeholder:text-slate-500 focus:outline-none focus:ring-2 focus:ring-[#7C3AED] transition-all"
                required
              />
              <button 
                type="submit"
                className="bg-gradient-to-r from-[#7C3AED] to-[#06B6D4] text-white font-semibold px-6 py-3 rounded-xl hover:shadow-[0_0_20px_rgba(6,182,212,0.4)] transition-all whitespace-nowrap"
              >
                Subscribe
              </button>
            </form>
          </div>
        </div>
      </section>

    </div>
  );
}
