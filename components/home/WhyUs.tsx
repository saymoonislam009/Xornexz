"use client";

import { motion } from "framer-motion";
import { Zap, Shield, GitBranch, Headphones, Target, TrendingUp } from "lucide-react";

const advantages = [
  {
    icon: Zap,
    title: "Delivery in Weeks, Not Months",
    description: "Our battle-tested sprint framework cuts average project delivery time by 40%. You ship faster, validate sooner, and outpace your competition.",
    stat: "40%",
    statLabel: "faster delivery",
    color: "from-amber-500 to-orange-500",
  },
  {
    icon: Shield,
    title: "Enterprise-Grade Security",
    description: "Every product we ship is hardened with OWASP standards, regular penetration testing, and SOC 2-ready architecture from day one.",
    stat: "100%",
    statLabel: "security-first builds",
    color: "from-violet-500 to-purple-600",
  },
  {
    icon: GitBranch,
    title: "You Own Everything",
    description: "Full IP transfer on completion. Clean, documented code in your repository. No vendor lock-in, ever. Your product, your rules.",
    stat: "100%",
    statLabel: "IP ownership",
    color: "from-cyan-500 to-blue-500",
  },
  {
    icon: Headphones,
    title: "24/7 Post-Launch Support",
    description: "We don't disappear after launch. Dedicated Slack channel, real engineers on call, and guaranteed response times for every client.",
    stat: "< 2h",
    statLabel: "avg. response time",
    color: "from-emerald-500 to-teal-500",
  },
  {
    icon: Target,
    title: "Business-First Engineering",
    description: "We obsess over your KPIs, not just clean code. Every technical decision is filtered through one question: does this move the business forward?",
    stat: "98%",
    statLabel: "on-time delivery",
    color: "from-rose-500 to-pink-600",
  },
  {
    icon: TrendingUp,
    title: "Built to Scale Globally",
    description: "Multi-region deployment, auto-scaling infrastructure, and CDN-optimized assets. Your app performs at its peak whether you have 100 or 10M users.",
    stat: "99.9%",
    statLabel: "uptime guarantee",
    color: "from-violet-500 to-cyan-500",
  },
];

export default function WhyUs() {
  return (
    <section className="py-20 sm:py-32 bg-[#0B0D14] relative overflow-hidden" id="why-us">
      {/* Background grid */}
      <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.015)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.015)_1px,transparent_1px)] bg-[size:48px_48px] pointer-events-none" />

      <div className="container mx-auto px-4 md:px-6 relative z-10">
        <div className="text-center mb-12 sm:mb-20">
          <motion.p
            initial={{ opacity: 0, y: 10 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="text-xs font-semibold tracking-[0.2em] text-violet-400 uppercase mb-4"
          >
            Why Xornexz
          </motion.p>
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="text-3xl sm:text-4xl md:text-5xl font-bold font-display text-white mb-6 max-w-3xl mx-auto leading-tight"
          >
            The Standard Others
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-violet-400 to-cyan-400"> Benchmark Against</span>
          </motion.h2>
          <motion.p
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="text-gray-400 text-lg max-w-2xl mx-auto"
          >
            We have refined our craft across 120+ engagements. Here is what makes our work categorically different.
          </motion.p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {advantages.map((adv, index) => (
            <motion.div
              key={adv.title}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-60px" }}
              transition={{ duration: 0.6, delay: index * 0.08 }}
              className="group relative p-5 sm:p-8 rounded-2xl border border-white/5 bg-white/[0.02] hover:border-white/10 hover:bg-white/[0.04] transition-all duration-500"
            >
              {/* Gradient accent on hover */}
              <div className={`absolute top-0 left-0 right-0 h-px bg-gradient-to-r ${adv.color} opacity-0 group-hover:opacity-100 transition-opacity duration-500 rounded-t-2xl`} />

              <div className="flex items-start justify-between mb-6">
                <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${adv.color} p-[1px]`}>
                  <div className="w-full h-full rounded-xl bg-[#0B0D14] flex items-center justify-center">
                    <adv.icon className="w-5 h-5 text-white" />
                  </div>
                </div>
                <div className="text-right">
                  <div className={`text-2xl font-black font-display text-transparent bg-clip-text bg-gradient-to-r ${adv.color}`}>
                    {adv.stat}
                  </div>
                  <div className="text-xs text-gray-600 uppercase tracking-wider">{adv.statLabel}</div>
                </div>
              </div>

              <h3 className="text-xl font-bold text-white mb-3 font-display leading-snug">
                {adv.title}
              </h3>
              <p className="text-gray-400 text-sm leading-relaxed">
                {adv.description}
              </p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
