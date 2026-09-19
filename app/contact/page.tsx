"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Mail, Calendar, Linkedin, CheckCircle, Loader2, ArrowRight, Twitter, Github } from "lucide-react";
import Link from "next/link";

const SERVICES = [
  "Website Design & Development",
  "Mobile App Development",
  "SaaS Platform",
  "Custom Software",
  "AI / Automation Integration",
  "API & Third-party Integration",
  "UI/UX Design",
  "Other",
];

const BUDGETS = [
  "Under $10k",
  "$10k – $25k",
  "$25k – $50k",
  "$50k – $100k",
  "$100k+",
  "Let's discuss",
];

const TIMELINES = [
  "ASAP (< 1 month)",
  "1 – 3 months",
  "3 – 6 months",
  "6+ months",
  "Flexible",
];

export default function ContactPage() {
  const [step, setStep] = useState(1);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [form, setForm] = useState({
    name: "", email: "", company: "",
    service: "", budget: "", timeline: "",
    message: "",
  });

  const update = (field: string, value: string) =>
    setForm((f) => ({ ...f, [field]: value }));

  const handleNext = (e: React.FormEvent) => {
    e.preventDefault();
    if (step < 3) {
      setStep(step + 1);
    } else {
      setIsSubmitting(true);
      fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      })
        .catch(() => {})
        .finally(() => {
          setIsSubmitting(false);
          setIsSuccess(true);
        });
    }
  };

  const stepLabels = ["About you", "Your project", "Your message"];

  return (
    <main className="min-h-screen bg-[#05060A] text-white pt-24 pb-24 relative overflow-hidden">
      {/* Background ambience */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_80%_50%_at_50%_-10%,rgba(124,58,237,0.12),transparent)] pointer-events-none" />
      <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-cyan-600/5 rounded-full blur-[120px] pointer-events-none" />

      <div className="max-w-7xl mx-auto px-6 md:px-12">

        {/* Page header */}
        <motion.div
          className="text-center mb-16 pt-8"
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <div className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-4 py-1.5 text-sm text-gray-400 mb-6">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
              <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500" />
            </span>
            Available for new projects
          </div>
          <h1 className="text-4xl md:text-6xl lg:text-7xl font-display font-bold tracking-tight mb-5">
            Let&apos;s build{" "}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-violet-400 to-cyan-400">
              what&apos;s next.
            </span>
          </h1>
          <p className="text-lg text-gray-400 max-w-xl mx-auto">
            Tell us about your project and we&apos;ll get back to you within 24 hours with a detailed proposal.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-16">

          {/* ── Form Panel ─────────────────────────────────────────────── */}
          <div className="lg:col-span-7 xl:col-span-8">
            <AnimatePresence mode="wait">
              {!isSuccess ? (
                <motion.div
                  key="form"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  className="bg-[#0B0D14] border border-white/10 rounded-3xl p-8 md:p-10"
                >
                  {/* Step indicator */}
                  <div className="flex items-center gap-3 mb-10">
                    {stepLabels.map((label, i) => {
                      const s = i + 1;
                      const active = s === step;
                      const done = s < step;
                      return (
                        <div key={s} className="flex items-center gap-2 flex-1">
                          <button
                            type="button"
                            disabled={s > step}
                            onClick={() => s < step && setStep(s)}
                            className={`flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold transition-all ${
                              done
                                ? "bg-gradient-to-r from-violet-600 to-cyan-500 text-white"
                                : active
                                ? "bg-white text-black"
                                : "bg-white/10 text-gray-500"
                            }`}
                          >
                            {done ? "✓" : s}
                          </button>
                          <span
                            className={`text-xs font-medium hidden sm:block ${
                              active ? "text-white" : done ? "text-gray-400" : "text-gray-600"
                            }`}
                          >
                            {label}
                          </span>
                          {i < 2 && (
                            <div className="flex-1 h-px bg-white/10 mx-2">
                              <div
                                className="h-full bg-gradient-to-r from-violet-500 to-cyan-500 transition-all duration-500"
                                style={{ width: done ? "100%" : "0%" }}
                              />
                            </div>
                          )}
                        </div>
                      );
                    })}
                  </div>

                  <form onSubmit={handleNext} noValidate>
                    <AnimatePresence mode="wait">

                      {/* Step 1 — About you */}
                      {step === 1 && (
                        <motion.div
                          key="step1"
                          initial={{ opacity: 0, x: 20 }}
                          animate={{ opacity: 1, x: 0 }}
                          exit={{ opacity: 0, x: -20 }}
                          transition={{ duration: 0.25 }}
                          className="space-y-5"
                        >
                          <h2 className="text-2xl font-bold mb-6">Tell us about yourself</h2>
                          <div>
                            <label className="block text-sm font-medium text-slate-400 mb-2">
                              Full Name <span className="text-violet-400">*</span>
                            </label>
                            <input
                              required
                              type="text"
                              value={form.name}
                              onChange={(e) => update("name", e.target.value)}
                              className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white placeholder:text-gray-600 focus:outline-none focus:border-violet-500 focus:ring-1 focus:ring-violet-500/30 transition-all"
                              placeholder="Jane Doe"
                            />
                          </div>
                          <div>
                            <label className="block text-sm font-medium text-slate-400 mb-2">
                              Work Email <span className="text-violet-400">*</span>
                            </label>
                            <input
                              required
                              type="email"
                              value={form.email}
                              onChange={(e) => update("email", e.target.value)}
                              className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white placeholder:text-gray-600 focus:outline-none focus:border-violet-500 focus:ring-1 focus:ring-violet-500/30 transition-all"
                              placeholder="jane@company.com"
                            />
                          </div>
                          <div>
                            <label className="block text-sm font-medium text-slate-400 mb-2">
                              Company / Organization
                            </label>
                            <input
                              type="text"
                              value={form.company}
                              onChange={(e) => update("company", e.target.value)}
                              className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white placeholder:text-gray-600 focus:outline-none focus:border-violet-500 focus:ring-1 focus:ring-violet-500/30 transition-all"
                              placeholder="Acme Corp (optional)"
                            />
                          </div>
                        </motion.div>
                      )}

                      {/* Step 2 — Project details */}
                      {step === 2 && (
                        <motion.div
                          key="step2"
                          initial={{ opacity: 0, x: 20 }}
                          animate={{ opacity: 1, x: 0 }}
                          exit={{ opacity: 0, x: -20 }}
                          transition={{ duration: 0.25 }}
                          className="space-y-5"
                        >
                          <h2 className="text-2xl font-bold mb-6">Your project details</h2>

                          {/* Service selector — pill grid */}
                          <div>
                            <label className="block text-sm font-medium text-slate-400 mb-3">
                              What do you need? <span className="text-violet-400">*</span>
                            </label>
                            <div className="flex flex-wrap gap-2">
                              {SERVICES.map((s) => (
                                <button
                                  key={s}
                                  type="button"
                                  onClick={() => update("service", s)}
                                  className={`px-4 py-2 rounded-full text-sm font-medium border transition-all ${
                                    form.service === s
                                      ? "bg-violet-600 border-violet-500 text-white"
                                      : "bg-white/5 border-white/10 text-gray-400 hover:border-white/30 hover:text-white"
                                  }`}
                                >
                                  {s}
                                </button>
                              ))}
                            </div>
                          </div>

                          {/* Budget */}
                          <div>
                            <label className="block text-sm font-medium text-slate-400 mb-3">
                              Estimated budget
                            </label>
                            <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                              {BUDGETS.map((b) => (
                                <button
                                  key={b}
                                  type="button"
                                  onClick={() => update("budget", b)}
                                  className={`px-3 py-2 rounded-xl text-sm font-medium border transition-all text-center ${
                                    form.budget === b
                                      ? "bg-cyan-600/20 border-cyan-500 text-cyan-300"
                                      : "bg-white/5 border-white/10 text-gray-400 hover:border-white/30 hover:text-white"
                                  }`}
                                >
                                  {b}
                                </button>
                              ))}
                            </div>
                          </div>

                          {/* Timeline */}
                          <div>
                            <label className="block text-sm font-medium text-slate-400 mb-3">
                              Timeline
                            </label>
                            <div className="flex flex-wrap gap-2">
                              {TIMELINES.map((t) => (
                                <button
                                  key={t}
                                  type="button"
                                  onClick={() => update("timeline", t)}
                                  className={`px-4 py-2 rounded-full text-sm font-medium border transition-all ${
                                    form.timeline === t
                                      ? "bg-violet-600/20 border-violet-500 text-violet-300"
                                      : "bg-white/5 border-white/10 text-gray-400 hover:border-white/30 hover:text-white"
                                  }`}
                                >
                                  {t}
                                </button>
                              ))}
                            </div>
                          </div>
                        </motion.div>
                      )}

                      {/* Step 3 — Message */}
                      {step === 3 && (
                        <motion.div
                          key="step3"
                          initial={{ opacity: 0, x: 20 }}
                          animate={{ opacity: 1, x: 0 }}
                          exit={{ opacity: 0, x: -20 }}
                          transition={{ duration: 0.25 }}
                        >
                          <h2 className="text-2xl font-bold mb-6">Describe your project</h2>
                          <div>
                            <label className="block text-sm font-medium text-slate-400 mb-2">
                              Project description <span className="text-violet-400">*</span>
                            </label>
                            <textarea
                              required
                              rows={7}
                              value={form.message}
                              onChange={(e) => update("message", e.target.value)}
                              className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white placeholder:text-gray-600 focus:outline-none focus:border-violet-500 focus:ring-1 focus:ring-violet-500/30 transition-all resize-none"
                              placeholder="Tell us about your goals, current challenges, inspiration, and any technical requirements..."
                            />
                          </div>

                          {/* Summary preview */}
                          {(form.service || form.budget) && (
                            <div className="mt-5 p-4 bg-white/3 border border-white/5 rounded-xl text-sm text-gray-400 space-y-1">
                              <p className="text-gray-300 font-medium mb-2">Summary</p>
                              {form.service && <p>📦 {form.service}</p>}
                              {form.budget && <p>💰 {form.budget}</p>}
                              {form.timeline && <p>⏱ {form.timeline}</p>}
                            </div>
                          )}
                        </motion.div>
                      )}
                    </AnimatePresence>

                    {/* Navigation buttons */}
                    <div className="mt-10 flex justify-between items-center pt-6 border-t border-white/5">
                      {step > 1 ? (
                        <button
                          type="button"
                          onClick={() => setStep(step - 1)}
                          className="text-gray-400 hover:text-white transition-colors text-sm font-medium flex items-center gap-1"
                        >
                          ← Back
                        </button>
                      ) : (
                        <div />
                      )}

                      <button
                        type="submit"
                        disabled={isSubmitting}
                        className="group inline-flex items-center gap-2 rounded-full bg-gradient-to-r from-violet-600 to-cyan-500 px-7 py-3.5 text-sm font-semibold text-white shadow-lg transition-all hover:scale-105 hover:shadow-[0_0_20px_rgba(124,58,237,0.4)] disabled:opacity-60 disabled:cursor-not-allowed disabled:hover:scale-100"
                      >
                        {isSubmitting ? (
                          <>
                            <Loader2 className="w-4 h-4 animate-spin" /> Sending…
                          </>
                        ) : step === 3 ? (
                          <>Send Request <ArrowRight className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" /></>
                        ) : (
                          <>Continue <ArrowRight className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" /></>
                        )}
                      </button>
                    </div>
                  </form>
                </motion.div>
              ) : (
                <motion.div
                  key="success"
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="bg-[#0B0D14] border border-white/10 rounded-3xl p-12 text-center flex flex-col justify-center items-center min-h-[500px]"
                >
                  <div className="w-20 h-20 rounded-full bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center mb-6">
                    <CheckCircle className="w-10 h-10 text-emerald-400" />
                  </div>
                  <h2 className="text-3xl font-display font-bold mb-3">Message Sent!</h2>
                  <p className="text-gray-400 mb-8 max-w-sm mx-auto leading-relaxed">
                    Thank you, {form.name || "friend"}. We&apos;ve received your details and one of our partners
                    will reach out within 24 hours.
                  </p>
                  <button
                    onClick={() => { setStep(1); setIsSuccess(false); setForm({ name: "", email: "", company: "", service: "", budget: "", timeline: "", message: "" }); }}
                    className="text-sm text-violet-400 hover:text-violet-300 font-medium transition-colors underline-offset-4 hover:underline"
                  >
                    Submit another inquiry
                  </button>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* ── Info Panel ─────────────────────────────────────────────── */}
          <div className="lg:col-span-5 xl:col-span-4 space-y-5">

            {/* Schedule a call card */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.1 }}
              className="bg-[#0B0D14] border border-white/10 rounded-3xl p-7"
            >
              <div className="w-11 h-11 bg-violet-500/10 border border-violet-500/20 rounded-xl flex items-center justify-center mb-5">
                <Calendar className="w-5 h-5 text-violet-400" />
              </div>
              <h3 className="text-xl font-bold mb-2">Schedule a Call</h3>
              <p className="text-gray-400 text-sm mb-5 leading-relaxed">
                Skip the form and jump straight into a free 30-minute discovery call with our team.
              </p>
              <a
                href="https://cal.com"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center justify-center gap-2 w-full py-3 bg-gradient-to-r from-violet-600 to-cyan-500 text-white text-sm font-semibold rounded-xl hover:opacity-90 transition-all"
              >
                Book via Cal.com <ArrowRight className="w-4 h-4" />
              </a>
            </motion.div>

            {/* Direct contact */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.2 }}
              className="bg-[#0B0D14] border border-white/10 rounded-3xl p-7"
            >
              <h3 className="text-lg font-bold mb-5">Direct Contact</h3>

              <div className="space-y-4">
                <a
                  href="mailto:hello@xornexz.com"
                  className="flex items-center gap-4 group"
                >
                  <div className="w-10 h-10 bg-white/5 rounded-full flex items-center justify-center group-hover:bg-violet-500/20 transition-colors flex-shrink-0">
                    <Mail className="w-4 h-4 text-gray-400 group-hover:text-violet-400 transition-colors" />
                  </div>
                  <div>
                    <div className="text-sm font-medium text-white">Email Us</div>
                    <div className="text-xs text-gray-500">hello@xornexz.com</div>
                  </div>
                </a>

                <a
                  href="https://linkedin.com"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-4 group"
                >
                  <div className="w-10 h-10 bg-white/5 rounded-full flex items-center justify-center group-hover:bg-cyan-500/20 transition-colors flex-shrink-0">
                    <Linkedin className="w-4 h-4 text-gray-400 group-hover:text-cyan-400 transition-colors" />
                  </div>
                  <div>
                    <div className="text-sm font-medium text-white">LinkedIn</div>
                    <div className="text-xs text-gray-500">Connect with us</div>
                  </div>
                </a>

                <a
                  href="https://twitter.com"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-4 group"
                >
                  <div className="w-10 h-10 bg-white/5 rounded-full flex items-center justify-center group-hover:bg-sky-500/20 transition-colors flex-shrink-0">
                    <Twitter className="w-4 h-4 text-gray-400 group-hover:text-sky-400 transition-colors" />
                  </div>
                  <div>
                    <div className="text-sm font-medium text-white">Twitter / X</div>
                    <div className="text-xs text-gray-500">@xornexz</div>
                  </div>
                </a>

                <a
                  href="https://github.com"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-4 group"
                >
                  <div className="w-10 h-10 bg-white/5 rounded-full flex items-center justify-center group-hover:bg-white/10 transition-colors flex-shrink-0">
                    <Github className="w-4 h-4 text-gray-400 group-hover:text-white transition-colors" />
                  </div>
                  <div>
                    <div className="text-sm font-medium text-white">GitHub</div>
                    <div className="text-xs text-gray-500">View our open source work</div>
                  </div>
                </a>
              </div>

              <div className="mt-6 pt-5 border-t border-white/5 flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-emerald-500 flex-shrink-0" />
                <p className="text-xs text-gray-500">Average response time: <span className="text-gray-300">24 hours</span></p>
              </div>
            </motion.div>

            {/* FAQ teaser */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.3 }}
              className="bg-gradient-to-br from-violet-900/20 to-cyan-900/20 border border-white/10 rounded-3xl p-7"
            >
              <p className="text-sm text-gray-400 mb-3">Have questions first?</p>
              <Link
                href="/#faq"
                className="text-white font-semibold hover:text-violet-300 transition-colors flex items-center gap-2 group"
              >
                Read our FAQ
                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </Link>
            </motion.div>
          </div>
        </div>
      </div>
    </main>
  );
}
