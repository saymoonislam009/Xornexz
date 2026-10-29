'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { AnimatePresence } from 'framer-motion';
import { AlertCircle, CheckCircle2 } from 'lucide-react';
import { StepIndicator } from '@/components/estimator/StepIndicator';
import { ProjectTypeStep } from '@/components/estimator/ProjectTypeStep';
import { FeaturesStep } from '@/components/estimator/FeaturesStep';
import { TimelineStep } from '@/components/estimator/TimelineStep';
import { BudgetStep } from '@/components/estimator/BudgetStep';
import { EstimateReveal } from '@/components/estimator/EstimateReveal';
import { ContactStep } from '@/components/estimator/ContactStep';
import { DEFAULT_ESTIMATOR, type EstimatorConfig } from '@/lib/site-config';

const STEPS = ['Type', 'Features', 'Timeline', 'Budget', 'Estimate', 'Contact'];

export default function EstimatorPage() {
  const [estimatorConfig, setEstimatorConfig] = useState<EstimatorConfig>(DEFAULT_ESTIMATOR);
  const [currentStep, setCurrentStep] = useState(1);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const [formData, setFormData] = useState({
    projectType: '',
    features: [] as string[],
    timeline: '',
    budget: '',
    name: '',
    email: '',
    company: '',
  });

  useEffect(() => {
    fetch('/api/site-config')
      .then((r) => (r.ok ? r.json() : null))
      .then((data) => {
        if (data?.estimator) {
          setEstimatorConfig(data.estimator);
        }
      })
      .catch(() => {});
  }, []);

  const nextStep = () => {
    setErrorMsg(null);
    setCurrentStep((prev) => Math.min(prev + 1, STEPS.length));
  };
  const prevStep = () => {
    setErrorMsg(null);
    setCurrentStep((prev) => Math.max(prev - 1, 1));
  };

  const updateFormData = (field: string, value: string | string[] | number | boolean) => {
    setErrorMsg(null);
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleSubmit = async () => {
    setErrorMsg(null);
    setIsSubmitting(true);
    try {
      const response = await fetch('/api/estimator', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      const data = await response.json().catch(() => ({}));
      if (!response.ok) {
        setErrorMsg(
          data?.error || 'Could not submit your estimate request. Please verify your email and try again.'
        );
        return;
      }

      setSubmitted(true);
    } catch {
      setErrorMsg('Network error while submitting your estimate. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (submitted) {
    return (
      <div className="min-h-screen bg-slate-50 dark:bg-[#05060A] pt-32 pb-20 px-4 md:px-8 flex items-center justify-center">
        <div className="max-w-lg mx-auto text-center bg-white dark:bg-[#0A0C14] border border-slate-200 dark:border-white/10 rounded-3xl p-10 shadow-xl dark:shadow-none">
          <div className="w-20 h-20 bg-emerald-500/10 border border-emerald-500/30 rounded-full flex items-center justify-center mx-auto mb-6">
            <CheckCircle2 className="w-10 h-10 text-emerald-500 dark:text-emerald-400" />
          </div>
          <h1 className="text-3xl sm:text-4xl font-display font-bold text-slate-900 dark:text-white mb-4">
            Estimate Request Received!
          </h1>
          <p className="text-slate-600 dark:text-gray-400 text-base sm:text-lg mb-8">
            Thank you, {formData.name}. Your custom estimate and scope details have been sent to our engineering team — we&apos;ll follow up within 24 hours.
          </p>
          <Link
            href="/"
            className="btn-gradient inline-block px-8 py-3.5 bg-gradient-to-r from-violet-600 to-cyan-500 text-white font-semibold rounded-full hover:opacity-90 transition-all"
          >
            Return to Home
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-[#05060A] pt-32 pb-20 px-4 md:px-8 relative overflow-hidden">
      {/* Background gradients */}
      <div className="absolute top-0 left-1/4 w-[500px] h-[500px] bg-violet-900/15 rounded-full blur-[120px] pointer-events-none" />
      <div className="absolute bottom-0 right-1/4 w-[500px] h-[500px] bg-cyan-900/15 rounded-full blur-[120px] pointer-events-none" />

      <div className="max-w-4xl mx-auto relative z-10">
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-5xl font-display font-bold text-slate-950 dark:text-white mb-4">
            {estimatorConfig.heading || 'Project Estimator'}
          </h1>
          <p className="text-slate-600 dark:text-gray-400 max-w-xl mx-auto">
            {estimatorConfig.subheading ||
              'Configure your project scope and get an instant ballpark investment range.'}
          </p>
        </div>

        <StepIndicator currentStep={currentStep} totalSteps={STEPS.length} steps={STEPS} />

        <div className="bg-white dark:bg-[#0A0C14] border border-slate-200 dark:border-white/10 rounded-3xl p-6 md:p-10 shadow-xl dark:shadow-2xl min-h-[400px]">
          {errorMsg && (
            <div className="mb-6 flex items-start gap-2.5 rounded-xl border border-red-500/30 bg-red-500/10 p-3.5 text-sm text-red-600 dark:text-red-300">
              <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
              <span>{errorMsg}</span>
            </div>
          )}

          <AnimatePresence mode="wait">
            {currentStep === 1 && (
              <ProjectTypeStep
                key="step1"
                options={estimatorConfig.projectTypes}
                value={formData.projectType}
                onChange={(v) => updateFormData('projectType', v)}
                onNext={nextStep}
              />
            )}
            {currentStep === 2 && (
              <FeaturesStep
                key="step2"
                options={estimatorConfig.features}
                selectedFeatures={formData.features}
                onChange={(v) => updateFormData('features', v)}
                onNext={nextStep}
                onBack={prevStep}
              />
            )}
            {currentStep === 3 && (
              <TimelineStep
                key="step3"
                options={estimatorConfig.timelines}
                value={formData.timeline}
                onChange={(v) => updateFormData('timeline', v)}
                onNext={nextStep}
                onBack={prevStep}
              />
            )}
            {currentStep === 4 && (
              <BudgetStep
                key="step4"
                options={estimatorConfig.budgets}
                value={formData.budget}
                onChange={(v) => updateFormData('budget', v)}
                onNext={nextStep}
                onBack={prevStep}
              />
            )}
            {currentStep === 5 && (
              <EstimateReveal
                key="step5"
                estimateData={formData}
                config={estimatorConfig}
                onNext={nextStep}
                onBack={prevStep}
              />
            )}
            {currentStep === 6 && (
              <ContactStep
                key="step6"
                formData={formData}
                onChange={updateFormData}
                onSubmit={handleSubmit}
                onBack={prevStep}
                isSubmitting={isSubmitting}
              />
            )}
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
}
