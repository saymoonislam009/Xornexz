import { buildMetadata, buildBreadcrumbSchema } from '@/lib/seo';
import { PROJECTS_DATA as projects } from '@/lib/data/projects';
import { notFound } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';
import { ArrowLeft, ExternalLink, ArrowRight } from 'lucide-react';
import type { Metadata } from 'next';
import { prisma } from '@/lib/db';
import {
  resolveEntityImageUrl,
  resolveGalleryUrls,
  isUnoptimizedImageSrc,
} from '@/lib/media-url';

export const dynamicParams = true;
export const revalidate = 30;

async function getProject(slug: string) {
  const staticFallback = projects.find((p) => p.slug === slug);
  try {
    const dbProject = await prisma.project.findUnique({
      where: { slug },
      include: { testimonial: true },
    });
    if (dbProject && dbProject.status === 'PUBLISHED') {
      const defaultImg =
        staticFallback?.coverImage ||
        'https://images.unsplash.com/photo-1551288049-bebda4e38f71?auto=format&fit=crop&q=80&w=2070';

      const coverImage = resolveEntityImageUrl(
        dbProject.coverImage,
        'project',
        dbProject.id,
        dbProject.updatedAt,
        defaultImg
      );

      const gallery = resolveGalleryUrls(
        dbProject.gallery,
        dbProject.id,
        dbProject.updatedAt,
        staticFallback?.gallery || []
      );

      return {
        id: dbProject.id,
        slug: dbProject.slug,
        title: dbProject.title,
        tagline: dbProject.tagline,
        description: dbProject.description,
        challenge: dbProject.description,
        solution: dbProject.content || dbProject.description,
        client: dbProject.client || staticFallback?.client || 'Enterprise Client',
        liveUrl: dbProject.liveUrl || null,
        category: dbProject.category,
        tags:
          dbProject.tags && dbProject.tags.length > 0
            ? dbProject.tags
            : staticFallback?.tags || ['Web Development'],
        techStack:
          dbProject.techStack && dbProject.techStack.length > 0
            ? dbProject.techStack
            : staticFallback?.techStack || ['Next.js', 'TypeScript', 'TailwindCSS'],
        coverGradient:
          staticFallback?.coverGradient || 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
        coverImage,
        gallery,
        year: String((dbProject.publishedAt ?? dbProject.createdAt).getFullYear()),
        results:
          (dbProject.metrics as Record<string, unknown>) ||
          staticFallback?.results || {
            Performance: { value: '99.9%', note: 'Uptime SLA' },
            Conversion: { value: '+45%', note: 'Increase in qualified leads' },
          },
        testimonial: dbProject.testimonial
          ? {
              name: dbProject.testimonial.name,
              title: dbProject.testimonial.title,
              company: dbProject.testimonial.company,
              content: dbProject.testimonial.content,
              rating: dbProject.testimonial.rating,
            }
          : staticFallback?.testimonial || null,
      };
    }
  } catch {
    // Database query failed, fallback to static
  }

  return staticFallback ? { ...staticFallback, liveUrl: staticFallback.liveUrl || null } : null;
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const project = await getProject(slug);
  if (!project) return { title: 'Project Not Found | Xornexz' };
  return buildMetadata({
    title: `${project.title} | Xornexz Portfolio`,
    description:
      project.tagline ||
      project.description ||
      `See how Xornexz built ${project.title} — a case study.`,
    path: `/portfolio/${slug}`,
    keywords: [
      project.title.toLowerCase(),
      project.category?.toLowerCase() || 'software',
      'case study',
      'xornexz portfolio',
    ],
  });
}

