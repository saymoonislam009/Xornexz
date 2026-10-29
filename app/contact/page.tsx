"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Mail,
  Calendar,
  Linkedin,
  CheckCircle,
  Loader2,
  ArrowRight,
  Twitter,
  Github,
  Calculator,
  AlertCircle,
  Check,
} from "lucide-react";
import Link from "next/link";
import { DEFAULT_SITE_CONFIG, type SiteConfig } from "@/lib/site-config";

export default function ContactPage() {
  const [siteConfig, setSiteConfig] = useState<SiteConfig>(DEFAULT_SITE_CONFIG);
  const [step, setStep] = useState(1);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const [form, setForm] = useState({
    name: "",
    email: "",
    phone: "",
    company: "",
    service: "",
    budget: "",
    timeline: "",
    requirements: [] as string[],
    message: "",
  });

  useEffect(() => {
    fetch("/api/site-config")
      .then((r) => (r.ok ? r.json() : null))
      .then((data) => {
        if (data && data.projectForm) {
          setSiteConfig(data);
        }
      })
      .catch(() => {});
  }, []);

  const pf = siteConfig.projectForm;
  const services = pf.services.length > 0 ? pf.services : DEFAULT_SITE_CONFIG.projectForm.services;
  const budgets = pf.budgets.length > 0 ? pf.budgets : DEFAULT_SITE_CONFIG.projectForm.budgets;
  const timelines =
    pf.timelines.length > 0 ? pf.timelines : DEFAULT_SITE_CONFIG.projectForm.timelines;
  const requirements = pf.requirements || [];

  const update = (field: string, value: string) => {
    setErrorMsg(null);
    setForm((f) => ({ ...f, [field]: value }));
  };

  const toggleRequirement = (item: string) => {
    setErrorMsg(null);
    setForm((f) => ({
      ...f,
      requirements: f.requirements.includes(item)
        ? f.requirements.filter((r) => r !== item)
        : [...f.requirements, item],
    }));
  };

  const handleNext = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg(null);

    if (step === 1) {
      if (!form.name.trim()) {
        setErrorMsg("Please enter your full name.");
        return;
      }
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(form.email.trim())) {
        setErrorMsg("Please enter a valid email address.");
        return;
      }
      setStep(2);
      return;
    }

    if (step === 2) {
      if (!form.service) {
        setErrorMsg("Please select what you need help building.");
        return;
      }
      setStep(3);
      return;
    }

    // Step 3 — Submit to /api/contact
    if (!form.message.trim()) {
      setErrorMsg("Please tell us briefly about your project.");
      return;
    }

    setIsSubmitting(true);
    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: form.name.trim(),
          email: form.email.trim(),
          phone: form.phone.trim() || undefined,
          company: form.company.trim() || undefined,
          service: form.service || undefined,
          budget: form.budget || undefined,
          timeline: form.timeline || undefined,
          requirements: form.requirements,
          message: form.message.trim(),
        }),
      });

      const data = await res.json().catch(() => ({}));
      if (!res.ok) {
        setErrorMsg(
          data?.error || "Unable to send your message right now. Please check your details and try again."
        );
        return;
      }

      setIsSuccess(true);
    } catch {
      setErrorMsg("Network error while sending your request. Please check your connection and try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const stepLabels = ["About you", "Project & budget", "Project brief"];

  const rawHeading = (pf.heading || "Let's build what's next.").trim();
  const headingWords = rawHeading.split(/\s+/);
  const splitIdx = headingWords.length > 2 ? Math.ceil(headingWords.length / 2) : 1;
  const headingTop = headingWords.length > 1 ? headingWords.slice(0, splitIdx).join(" ") : "";
  const headingAccent =
    headingWords.length > 1 ? headingWords.slice(splitIdx).join(" ") : rawHeading;

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-[#05060A] text-slate-900 dark:text-white pt-24 pb-24 relative overflow-hidden">
      {/* Background ambience */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_80%_50%_at_50%_-10%,rgba(124,58,237,0.12),transparent)] pointer-events-none" />
      <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-cyan-600/5 rounded-full blur-[120px] pointer-events-none" />

      <div className="max-w-7xl mx-auto px-5 sm:px-6 md:px-12 relative z-10">
        {/* Page header */}
        <motion.div
          className="text-center mb-14 pt-8"
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.45 }}
        >
          <div className="inline-flex items-center gap-2 rounded-full border border-slate-200 dark:border-white/10 bg-white dark:bg-white/5 px-4 py-1.5 text-sm text-slate-600 dark:text-gray-400 mb-6 shadow-sm dark:shadow-none">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
              <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500" />
            </span>
            {pf.badgeText || "Available for new projects"}
          </div>
          <h1 className="text-4xl md:text-6xl lg:text-7xl font-display font-bold tracking-tight mb-5 text-slate-950 dark:text-white">
            {headingTop ? <>{headingTop} </> : null}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-violet-600 to-cyan-500 dark:from-violet-400 dark:to-cyan-400">
              {headingAccent}
            </span>
          </h1>
          <p className="text-base sm:text-lg text-slate-600 dark:text-gray-400 max-w-xl mx-auto">
            {pf.subheading}
          </p>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-14">
          {/* ── Form Panel ─────────────────────────────────────────────── */}
          <div className="lg:col-span-7 xl:col-span-8">
            <AnimatePresence mode="wait">
              {!isSuccess ? (
                <motion.div
                  key="form"
                  initial={{ opacity: 0, y: 16 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -16 }}
                  className="bg-white dark:bg-[#0B0D14] border border-slate-200 dark:border-white/10 rounded-3xl p-6 sm:p-8 md:p-10 shadow-xl dark:shadow-none"
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
                            onClick={() => {
                              if (s < step) {
                                setErrorMsg(null);
                                setStep(s);
                              }
                            }}
                            className={`flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold transition-all ${
                              done
                                ? "btn-gradient bg-gradient-to-r from-violet-600 to-cyan-500 text-white"
                                : active
                                ? "bg-slate-900 text-white dark:bg-white dark:text-black"
                                : "bg-slate-100 dark:bg-white/10 text-slate-400 dark:text-gray-500"
                            }`}
                          >
                            {done ? "✓" : s}
                          </button>
                          <span
                            className={`text-xs font-semibold hidden sm:block ${
                              active
                                ? "text-slate-900 dark:text-white"
                                : done
                                ? "text-slate-600 dark:text-gray-400"
                                : "text-slate-400 dark:text-gray-600"
                            }`}
                          >
                            {label}
                          </span>
                          {i < 2 && (
                            <div className="flex-1 h-px bg-slate-200 dark:bg-white/10 mx-2">
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

                  {errorMsg && (
                    <div className="mb-6 flex items-start gap-2.5 rounded-xl border border-red-500/30 bg-red-500/10 p-3.5 text-sm text-red-600 dark:text-red-300">
                      <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
                      <span>{errorMsg}</span>
                    </div>
                  )}

                  <form onSubmit={handleNext} noValidate>
                    <AnimatePresence mode="wait">
                      {/* Step 1 — About you */}
                      {step === 1 && (
                        <motion.div
                          key="step1"
                          initial={{ opacity: 0, x: 16 }}
                          animate={{ opacity: 1, x: 0 }}
                          exit={{ opacity: 0, x: -16 }}
                          transition={{ duration: 0.2 }}
                          className="space-y-5"
                        >
                          <h2 className="text-2xl font-bold mb-6 text-slate-900 dark:text-white">
                            Tell us about yourself
                          </h2>
                          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                            <div>
                              <label className="block text-sm font-medium text-slate-600 dark:text-slate-400 mb-2">
                                Full Name <span className="text-violet-500">*</span>
                              </label>
                              <input
                                required
                                type="text"
                                value={form.name}
                                onChange={(e) => update("name", e.target.value)}
                                className="w-full bg-slate-50 dark:bg-white/5 border border-slate-200 dark:border-white/10 rounded-xl px-4 py-3 text-slate-900 dark:text-white placeholder:text-slate-400 dark:placeholder:text-gray-600 focus:outline-none focus:border-violet-500 focus:ring-1 focus:ring-violet-500/30 transition-all"
                                placeholder="Jane Doe"
                              />
                            </div>
                            <div>
                              <label className="block text-sm font-medium text-slate-600 dark:text-slate-400 mb-2">
                                Work Email <span className="text-violet-500">*</span>
                              </label>
                              <input
                                required
                                type="email"
                                value={form.email}
                                onChange={(e) => update("email", e.target.value)}
                                className="w-full bg-slate-50 dark:bg-white/5 border border-slate-200 dark:border-white/10 rounded-xl px-4 py-3 text-slate-900 dark:text-white placeholder:text-slate-400 dark:placeholder:text-gray-600 focus:outline-none focus:border-violet-500 focus:ring-1 focus:ring-violet-500/30 transition-all"
                                placeholder="jane@company.com"
                              />
                            </div>
                          </div>
                          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                            <div>
                              <label className="block text-sm font-medium text-slate-600 dark:text-slate-400 mb-2">
                                Company / Organization
                              </label>
                              <input
                                type="text"
                                value={form.company}
                                onChange={(e) => update("company", e.target.value)}
                                className="w-full bg-slate-50 dark:bg-white/5 border border-slate-200 dark:border-white/10 rounded-xl px-4 py-3 text-slate-900 dark:text-white placeholder:text-slate-400 dark:placeholder:text-gray-600 focus:outline-none focus:border-violet-500 focus:ring-1 focus:ring-violet-500/30 transition-all"
                                placeholder="Acme Corp (optional)"
                              />
                            </div>
                            <div>
                              <label className="block text-sm font-medium text-slate-600 dark:text-slate-400 mb-2">
                                Phone / WhatsApp (Optional)
                              </label>
                              <input
                                type="tel"
                                value={form.phone}
                                onChange={(e) => update("phone", e.target.value)}
                                className="w-full bg-slate-50 dark:bg-white/5 border border-slate-200 dark:border-white/10 rounded-xl px-4 py-3 text-slate-900 dark:text-white placeholder:text-slate-400 dark:placeholder:text-gray-600 focus:outline-none focus:border-violet-500 focus:ring-1 focus:ring-violet-500/30 transition-all"
                                placeholder="+1 (555) 000-0000"
                              />
                            </div>
                          </div>
                        </motion.div>
                      )}

                      {/* Step 2 — Project details */}
                      {step === 2 && (
                        <motion.div
                          key="step2"
                          initial={{ opacity: 0, x: 16 }}
                          animate={{ opacity: 1, x: 0 }}
                          exit={{ opacity: 0, x: -16 }}
                          transition={{ duration: 0.2 }}
                          className="space-y-6"
                        >
                          <h2 className="text-2xl font-bold text-slate-900 dark:text-white">
                            Your project scope & budget
                          </h2>

                          {/* Service selector */}
                          <div>
                            <label className="block text-sm font-medium text-slate-600 dark:text-slate-400 mb-3">
                              What do you need? <span className="text-violet-500">*</span>
                            </label>
                            <div className="flex flex-wrap gap-2">
                              {services.map((s) => (
                                <button
                                  key={s}
                                  type="button"
                                  onClick={() => update("service", s)}
                                  className={`px-4 py-2 rounded-full text-sm font-medium border transition-all ${
                                    form.service === s
                                      ? "btn-gradient bg-gradient-to-r from-violet-600 to-cyan-500 border-transparent text-white shadow-sm"
                                      : "bg-slate-50 dark:bg-white/5 border-slate-200 dark:border-white/10 text-slate-700 dark:text-gray-300 hover:border-violet-500/50"
                                  }`}
                                >
                                  {s}
                                </button>
                              ))}
                            </div>
                          </div>

                          {/* Budget / Price Ranges */}
                          <div>
                            <label className="block text-sm font-medium text-slate-600 dark:text-slate-400 mb-3">
                              Estimated price range
                            </label>
                            <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                              {budgets.map((b) => (
                                <button
                                  key={b}
                                  type="button"
                                  onClick={() => update("budget", b)}
                                  className={`px-3 py-2.5 rounded-xl text-sm font-semibold border transition-all text-center ${
                                    form.budget === b
                                      ? "bg-cyan-500/15 border-cyan-500 text-cyan-700 dark:text-cyan-300"
                                      : "bg-slate-50 dark:bg-white/5 border-slate-200 dark:border-white/10 text-slate-700 dark:text-gray-300 hover:border-cyan-500/40"
                                  }`}
                                >
                                  {b}
                                </button>
                              ))}
                            </div>
                          </div>

                          {/* Timeline */}
                          <div>
                            <label className="block text-sm font-medium text-slate-600 dark:text-slate-400 mb-3">
                              Target timeline
                            </label>
                            <div className="flex flex-wrap gap-2">
                              {timelines.map((t) => (
                                <button
                                  key={t}
                                  type="button"
                                  onClick={() => update("timeline", t)}
                                  className={`px-4 py-2 rounded-full text-sm font-medium border transition-all ${
                                    form.timeline === t
                                      ? "bg-violet-500/15 border-violet-500 text-violet-700 dark:text-violet-300"
                                      : "bg-slate-50 dark:bg-white/5 border-slate-200 dark:border-white/10 text-slate-700 dark:text-gray-300 hover:border-violet-500/40"
                                  }`}
                                >
                                  {t}
                                </button>
                              ))}
                            </div>
                          </div>

                          {/* Optional Requirements (Multi-select) */}
                          {requirements.length > 0 && (
                            <div>
                              <label className="block text-sm font-medium text-slate-600 dark:text-slate-400 mb-3">
                                Optional add-ons & requirements{" "}
                                <span className="text-xs font-normal text-slate-400">
                                  (select all that apply)
                                </span>
                              </label>
                              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                                {requirements.map((reqItem) => {
                                  const checked = form.requirements.includes(reqItem);
                                  return (
                                    <button
                                      key={reqItem}
                                      type="button"
                                      onClick={() => toggleRequirement(reqItem)}
                                      className={`flex items-center gap-2.5 px-3.5 py-2.5 rounded-xl text-left text-xs sm:text-sm font-medium border transition-all ${
                                        checked
                                          ? "bg-emerald-500/10 border-emerald-500/60 text-emerald-700 dark:text-emerald-300"
                                          : "bg-slate-50 dark:bg-white/5 border-slate-200 dark:border-white/10 text-slate-700 dark:text-gray-300 hover:border-slate-300 dark:hover:border-white/25"
                                      }`}
                                    >
                                      <span
                                        className={`w-4 h-4 rounded flex items-center justify-center border shrink-0 ${
                                          checked
                                            ? "bg-emerald-500 border-emerald-500 text-white"
                                            : "border-slate-300 dark:border-white/25"
                                        }`}
                                      >
                                        {checked && <Check className="w-3 h-3" />}
                                      </span>
                                      <span className="truncate">{reqItem}</span>
                                    </button>
                                  );
                                })}
                              </div>
                            </div>
                          )}
                        </motion.div>
                      )}

                      {/* Step 3 — Message */}
                      {step === 3 && (
                        <motion.div
                          key="step3"
                          initial={{ opacity: 0, x: 16 }}
                          animate={{ opacity: 1, x: 0 }}
                          exit={{ opacity: 0, x: -16 }}
                          transition={{ duration: 0.2 }}
                        >
                          <h2 className="text-2xl font-bold mb-6 text-slate-900 dark:text-white">
                            Describe your project
                          </h2>
                          <div>
                            <label className="block text-sm font-medium text-slate-600 dark:text-slate-400 mb-2">
                              Project overview & goals <span className="text-violet-500">*</span>
                            </label>
                            <textarea
                              required
                              rows={6}
                              value={form.message}
                              onChange={(e) => update("message", e.target.value)}
                              className="w-full bg-slate-50 dark:bg-white/5 border border-slate-200 dark:border-white/10 rounded-xl px-4 py-3 text-slate-900 dark:text-white placeholder:text-slate-400 dark:placeholder:text-gray-600 focus:outline-none focus:border-violet-500 focus:ring-1 focus:ring-violet-500/30 transition-all resize-none"
                              placeholder={pf.messagePlaceholder}
                            />
                          </div>

                          {/* Summary preview */}
                          {(form.service || form.budget || form.timeline || form.requirements.length > 0) && (
                            <div className="mt-5 p-4 bg-slate-50 dark:bg-white/[0.03] border border-slate-200 dark:border-white/5 rounded-xl text-sm text-slate-600 dark:text-gray-400 space-y-1.5">
                              <p className="text-slate-900 dark:text-gray-200 font-semibold mb-1">
                                Selected Scope Summary
                              </p>
                              {form.service && <p>• Service: {form.service}</p>}
                              {form.budget && <p>• Budget: {form.budget}</p>}
                              {form.timeline && <p>• Timeline: {form.timeline}</p>}
                              {form.requirements.length > 0 && (
                                <p>• Requirements: {form.requirements.join(", ")}</p>
                              )}
                            </div>
                          )}
                        </motion.div>
                      )}
                    </AnimatePresence>

                    {/* Navigation buttons */}
                    <div className="mt-10 flex justify-between items-center pt-6 border-t border-slate-200 dark:border-white/5">
                      {step > 1 ? (
                        <button
                          type="button"
                          onClick={() => {
                            setErrorMsg(null);
                            setStep(step - 1);
                          }}
                          className="text-slate-600 dark:text-gray-400 hover:text-slate-900 dark:hover:text-white transition-colors text-sm font-medium flex items-center gap-1"
                        >
                          ← Back
                        </button>
                      ) : (
                        <div />
                      )}

                      <button
                        type="submit"
                        disabled={isSubmitting}
                        className="btn-gradient group inline-flex items-center gap-2 rounded-full bg-gradient-to-r from-violet-600 to-cyan-500 px-7 py-3.5 text-sm font-semibold text-white shadow-lg transition-all hover:scale-[1.02] hover:shadow-[0_0_20px_rgba(124,58,237,0.4)] disabled:opacity-60 disabled:cursor-not-allowed"
                      >
                        {isSubmitting ? (
                          <>
                            <Loader2 className="w-4 h-4 animate-spin" /> Sending…
                          </>
                        ) : step === 3 ? (
                          <>
                            Send Request{" "}
                            <ArrowRight className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" />
                          </>
                        ) : (
                          <>
                            Continue{" "}
                            <ArrowRight className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" />
                          </>
                        )}
                      </button>
                    </div>
                  </form>
                </motion.div>
              ) : (
                <motion.div
                  key="success"
                  initial={{ opacity: 0, scale: 0.96 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="bg-white dark:bg-[#0B0D14] border border-slate-200 dark:border-white/10 rounded-3xl p-12 text-center flex flex-col justify-center items-center min-h-[480px] shadow-xl dark:shadow-none"
                >
                  <div className="w-20 h-20 rounded-full bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center mb-6">
                    <CheckCircle className="w-10 h-10 text-emerald-500 dark:text-emerald-400" />
                  </div>
                  <h2 className="text-3xl font-display font-bold mb-3 text-slate-900 dark:text-white">
                    Message Sent!
                  </h2>
                  <p className="text-slate-600 dark:text-gray-400 mb-8 max-w-sm mx-auto leading-relaxed">
                    Thank you, {form.name || "friend"}. Your project brief has been delivered to our team and we&apos;ll respond within{" "}
                    {pf.responseTime || "24 hours"}.
                  </p>
                  <button
                    type="button"
                    onClick={() => {
                      setStep(1);
                      setIsSuccess(false);
                      setErrorMsg(null);
                      setForm({
                        name: "",
                        email: "",
                        phone: "",
                        company: "",
                        service: "",
                        budget: "",
                        timeline: "",
                        requirements: [],
                        message: "",
                      });
                    }}
                    className="text-sm text-violet-600 dark:text-violet-400 hover:opacity-80 font-semibold transition-colors underline-offset-4 hover:underline"
                  >
                    Submit another inquiry
                  </button>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* ── Info Panel ─────────────────────────────────────────────── */}
          <div className="lg:col-span-5 xl:col-span-4 space-y-5">
            {/* Instant Estimator Card */}
            <div className="bg-white dark:bg-[#0B0D14] border border-slate-200 dark:border-white/10 rounded-3xl p-7 shadow-sm dark:shadow-none">
              <div className="w-11 h-11 bg-cyan-500/10 border border-cyan-500/20 rounded-xl flex items-center justify-center mb-5">
                <Calculator className="w-5 h-5 text-cyan-600 dark:text-cyan-400" />
              </div>
              <h3 className="text-xl font-bold mb-2 text-slate-900 dark:text-white">
                Instant Cost Estimator
              </h3>
              <p className="text-slate-600 dark:text-gray-400 text-sm mb-5 leading-relaxed">
                Configure features and timeline interactively to get an instant ballpark budget range.
              </p>
              <Link
                href="/estimator"
                className="flex items-center justify-center gap-2 w-full py-3 border border-slate-200 dark:border-white/15 bg-slate-50 dark:bg-white/5 text-slate-900 dark:text-white text-sm font-semibold rounded-xl hover:bg-slate-100 dark:hover:bg-white/10 transition-all"
              >
                Launch Estimator <ArrowRight className="w-4 h-4" />
              </Link>
            </div>

            {/* Schedule a call card */}
            <div className="bg-white dark:bg-[#0B0D14] border border-slate-200 dark:border-white/10 rounded-3xl p-7 shadow-sm dark:shadow-none">
              <div className="w-11 h-11 bg-violet-500/10 border border-violet-500/20 rounded-xl flex items-center justify-center mb-5">
                <Calendar className="w-5 h-5 text-violet-600 dark:text-violet-400" />
              </div>
              <h3 className="text-xl font-bold mb-2 text-slate-900 dark:text-white">
                Schedule a Call
              </h3>
              <p className="text-slate-600 dark:text-gray-400 text-sm mb-5 leading-relaxed">
                Prefer talking live? Book a 30-minute discovery call directly with our engineering partners.
              </p>
              <a
                href={siteConfig.socials.calUrl || "https://cal.com"}
                target="_blank"
                rel="noopener noreferrer"
                className="btn-gradient flex items-center justify-center gap-2 w-full py-3 bg-gradient-to-r from-violet-600 to-cyan-500 text-white text-sm font-semibold rounded-xl hover:opacity-90 transition-all"
              >
                Book Discovery Call <ArrowRight className="w-4 h-4" />
              </a>
            </div>

            {/* Direct contact */}
            <div className="bg-white dark:bg-[#0B0D14] border border-slate-200 dark:border-white/10 rounded-3xl p-7 shadow-sm dark:shadow-none">
              <h3 className="text-lg font-bold mb-5 text-slate-900 dark:text-white">
                Direct Contact
              </h3>

              <div className="space-y-4">
                <a
                  href={`mailto:${siteConfig.email || "hello@xornexz.com"}`}
                  className="flex items-center gap-4 group"
                >
                  <div className="w-10 h-10 bg-slate-100 dark:bg-white/5 rounded-full flex items-center justify-center group-hover:bg-violet-500/20 transition-colors flex-shrink-0">
                    <Mail className="w-4 h-4 text-slate-600 dark:text-gray-400 group-hover:text-violet-600 dark:group-hover:text-violet-400 transition-colors" />
                  </div>
                  <div>
                    <div className="text-sm font-semibold text-slate-900 dark:text-white">
                      Email Us
                    </div>
                    <div className="text-xs text-slate-500 dark:text-gray-400">
                      {siteConfig.email || "hello@xornexz.com"}
                    </div>
                  </div>
                </a>

                <a
                  href={siteConfig.socials.linkedin || "https://linkedin.com"}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-4 group"
                >
                  <div className="w-10 h-10 bg-slate-100 dark:bg-white/5 rounded-full flex items-center justify-center group-hover:bg-cyan-500/20 transition-colors flex-shrink-0">
                    <Linkedin className="w-4 h-4 text-slate-600 dark:text-gray-400 group-hover:text-cyan-600 dark:group-hover:text-cyan-400 transition-colors" />
                  </div>
                  <div>
                    <div className="text-sm font-semibold text-slate-900 dark:text-white">
                      LinkedIn
                    </div>
                    <div className="text-xs text-slate-500 dark:text-gray-400">Connect with us</div>
                  </div>
                </a>

                <a
                  href={siteConfig.socials.twitter || "https://twitter.com"}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-4 group"
                >
                  <div className="w-10 h-10 bg-slate-100 dark:bg-white/5 rounded-full flex items-center justify-center group-hover:bg-sky-500/20 transition-colors flex-shrink-0">
                    <Twitter className="w-4 h-4 text-slate-600 dark:text-gray-400 group-hover:text-sky-500 transition-colors" />
                  </div>
                  <div>
                    <div className="text-sm font-semibold text-slate-900 dark:text-white">
                      Twitter / X
                    </div>
                    <div className="text-xs text-slate-500 dark:text-gray-400">Follow updates</div>
                  </div>
                </a>

                <a
                  href={siteConfig.socials.github || "https://github.com"}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-4 group"
                >
                  <div className="w-10 h-10 bg-slate-100 dark:bg-white/5 rounded-full flex items-center justify-center group-hover:bg-slate-200 dark:group-hover:bg-white/10 transition-colors flex-shrink-0">
                    <Github className="w-4 h-4 text-slate-600 dark:text-gray-400 group-hover:text-slate-900 dark:group-hover:text-white transition-colors" />
                  </div>
                  <div>
                    <div className="text-sm font-semibold text-slate-900 dark:text-white">
                      GitHub
                    </div>
                    <div className="text-xs text-slate-500 dark:text-gray-400">
                      Open source & engineering
                    </div>
                  </div>
                </a>
              </div>

              <div className="mt-6 pt-5 border-t border-slate-200 dark:border-white/5 flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-emerald-500 flex-shrink-0" />
                <p className="text-xs text-slate-500 dark:text-gray-400">
                  Average response time:{" "}
                  <span className="font-semibold text-slate-800 dark:text-gray-200">
                    {pf.responseTime || "24 hours"}
                  </span>
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
