import React, { useState } from 'react';
import { motion } from 'framer-motion';

type Props = {
  formData: {
    name: string;
    email: string;
    company: string;
  };
  onChange: (field: string, value: string) => void;
  onSubmit: () => void;
  onBack: () => void;
  isSubmitting: boolean;
};

export const ContactStep = ({ formData, onChange, onSubmit, onBack, isSubmitting }: Props) => {
  const isValid = formData.name.trim() !== '' && formData.email.trim() !== '';

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      className="max-w-xl mx-auto"
    >
      <h2 className="text-3xl font-space-grotesk font-bold text-white mb-2 text-center">Ready to start?</h2>
      <p className="text-white/60 font-inter text-center mb-8">Leave your details and we'll reach out with a detailed proposal.</p>
      
      <div className="space-y-4">
        <div>
          <label className="block text-sm font-inter text-white/70 mb-1 ml-1">Full Name *</label>
          <input
            type="text"
            value={formData.name}
            onChange={(e) => onChange('name', e.target.value)}
            className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white placeholder-white/30 focus:outline-none focus:border-violet-500 focus:bg-white/10 transition-colors"
            placeholder="John Doe"
            required
          />
        </div>
        <div>
          <label className="block text-sm font-inter text-white/70 mb-1 ml-1">Email Address *</label>
          <input
            type="email"
            value={formData.email}
            onChange={(e) => onChange('email', e.target.value)}
            className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white placeholder-white/30 focus:outline-none focus:border-violet-500 focus:bg-white/10 transition-colors"
            placeholder="john@example.com"
            required
          />
        </div>
        <div>
          <label className="block text-sm font-inter text-white/70 mb-1 ml-1">Company (Optional)</label>
          <input
            type="text"
            value={formData.company}
            onChange={(e) => onChange('company', e.target.value)}
            className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white placeholder-white/30 focus:outline-none focus:border-violet-500 focus:bg-white/10 transition-colors"
            placeholder="Acme Corp"
          />
        </div>
      </div>

      <div className="mt-10 flex justify-between">
        <button
          onClick={onBack}
          className="px-8 py-3 bg-white/5 text-white rounded-full font-space-grotesk hover:bg-white/10 transition-colors"
          disabled={isSubmitting}
        >
          Back
        </button>
        <button
          onClick={onSubmit}
          disabled={!isValid || isSubmitting}
          className="px-8 py-3 bg-gradient-to-r from-violet-600 to-cyan-500 text-white font-bold rounded-full font-space-grotesk hover:shadow-[0_0_20px_rgba(124,58,237,0.4)] disabled:opacity-50 disabled:cursor-not-allowed transition-all flex items-center gap-2"
        >
          {isSubmitting ? 'Submitting...' : 'Send Request'}
        </button>
      </div>
    </motion.div>
  );
};
