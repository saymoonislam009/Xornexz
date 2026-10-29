"use client";

import Image from "next/image";
import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import { motion } from "framer-motion";
import { isUnoptimizedImageSrc } from "@/lib/media-url";

type FeaturedProject = {
  id: string | number;
  title: string;
  client: string;
  category: string;
  image: string;
  slug: string;
  year: string;
};

export default function FeaturedProjects({ projects }: { projects: FeaturedProject[] }) {
  if (!projects.length) return null;
  return (
    <section className="py-24 bg-slate-50 dark:bg-[#0B0D14] relative overflow-hidden" id="work">
      <div className="container mx-auto px-4 md:px-6 mb-12">
        <div className="flex items-end justify-between">
          <div>
            <p className="text-xs font-semibold tracking-[0.2em] text-violet-600 dark:text-violet-400 uppercase mb-3">
              Portfolio
            </p>
            <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold font-display text-slate-900 dark:text-white">
              Selected Work
            </h2>
          </div>
          <Link
            href="/portfolio"
            className="hidden md:inline-flex items-center gap-2 text-sm font-medium text-slate-600 dark:text-gray-400 hover:text-cyan-600 dark:hover:text-cyan-400 transition-colors"
          >
            View all <ArrowUpRight className="w-4 h-4" />
          </Link>
        </div>
      </div>

      <div className="container mx-auto px-4 md:px-6">
        <div
          className={`grid grid-cols-1 ${
            projects.length >= 5 ? "md:grid-cols-2 lg:grid-cols-3" : "md:grid-cols-2"
          } gap-6`}
        >
          {projects.map((project, index) => (
            <motion.div
              key={project.id}
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-60px" }}
              transition={{ duration: 0.45, delay: Math.min(index * 0.06, 0.25) }}
            >
              <Link
                href={`/portfolio/${project.slug}`}
                className="dark-card-overlay group relative block w-full overflow-hidden rounded-2xl border border-slate-200/60 dark:border-white/10 shadow-md dark:shadow-none bg-slate-900"
              >
                <div className="relative w-full h-[300px] sm:h-[360px] md:h-[400px]">
                  <Image
                    src={project.image}
                    alt={project.title}
                    fill
                    className="object-cover transition-transform duration-700 group-hover:scale-105"
                    sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                    unoptimized={isUnoptimizedImageSrc(project.image)}
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/30 to-black/10" />
                  <div className="absolute inset-0 bg-violet-600/0 group-hover:bg-violet-600/10 transition-colors duration-500" />
                </div>

                <div className="absolute inset-0 p-6 md:p-8 flex flex-col justify-between">
                  <div className="flex items-center justify-between">
                    <span className="px-3 py-1 text-xs font-semibold uppercase tracking-wider text-white/90 bg-black/40 backdrop-blur-md rounded-full border border-white/15">
                      {project.category}
                    </span>
                    <span className="text-xs text-white/70 font-medium">{project.year}</span>
                  </div>

                  <div className="flex items-end justify-between">
                    <div>
                      <p className="text-sm text-white/75 mb-1">{project.client}</p>
                      <h3 className="text-2xl md:text-3xl font-bold text-white font-display">
                        {project.title}
                      </h3>
                    </div>
                    <div className="w-12 h-12 rounded-full bg-white flex items-center justify-center transform translate-y-3 opacity-0 group-hover:translate-y-0 group-hover:opacity-100 transition-all duration-300 shrink-0 ml-4 shadow-lg">
                      <ArrowUpRight className="w-5 h-5 text-black" />
                    </div>
                  </div>
                </div>
              </Link>
            </motion.div>
          ))}
        </div>

        <div className="mt-8 text-center md:hidden">
          <Link
            href="/portfolio"
            className="inline-flex items-center gap-2 text-sm font-medium text-violet-600 dark:text-violet-400 hover:text-cyan-600 dark:hover:text-cyan-400 transition-colors"
          >
            View all projects <ArrowUpRight className="w-4 h-4" />
          </Link>
        </div>
      </div>
    </section>
  );
}
