'use client';
import { motion } from 'framer-motion';
import { team } from '@/lib/data/team';
import { Zap, Shield, Heart, Lightbulb } from 'lucide-react';
import Link from 'next/link';

const values = [
  { icon: Zap, title: 'Speed of Execution', desc: 'We iterate fast and ship faster without compromising architecture.' },
  { icon: Shield, title: 'Engineering Integrity', desc: 'No shortcuts. We build secure, robust, and scalable systems.' },
  { icon: Heart, title: 'Craftsmanship', desc: 'Every pixel and line of code is written with intent and care.' },
  { icon: Lightbulb, title: 'Radical Innovation', desc: 'We leverage the bleeding edge of tech to solve old problems.' }
];

export default function AboutPage() {
  return (
    <main className="min-h-screen bg-[#05060A] text-white pt-32 pb-0">
      
      {/* Hero */}
      <section className="px-6 md:px-12 max-w-7xl mx-auto text-center mb-32">
        <motion.h1 
          className="text-5xl md:text-8xl font-display font-bold mb-8 tracking-tight"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          We Are <span className="text-transparent bg-clip-text bg-gradient-to-r from-violet-400 to-cyan-400">Xornexz</span>
        </motion.h1>
        <motion.p 
          className="text-xl md:text-2xl text-slate-400 max-w-3xl mx-auto font-light leading-relaxed"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.1 }}
        >
          An elite collective of engineers, designers, and strategists building the next generation of digital infrastructure.
        </motion.p>
      </section>

      {/* Story */}
      <section className="px-6 md:px-12 max-w-4xl mx-auto mb-32">
        <h2 className="text-3xl font-display font-bold mb-8 text-center">Our Mission</h2>
        <div className="prose prose-invert prose-lg mx-auto text-slate-300">
          <p>
            Founded in 2018, Xornexz started with a simple observation: enterprise software was too slow to build and too clunky to use, while startup MVPs were too fragile to scale.
          </p>
          <p>
            We set out to bridge that gap. By combining senior-level engineering talent with award-winning design, we build software that has the architectural rigor of a massive enterprise platform, but the soul and usability of a consumer app.
          </p>
        </div>
      </section>

      {/* Values Grid */}
      <section className="px-6 md:px-12 max-w-7xl mx-auto mb-32">
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
          {values.map((v, i) => {
            const Icon = v.icon;
            return (
              <div key={i} className="bg-[#0B0D14] border border-white/10 rounded-3xl p-8 hover:border-violet-500/50 transition-colors">
                <div className="w-12 h-12 bg-white/5 rounded-2xl flex items-center justify-center mb-6 text-cyan-400">
                  <Icon className="w-6 h-6" />
                </div>
                <h3 className="text-xl font-bold mb-3">{v.title}</h3>
                <p className="text-slate-400 text-sm leading-relaxed">{v.desc}</p>
              </div>
            );
          })}
        </div>
      </section>

      {/* Team */}
      <section className="px-6 md:px-12 max-w-7xl mx-auto mb-32">
        <div className="text-center mb-16">
          <h2 className="text-4xl font-display font-bold mb-4">Leadership Team</h2>
          <p className="text-slate-400">The minds behind the code.</p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {team.map((member, i) => (
            <div key={i} className="group relative overflow-hidden rounded-3xl bg-[#0B0D14] border border-white/10">
              <div className="aspect-square bg-slate-800 relative">
                {/* Image Placeholder if actual images fail */}
                <div className="absolute inset-0 bg-gradient-to-br from-violet-900/50 to-cyan-900/50" />
                <img 
                  src={member.image} 
                  alt={member.name}
                  className="w-full h-full object-cover mix-blend-overlay grayscale group-hover:grayscale-0 transition-all duration-500"
                />
              </div>
              <div className="p-8 relative bg-[#0B0D14] z-10">
                <h3 className="text-2xl font-bold mb-1">{member.name}</h3>
                <div className="text-violet-400 text-sm font-medium mb-4">{member.role}</div>
                <p className="text-slate-400 text-sm leading-relaxed">
                  {member.bio}
                </p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Culture / CTA */}
      <section className="bg-white text-black py-24 md:py-32 rounded-t-[3rem]">
        <div className="px-6 md:px-12 max-w-4xl mx-auto text-center">
          <h2 className="text-4xl md:text-5xl font-display font-bold mb-8">Ready to do the best work of your life?</h2>
          <p className="text-xl text-slate-600 mb-12">
            We are a remote-first, async-friendly team. We value output over hours logged. 
            If you're an exceptional builder, we want to hear from you.
          </p>
          <div className="flex flex-col sm:flex-row justify-center gap-4">
            <Link 
              href="/careers" 
              className="px-8 py-4 bg-black text-white font-medium rounded-full hover:bg-slate-800 transition-colors"
            >
              View Open Roles
            </Link>
            <Link 
              href="/contact" 
              className="px-8 py-4 bg-slate-200 text-black font-medium rounded-full hover:bg-slate-300 transition-colors"
            >
              Start a Project
            </Link>
          </div>
        </div>
      </section>
    </main>
  );
}
