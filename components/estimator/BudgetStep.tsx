import React from 'react';
import { motion } from 'framer-motion';

const budgets = [
  { id: 'small', title: '< $5k', desc: 'MVP or simple projects' },
  { id: 'medium', title: '$5k - $15k', desc: 'Standard business solutions' },
  { id: 'large', title: '$15k - $50k', desc: 'Complex applications' },
  { id: 'enterprise', title: '$50k+', desc: 'Enterprise-grade systems' },
];

type Props = {
  value: string;
  onChange: (val: string) => void;
  onNext: () => void;
  onBack: () => void;
};

export const BudgetStep = ({ value, onChange, onNext, onBack }: Props) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      className="max-w-3xl mx-auto"
    >
      <h2 className="text-3xl font-space-grotesk font-bold text-white mb-2 text-center">What is your budget?</h2>
      <p className="text-white/60 font-inter text-center mb-8">This helps us propose the best solution within your means.</p>
      
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {budgets.map((budget) => (
          <button
            key={budget.id}
            onClick={() => onChange(budget.id)}
            className={`p-6 rounded-2xl border text-center transition-all duration-300 ${
              value === budget.id
                ? 'bg-cyan-900/30 border-cyan-500 shadow-[0_0_20px_rgba(6,182,212,0.2)]'
                : 'bg-white/5 border-white/10 hover:bg-white/10 hover:border-white/30'
            }`}
          >
            <h3 className="text-2xl font-space-grotesk text-white font-bold mb-2">{budget.title}</h3>
            <p className="text-sm font-inter text-white/50">{budget.desc}</p>
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
          Calculate Estimate
        </button>
      </div>
    </motion.div>
  );
};
