'use client';
import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Search, PenTool, Code2, Rocket, TrendingUp, CheckCircle2, MessageSquare, Layers, Wrench, Settings, Zap, Globe } from 'lucide-react';

const ICON_MAP: Record<string, React.ComponentType<{ className?: string; size?: number }>> = {
  Search, PenTool, Code2, Rocket, TrendingUp, CheckCircle2, MessageSquare, Layers, Wrench, Settings, Zap, Globe,
};

function resolveIcon(name: string) {
  return ICON_MAP[name] ?? Code2;
}

interface ProcessStep {
  id: string;
  icon: string;
  title: string;
  description: string;
  order: number;
}

interface Props {
  steps: ProcessStep[];
}

const DEFAULT_STEPS: ProcessStep[] = [
  {
    id: '01',
    title: 'Discovery & Strategy',
    icon: 'Search',
    description: 'We dig deep into your business, competitors, and user needs to form a rock-solid strategy.',
    order: 1
  },
  {
    id: '02',
    title: 'UX/UI Design',
    icon: 'PenTool',
    description: 'Translating strategy into intuitive, beautiful interfaces that align with your brand identity.',
    order: 2
  },
  {
    id: '03',
    title: 'Development & Build',
    icon: 'Code2',
    description: 'Writing clean, scalable code. We work in agile sprints to ensure rapid, transparent progress.',
    order: 3
  },
  {
    id: '04',
    title: 'Testing & Launch',
    icon: 'Rocket',
    description: 'Rigorous QA to ensure perfection before we confidently push your product to production.',
    order: 4
  },
  {
    id: '05',
    title: 'Scale & Support',
    icon: 'TrendingUp',
    description: 'Post-launch monitoring, maintenance, and iterative improvements based on real user data.',
    order: 5
  }
];

function StepDetail({ step, originalDetails }: { step: ProcessStep, originalDetails?: string[] }) {
  const Icon = resolveIcon(step.icon);
  return (
    <div>
      <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-violet-500/20 to-cyan-500/20 flex items-center justify-center mb-8 border border-white/10">
        <Icon className="w-8 h-8 text-cyan-400" />
      </div>

      <h3 className="text-3xl font-display font-bold mb-4">{step.title}</h3>

      <div className="inline-block px-3 py-1 bg-white/5 border border-white/10 rounded-full text-xs font-medium text-slate-300 mb-8">
        Phase {step.order}
      </div>

      <p className="text-slate-300 mb-6">{step.description}</p>
    </div>
  );
}

export default function ProcessClient({ steps }: Props) {
  const [activeStep, setActiveStep] = useState(0);

  const displaySteps = steps.length > 0 ? steps : DEFAULT_STEPS;

  return (
    <main className="min-h-screen bg-[#05060A] text-white pt-32 pb-24">
      {/* Hero Section */}
      <section className="px-6 md:px-12 max-w-7xl mx-auto text-center mb-24">
        <motion.h1 
          className="text-4xl md:text-6xl font-display font-bold mb-6 tracking-tight"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          How We <span className="text-transparent bg-clip-text bg-gradient-to-r from-violet-400 to-cyan-400">Work</span>
        </motion.h1>
        <motion.p 
          className="text-lg text-slate-400 max-w-2xl mx-auto"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.1 }}
        >
          A battle-tested methodology designed to mitigate risk, ensure transparency, and deliver world-class digital products on time.
        </motion.p>
      </section>

      {/* Interactive Process Flow */}
      <section className="px-6 md:px-12 max-w-6xl mx-auto mb-32 relative">
        <div className="flex flex-col md:flex-row gap-12">
          
          {/* Timeline Steps */}
          <div className="w-full md:w-1/2 space-y-4">
            {displaySteps.map((step, index) => {
              const isActive = index === activeStep;
              return (
                <div 
                  key={step.id}
                  onClick={() => setActiveStep(index)}
                  className={`group cursor-pointer p-6 rounded-2xl border transition-all duration-300 ${
                    isActive 
                      ? 'bg-white/10 border-violet-500/50 scale-[1.02]' 
                      : 'bg-[#0B0D14] border-white/5 hover:border-white/20 hover:bg-white/5'
                  }`}
                >
                  <div className="flex items-start gap-4">
                    <div className={`text-4xl font-display font-bold opacity-30 ${isActive ? 'text-violet-400 opacity-100' : ''}`}>
                      0{index + 1}
                    </div>
                    <div>
                      <h3 className="text-xl font-bold mb-2 flex items-center gap-2">
                        {step.title}
                      </h3>
                      <p className="text-slate-400 text-sm">{step.description}</p>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Details Panel */}
          <div className="w-full md:w-1/2 relative md:sticky top-32 h-fit">
            <AnimatePresence mode="wait">
              <motion.div
                key={activeStep}
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                transition={{ duration: 0.3 }}
                className="bg-[#0B0D14] border border-white/10 rounded-3xl p-8"
              >
                <StepDetail step={displaySteps[activeStep]} />
              </motion.div>
            </AnimatePresence>
          </div>
          
        </div>
      </section>

      {/* Typical Timeline Summary */}
      <section className="px-6 md:px-12 max-w-4xl mx-auto text-center border-t border-white/10 pt-24">
        <h2 className="text-3xl font-display font-bold mb-6">Typical Project Timeline</h2>
        <p className="text-slate-400 mb-12">While every project is unique, a standard mid-sized custom application typically takes between <span className="text-white font-medium">8 to 16 weeks</span> from initial kickoff to public launch.</p>
        
        <div className="h-4 w-full bg-white/5 rounded-full overflow-hidden flex relative">
          <div className="h-full bg-violet-600 w-[15%]" title="Discovery"></div>
          <div className="h-full bg-violet-500 w-[25%]" title="Design"></div>
          <div className="h-full bg-cyan-500 w-[45%]" title="Development"></div>
          <div className="h-full bg-cyan-400 w-[15%]" title="Testing"></div>
        </div>
        <div className="flex justify-between text-xs text-slate-500 mt-2">
          <span>Week 1</span>
          <span>Week 16</span>
        </div>
      </section>
    </main>
  );
}
