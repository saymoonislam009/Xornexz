import React from 'react';
import { motion } from 'framer-motion';
import type { EstimatorBudget } from '@/lib/site-config';

type Props = {
  options: EstimatorBudget[];
  value: string;
  onChange: (val: string) => void;
  onNext: () => void;
  onBack: () => void;
};

export const BudgetStep = ({ options, value, onChange, onNext, onBack }: Props) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -16 }}
      className="max-w-3xl mx-auto"
    >
      <h2 className="text-2xl sm:text-3xl font-display font-bold text-slate-900 dark:text-white mb-2 text-center">
        Target Investment Tier
      </h2>
      <p className="text-slate-600 dark:text-gray-400 text-center mb-8">
        Helps us tailor our architecture and staffing recommendations.
      </p>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {options.map((budget) => {
          const selected = value === budget.id;
          return (
            <button
              key={budget.id}
              type="button"
              onClick={() => onChange(budget.id)}
              className={`p-6 rounded-2xl border text-center transition-all duration-200 ${
                selected
                  ? 'bg-cyan-500/10 dark:bg-cyan-900/30 border-cyan-500 shadow-[0_0_20px_rgba(6,182,212,0.18)]'
                  : 'bg-slate-50 dark:bg-white/5 border-slate-200 dark:border-white/10 hover:border-cyan-500/40'
              }`}
            >
              <h3 className="text-2xl font-display text-slate-900 dark:text-white font-bold mb-2">
                {budget.title}
              </h3>
              <p className="text-sm text-slate-600 dark:text-gray-400">{budget.desc}</p>
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
          disabled={!value}
          className="btn-gradient px-8 py-3 bg-gradient-to-r from-violet-600 to-cyan-500 text-white font-semibold rounded-full hover:shadow-[0_0_20px_rgba(6,182,212,0.4)] disabled:opacity-50 disabled:cursor-not-allowed transition-all"
        >
          Calculate Estimate
        </button>
      </div>
    </motion.div>
  );
};
