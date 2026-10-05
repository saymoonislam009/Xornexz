import { buildMetadata, buildBreadcrumbSchema } from '@/lib/seo';
import { PROJECTS_DATA as projects } from '@/lib/data/projects';
import { notFound } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';
import { ArrowLeft, ExternalLink, ArrowRight } from 'lucide-react';
import type { Metadata } from 'next';

import { prisma } from '@/lib/db';
import { ensureContentSeeded } from '@/lib/content';

export const dynamicParams = true;
export const dynamic = 'force-dynamic';

async function getProject(slug: string) {
  const staticFallback = projects.find((p) => p.slug === slug);
  try {
    await ensureContentSeeded();
    const dbProject = await prisma.project.findUnique({
      where: { slug },
      include: { testimonial: true },
    });
    if (dbProject && dbProject.status === 'PUBLISHED') {
      const hasRealCover =
        dbProject.coverImage &&
        dbProject.coverImage.trim() !== '' &&
        !dbProject.coverImage.startsWith('linear-gradient');

      const coverImage = hasRealCover
        ? dbProject.coverImage
        : (staticFallback?.coverImage || 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?auto=format&fit=crop&q=80&w=2070');

      const gallery =
        dbProject.gallery && dbProject.gallery.length > 0
          ? dbProject.gallery
          : (staticFallback?.gallery || []);

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
        tags: dbProject.tags && dbProject.tags.length > 0 ? dbProject.tags : (staticFallback?.tags || ['Web Development']),
        techStack: dbProject.techStack && dbProject.techStack.length > 0 ? dbProject.techStack : (staticFallback?.techStack || ['Next.js', 'TypeScript', 'TailwindCSS']),
        coverGradient: staticFallback?.coverGradient || 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
        coverImage,
        gallery,
        year: String((dbProject.publishedAt ?? dbProject.createdAt).getFullYear()),
        results: (dbProject.metrics as any) || staticFallback?.results || {
          'Performance': { value: '99.9%', note: 'Uptime SLA' },
          'Conversion': { value: '+45%', note: 'Increase in qualified leads' },
        },
        testimonial: dbProject.testimonial ? {
          name: dbProject.testimonial.name,
          title: dbProject.testimonial.title,
          company: dbProject.testimonial.company,
          content: dbProject.testimonial.content,
          rating: dbProject.testimonial.rating,
        } : (staticFallback?.testimonial || null),
      };
    }
  } catch {
    // Database query failed, fallback to static
  }

  return staticFallback ? { ...staticFallback, liveUrl: staticFallback.liveUrl || null } : null;
}

