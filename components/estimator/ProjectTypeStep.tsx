import React from 'react';
import { motion } from 'framer-motion';
import type { EstimatorProjectType } from '@/lib/site-config';

type Props = {
  options: EstimatorProjectType[];
  value: string;
  onChange: (val: string) => void;
  onNext: () => void;
};

export const ProjectTypeStep = ({ options, value, onChange, onNext }: Props) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -16 }}
      className="max-w-3xl mx-auto"
    >
      <h2 className="text-2xl sm:text-3xl font-display font-bold text-slate-900 dark:text-white mb-2 text-center">
        What are we building?
      </h2>
      <p className="text-slate-600 dark:text-gray-400 text-center mb-8">
        Select the primary platform or solution you need.
      </p>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {options.map((type) => {
          const selected = value === type.id;
          return (
            <button
              key={type.id}
              type="button"
              onClick={() => onChange(type.id)}
              className={`p-6 rounded-2xl border text-left transition-all duration-200 ${
                selected
                  ? 'bg-violet-500/10 dark:bg-violet-900/30 border-violet-500 shadow-[0_0_20px_rgba(124,58,237,0.18)]'
                  : 'bg-slate-50 dark:bg-white/5 border-slate-200 dark:border-white/10 hover:border-violet-500/40'
              }`}
            >
              <div className="flex items-start justify-between mb-3">
                <span className="text-3xl">{type.icon || '🚀'}</span>
                <span className="text-xs font-semibold px-2.5 py-1 rounded-full bg-violet-500/10 text-violet-600 dark:text-violet-300">
                  From ${Number(type.basePrice || 0).toLocaleString()}
                </span>
              </div>
              <h3 className="text-xl font-display text-slate-900 dark:text-white font-semibold mb-1.5">
                {type.title}
              </h3>
              <p className="text-sm text-slate-600 dark:text-gray-400">{type.desc}</p>
            </button>
          );
        })}
      </div>

      <div className="mt-10 flex justify-end">
        <button
          type="button"
          onClick={onNext}
          disabled={!value}
          className="btn-gradient px-8 py-3 bg-gradient-to-r from-violet-600 to-cyan-500 text-white font-semibold rounded-full hover:shadow-[0_0_20px_rgba(6,182,212,0.4)] disabled:opacity-50 disabled:cursor-not-allowed transition-all"
        >
          Next Step
        </button>
      </div>
    </motion.div>
  );
};
