"use client";

import { Check, Zap, Target, Users } from "lucide-react";
import Link from "next/link";

const models = [
  {
    name: "Fixed-Scope Project",
    icon: Target,
    description: "Perfect for well-defined projects with clear deliverables and timelines.",
    features: [
      "Fixed timeline and budget",
      "Dedicated project manager",
      "Defined milestones & deliverables",
      "Best for MVPs & V1 launches"
    ],
    highlighted: false,
  },
  {
    name: "Dedicated Team",
    icon: Users,
    description: "Scale your capacity instantly with our senior engineers and designers.",
    features: [
      "Full-time dedicated resources",
      "Direct communication channel",
      "Flexible priority management",
      "Ideal for ongoing development"
    ],
    highlighted: true,
  },
  {
    name: "Monthly Retainer",
    icon: Zap,
    description: "Ongoing support, maintenance, and incremental feature updates.",
    features: [
      "Guaranteed monthly hours",
      "Priority response times",
      "Regular technical audits",
      "Continuous optimization"
    ],
    highlighted: false,
  }
];

export default function PricingSection() {
  return (
    <section className="py-32 bg-[#05060A] relative" id="pricing">
      <div className="container mx-auto px-4 md:px-6">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold font-display text-white mb-4">
            How We Engage
          </h2>
          <p className="text-gray-400 text-lg max-w-2xl mx-auto">
            Flexible partnership models designed to align with your business goals, team size, and project requirements.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl mx-auto items-center">
          {models.map((model, idx) => (
            <div 
              key={idx} 
              className={`relative rounded-3xl p-8 h-full flex flex-col transition-transform duration-300 hover:-translate-y-2 ${
                model.highlighted 
                  ? "bg-gradient-to-b from-violet-900/30 to-[#0A0D14] border-violet-500/50 border-2 shadow-[0_0_30px_rgba(124,58,237,0.15)] md:-translate-y-4 hover:md:-translate-y-6" 
                  : "bg-[#0A0D14] border border-white/10 hover:border-white/20"
              }`}
            >
              {model.highlighted && (
                <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-gradient-to-r from-violet-600 to-cyan-500 text-white text-xs font-bold uppercase tracking-wider py-1 px-4 rounded-full">
                  Most Popular
                </div>
              )}
              
              <div className={`w-14 h-14 rounded-2xl flex items-center justify-center mb-6 ${
                model.highlighted ? "bg-violet-500/20 text-violet-400" : "bg-white/5 text-gray-400"
              }`}>
                <model.icon className="w-7 h-7" />
              </div>
              
              <h3 className="text-2xl font-bold text-white mb-3 font-display">{model.name}</h3>
              <p className="text-gray-400 mb-8">{model.description}</p>
              
              <ul className="space-y-4 mb-10 flex-1">
                {model.features.map((feature, i) => (
                  <li key={i} className="flex items-start gap-3">
                    <Check className={`w-5 h-5 shrink-0 mt-0.5 ${model.highlighted ? "text-cyan-400" : "text-gray-500"}`} />
                    <span className="text-gray-300 text-sm">{feature}</span>
                  </li>
                ))}
              </ul>
              
              <Link 
                href="/contact"
                className={`w-full py-4 rounded-full font-semibold text-center transition-all ${
                  model.highlighted
                    ? "bg-gradient-to-r from-violet-600 to-cyan-500 text-white hover:shadow-[0_0_20px_rgba(124,58,237,0.4)]"
                    : "bg-white/5 text-white hover:bg-white/10"
                }`}
              >
                Let's Talk
              </Link>
            </div>
          ))}
        </div>

        <div className="mt-16 text-center">
          <Link href="/pricing" className="text-cyan-400 hover:text-cyan-300 font-medium inline-flex items-center gap-2 group">
            Compare all features and pricing details
            <span className="group-hover:translate-x-1 transition-transform">→</span>
          </Link>
        </div>
      </div>
    </section>
  );
}