export async function generateMetadata(
  { params }: { params: Promise<{ slug: string }> }
): Promise<Metadata> {
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

export default async function CaseStudyPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const project = await getProject(slug);
  
  if (!project) notFound();

  const nextProj = projects.find(p => p.slug !== project.slug) || projects[0];

  return (
    <main className="bg-[#05060A] text-white pt-28 pb-0">
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
        <Link href="/portfolio" className="inline-flex items-center text-sm font-medium text-slate-400 hover:text-white mb-8 transition-colors">
          <ArrowLeft className="w-4 h-4 mr-2" /> Back to Portfolio
        </Link>
        
        <div className="grid md:grid-cols-2 gap-10 items-end">
          <div>
            <div className="inline-block px-4 py-1.5 bg-white/5 border border-white/10 rounded-full text-xs font-semibold uppercase tracking-wider text-cyan-400 mb-5">
              {project.category}
            </div>
            <h1 className="text-4xl sm:text-5xl md:text-7xl font-display font-bold tracking-tight mb-5 leading-tight">
              {project.title}
            </h1>
            <p className="text-lg md:text-2xl text-slate-300 font-light leading-relaxed">
              {project.tagline}
            </p>
          </div>
          
          <div className="flex flex-col md:items-end gap-6 pb-2">
            <div className="grid grid-cols-2 gap-8 text-left md:text-right">
              <div>
                <div className="text-slate-500 text-xs uppercase tracking-wider mb-1">Client</div>
                <div className="font-semibold text-lg text-white">{project.client}</div>
              </div>
              <div>
                <div className="text-slate-500 text-xs uppercase tracking-wider mb-1">Timeline</div>
                <div className="font-semibold text-lg text-white">2023 - 2024</div>
              </div>
            </div>
            {project.liveUrl ? (
              <a
                href={project.liveUrl}
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center gap-2 px-6 py-3 bg-white text-black font-semibold rounded-full hover:bg-slate-200 transition-colors shadow-lg shadow-white/10"
              >
                Visit Live Site <ExternalLink className="w-4 h-4" />
              </a>
            ) : (
              <Link
                href="/contact"
                className="inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-violet-600 to-cyan-500 text-white font-semibold rounded-full hover:shadow-[0_0_20px_rgba(124,58,237,0.4)] transition-all"
              >
                Discuss Similar Project <ArrowRight className="w-4 h-4" />
              </Link>
            )}
          </div>
        </div>
      </section>

      {/* Massive Cover Visual */}
      <section className="px-6 md:px-12 max-w-7xl mx-auto mb-24">
        <div className="relative w-full h-[45vh] sm:h-[55vh] md:h-[68vh] rounded-3xl overflow-hidden border border-white/10 shadow-2xl bg-[#0B0D14]">
          {project.coverImage ? (
            <Image
              src={project.coverImage}
              alt={project.title}
              fill
              priority
              className="object-cover"
              sizes="100vw"
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
              <div className="text-center">
                <span className="text-sm font-semibold uppercase tracking-widest text-cyan-300 mb-2 block">{project.category}</span>
                <h2 className="text-4xl md:text-6xl font-display font-bold text-white">{project.title}</h2>
              </div>
            </div>
          )}
          <div className="absolute inset-0 bg-gradient-to-t from-[#05060A]/80 via-transparent to-transparent pointer-events-none" />
        </div>
      </section>

      {/* Content Columns */}
      <section className="px-6 md:px-12 max-w-7xl mx-auto mb-24">
        <div className="grid md:grid-cols-12 gap-12 lg:gap-16">
          
          {/* Main Body */}
          <div className="md:col-span-8 space-y-12">
            <div>
              <h2 className="text-2xl sm:text-3xl font-display font-bold mb-4 text-white">The Challenge</h2>
              <p className="text-base sm:text-lg text-slate-300 leading-relaxed font-light">
                {project.challenge}
              </p>
            </div>
            
            <div>
              <h2 className="text-2xl sm:text-3xl font-display font-bold mb-4 text-white">Our Solution</h2>
              <p className="text-base sm:text-lg text-slate-300 leading-relaxed font-light">
                {project.solution}
              </p>
            </div>

            {/* Testimonial Quote */}
            {project.testimonial && (
              <div className="bg-[#0B0D14] border border-white/10 rounded-3xl p-8 sm:p-10 relative overflow-hidden">
                <div className="absolute top-0 left-0 w-2 h-full bg-gradient-to-b from-violet-500 to-cyan-500" />
                <p className="text-xl sm:text-2xl font-light italic text-slate-200 leading-relaxed mb-6">
                  &ldquo;{project.testimonial.content}&rdquo;
                </p>
                <div>
                  <div className="font-bold text-base text-white">{project.testimonial.name}</div>
                  <div className="text-slate-400 text-sm">{project.testimonial.title} — {project.testimonial.company}</div>
                </div>
              </div>
            )}
          </div>

          {/* Sidebar */}
          <div className="md:col-span-4 space-y-10">
            
            {/* Key Results */}
            {project.results && Object.keys(project.results).length > 0 && (
              <div className="p-6 rounded-2xl bg-white/[0.02] border border-white/5">
                <h3 className="text-lg font-bold mb-6 border-b border-white/10 pb-3 text-white">Key Results</h3>
                <div className="space-y-6">
                  {Object.entries(project.results).map(([key, val]) => {
                    const resultVal = val as Record<string, string> | string;
                    const display = typeof resultVal === 'string'
                      ? resultVal
                      : (resultVal as Record<string, string>).improvement || (resultVal as Record<string, string>).value || (resultVal as Record<string, string>).after || '';
                    const note = typeof resultVal === 'object' && resultVal !== null ? (resultVal as Record<string, string>).note : '';

                    return (
                      <div key={key}>
                        <div className="text-3xl sm:text-4xl font-display font-black text-transparent bg-clip-text bg-gradient-to-r from-violet-400 to-cyan-400 mb-1">
                          {display}
                        </div>
                        <div className="text-white text-sm font-semibold">{key}</div>
                        {note && <div className="text-slate-500 text-xs mt-0.5">{note}</div>}
                      </div>
                    );
                  })}
                </div>
              </div>
            )}

            {/* Tech Stack */}
            {project.techStack && project.techStack.length > 0 && (
              <div className="p-6 rounded-2xl bg-white/[0.02] border border-white/5">
                <h3 className="text-lg font-bold mb-4 border-b border-white/10 pb-3 text-white">Technologies Used</h3>
                <div className="flex flex-wrap gap-2">
                  {project.techStack.map(tech => (
                    <span key={tech} className="px-3 py-1.5 bg-white/5 border border-white/10 rounded-lg text-xs font-medium text-slate-300">
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
            <span className="text-xs font-semibold uppercase tracking-[0.2em] text-cyan-400 mb-2 block">Visual Showcase</span>
            <h2 className="text-2xl md:text-3xl font-display font-bold text-white">Interface & Systems Overview</h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {project.gallery.slice(0, 2).map((imgUrl: string, idx: number) => (
              <div key={idx} className="relative aspect-[4/3] rounded-3xl overflow-hidden border border-white/10 bg-[#0E1018] group shadow-xl">
                <Image
                  src={imgUrl}
                  alt={`${project.title} interface preview ${idx + 1}`}
                  fill
                  className="object-cover group-hover:scale-105 transition-transform duration-700"
                  sizes="(max-width: 768px) 100vw, 50vw"
                  unoptimized={imgUrl.startsWith("data:") || imgUrl.startsWith("blob:")}
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent pointer-events-none" />
              </div>
            ))}
            {project.gallery[2] && (
              <div className="md:col-span-2 relative aspect-[16/9] md:aspect-[21/9] rounded-3xl overflow-hidden border border-white/10 bg-[#0E1018] group shadow-xl">
                <Image
                  src={project.gallery[2]}
                  alt={`${project.title} complete architecture showcase`}
                  fill
                  className="object-cover group-hover:scale-105 transition-transform duration-700"
                  sizes="100vw"
                  unoptimized={project.gallery[2].startsWith("data:") || project.gallery[2].startsWith("blob:")}
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent pointer-events-none" />
              </div>
            )}
          </div>
        </section>
      )}

      {/* Next Project Footer */}
      {nextProj && (
        <Link href={`/portfolio/${nextProj.slug}`} className="block group">
          <section
            className="w-full py-24 md:py-32 relative overflow-hidden bg-[#0B0D14] border-t border-white/10"
            style={{
              background: (nextProj as any).coverGradient?.startsWith("linear-gradient")
                ? (nextProj as any).coverGradient
                : "linear-gradient(135deg, #11998e 0%, #38ef7d 100%)",
            }}
          >
            <div className="absolute inset-0 bg-black/75 group-hover:bg-black/55 transition-colors duration-500" />
            <div className="relative z-10 px-6 md:px-12 max-w-7xl mx-auto text-center flex flex-col items-center">
              <span className="text-sm font-semibold uppercase tracking-widest text-cyan-300 mb-4">Next Project</span>
              <h2 className="text-4xl md:text-6xl font-display font-bold mb-8 group-hover:scale-105 transition-transform duration-500 text-white">
                {nextProj.title}
              </h2>
              <div className="w-16 h-16 rounded-full bg-white text-black flex items-center justify-center transform group-hover:translate-x-2 transition-transform duration-300 shadow-xl">
                <ArrowRight className="w-6 h-6" />
              </div>
            </div>
          </section>
        </Link>
      )}
    </main>
  );
}
