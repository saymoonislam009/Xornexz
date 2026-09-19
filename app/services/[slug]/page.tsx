// 
import { SERVICES_DATA as services } from '@/lib/data/services';
import { PROJECTS_DATA as projects } from '@/lib/data/projects';
import { notFound } from 'next/navigation';
import Link from 'next/link';
import { 
  CheckCircle2, 
  ArrowRight,
  Globe, 
  Smartphone, 
  Cloud, 
  Layers, 
  Cpu, 
  Plug, 
  Code,
  type LucideIcon 
} from 'lucide-react';
import type { Metadata } from 'next';

const iconMap: Record<string, LucideIcon> = {
  Globe,
  Smartphone,
  Cloud,
  Layers,
  Cpu,
  Plug,
  Code,
};

export function generateStaticParams() {
  return services.map((service) => ({
    slug: service.slug,
  }));
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const service = services.find((s) => s.slug === slug);
  if (!service) return { title: 'Service Not Found' };
  
  return {
    title: `${service.title} | Xornexz`,
    description: service.description,
  };
}

export default async function ServiceDetailPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const service = services.find((s) => s.slug === slug);
  
  if (!service) {
    notFound();
  }

  const Icon = iconMap[service.icon] || Globe;
  // Get a few sample projects related to this service
  const relatedProjects = projects.slice(0, 2);

  return (
    <main className="min-h-screen bg-[#05060A] text-white pt-32 pb-24">
      {/* Hero */}
      <section className="px-6 md:px-12 max-w-5xl mx-auto mb-24">
        <div className="w-20 h-20 bg-gradient-to-br from-violet-500/20 to-cyan-500/20 rounded-3xl flex items-center justify-center mb-8 border border-white/10">
          <Icon className="w-10 h-10 text-cyan-400" />
        </div>
        <h1 className="text-4xl md:text-6xl font-display font-bold mb-6 tracking-tight">
          {service.title}
        </h1>
        <p className="text-xl md:text-2xl text-slate-400 font-light mb-8 max-w-3xl">
          {service.tagline}
        </p>
        <p className="text-lg text-slate-300 leading-relaxed max-w-3xl">
          {service.description}
        </p>
      </section>

      {/* Grid Content */}
      <section className="px-6 md:px-12 max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-16 mb-32">
        
        {/* Left Column */}
        <div className="lg:col-span-7 space-y-16">
          {/* Deliverables */}
          <div>
            <h2 className="text-3xl font-display font-bold mb-8">What's Included</h2>
            <div className="grid sm:grid-cols-2 gap-4">
              {service.deliverables.map((item, i) => (
                <div key={i} className="flex items-start bg-[#0B0D14] p-4 rounded-xl border border-white/5">
                  <CheckCircle2 className="w-5 h-5 text-violet-400 shrink-0 mr-3 mt-0.5" />
                  <span className="font-medium">{item}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Process */}
          <div>
            <h2 className="text-3xl font-display font-bold mb-8">Our Process</h2>
            <div className="space-y-6">
              {service.processSteps.map((step, i) => (
                <div key={i} className="flex gap-6 relative">
                  {i !== service.processSteps.length - 1 && (
                    <div className="absolute left-[19px] top-10 bottom-[-24px] w-px bg-white/10" />
                  )}
                  <div className="w-10 h-10 rounded-full bg-[#0B0D14] border border-white/10 flex items-center justify-center shrink-0 z-10 text-sm font-bold">
                    {i + 1}
                  </div>
                  <div className="pt-2 pb-6">
                    <h3 className="text-xl font-bold mb-2">{step.title}</h3>
                    <p className="text-slate-400">{step.description}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Right Column (Sidebar) */}
        <div className="lg:col-span-5 space-y-10">
          
          {/* Tech Stack */}
          <div className="bg-[#0B0D14] rounded-3xl p-8 border border-white/10">
            <h3 className="text-xl font-bold mb-6">Technologies Used</h3>
            <div className="flex flex-wrap gap-3">
              {service.techStack.map((tech, i) => (
                <span key={i} className="px-4 py-2 bg-white/5 rounded-full text-sm font-medium border border-white/5">
                  {tech}
                </span>
              ))}
            </div>
          </div>

          {/* Pricing Box */}
          <div className="bg-gradient-to-br from-violet-900/40 to-[#0B0D14] rounded-3xl p-8 border border-violet-500/20">
            <h3 className="text-xl font-bold mb-2">Project Investment</h3>
            <p className="text-slate-400 text-sm mb-6">We don't offer one-size-fits-all pricing. Every architecture is tailored.</p>
            <div className="text-3xl font-display font-bold mb-8">
              Starting at {service.startingPrice}
            </div>
            <Link 
              href="/contact"
              className="block w-full py-4 text-center bg-white text-black font-medium rounded-xl hover:bg-slate-200 transition-colors"
            >
              Request a Custom Quote
            </Link>
          </div>

        </div>
      </section>

      {/* Related Work */}
      <section className="px-6 md:px-12 max-w-7xl mx-auto mb-24 border-t border-white/10 pt-24">
        <div className="flex justify-between items-end mb-10">
          <h2 className="text-3xl font-display font-bold">Related Case Studies</h2>
          <Link href="/portfolio" className="text-sm font-medium text-violet-400 hover:text-cyan-400 transition-colors flex items-center">
            View all <ArrowRight className="w-4 h-4 ml-1" />
          </Link>
        </div>
        
        <div className="grid md:grid-cols-2 gap-8">
          {relatedProjects.map((project) => (
            <Link key={project.slug} href={`/portfolio/${project.slug}`} className="group block">
              <div className={`w-full aspect-[4/3] rounded-2xl mb-6 bg-gradient-to-br ${project.coverGradient} overflow-hidden relative`}>
                <div className="absolute inset-0 bg-black/20 opacity-0 group-hover:opacity-100 transition-opacity" />
              </div>
              <h3 className="text-2xl font-bold mb-2">{project.title}</h3>
              <p className="text-slate-400">{project.tagline}</p>
            </Link>
          ))}
        </div>
      </section>

      {/* Bottom CTA */}
      <section className="px-6 md:px-12 max-w-4xl mx-auto text-center bg-[#0B0D14] rounded-3xl p-16 border border-white/10">
        <h2 className="text-3xl font-display font-bold mb-6">Ready to transform your ideas into robust software?</h2>
        <Link 
          href="/contact" 
          className="inline-flex px-8 py-4 bg-white text-black font-medium rounded-full hover:bg-slate-200 transition-colors"
        >
          Start a Project
        </Link>
      </section>
    </main>
  );
}
