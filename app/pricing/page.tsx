'use client';
import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { CheckCircle2, ChevronDown, Rocket, Users, Wrench } from 'lucide-react';
import Link from 'next/link';

const plans = [
  {
    name: 'Fixed Scope',
    description: 'Best for defined projects with clear deliverables.',
    icon: Rocket,
    price: 'From $15,000',
    timeline: '4-12 weeks',
    features: ['Defined deliverables', 'Fixed timeline & budget', 'Weekly progress updates', 'Dedicated project manager', '30-day post-launch support'],
    recommended: false,
  },
  {
    name: 'Dedicated Team',
    description: 'Best for ongoing product development and scaling.',
    icon: Users,
    price: 'From $8,000/mo',
    timeline: 'Ongoing',
    features: ['Full-time dedicated developers', 'Flexible priority shifting', 'Direct communication channel', 'Integrated with your team', 'Scalable team size'],
    recommended: true,
  },
  {
    name: 'Monthly Retainer',
    description: 'Best for maintenance, support, and incremental features.',
    icon: Wrench,
    price: 'From $3,000/mo',
    timeline: 'Ongoing',
    features: ['Guaranteed monthly hours', 'Priority bug fixing', 'Security & dependency updates', 'Uptime monitoring', 'Monthly strategy calls'],
    recommended: false,
  }
];

const faqs = [
  { question: 'How do you estimate fixed scope projects?', answer: 'We start with a thorough discovery phase to map out all requirements, edge cases, and technical constraints. Based on this blueprint, we provide a detailed proposal with a fixed cost and timeline.' },
  { question: 'Can we switch from a Fixed Scope to a Dedicated Team later?', answer: 'Absolutely. Many of our clients start with a fixed-scope MVP and transition to a dedicated team model for ongoing feature development once the product finds market fit.' },
  { question: 'What happens if we don\'t use all our retainer hours?', answer: 'Retainer hours roll over for one consecutive month. This ensures you get full value while providing flexibility during slower periods.' },
  { question: 'Do you charge for discovery phases?', answer: 'For smaller projects, discovery is often complimentary. For complex enterprise applications requiring weeks of architectural planning, we structure discovery as a standalone, paid engagement.' }
];

export default function PricingPage() {
  const [openFaq, setOpenFaq] = useState<number | null>(null);

  return (
    <main className="min-h-screen bg-[#05060A] text-white pt-32 pb-24">
      {/* Hero Section */}
      <section className="px-6 md:px-12 max-w-7xl mx-auto text-center mb-24">
        <motion.h1 
          className="text-4xl md:text-6xl font-display font-bold mb-6 tracking-tight"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          Transparent <span className="text-transparent bg-clip-text bg-gradient-to-r from-violet-400 to-cyan-400">Engagement Models</span>
        </motion.h1>
        <motion.p 
          className="text-lg text-slate-400 max-w-2xl mx-auto"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.1 }}
        >
          We don't do hidden fees or surprise invoices. Choose the model that best fits your project lifecycle and team needs.
        </motion.p>
      </section>

      {/* Pricing Cards */}
      <section className="px-6 md:px-12 max-w-7xl mx-auto mb-32">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {plans.map((plan, index) => {
            const Icon = plan.icon;
            return (
              <motion.div
                key={plan.name}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.2 + index * 0.1 }}
                className={`relative rounded-3xl p-8 border ${plan.recommended ? 'bg-gradient-to-b from-[#1a1c29] to-[#0B0D14] border-violet-500/50' : 'bg-[#0B0D14] border-white/10'}`}
              >
                {plan.recommended && (
                  <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-gradient-to-r from-violet-500 to-cyan-500 text-white text-xs font-bold px-4 py-1 rounded-full uppercase tracking-wider">
                    Recommended
                  </div>
                )}
                
                <Icon className={`w-12 h-12 mb-6 ${plan.recommended ? 'text-cyan-400' : 'text-slate-400'}`} />
                <h3 className="text-2xl font-display font-semibold mb-2">{plan.name}</h3>
                <p className="text-slate-400 text-sm mb-6 h-10">{plan.description}</p>
                
                <div className="mb-8">
                  <div className="text-3xl font-bold">{plan.price}</div>
                  <div className="text-slate-500 text-sm mt-1">Timeline: {plan.timeline}</div>
                </div>

                <ul className="space-y-4 mb-8">
                  {plan.features.map(feature => (
                    <li key={feature} className="flex items-start">
                      <CheckCircle2 className="w-5 h-5 text-violet-400 shrink-0 mr-3 mt-0.5" />
                      <span className="text-slate-300 text-sm">{feature}</span>
                    </li>
                  ))}
                </ul>

                <Link 
                  href="/contact"
                  className={`block w-full py-4 text-center rounded-xl font-medium transition-colors ${plan.recommended ? 'bg-white text-black hover:bg-slate-200' : 'bg-white/5 text-white hover:bg-white/10'}`}
                >
                  Get Started
                </Link>
              </motion.div>
            );
          })}
        </div>
      </section>

      {/* FAQ Section */}
      <section className="px-6 md:px-12 max-w-3xl mx-auto mb-24">
        <h2 className="text-3xl font-display font-bold text-center mb-12">Not sure which fits?</h2>
        
        <div className="space-y-4">
          {faqs.map((faq, i) => (
            <div key={i} className="border border-white/10 rounded-2xl bg-[#0B0D14] overflow-hidden">
              <button 
                className="w-full flex items-center justify-between p-6 text-left"
                onClick={() => setOpenFaq(openFaq === i ? null : i)}
              >
                <span className="font-medium text-lg">{faq.question}</span>
                <ChevronDown className={`w-5 h-5 text-slate-400 transition-transform ${openFaq === i ? 'rotate-180' : ''}`} />
              </button>
              <AnimatePresence>
                {openFaq === i && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: 'auto', opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    className="overflow-hidden"
                  >
                    <div className="p-6 pt-0 text-slate-400 border-t border-white/5">
                      {faq.answer}
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          ))}
        </div>
      </section>

      {/* CTA */}
      <section className="px-6 md:px-12 max-w-4xl mx-auto text-center">
        <div className="bg-gradient-to-r from-violet-900/50 to-cyan-900/50 p-12 rounded-3xl border border-white/10 backdrop-blur-sm">
          <h2 className="text-3xl font-display font-bold mb-4">Ready to discuss your project?</h2>
          <p className="text-slate-300 mb-8 max-w-xl mx-auto">Get a tailored estimate based on your specific requirements within 24 hours.</p>
          <Link 
            href="/contact" 
            className="inline-block px-8 py-4 bg-white text-black font-medium rounded-full hover:bg-slate-200 transition-colors"
          >
            Project Estimator →
          </Link>
        </div>
      </section>
    </main>
  );
}
