import React from 'react';
import { motion } from 'framer-motion';
import type { EstimatorTimeline } from '@/lib/site-config';

type Props = {
  options: EstimatorTimeline[];
  value: string;
  onChange: (val: string) => void;
  onNext: () => void;
  onBack: () => void;
};

export const TimelineStep = ({ options, value, onChange, onNext, onBack }: Props) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -16 }}
      className="max-w-2xl mx-auto"
    >
      <h2 className="text-2xl sm:text-3xl font-display font-bold text-slate-900 dark:text-white mb-2 text-center">
        Project Timeline
      </h2>
      <p className="text-slate-600 dark:text-gray-400 text-center mb-8">
        When do you want to launch?
      </p>

      <div className="flex flex-col gap-4">
        {options.map((time) => {
          const selected = value === time.id;
          return (
            <button
              key={time.id}
              type="button"
              onClick={() => onChange(time.id)}
              className={`p-6 rounded-2xl border text-left transition-all duration-200 flex justify-between items-center ${
                selected
                  ? 'bg-violet-500/10 dark:bg-violet-900/30 border-violet-500 shadow-[0_0_20px_rgba(124,58,237,0.18)]'
                  : 'bg-slate-50 dark:bg-white/5 border-slate-200 dark:border-white/10 hover:border-violet-500/40'
              }`}
            >
              <div>
                <h3 className="text-xl font-display text-slate-900 dark:text-white font-semibold mb-1">
                  {time.title}
                </h3>
                <p className="text-sm text-slate-600 dark:text-gray-400">{time.desc}</p>
              </div>
              <div
                className={`w-6 h-6 rounded-full border-2 flex items-center justify-center ${
                  selected ? 'border-violet-500' : 'border-slate-300 dark:border-white/30'
                }`}
              >
                {selected && <div className="w-3 h-3 rounded-full bg-violet-500" />}
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
          disabled={!value}
          className="btn-gradient px-8 py-3 bg-gradient-to-r from-violet-600 to-cyan-500 text-white font-semibold rounded-full hover:shadow-[0_0_20px_rgba(6,182,212,0.4)] disabled:opacity-50 disabled:cursor-not-allowed transition-all"
        >
          Next Step
        </button>
      </div>
    </motion.div>
  );
};
