import React from 'react';
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
  const emailValid = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email.trim());
  const isValid = formData.name.trim() !== '' && emailValid;

  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -16 }}
      className="max-w-xl mx-auto"
    >
      <h2 className="text-2xl sm:text-3xl font-display font-bold text-slate-900 dark:text-white mb-2 text-center">
        Where should we send your breakdown?
      </h2>
      <p className="text-slate-600 dark:text-gray-400 text-center mb-8">
        Leave your details and our engineering team will send a tailored proposal.
      </p>

      <div className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-slate-600 dark:text-gray-300 mb-1.5 ml-1">
            Full Name *
          </label>
          <input
            type="text"
            value={formData.name}
            onChange={(e) => onChange('name', e.target.value)}
            className="w-full bg-slate-50 dark:bg-white/5 border border-slate-200 dark:border-white/10 rounded-xl px-4 py-3 text-slate-900 dark:text-white placeholder:text-slate-400 dark:placeholder:text-gray-500 focus:outline-none focus:border-violet-500 transition-colors"
            placeholder="Jane Doe"
            required
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-slate-600 dark:text-gray-300 mb-1.5 ml-1">
            Work Email *
          </label>
          <input
            type="email"
            value={formData.email}
            onChange={(e) => onChange('email', e.target.value)}
            className="w-full bg-slate-50 dark:bg-white/5 border border-slate-200 dark:border-white/10 rounded-xl px-4 py-3 text-slate-900 dark:text-white placeholder:text-slate-400 dark:placeholder:text-gray-500 focus:outline-none focus:border-violet-500 transition-colors"
            placeholder="jane@company.com"
            required
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-slate-600 dark:text-gray-300 mb-1.5 ml-1">
            Company (Optional)
          </label>
          <input
            type="text"
            value={formData.company}
            onChange={(e) => onChange('company', e.target.value)}
            className="w-full bg-slate-50 dark:bg-white/5 border border-slate-200 dark:border-white/10 rounded-xl px-4 py-3 text-slate-900 dark:text-white placeholder:text-slate-400 dark:placeholder:text-gray-500 focus:outline-none focus:border-violet-500 transition-colors"
            placeholder="Acme Corp"
          />
        </div>
      </div>

      <div className="mt-10 flex justify-between">
        <button
          type="button"
          onClick={onBack}
          className="px-8 py-3 border border-slate-200 dark:border-white/10 bg-slate-100 dark:bg-white/5 text-slate-800 dark:text-white rounded-full font-medium hover:bg-slate-200 dark:hover:bg-white/10 transition-colors"
          disabled={isSubmitting}
        >
          Back
        </button>
        <button
          type="button"
          onClick={onSubmit}
          disabled={!isValid || isSubmitting}
          className="btn-gradient px-8 py-3 bg-gradient-to-r from-violet-600 to-cyan-500 text-white font-semibold rounded-full hover:shadow-[0_0_20px_rgba(124,58,237,0.4)] disabled:opacity-50 disabled:cursor-not-allowed transition-all flex items-center gap-2"
        >
          {isSubmitting ? 'Submitting...' : 'Send Estimate Request'}
        </button>
      </div>
    </motion.div>
  );
};