export default async function CaseStudyPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const project = await getProject(slug);

  if (!project) notFound();

  const nextProj = projects.find((p) => p.slug !== project.slug) || projects[0];

  return (
    <div className="bg-slate-50 dark:bg-[#05060A] text-slate-900 dark:text-white pt-28 pb-0">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(
            buildBreadcrumbSchema([
              { name: 'Home', url: 'https://xornexz.com' },
              { name: 'Portfolio', url: 'https://xornexz.com/portfolio' },
              { name: project.title, url: `https://xornexz.com/portfolio/${project.slug}` },
            ])
          ),
        }}
      />

      {/* Hero Header */}
      <section className="px-6 md:px-12 max-w-7xl mx-auto mb-12">
        <Link
          href="/portfolio"
          className="inline-flex items-center text-sm font-medium text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white mb-8 transition-colors"
        >
          <ArrowLeft className="w-4 h-4 mr-2" /> Back to Portfolio
        </Link>

        <div className="grid md:grid-cols-2 gap-10 items-end">
          <div>
            <div className="inline-block px-4 py-1.5 bg-violet-500/10 dark:bg-white/5 border border-violet-500/20 dark:border-white/10 rounded-full text-xs font-semibold uppercase tracking-wider text-violet-600 dark:text-cyan-400 mb-5">
              {project.category}
            </div>
            <h1 className="text-4xl sm:text-5xl md:text-7xl font-display font-bold tracking-tight mb-5 leading-tight text-slate-950 dark:text-white">
              {project.title}
            </h1>
            <p className="text-lg md:text-2xl text-slate-600 dark:text-slate-300 font-light leading-relaxed">
              {project.tagline}
            </p>
          </div>

          <div className="flex flex-col md:items-end gap-6 pb-2">
            <div className="grid grid-cols-2 gap-8 text-left md:text-right">
              <div>
                <div className="text-slate-500 text-xs uppercase tracking-wider mb-1">Client</div>
                <div className="font-semibold text-lg text-slate-900 dark:text-white">
                  {project.client}
                </div>
              </div>
              <div>
                <div className="text-slate-500 text-xs uppercase tracking-wider mb-1">Year</div>
                <div className="font-semibold text-lg text-slate-900 dark:text-white">
                  {project.year}
                </div>
              </div>
            </div>
            {project.liveUrl ? (
              <a
                href={project.liveUrl}
                target="_blank"
                rel="noreferrer"
                className="btn-gradient inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-violet-600 to-cyan-500 text-white font-semibold rounded-full hover:opacity-90 transition-all shadow-lg"
              >
                Visit Live Site <ExternalLink className="w-4 h-4" />
              </a>
            ) : (
              <Link
                href="/contact"
                className="btn-gradient inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-violet-600 to-cyan-500 text-white font-semibold rounded-full hover:shadow-[0_0_20px_rgba(124,58,237,0.4)] transition-all"
              >
                Discuss Similar Project <ArrowRight className="w-4 h-4" />
              </Link>
            )}
          </div>
        </div>
      </section>

      {/* Massive Cover Visual */}
      <section className="px-6 md:px-12 max-w-7xl mx-auto mb-24">
        <div className="relative w-full h-[45vh] sm:h-[55vh] md:h-[68vh] rounded-3xl overflow-hidden border border-slate-200 dark:border-white/10 shadow-2xl bg-slate-900">
          {project.coverImage ? (
            <Image
              src={project.coverImage}
              alt={project.title}
              fill
              priority
              className="object-cover"
              sizes="100vw"
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
              <div className="text-center">
                <span className="text-sm font-semibold uppercase tracking-widest text-cyan-300 mb-2 block">
                  {project.category}
                </span>
                <h2 className="text-4xl md:text-6xl font-display font-bold text-white">
                  {project.title}
                </h2>
              </div>
            </div>
          )}
        </div>
      </section>

      {/* Content Columns */}
      <section className="px-6 md:px-12 max-w-7xl mx-auto mb-24">
        <div className="grid md:grid-cols-12 gap-12 lg:gap-16">
          {/* Main Body */}
          <div className="md:col-span-8 space-y-12">
            <div>
              <h2 className="text-2xl sm:text-3xl font-display font-bold mb-4 text-slate-900 dark:text-white">
                The Challenge
              </h2>
              <p className="text-base sm:text-lg text-slate-600 dark:text-slate-300 leading-relaxed font-light whitespace-pre-line">
                {project.challenge}
              </p>
            </div>

            <div>
              <h2 className="text-2xl sm:text-3xl font-display font-bold mb-4 text-slate-900 dark:text-white">
                Our Solution
              </h2>
              <p className="text-base sm:text-lg text-slate-600 dark:text-slate-300 leading-relaxed font-light whitespace-pre-line">
                {project.solution}
              </p>
            </div>

            {/* Testimonial Quote */}
            {project.testimonial && (
              <div className="bg-white dark:bg-[#0B0D14] border border-slate-200 dark:border-white/10 rounded-3xl p-8 sm:p-10 relative overflow-hidden shadow-sm dark:shadow-none">
                <div className="absolute top-0 left-0 w-2 h-full bg-gradient-to-b from-violet-500 to-cyan-500" />
                <p className="text-xl sm:text-2xl font-light italic text-slate-700 dark:text-slate-200 leading-relaxed mb-6">
                  &ldquo;{project.testimonial.content}&rdquo;
                </p>
                <div>
                  <div className="font-bold text-base text-slate-900 dark:text-white">
                    {project.testimonial.name}
                  </div>
                  <div className="text-slate-500 dark:text-slate-400 text-sm">
                    {project.testimonial.title}
                    {project.testimonial.company ? ` — ${project.testimonial.company}` : ''}
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Sidebar */}
          <div className="md:col-span-4 space-y-10">
            {/* Key Results */}
            {project.results && Object.keys(project.results).length > 0 && (
              <div className="p-6 rounded-2xl bg-white dark:bg-white/[0.02] border border-slate-200 dark:border-white/5 shadow-sm dark:shadow-none">
                <h3 className="text-lg font-bold mb-6 border-b border-slate-200 dark:border-white/10 pb-3 text-slate-900 dark:text-white">
                  Key Results
                </h3>
                <div className="space-y-6">
                  {Object.entries(project.results).map(([key, val]) => {
                    const resultVal = val as Record<string, string> | string;
                    const display =
                      typeof resultVal === 'string'
                        ? resultVal
                        : resultVal.improvement || resultVal.value || resultVal.after || '';
                    const note =
                      typeof resultVal === 'object' && resultVal !== null ? resultVal.note : '';

                    return (
                      <div key={key}>
                        <div className="text-3xl sm:text-4xl font-display font-black text-transparent bg-clip-text bg-gradient-to-r from-violet-600 to-cyan-500 dark:from-violet-400 dark:to-cyan-400 mb-1">
                          {display}
                        </div>
                        <div className="text-slate-900 dark:text-white text-sm font-semibold">
                          {key}
                        </div>
                        {note && <div className="text-slate-500 text-xs mt-0.5">{note}</div>}
                      </div>
                    );
                  })}
                </div>
              </div>
            )}

            {/* Tech Stack */}
            {project.techStack && project.techStack.length > 0 && (
              <div className="p-6 rounded-2xl bg-white dark:bg-white/[0.02] border border-slate-200 dark:border-white/5 shadow-sm dark:shadow-none">
                <h3 className="text-lg font-bold mb-4 border-b border-slate-200 dark:border-white/10 pb-3 text-slate-900 dark:text-white">
                  Technologies Used
                </h3>
                <div className="flex flex-wrap gap-2">
                  {project.techStack.map((tech) => (
                    <span
                      key={tech}
                      className="px-3 py-1.5 bg-slate-100 dark:bg-white/5 border border-slate-200 dark:border-white/10 rounded-lg text-xs font-medium text-slate-700 dark:text-slate-300"
                    >
                      {tech}
                    </span>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </section>

      {/* Gallery Showcase */}
      {project.gallery && project.gallery.length > 0 && (
        <section className="px-6 md:px-12 max-w-7xl mx-auto mb-32">
          <div className="mb-8">
            <span className="text-xs font-semibold uppercase tracking-[0.2em] text-cyan-600 dark:text-cyan-400 mb-2 block">
              Visual Showcase
            </span>
            <h2 className="text-2xl md:text-3xl font-display font-bold text-slate-900 dark:text-white">
              Interface & Systems Overview
            </h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {project.gallery.slice(0, 2).map((imgUrl: string, idx: number) => (
              <div
                key={idx}
                className="relative aspect-[4/3] rounded-3xl overflow-hidden border border-slate-200 dark:border-white/10 bg-slate-900 group shadow-xl"
              >
                <Image
                  src={imgUrl}
                  alt={`${project.title} interface preview ${idx + 1}`}
                  fill
                  className="object-cover group-hover:scale-105 transition-transform duration-700"
                  sizes="(max-width: 768px) 100vw, 50vw"
                  unoptimized={isUnoptimizedImageSrc(imgUrl)}
                />
              </div>
            ))}
            {project.gallery[2] && (
              <div className="md:col-span-2 relative aspect-[16/9] md:aspect-[21/9] rounded-3xl overflow-hidden border border-slate-200 dark:border-white/10 bg-slate-900 group shadow-xl">
                <Image
                  src={project.gallery[2]}
                  alt={`${project.title} complete architecture showcase`}
                  fill
                  className="object-cover group-hover:scale-105 transition-transform duration-700"
                  sizes="100vw"
                  unoptimized={isUnoptimizedImageSrc(project.gallery[2])}
                />
              </div>
            )}
          </div>
        </section>
      )}

      {/* Next Project Footer */}
      {nextProj && (
        <Link href={`/portfolio/${nextProj.slug}`} className="dark-card-overlay block group">
          <div
            className="w-full py-24 md:py-32 relative overflow-hidden bg-[#0B0D14] border-t border-white/10"
            style={{
              background: (nextProj as { coverGradient?: string }).coverGradient?.startsWith(
                'linear-gradient'
              )
                ? (nextProj as { coverGradient?: string }).coverGradient
                : 'linear-gradient(135deg, #11998e 0%, #38ef7d 100%)',
            }}
          >
            <div className="absolute inset-0 bg-black/75 group-hover:bg-black/55 transition-colors duration-500" />
            <div className="relative z-10 px-6 md:px-12 max-w-7xl mx-auto text-center flex flex-col items-center">
              <span className="text-sm font-semibold uppercase tracking-widest text-cyan-300 mb-4">
                Next Project
              </span>
              <h2 className="text-4xl md:text-6xl font-display font-bold mb-8 group-hover:scale-105 transition-transform duration-500 text-white">
                {nextProj.title}
              </h2>
              <div className="w-16 h-16 rounded-full bg-white text-black flex items-center justify-center transform group-hover:translate-x-2 transition-transform duration-300 shadow-xl">
                <ArrowRight className="w-6 h-6" />
              </div>
            </div>
          </div>
        </Link>
      )}
    </div>
  );
}
