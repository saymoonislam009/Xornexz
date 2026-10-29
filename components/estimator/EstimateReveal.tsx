import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import type { EstimatorConfig } from '@/lib/site-config';

type Props = {
  estimateData: {
    projectType: string;
    features: string[];
    timeline: string;
    budget: string;
  };
  config: EstimatorConfig;
  onNext: () => void;
  onBack: () => void;
};

export const EstimateReveal = ({ estimateData, config, onNext, onBack }: Props) => {
  const [calculating, setCalculating] = useState(true);
  const [estimatedPrice, setEstimatedPrice] = useState(0);

  useEffect(() => {
    const timer = setTimeout(() => {
      const matchedType = config.projectTypes.find((t) => t.id === estimateData.projectType);
      const base = matchedType?.basePrice ?? 3500;

      const featureCost = estimateData.features.reduce((sum, fId) => {
        const matchedFeat = config.features.find((f) => f.id === fId);
        return sum + (matchedFeat?.price ?? 800);
      }, 0);

      const matchedTimeline = config.timelines.find((t) => t.id === estimateData.timeline);
      const multiplier = matchedTimeline?.multiplier ?? 1.0;

      const total = Math.round((base + featureCost) * multiplier);
      setEstimatedPrice(total);
      setCalculating(false);
    }, 450);
    return () => clearTimeout(timer);
  }, [estimateData, config]);

  const minRange = Math.round((estimatedPrice * 0.85) / 100) * 100;
  const maxRange = Math.round((estimatedPrice * 1.15) / 100) * 100;

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.97 }}
      animate={{ opacity: 1, scale: 1 }}
      className="max-w-2xl mx-auto text-center"
    >
      {calculating ? (
        <div className="py-16 flex flex-col items-center justify-center">
          <div className="w-14 h-14 border-4 border-slate-200 dark:border-white/10 border-t-violet-500 rounded-full animate-spin mb-6" />
          <h2 className="text-2xl font-display text-slate-900 dark:text-white font-bold">
            Calculating Your Scope...
          </h2>
          <p className="text-slate-600 dark:text-gray-400 mt-2">
            Generating your tailored investment range
          </p>
        </div>
      ) : (
        <div className="py-6">
          <h2 className="text-3xl font-display font-bold text-slate-900 dark:text-white mb-2">
            Your Estimated Investment
          </h2>
          <p className="text-slate-600 dark:text-gray-400 mb-8">
            Based on your selected platform, modules, and delivery timeline.
          </p>

          <div className="bg-slate-50 dark:bg-gradient-to-br dark:from-violet-900/40 dark:to-cyan-900/40 border border-slate-200 dark:border-white/10 rounded-3xl p-8 sm:p-10 mb-8 relative overflow-hidden">
            <p className="text-xs font-display text-cyan-600 dark:text-cyan-400 font-bold uppercase tracking-widest mb-3 relative z-10">
              Estimated Range
            </p>
            <div className="flex flex-wrap justify-center items-baseline gap-2 relative z-10">
              <span className="text-4xl sm:text-6xl font-display font-black text-slate-950 dark:text-white">
                ${minRange.toLocaleString()}
              </span>
              <span className="text-xl sm:text-2xl text-slate-500 dark:text-gray-400">
                – ${maxRange.toLocaleString()}
              </span>
            </div>
            <p className="text-xs text-slate-500 dark:text-gray-400 mt-4 relative z-10">
              * Final proposal may vary based on detailed technical specifications.
            </p>
          </div>

          <div className="flex justify-between">
            <button
              type="button"
              onClick={onBack}
              className="px-8 py-3 border border-slate-200 dark:border-white/10 bg-slate-100 dark:bg-white/5 text-slate-800 dark:text-white rounded-full font-medium hover:bg-slate-200 dark:hover:bg-white/10 transition-colors"
            >
              Back
            </button>
            <button
              type="button"
              onClick={onNext}
              className="btn-gradient px-8 py-3 bg-gradient-to-r from-violet-600 to-cyan-500 text-white font-semibold rounded-full hover:shadow-[0_0_20px_rgba(124,58,237,0.4)] transition-all"
            >
              Lock In & Discuss
            </button>
          </div>
        </div>
      )}
    </motion.div>
  );
};
