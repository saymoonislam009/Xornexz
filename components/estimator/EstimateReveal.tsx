import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';

type Props = {
  estimateData: {
    projectType: string;
    features: string[];
    timeline: string;
    budget: string;
  };
  onNext: () => void;
  onBack: () => void;
};

export const EstimateReveal = ({ estimateData, onNext, onBack }: Props) => {
  const [calculating, setCalculating] = useState(true);
  const [estimatedPrice, setEstimatedPrice] = useState(0);

  useEffect(() => {
    // Simulate calculation
    const timer = setTimeout(() => {
      let base = 2000;
      if (estimateData.projectType === 'mobile') base += 3000;
      if (estimateData.projectType === 'ecommerce') base += 2500;
      
      const featureCost = estimateData.features.length * 800;
      let total = base + featureCost;
      
      if (estimateData.timeline === 'rush') total *= 1.5;
      if (estimateData.timeline === 'flexible') total *= 0.9;
      
      setEstimatedPrice(Math.round(total));
      setCalculating(false);
    }, 1500);
    return () => clearTimeout(timer);
  }, [estimateData]);

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      className="max-w-2xl mx-auto text-center"
    >
      {calculating ? (
        <div className="py-20 flex flex-col items-center justify-center">
          <div className="w-16 h-16 border-4 border-white/10 border-t-violet-500 rounded-full animate-spin mb-6" />
          <h2 className="text-2xl font-space-grotesk text-white font-bold">Analyzing Requirements...</h2>
          <p className="text-white/60 font-inter mt-2">Generating your custom estimate</p>
        </div>
      ) : (
        <div className="py-10">
          <h2 className="text-3xl font-space-grotesk font-bold text-white mb-2">Your Estimated Investment</h2>
          <p className="text-white/60 font-inter mb-10">Based on your selections, here is a rough estimate.</p>
          
          <div className="bg-gradient-to-br from-violet-900/40 to-cyan-900/40 border border-white/10 rounded-3xl p-10 mb-10 relative overflow-hidden">
            <div className="absolute top-0 right-0 w-64 h-64 bg-violet-500/20 rounded-full blur-3xl -mr-32 -mt-32 pointer-events-none" />
            <div className="absolute bottom-0 left-0 w-64 h-64 bg-cyan-500/20 rounded-full blur-3xl -ml-32 -mb-32 pointer-events-none" />
            
            <p className="text-sm font-space-grotesk text-cyan-400 font-bold uppercase tracking-widest mb-2 relative z-10">Estimated Range</p>
            <div className="flex justify-center items-end gap-2 relative z-10">
              <span className="text-6xl font-space-grotesk font-bold text-white">
                ${(estimatedPrice * 0.8).toLocaleString()}
              </span>
              <span className="text-2xl font-inter text-white/50 mb-2">- ${(estimatedPrice * 1.2).toLocaleString()}</span>
            </div>
            <p className="text-xs font-inter text-white/40 mt-4 relative z-10">* Final quote may vary based on specific requirements and scope changes.</p>
          </div>

          <div className="flex justify-between">
            <button
              onClick={onBack}
              className="px-8 py-3 bg-white/5 text-white rounded-full font-space-grotesk hover:bg-white/10 transition-colors"
            >
              Back
            </button>
            <button
              onClick={onNext}
              className="px-8 py-3 bg-gradient-to-r from-violet-600 to-cyan-500 text-white font-bold rounded-full font-space-grotesk hover:shadow-[0_0_20px_rgba(124,58,237,0.4)] transition-all"
            >
              Let's Discuss It
            </button>
          </div>
        </div>
      )}
    </motion.div>
  );
};
