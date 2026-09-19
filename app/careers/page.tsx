import Link from 'next/link';
import { jobs } from '@/lib/data/jobs';

export const metadata = {
  title: 'Careers | Xornexz',
  description: 'Join our team and help us build the future.',
};

export default function CareersPage() {
  return (
    <div className="min-h-screen bg-[#05060A] text-white font-inter pb-20">
      {/* Hero Section */}
      <section className="relative pt-32 pb-20 px-6 max-w-7xl mx-auto text-center">
        <div className="absolute inset-0 bg-gradient-to-b from-[#7C3AED]/20 to-transparent pointer-events-none" />
        <h1 className="text-5xl md:text-7xl font-space font-bold mb-6 tracking-tight">
          Shape the <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#7C3AED] to-[#06B6D4]">Future</span> With Us
        </h1>
        <p className="text-lg md:text-xl text-gray-400 max-w-2xl mx-auto mb-10">
          We're a team of passionate builders, creators, and innovators. Come do the best work of your life.
        </p>
      </section>

      {/* Culture & Benefits */}
      <section className="py-20 px-6 max-w-7xl mx-auto">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-space font-bold mb-4">Why Xornexz?</h2>
          <p className="text-gray-400 max-w-2xl mx-auto">We offer more than just a job. We offer an environment where you can thrive.</p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {[
            { title: "Remote-First", desc: "Work from anywhere in the world. We value output over face time." },
            { title: "Health & Wellness", desc: "Comprehensive health coverage and wellness stipends for a healthy life." },
            { title: "Continuous Learning", desc: "Annual budget for courses, books, and conferences to keep you growing." },
          ].map((benefit, i) => (
            <div key={i} className="p-6 rounded-2xl bg-white/5 border border-white/10 backdrop-blur-sm">
              <div className="w-12 h-12 rounded-full bg-gradient-to-br from-[#7C3AED] to-[#06B6D4] flex items-center justify-center mb-6" />
              <h3 className="text-xl font-space font-bold mb-3">{benefit.title}</h3>
              <p className="text-gray-400">{benefit.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Open Positions */}
      <section className="py-20 px-6 max-w-4xl mx-auto" id="open-roles">
        <h2 className="text-3xl md:text-4xl font-space font-bold mb-10 text-center">Open Positions</h2>
        <div className="space-y-4">
          {jobs.map((job) => (
            <Link 
              href={`/careers/${job.slug}`} 
              key={job.id}
              className="block p-6 rounded-xl bg-white/5 border border-white/10 hover:border-[#7C3AED]/50 hover:bg-white/10 transition-all group"
            >
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                  <h3 className="text-xl font-space font-bold group-hover:text-[#06B6D4] transition-colors">{job.title}</h3>
                  <div className="flex flex-wrap gap-3 mt-2 text-sm text-gray-400">
                    <span>{job.department}</span>
                    <span>&bull;</span>
                    <span>{job.location}</span>
                    <span>&bull;</span>
                    <span>{job.type}</span>
                  </div>
                </div>
                <div className="shrink-0">
                  <span className="inline-flex items-center justify-center px-4 py-2 rounded-full bg-[#7C3AED]/20 text-[#7C3AED] text-sm font-medium">
                    Apply Now
                  </span>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </section>
    </div>
  );
}
