// 
'use client';
import { motion } from 'framer-motion';
import Link from 'next/link';
import { SERVICES_DATA as services } from '@/lib/data/services';
import { ArrowRight } from 'lucide-react';

export default function ServicesPage() {
  return (
    <main className="min-h-screen bg-[#05060A] text-white pt-32 pb-24">
      {/* Hero */}
      <section className="px-6 md:px-12 max-w-7xl mx-auto text-center mb-24">
        <motion.h1 
          className="text-5xl md:text-7xl font-display font-bold mb-6 tracking-tight"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          What We <span className="text-transparent bg-clip-text bg-gradient-to-r from-violet-400 to-cyan-400">Build</span>
        </motion.h1>
        <motion.p 
          className="text-xl text-slate-400 max-w-2xl mx-auto"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.1 }}
        >
          Comprehensive engineering and design solutions to take your digital products from concept to scale.
        </motion.p>
      </section>

      {/* Services Grid */}
      <section className="px-6 md:px-12 max-w-7xl mx-auto mb-32">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {services.map((service, index) => {
            const Icon = service.icon;
            return (
              <motion.div
                key={service.slug}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
              >
                <Link 
                  href={`/services/${service.slug}`}
                  className="group block h-full p-8 rounded-3xl bg-[#0B0D14] border border-white/5 hover:border-violet-500/50 hover:bg-white/5 transition-all duration-300 relative overflow-hidden"
                >
                  <div className="absolute top-0 right-0 w-64 h-64 bg-gradient-to-br from-violet-500/10 to-transparent rounded-full blur-3xl opacity-0 group-hover:opacity-100 transition-opacity" />
                  
                  <div className="w-14 h-14 bg-white/5 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300">
                    {/* @ts-ignore */}
                    <Icon className="w-7 h-7 text-cyan-400" />
                  </div>
                  
                  <h3 className="text-2xl font-display font-bold mb-3">{service.title}</h3>
                  <p className="text-slate-400 mb-6 text-sm">{service.tagline}</p>
                  
                  <ul className="space-y-2 mb-8 text-sm text-slate-500">
                    {service.deliverables.slice(0, 3).map((item, i) => (
                      <li key={i} className="flex items-center gap-2">
                        <div className="w-1 h-1 bg-violet-400 rounded-full" />
                        {item}
                      </li>
                    ))}
                  </ul>

                  <div className="flex items-center text-sm font-medium text-violet-400 group-hover:text-cyan-400 transition-colors mt-auto">
                    Learn More <ArrowRight className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" />
                  </div>
                </Link>
              </motion.div>
            );
          })}
        </div>
      </section>

      {/* CTA */}
      <section className="px-6 md:px-12 max-w-4xl mx-auto text-center border-t border-white/10 pt-24">
        <h2 className="text-3xl font-display font-bold mb-6">Not sure what you need?</h2>
        <p className="text-slate-400 mb-8 max-w-xl mx-auto">Our technical strategists can help you identify the right architecture and approach for your specific business goals.</p>
        <Link 
          href="/contact" 
          className="inline-flex px-8 py-4 bg-white text-black font-medium rounded-full hover:bg-slate-200 transition-colors"
        >
          Let's talk architecture
        </Link>
      </section>
    </main>
  );
}
