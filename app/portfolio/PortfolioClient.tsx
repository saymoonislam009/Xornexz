'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Link from 'next/link';
import Image from 'next/image';
import { ArrowUpRight } from 'lucide-react';

const categories = ['All', 'Web', 'Mobile', 'SaaS', 'API', 'UI/UX', 'AI/Automation'];

interface ProjectItem {
  id: string | number;
  slug: string;
  title: string;
  tagline: string;
  client?: string;
  category: string;
  tags?: string[];
  coverGradient?: string;
  coverImage?: string | null;
  year?: string;
  featured?: boolean;
}

export default function PortfolioClient({ projects }: { projects: ProjectItem[] }) {
  const [activeFilter, setActiveFilter] = useState('All');

  const filteredProjects = activeFilter === 'All' 
    ? projects 
    : projects.filter(p => {
        const cat = (p.category || "").toLowerCase();
        const filt = activeFilter.toLowerCase();
        if (cat.includes(filt)) return true;
        if (Array.isArray(p.tags)) {
          return p.tags.some((tag: string) => tag.toLowerCase().includes(filt));
        }
        return false;
      });

  return (
    <main className="min-h-screen bg-[#05060A] text-white pt-32 pb-24">
      {/* Hero */}
      <section className="px-6 md:px-12 max-w-7xl mx-auto mb-16">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-8">
          <div>
            <motion.h1 
              className="text-5xl md:text-7xl font-display font-bold tracking-tight mb-4"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
            >
              Selected <span className="text-transparent bg-clip-text bg-gradient-to-r from-violet-400 to-cyan-400">Work</span>
            </motion.h1>
            <motion.p 
              className="text-lg text-slate-400"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.6, delay: 0.2 }}
            >
              Case studies and production systems engineered by Xornexz.
            </motion.p>
          </div>
          <motion.div 
            className="text-6xl font-display font-bold text-white/10"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.8, delay: 0.4 }}
          >
            {projects.length < 10 ? `0${projects.length}` : projects.length}
          </motion.div>
        </div>
      </section>

      {/* Filters */}
      <section className="px-6 md:px-12 max-w-7xl mx-auto mb-16 overflow-x-auto pb-4 no-scrollbar">
        <div className="flex gap-2 min-w-max">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setActiveFilter(cat)}
              className={`px-5 py-2.5 rounded-full text-sm font-medium transition-all duration-300 ${
                activeFilter === cat 
                  ? 'bg-white text-black shadow-lg shadow-white/10' 
                  : 'bg-white/5 text-slate-300 hover:bg-white/10'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
      </section>

      {/* Grid */}
      <section className="px-6 md:px-12 max-w-7xl mx-auto min-h-[50vh]">
        <motion.div 
          layout
          className="grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-12"
        >
          <AnimatePresence>
            {filteredProjects.map((project) => (
              <motion.div
                key={project.id}
                layout
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
                transition={{ duration: 0.4 }}
                className="group cursor-pointer"
              >
                <Link href={`/portfolio/${project.slug}`} className="block">
                  <div className="w-full aspect-[4/3] rounded-3xl overflow-hidden relative mb-6 bg-[#0E1018] border border-white/10 group-hover:border-violet-500/30 transition-all">
                    {project.coverImage ? (
                      <Image
                        src={project.coverImage}
                        alt={project.title}
                        fill
                        className="object-cover transition-transform duration-700 group-hover:scale-105"
                        sizes="(max-width: 768px) 100vw, 50vw"
                        unoptimized={project.coverImage.startsWith("data:") || project.coverImage.startsWith("blob:")}
                      />
                    ) : (
                      <div
                        className="w-full h-full flex items-center justify-center p-8"
                        style={{
                          background: project.coverGradient?.startsWith("linear-gradient")
                            ? project.coverGradient
                            : "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
                        }}
                      >
                        <span className="text-2xl font-bold font-display text-white/90">{project.title}</span>
                      </div>
                    )}
                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />

                    {/* Hover Overlay */}
                    <div className="absolute inset-0 bg-violet-600/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center backdrop-blur-sm">
                      <div className="px-6 py-3 bg-white text-black rounded-full font-medium flex items-center gap-2 transform translate-y-4 group-hover:translate-y-0 transition-transform duration-300 shadow-xl">
                        View Case Study <ArrowUpRight className="w-4 h-4" />
                      </div>
                    </div>
                    {/* Category Badge */}
                    <div className="absolute top-6 left-6 px-4 py-1.5 bg-black/60 backdrop-blur-md border border-white/10 rounded-full text-xs font-semibold uppercase tracking-wider text-cyan-300">
                      {project.category}
                    </div>
                  </div>
                  
                  <div className="flex justify-between items-start">
                    <div>
                      <h2 className="text-2xl md:text-3xl font-display font-bold mb-2 group-hover:text-cyan-400 transition-colors">
                        {project.title}
                      </h2>
                      <p className="text-slate-400 mb-4 text-sm md:text-base">{project.client}</p>
                    </div>
                  </div>
                  
                  {project.tags && project.tags.length > 0 && (
                    <div className="flex flex-wrap gap-2">
                      {project.tags.map((tag: string) => (
                        <span key={tag} className="text-xs font-medium text-slate-400 border border-white/10 bg-white/[0.02] px-3 py-1 rounded-full">
                          {tag}
                        </span>
                      ))}
                    </div>
                  )}
                </Link>
              </motion.div>
            ))}
          </AnimatePresence>
        </motion.div>
      </section>
    </main>
  );
}
