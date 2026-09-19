import React from 'react';
import { motion } from 'framer-motion';

type Props = {
  currentStep: number;
  totalSteps: number;
  steps: string[];
};

export const StepIndicator = ({ currentStep, totalSteps, steps }: Props) => {
  return (
    <div className="w-full max-w-3xl mx-auto mb-12 relative">
      <div className="flex justify-between items-center relative z-10">
        {steps.map((step, index) => (
          <div key={step} className="flex flex-col items-center">
            <div
              className={`w-10 h-10 rounded-full flex items-center justify-center font-space-grotesk text-sm font-bold transition-all duration-300 ${
                index + 1 === currentStep
                  ? 'bg-violet-600 text-white shadow-[0_0_15px_rgba(124,58,237,0.5)] scale-110'
                  : index + 1 < currentStep
                  ? 'bg-cyan-500 text-black'
                  : 'bg-white/10 text-white/50 border border-white/20'
              }`}
            >
              {index + 1 < currentStep ? '✓' : index + 1}
            </div>
            <span className="text-xs mt-3 font-inter text-white/70 hidden sm:block whitespace-nowrap">{step}</span>
          </div>
        ))}
      </div>
      <div className="absolute top-5 left-[20px] right-[20px] h-[2px] bg-white/10 -z-0">
        <motion.div
          className="h-full bg-gradient-to-r from-violet-600 to-cyan-500"
          initial={{ width: 0 }}
          animate={{ width: `${((currentStep - 1) / (totalSteps - 1)) * 100}%` }}
          transition={{ duration: 0.5, ease: "easeInOut" }}
        />
      </div>
    </div>
  );
};
