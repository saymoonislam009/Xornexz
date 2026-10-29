'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Link from 'next/link';
import Image from 'next/image';
import { ArrowUpRight } from 'lucide-react';
import { isUnoptimizedImageSrc } from '@/lib/media-url';

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

  const filteredProjects =
    activeFilter === 'All'
      ? projects
      : projects.filter((p) => {
          const cat = (p.category || '').toLowerCase();
          const filt = activeFilter.toLowerCase();
          if (cat.includes(filt)) return true;
          if (Array.isArray(p.tags)) {
            return p.tags.some((tag: string) => tag.toLowerCase().includes(filt));
          }
          return false;
        });

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-[#05060A] text-slate-900 dark:text-white pt-32 pb-24">
      {/* Hero */}
      <section className="px-6 md:px-12 max-w-7xl mx-auto mb-14">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-8">
          <div>
            <motion.h1
              className="text-5xl md:text-7xl font-display font-bold tracking-tight mb-4 text-slate-950 dark:text-white"
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.45 }}
            >
              Selected{' '}
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-violet-600 to-cyan-500 dark:from-violet-400 dark:to-cyan-400">
                Work
              </span>
            </motion.h1>
            <p className="text-lg text-slate-600 dark:text-slate-400">
              Case studies and production systems engineered by Xornexz.
            </p>
          </div>
          <div className="text-6xl font-display font-bold text-slate-900/10 dark:text-white/10">
            {projects.length < 10 ? `0${projects.length}` : projects.length}
          </div>
        </div>
      </section>

      {/* Filters */}
      <section className="px-6 md:px-12 max-w-7xl mx-auto mb-14 overflow-x-auto pb-4 no-scrollbar">
        <div className="flex gap-2 min-w-max">
          {categories.map((cat) => (
            <button
              key={cat}
              type="button"
              onClick={() => setActiveFilter(cat)}
              className={`px-5 py-2.5 rounded-full text-sm font-semibold transition-all duration-200 ${
                activeFilter === cat
                  ? 'btn-gradient bg-gradient-to-r from-violet-600 to-cyan-500 text-white shadow-md shadow-violet-500/20'
                  : 'bg-white dark:bg-white/5 border border-slate-200 dark:border-white/10 text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-white/10'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
      </section>

      {/* Grid */}
      <section className="px-6 md:px-12 max-w-7xl mx-auto min-h-[50vh]">
        <motion.div layout className="grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-12">
          <AnimatePresence>
            {filteredProjects.map((project) => (
              <motion.div
                key={project.id}
                layout
                initial={{ opacity: 0, scale: 0.97 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.97 }}
                transition={{ duration: 0.3 }}
                className="group cursor-pointer"
              >
                <Link href={`/portfolio/${project.slug}`} className="block">
                  <div className="dark-card-overlay w-full aspect-[4/3] rounded-3xl overflow-hidden relative mb-6 bg-slate-900 dark:bg-[#0E1018] border border-slate-200 dark:border-white/10 group-hover:border-violet-500/40 transition-all shadow-md dark:shadow-none">
                    {project.coverImage ? (
                      <Image
                        src={project.coverImage}
                        alt={project.title}
                        fill
                        className="object-cover transition-transform duration-700 group-hover:scale-105"
                        sizes="(max-width: 768px) 100vw, 50vw"
                        unoptimized={isUnoptimizedImageSrc(project.coverImage)}
                      />
                    ) : (
                      <div
                        className="w-full h-full flex items-center justify-center p-8"
                        style={{
                          background: project.coverGradient?.startsWith('linear-gradient')
                            ? project.coverGradient
                            : 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                        }}
                      >
                        <span className="text-2xl font-bold font-display text-white/90">
                          {project.title}
                        </span>
                      </div>
                    )}
                    <div className="absolute inset-0 bg-gradient-to-t from-black/75 via-black/15 to-transparent" />

                    {/* Hover Overlay */}
                    <div className="absolute inset-0 bg-violet-600/15 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center backdrop-blur-[2px]">
                      <div className="px-6 py-3 bg-white text-slate-950 rounded-full font-semibold flex items-center gap-2 transform translate-y-3 group-hover:translate-y-0 transition-transform duration-300 shadow-xl">
                        View Case Study <ArrowUpRight className="w-4 h-4" />
                      </div>
                    </div>
                    {/* Category Badge */}
                    <div className="absolute top-5 left-5 px-4 py-1.5 bg-black/65 backdrop-blur-md border border-white/15 rounded-full text-xs font-semibold uppercase tracking-wider text-cyan-300">
                      {project.category}
                    </div>
                  </div>

                  <div className="flex justify-between items-start">
                    <div>
                      <h2 className="text-2xl md:text-3xl font-display font-bold mb-1.5 text-slate-900 dark:text-white group-hover:text-cyan-600 dark:group-hover:text-cyan-400 transition-colors">
                        {project.title}
                      </h2>
                      <p className="text-slate-500 dark:text-slate-400 mb-4 text-sm md:text-base">
                        {project.client || project.tagline}
                      </p>
                    </div>
                  </div>

                  {project.tags && project.tags.length > 0 && (
                    <div className="flex flex-wrap gap-2">
                      {project.tags.map((tag: string) => (
                        <span
                          key={tag}
                          className="text-xs font-medium text-slate-600 dark:text-slate-400 border border-slate-200 dark:border-white/10 bg-white dark:bg-white/[0.02] px-3 py-1 rounded-full"
                        >
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
    </div>
  );
}
