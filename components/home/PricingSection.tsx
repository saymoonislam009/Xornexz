"use client";

import { Check, Zap, Target, Users } from "lucide-react";
import Link from "next/link";

const ICONS = [Target, Users, Zap];

export type PricingModelItem = {
  id?: string;
  name: string;
  description: string;
  price?: string;
  period?: string | null;
  ctaLabel?: string;
  ctaHref?: string;
  features: string[];
  highlighted: boolean;
};

export default function PricingSection({ models }: { models: PricingModelItem[] }) {
  return (
    <section className="py-20 sm:py-32 bg-slate-50 dark:bg-[#05060A] relative overflow-hidden" id="pricing">
      <div className="container mx-auto px-4 md:px-6">
        <div className="text-center mb-12 sm:mb-16">
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold font-display text-slate-900 dark:text-white mb-3 sm:mb-4">
            How We Engage
          </h2>
          <p className="text-slate-600 dark:text-gray-400 text-base sm:text-lg max-w-2xl mx-auto px-2">
            Flexible partnership models designed to align with your business goals, team size, and project requirements.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 sm:gap-8 max-w-6xl mx-auto items-stretch">
          {models.map((model, idx) => {
            const Icon = ICONS[idx % ICONS.length];
            return (
              <div
                key={model.id || idx}
                className={`relative rounded-3xl p-6 sm:p-8 h-full flex flex-col transition-transform duration-300 hover:-translate-y-2 ${
                  model.highlighted
                    ? "bg-white dark:bg-gradient-to-b dark:from-violet-900/30 dark:to-[#0A0D14] border-violet-500/60 border-2 shadow-[0_0_30px_rgba(124,58,237,0.15)] md:-translate-y-3 hover:md:-translate-y-5"
                    : "bg-white dark:bg-[#0A0D14] border border-slate-200 dark:border-white/10 hover:border-violet-500/30 dark:hover:border-white/20 shadow-sm dark:shadow-none"
                }`}
              >
                {model.highlighted && (
                  <div className="btn-gradient absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-gradient-to-r from-violet-600 to-cyan-500 text-white text-xs font-bold uppercase tracking-wider py-1 px-4 rounded-full whitespace-nowrap">
                    Most Popular
                  </div>
                )}

                <div
                  className={`w-14 h-14 rounded-2xl flex items-center justify-center mb-6 ${
                    model.highlighted
                      ? "bg-violet-500/15 text-violet-600 dark:text-violet-400"
                      : "bg-slate-100 dark:bg-white/5 text-slate-600 dark:text-gray-400"
                  }`}
                >
                  <Icon className="w-7 h-7" />
                </div>

                <h3 className="text-2xl font-bold text-slate-900 dark:text-white mb-2 font-display">
                  {model.name}
                </h3>

                {model.price && (
                  <div className="mb-3 flex items-baseline gap-1.5">
                    <span className="text-3xl font-black font-display text-transparent bg-clip-text bg-gradient-to-r from-violet-600 to-cyan-500 dark:from-violet-400 dark:to-cyan-400">
                      {model.price}
                    </span>
                    {model.period && (
                      <span className="text-xs text-slate-500 dark:text-gray-400">{model.period}</span>
                    )}
                  </div>
                )}

                <p className="text-slate-600 dark:text-gray-400 mb-8 text-sm leading-relaxed">
                  {model.description}
                </p>

                <ul className="space-y-3.5 mb-10 flex-1">
                  {model.features.map((feature, i) => (
                    <li key={i} className="flex items-start gap-3">
                      <Check
                        className={`w-5 h-5 shrink-0 mt-0.5 ${
                          model.highlighted
                            ? "text-cyan-600 dark:text-cyan-400"
                            : "text-violet-600 dark:text-gray-500"
                        }`}
                      />
                      <span className="text-slate-700 dark:text-gray-300 text-sm">{feature}</span>
                    </li>
                  ))}
                </ul>

                <Link
                  href={model.ctaHref || "/contact"}
                  className={`w-full py-3.5 rounded-full font-semibold text-sm text-center transition-all ${
                    model.highlighted
                      ? "btn-gradient bg-gradient-to-r from-violet-600 to-cyan-500 text-white hover:shadow-[0_0_20px_rgba(124,58,237,0.4)]"
                      : "border border-slate-200 dark:border-white/10 bg-slate-100 dark:bg-white/5 text-slate-900 dark:text-white hover:bg-slate-200 dark:hover:bg-white/10"
                  }`}
                >
                  {model.ctaLabel || "Let's Talk"}
                </Link>
              </div>
            );
          })}
        </div>

        <div className="mt-16 text-center">
          <Link
            href="/pricing"
            className="text-cyan-600 dark:text-cyan-400 hover:opacity-80 font-medium inline-flex items-center gap-2 group"
          >
            Compare all features and pricing details
            <span className="group-hover:translate-x-1 transition-transform">→</span>
          </Link>
        </div>
      </div>
    </section>
  );
}
