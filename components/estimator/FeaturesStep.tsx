import React from 'react';
import { motion } from 'framer-motion';
import type { EstimatorFeature } from '@/lib/site-config';

type Props = {
  options: EstimatorFeature[];
  selectedFeatures: string[];
  onChange: (features: string[]) => void;
  onNext: () => void;
  onBack: () => void;
};

export const FeaturesStep = ({ options, selectedFeatures, onChange, onNext, onBack }: Props) => {
  const toggleFeature = (id: string) => {
    if (selectedFeatures.includes(id)) {
      onChange(selectedFeatures.filter((f) => f !== id));
    } else {
      onChange([...selectedFeatures, id]);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -16 }}
      className="max-w-3xl mx-auto"
    >
      <h2 className="text-2xl sm:text-3xl font-display font-bold text-slate-900 dark:text-white mb-2 text-center">
        Select Key Capabilities
      </h2>
      <p className="text-slate-600 dark:text-gray-400 text-center mb-8">
        Choose the core modules and integrations for your project.
      </p>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {options.map((feature) => {
          const isSelected = selectedFeatures.includes(feature.id);
          return (
            <button
              key={feature.id}
              type="button"
              onClick={() => toggleFeature(feature.id)}
              className={`p-5 rounded-xl border text-left transition-all duration-200 flex items-start gap-4 ${
                isSelected
                  ? 'bg-cyan-500/10 dark:bg-cyan-900/20 border-cyan-500 shadow-[0_0_15px_rgba(6,182,212,0.18)]'
                  : 'bg-slate-50 dark:bg-white/5 border-slate-200 dark:border-white/10 hover:border-cyan-500/40'
              }`}
            >
              <div
                className={`mt-1 w-5 h-5 rounded flex items-center justify-center border shrink-0 transition-colors ${
                  isSelected
                    ? 'bg-cyan-500 border-cyan-500 text-white'
                    : 'bg-transparent border-slate-300 dark:border-white/30'
                }`}
              >
                {isSelected && <span className="text-xs font-bold">✓</span>}
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between gap-2 mb-1">
                  <h3 className="text-base font-display text-slate-900 dark:text-white font-semibold truncate">
                    {feature.title}
                  </h3>
                  <span className="text-xs font-semibold text-cyan-600 dark:text-cyan-400 shrink-0">
                    +${Number(feature.price || 0).toLocaleString()}
                  </span>
                </div>
                <p className="text-xs sm:text-sm text-slate-600 dark:text-gray-400">{feature.desc}</p>
              </div>
            </button>
          );
        })}
      </div>

      <div className="mt-10 flex justify-between">
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
          className="btn-gradient px-8 py-3 bg-gradient-to-r from-violet-600 to-cyan-500 text-white font-semibold rounded-full hover:shadow-[0_0_20px_rgba(6,182,212,0.4)] transition-all"
        >
          Next Step
        </button>
      </div>
    </motion.div>
  );
};
