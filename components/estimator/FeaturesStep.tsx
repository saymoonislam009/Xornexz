import React from 'react';
import { motion } from 'framer-motion';

const featuresList = [
  { id: 'auth', title: 'User Authentication', desc: 'Login, signup, and profile management' },
  { id: 'payments', title: 'Payment Integration', desc: 'Stripe, PayPal, or custom gateways' },
  { id: 'cms', title: 'Content Management', desc: 'Manage your own content via admin panel' },
  { id: 'realtime', title: 'Real-time Features', desc: 'Chat, notifications, or live updates' },
  { id: 'analytics', title: 'Analytics Dashboard', desc: 'Track user behavior and metrics' },
  { id: 'api', title: 'Third-party APIs', desc: 'Integrations with external services' },
];

type Props = {
  selectedFeatures: string[];
  onChange: (features: string[]) => void;
  onNext: () => void;
  onBack: () => void;
};

export const FeaturesStep = ({ selectedFeatures, onChange, onNext, onBack }: Props) => {
  const toggleFeature = (id: string) => {
    if (selectedFeatures.includes(id)) {
      onChange(selectedFeatures.filter(f => f !== id));
    } else {
      onChange([...selectedFeatures, id]);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      className="max-w-3xl mx-auto"
    >
      <h2 className="text-3xl font-space-grotesk font-bold text-white mb-2 text-center">Select Key Features</h2>
      <p className="text-white/60 font-inter text-center mb-8">Choose the core functionalities for your project.</p>
      
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {featuresList.map((feature) => {
          const isSelected = selectedFeatures.includes(feature.id);
          return (
            <button
              key={feature.id}
              onClick={() => toggleFeature(feature.id)}
              className={`p-5 rounded-xl border text-left transition-all duration-300 flex items-start gap-4 ${
                isSelected
                  ? 'bg-cyan-900/20 border-cyan-500 shadow-[0_0_15px_rgba(6,182,212,0.2)]'
                  : 'bg-white/5 border-white/10 hover:bg-white/10 hover:border-white/30'
              }`}
            >
              <div className={`mt-1 w-6 h-6 rounded flex items-center justify-center border transition-colors ${
                isSelected ? 'bg-cyan-500 border-cyan-500' : 'bg-transparent border-white/30'
              }`}>
                {isSelected && <span className="text-black text-sm font-bold">✓</span>}
              </div>
              <div>
                <h3 className="text-lg font-space-grotesk text-white font-semibold">{feature.title}</h3>
                <p className="text-sm font-inter text-white/50">{feature.desc}</p>
              </div>
            </button>
          );
        })}
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
          className="px-8 py-3 bg-gradient-to-r from-violet-600 to-cyan-500 text-white font-bold rounded-full font-space-grotesk hover:shadow-[0_0_20px_rgba(6,182,212,0.4)] transition-all"
        >
          Next Step
        </button>
      </div>
    </motion.div>
  );
};
