// 
import { PROJECTS_DATA as projects } from '@/lib/data/projects';
import { notFound } from 'next/navigation';
import Link from 'next/link';
import { ArrowLeft, ExternalLink, ArrowRight } from 'lucide-react';
import type { Metadata } from 'next';

export function generateStaticParams() {
  return projects.map((project) => ({
    slug: project.slug,
  }));
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const project = projects.find((p) => p.slug === slug);
  if (!project) return { title: 'Project Not Found' };
  
  return {
    title: `${project.title} | Case Study`,
    description: project.description,
  };
}

export default async function CaseStudyPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const project = projects.find((p) => p.slug === slug);
  
  if (!project) notFound();

  const nextProj = projects.find(p => p.slug === (project as any).nextProject);

  return (
    <main className="bg-[#05060A] text-white pt-24 pb-0">
      
      {/* Hero */}
      <section className="px-6 md:px-12 max-w-7xl mx-auto mb-16 pt-8">
        <Link href="/portfolio" className="inline-flex items-center text-sm font-medium text-slate-400 hover:text-white mb-12 transition-colors">
          <ArrowLeft className="w-4 h-4 mr-2" /> Back to Portfolio
        </Link>
        
        <div className="grid md:grid-cols-2 gap-12 items-end">
          <div>
            <div className="inline-block px-4 py-1.5 bg-white/5 border border-white/10 rounded-full text-xs font-medium uppercase tracking-wider text-cyan-400 mb-6">
              {project.category}
            </div>
            <h1 className="text-5xl md:text-7xl font-display font-bold tracking-tight mb-6">
              {project.title}
            </h1>
            <p className="text-xl md:text-2xl text-slate-300 font-light">
              {project.tagline}
            </p>
          </div>
          
          <div className="flex flex-col md:items-end gap-6 pb-2">
            <div className="grid grid-cols-2 gap-8 text-left md:text-right">
              <div>
                <div className="text-slate-500 text-sm mb-1">Client</div>
                <div className="font-medium text-lg">{project.client}</div>
              </div>
              <div>
                <div className="text-slate-500 text-sm mb-1">Timeline</div>
                <div className="font-medium text-lg">2023 - 2024</div>
              </div>
            </div>
            <a href="#" className="inline-flex items-center gap-2 px-6 py-3 bg-white text-black font-medium rounded-full hover:bg-slate-200 transition-colors">
              Visit Live Site <ExternalLink className="w-4 h-4" />
            </a>
          </div>
        </div>
      </section>

      {/* Massive Cover */}
      <section className="w-full mb-24">
        <div className={`w-full h-[50vh] md:h-[70vh] bg-gradient-to-br ${project.coverGradient}`} />
      </section>

      {/* Content Columns */}
      <section className="px-6 md:px-12 max-w-7xl mx-auto mb-32">
        <div className="grid md:grid-cols-12 gap-16">
          
          {/* Main Body */}
          <div className="md:col-span-8 space-y-16">
            <div>
              <h2 className="text-3xl font-display font-bold mb-6">The Challenge</h2>
              <p className="text-lg text-slate-300 leading-relaxed">
                {project.challenge}
              </p>
            </div>
            
            <div>
              <h2 className="text-3xl font-display font-bold mb-6">Our Solution</h2>
              <p className="text-lg text-slate-300 leading-relaxed">
                {project.solution}
              </p>
            </div>

            {/* Quote */}
            <div className="bg-[#0B0D14] border border-white/10 rounded-3xl p-10 mt-12 relative overflow-hidden">
              <div className="absolute top-0 left-0 w-2 h-full bg-gradient-to-b from-violet-500 to-cyan-500" />
              <p className="text-2xl font-light italic text-slate-200 leading-relaxed mb-8">
                "{project.testimonial.content}"
              </p>
              <div>
                <div className="font-bold text-lg">{project.testimonial.name}</div>
                <div className="text-slate-500">{project.testimonial.title}</div>
              </div>
            </div>
          </div>

          {/* Sidebar */}
          <div className="md:col-span-4 space-y-12">
            
            <div>
              <h3 className="text-xl font-bold mb-6 border-b border-white/10 pb-4">Key Results</h3>
              <div className="space-y-6">
                {Object.entries(project.results).map(([key, val]) => {
                  const resultVal = val as Record<string, string> | string;
                  const display = typeof resultVal === 'string'
                    ? resultVal
                    : (resultVal as Record<string, string>).improvement || (resultVal as Record<string, string>).value || (resultVal as Record<string, string>).after || '';
                  return (
                    <div key={key}>
                      <div className="text-4xl font-display font-bold text-transparent bg-clip-text bg-gradient-to-r from-violet-400 to-cyan-400 mb-1">
                        {display}
                      </div>
                      <div className="text-slate-400 text-sm uppercase tracking-wider">{key}</div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Tech Stack */}
            <div>
              <h3 className="text-xl font-bold mb-6 border-b border-white/10 pb-4">Tech Stack</h3>
              <div className="flex flex-wrap gap-2">
                {project.techStack.map(tech => (
                  <span key={tech} className="px-3 py-1.5 bg-white/5 border border-white/10 rounded-lg text-sm">
                    {tech}
                  </span>
                ))}
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* Gallery (Placeholders) */}
      <section className="px-6 md:px-12 max-w-7xl mx-auto mb-32">
        <div className="grid grid-cols-2 gap-6">
          <div className="aspect-[4/3] rounded-3xl bg-slate-900 border border-white/5" />
          <div className="aspect-[4/3] rounded-3xl bg-slate-800 border border-white/5" />
          <div className="col-span-2 aspect-video rounded-3xl bg-slate-900 border border-white/5" />
        </div>
      </section>

      {/* Next Project Footer */}
      {nextProj && (
        <Link href={`/portfolio/${nextProj.slug}`} className="block group">
          <section className={`w-full py-24 md:py-32 bg-gradient-to-br ${(nextProj as any).coverGradient} relative overflow-hidden`}>
            <div className="absolute inset-0 bg-black/60 group-hover:bg-black/40 transition-colors duration-500" />
            <div className="relative z-10 px-6 md:px-12 max-w-7xl mx-auto text-center flex flex-col items-center">
              <span className="text-sm font-medium uppercase tracking-widest text-white/70 mb-4">Next Project</span>
              <h2 className="text-5xl md:text-7xl font-display font-bold mb-8 group-hover:scale-105 transition-transform duration-500">
                {nextProj.title}
              </h2>
              <div className="w-16 h-16 rounded-full bg-white text-black flex items-center justify-center transform group-hover:translate-x-2 transition-transform duration-300">
                <ArrowRight className="w-6 h-6" />
              </div>
            </div>
          </section>
        </Link>
      )}
    </main>
  );
}
