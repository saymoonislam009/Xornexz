import Link from 'next/link';
import Image from 'next/image';
import { ArrowRight, Calendar, Clock, ChevronRight } from 'lucide-react';
import { blogPosts } from '@/lib/data/blog';

export const metadata = {
  title: 'Blog | Xornexz',
  description: 'Insights, tutorials, and updates from the Xornexz team.',
};

export default function BlogPage() {
  const featuredPost = blogPosts[0];
  const gridPosts = blogPosts.slice(1);
  const categories = ['All', 'Engineering', 'Design', 'Architecture', 'Performance'];

  return (
    <div className="min-h-screen bg-[#05060A] text-slate-300 font-sans selection:bg-violet-500/30">
      
      {/* Hero Section */}
      <section className="relative pt-32 pb-20 overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-violet-900/20 via-[#05060A] to-[#05060A] -z-10" />
        
        <div className="max-w-7xl mx-auto px-6 lg:px-8 text-center">
          <h1 className="text-4xl md:text-6xl font-bold tracking-tighter text-white font-display mb-6">
            Insights & <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#7C3AED] to-[#06B6D4]">Innovations</span>
          </h1>
          <p className="max-w-2xl mx-auto text-lg text-slate-400">
            Explore our latest thinking on web development, design systems, and the future of digital experiences.
          </p>
        </div>
      </section>

      {/* Category Filter (Static for now) */}
      <section className="max-w-7xl mx-auto px-6 lg:px-8 mb-16">
        <div className="flex flex-wrap items-center justify-center gap-3">
          {categories.map((category, idx) => (
            <button
              key={category}
              className={`px-5 py-2.5 rounded-full text-sm font-medium transition-all ${
                idx === 0
                  ? 'bg-gradient-to-r from-[#7C3AED] to-[#06B6D4] text-white shadow-[0_0_20px_rgba(124,58,237,0.3)]'
                  : 'bg-white/5 text-slate-300 hover:bg-white/10 hover:text-white border border-white/10'
              }`}
            >
              {category}
            </button>
          ))}
        </div>
      </section>

      {/* Featured Post */}
      <section className="max-w-7xl mx-auto px-6 lg:px-8 mb-24">
        <Link href={`/blog/${featuredPost.slug}`} className="group block">
          <div className="relative rounded-3xl overflow-hidden bg-white/5 border border-white/10 flex flex-col lg:flex-row transition-transform duration-500 hover:-translate-y-1 hover:shadow-2xl hover:shadow-violet-900/20">
            <div className={`w-full lg:w-1/2 h-64 lg:h-auto bg-gradient-to-br ${featuredPost.coverGradient} opacity-90 group-hover:opacity-100 transition-opacity flex items-center justify-center`}>
              {/* Abstract decorative element representing the image */}
              <div className="w-32 h-32 rounded-full border-4 border-white/20 border-t-white/80 animate-[spin_10s_linear_infinite]" />
            </div>
            
            <div className="w-full lg:w-1/2 p-8 lg:p-12 flex flex-col justify-center">
              <div className="flex items-center gap-3 mb-6">
                <span className="px-3 py-1 text-xs font-semibold uppercase tracking-wider text-violet-300 bg-violet-900/30 rounded-full border border-violet-700/50">
                  {featuredPost.category}
                </span>
                <span className="flex items-center text-sm text-slate-400">
                  <Clock className="w-4 h-4 mr-1.5" />
                  {featuredPost.readingTime}
                </span>
              </div>
              
              <h2 className="text-3xl lg:text-4xl font-bold text-white mb-4 group-hover:text-[#06B6D4] transition-colors font-display">
                {featuredPost.title}
              </h2>
              
              <p className="text-slate-400 mb-8 line-clamp-3 text-lg">
                {featuredPost.excerpt}
              </p>
              
              <div className="flex items-center justify-between mt-auto">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-slate-800 overflow-hidden border border-white/10">
                    <Image src={featuredPost.author.avatar} alt={featuredPost.author.name} className="w-full h-full object-cover" />
                  </div>
                  <div>
                    <div className="text-sm font-medium text-white">{featuredPost.author.name}</div>
                    <div className="text-xs text-slate-500">{new Date(featuredPost.publishedAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}</div>
                  </div>
                </div>
                
                <div className="hidden sm:flex items-center text-sm font-semibold text-white group-hover:text-[#06B6D4] transition-colors">
                  Read Article <ArrowRight className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" />
                </div>
              </div>
            </div>
          </div>
        </Link>
      </section>

      {/* Post Grid */}
      <section className="max-w-7xl mx-auto px-6 lg:px-8 mb-32">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {gridPosts.map((post) => (
            <Link key={post.slug} href={`/blog/${post.slug}`} className="group flex flex-col h-full bg-white/[0.02] border border-white/5 rounded-2xl overflow-hidden hover:bg-white/[0.04] hover:border-white/10 transition-all duration-300">
              <div className={`h-48 w-full bg-gradient-to-br ${post.coverGradient} opacity-80 group-hover:opacity-100 transition-opacity`} />
              
              <div className="p-6 flex flex-col flex-grow">
                <div className="flex items-center justify-between mb-4">
                  <span className="text-xs font-medium text-[#06B6D4]">
                    {post.category}
                  </span>
                  <span className="text-xs text-slate-500 flex items-center">
                    <Calendar className="w-3 h-3 mr-1" />
                    {new Date(post.publishedAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
                  </span>
                </div>
                
                <h3 className="text-xl font-bold text-white mb-3 group-hover:text-[#7C3AED] transition-colors font-display line-clamp-2">
                  {post.title}
                </h3>
                
                <p className="text-sm text-slate-400 mb-6 line-clamp-3 flex-grow">
                  {post.excerpt}
                </p>
                
                <div className="mt-auto pt-6 border-t border-white/5 flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Image src={post.author.avatar} alt={post.author.name} className="w-6 h-6 rounded-full" />
                    <span className="text-xs text-slate-300">{post.author.name}</span>
                  </div>
                  <span className="text-xs text-slate-500">{post.readingTime}</span>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </section>

      {/* Newsletter CTA */}
      <section className="max-w-5xl mx-auto px-6 lg:px-8 mb-32">
        <div className="relative rounded-3xl overflow-hidden bg-gradient-to-r from-violet-900/40 to-cyan-900/40 border border-white/10 p-8 md:p-12 text-center">
          <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] opacity-10" />
          <div className="relative z-10">
            <h2 className="text-3xl font-bold text-white mb-4 font-display">Never Miss an Update</h2>
            <p className="text-slate-300 mb-8 max-w-xl mx-auto">
              Join our newsletter to get the latest articles, tutorials, and industry insights delivered straight to your inbox.
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
                className="bg-gradient-to-r from-[#7C3AED] to-[#06B6D4] text-white font-semibold px-6 py-3 rounded-xl hover:shadow-[0_0_20px_rgba(6,182,212,0.4)] transition-all flex items-center justify-center whitespace-nowrap"
              >
                Subscribe <ChevronRight className="w-4 h-4 ml-1" />
              </button>
            </form>
            <p className="text-xs text-slate-500 mt-4">We respect your privacy. Unsubscribe at any time.</p>
          </div>
        </div>
      </section>
    </div>
  );
}
