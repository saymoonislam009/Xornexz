import React from 'react';
import { motion } from 'framer-motion';

const timelines = [
  { id: 'rush', title: 'ASAP (Rush)', desc: 'Less than 1 month', multiplier: 1.5 },
  { id: 'standard', title: 'Standard', desc: '1 - 3 months', multiplier: 1 },
  { id: 'flexible', title: 'Flexible', desc: '3+ months', multiplier: 0.9 },
];

type Props = {
  value: string;
  onChange: (val: string) => void;
  onNext: () => void;
  onBack: () => void;
};

export const TimelineStep = ({ value, onChange, onNext, onBack }: Props) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      className="max-w-2xl mx-auto"
    >
      <h2 className="text-3xl font-space-grotesk font-bold text-white mb-2 text-center">Project Timeline</h2>
      <p className="text-white/60 font-inter text-center mb-8">When do you need this launched?</p>
      
      <div className="flex flex-col gap-4">
        {timelines.map((time) => (
          <button
            key={time.id}
            onClick={() => onChange(time.id)}
            className={`p-6 rounded-2xl border text-left transition-all duration-300 flex justify-between items-center ${
              value === time.id
                ? 'bg-violet-900/30 border-violet-500 shadow-[0_0_20px_rgba(124,58,237,0.2)]'
                : 'bg-white/5 border-white/10 hover:bg-white/10 hover:border-white/30'
            }`}
          >
            <div>
              <h3 className="text-xl font-space-grotesk text-white font-semibold mb-1">{time.title}</h3>
              <p className="text-sm font-inter text-white/50">{time.desc}</p>
            </div>
            <div className={`w-6 h-6 rounded-full border-2 flex items-center justify-center ${
              value === time.id ? 'border-violet-500' : 'border-white/30'
            }`}>
              {value === time.id && <div className="w-3 h-3 rounded-full bg-violet-500" />}
            </div>
          </button>
        ))}
      </div>

      <div className="mt-10 flex justify-between">
        <button
          onClick={onBack}
          className="px-8 py-3 bg-white/5 text-white rounded-full font-space-grotesk hover:bg-white/10 transition-colors"
        >
          Back
        </button>
        <button
          onClick={onNext}
          disabled={!value}
          className="px-8 py-3 bg-gradient-to-r from-violet-600 to-cyan-500 text-white font-bold rounded-full font-space-grotesk hover:shadow-[0_0_20px_rgba(6,182,212,0.4)] disabled:opacity-50 disabled:cursor-not-allowed transition-all"
        >
          Next Step
        </button>
      </div>
    </motion.div>
  );
};
