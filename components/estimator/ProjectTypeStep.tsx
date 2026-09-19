import React from 'react';
import { motion } from 'framer-motion';

const projectTypes = [
  { id: 'web', title: 'Web Application', icon: '🌐', desc: 'Custom web platforms and portals' },
  { id: 'mobile', title: 'Mobile App', icon: '📱', desc: 'iOS and Android applications' },
  { id: 'ecommerce', title: 'E-Commerce', icon: '🛍️', desc: 'Online stores and marketplaces' },
  { id: 'marketing', title: 'Marketing Site', icon: '✨', desc: 'Landing pages and corporate sites' },
];

type Props = {
  value: string;
  onChange: (val: string) => void;
  onNext: () => void;
};

export const ProjectTypeStep = ({ value, onChange, onNext }: Props) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      className="max-w-3xl mx-auto"
    >
      <h2 className="text-3xl font-space-grotesk font-bold text-white mb-2 text-center">What are we building?</h2>
      <p className="text-white/60 font-inter text-center mb-8">Select the type of project you need.</p>
      
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {projectTypes.map((type) => (
          <button
            key={type.id}
            onClick={() => onChange(type.id)}
            className={`p-6 rounded-2xl border text-left transition-all duration-300 ${
              value === type.id
                ? 'bg-violet-900/30 border-violet-500 shadow-[0_0_20px_rgba(124,58,237,0.2)]'
                : 'bg-white/5 border-white/10 hover:bg-white/10 hover:border-white/30'
            }`}
          >
            <div className="text-4xl mb-4">{type.icon}</div>
            <h3 className="text-xl font-space-grotesk text-white font-semibold mb-2">{type.title}</h3>
            <p className="text-sm font-inter text-white/60">{type.desc}</p>
          </button>
        ))}
      </div>

      <div className="mt-10 flex justify-end">
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
