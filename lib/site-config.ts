import { unstable_cache } from "next/cache";
import { prisma } from "@/lib/db";

export interface HeroStatItem {
  value: string;
  label: string;
}

export interface MainStatItem {
  end: number;
  suffix: string;
  label: string;
}

export interface AvailabilitySlotItem {
  month: string;
  spots: number;
  taken: number;
}

export interface CtaProofItem {
  highlight: string;
  label: string;
}

export interface EstimatorProjectType {
  id: string;
  title: string;
  icon: string;
  desc: string;
  basePrice: number;
}

export interface EstimatorFeature {
  id: string;
  title: string;
  desc: string;
  price: number;
}

export interface EstimatorTimeline {
  id: string;
  title: string;
  desc: string;
  multiplier: number;
}

export interface EstimatorBudget {
  id: string;
  title: string;
  desc: string;
}

export interface ProjectFormConfig {
  badgeText: string;
  heading: string;
  subheading: string;
  responseTime: string;
  messagePlaceholder: string;
  services: string[];
  budgets: string[];
  timelines: string[];
  requirements: string[];
}

export interface EstimatorConfig {
  heading: string;
  subheading: string;
  projectTypes: EstimatorProjectType[];
  features: EstimatorFeature[];
  timelines: EstimatorTimeline[];
  budgets: EstimatorBudget[];
}

export interface AvailabilityConfig {
  statusText: string;
  heading: string;
  subtext: string;
  ctaLabel: string;
  ctaHref: string;
  slots: AvailabilitySlotItem[];
}

export interface CtaConfig {
  badgeText: string;
  heading: string;
  subtext: string;
  cta1Label: string;
  cta1Href: string;
  cta2Label: string;
  cta2Href: string;
  proofItems: CtaProofItem[];
}

export interface SiteConfig {
  siteName: string;
  siteTagline: string;
  email: string;
  phone: string;
  address: string;
  logoUrl: string;
  logoDarkUrl: string;
  cookieConsentEnabled: boolean;
  maintenanceMode: boolean;
  maintenanceMessage: string;
  socials: {
    twitter: string;
    linkedin: string;
    github: string;
    instagram: string;
    youtube: string;
    calUrl: string;
  };
  hero: {
    badgeText: string;
    headline: string;
    subheadline: string;
    cta1Label: string;
    cta1Href: string;
    cta2Label: string;
    cta2Href: string;
    rotatingWords: string[];
    techPills: string[];
    stats: HeroStatItem[];
  };
  mainStats: MainStatItem[];
  availability: AvailabilityConfig;
  cta: CtaConfig;
  projectForm: ProjectFormConfig;
  estimator: EstimatorConfig;
}

export const DEFAULT_PROJECT_FORM: ProjectFormConfig = {
  badgeText: "Available for new projects",
  heading: "Let's build what's next.",
  subheading:
    "Tell us about your project and we'll get back to you within 24 hours with a tailored roadmap and proposal.",
  responseTime: "24 hours",
  messagePlaceholder:
    "Describe what you're building, key goals, target users, or any links/references you'd like to share...",
  services: [
    "Website Design & Development",
    "Mobile App Development",
    "SaaS Platform",
    "Custom Software",
    "AI / Automation Integration",
    "API & System Integration",
    "UI/UX Design",
    "Cloud & DevOps",
  ],
  budgets: [
    "Under $5k",
    "$5k – $15k",
    "$15k – $35k",
    "$35k – $75k",
    "$75k+",
    "Let's discuss",
  ],
  timelines: [
    "ASAP (< 1 month)",
    "1 – 3 months",
    "3 – 6 months",
    "6+ months",
    "Flexible",
  ],
  requirements: [
    "UI/UX Design & Prototyping",
    "Admin Portal / CMS",
    "Payment / Subscription Billing",
    "AI / LLM Capabilities",
    "NDA Required",
    "Post-Launch Maintenance",
  ],
};

export const DEFAULT_ESTIMATOR: EstimatorConfig = {
  heading: "Project Estimator",
  subheading: "Configure your project scope and get an instant ballpark investment range.",
  projectTypes: [
    {
      id: "web",
      title: "Web Application",
      icon: "🌐",
      desc: "Custom web platforms, portals, and SaaS products",
      basePrice: 4000,
    },
    {
      id: "mobile",
      title: "Mobile App",
      icon: "📱",
      desc: "iOS and Android cross-platform or native apps",
      basePrice: 6500,
    },
    {
      id: "ecommerce",
      title: "E-Commerce",
      icon: "🛍️",
      desc: "High-converting online stores and marketplaces",
      basePrice: 5000,
    },
    {
      id: "marketing",
      title: "Marketing / Brand Site",
      icon: "✨",
      desc: "Premium landing pages and corporate websites",
      basePrice: 2500,
    },
  ],
  features: [
    {
      id: "auth",
      title: "User Authentication & Roles",
      desc: "Login, signup, SSO, and RBAC permissions",
      price: 900,
    },
    {
      id: "payments",
      title: "Payments & Subscriptions",
      desc: "Stripe, invoicing, or custom checkout gateways",
      price: 1200,
    },
    {
      id: "cms",
      title: "Admin Dashboard & CMS",
      desc: "Manage all site data, users, and analytics",
      price: 1400,
    },
    {
      id: "realtime",
      title: "Real-Time & Messaging",
      desc: "Live notifications, chat, or streaming updates",
      price: 1100,
    },
    {
      id: "ai",
      title: "AI & Workflow Automation",
      desc: "LLM copilot, RAG search, or smart automations",
      price: 1600,
    },
    {
      id: "api",
      title: "Third-Party Integrations",
      desc: "CRM, ERP, webhooks, and external REST/GraphQL APIs",
      price: 900,
    },
  ],
  timelines: [
    { id: "rush", title: "ASAP (Priority Sprint)", desc: "Less than 1 month", multiplier: 1.35 },
    { id: "standard", title: "Standard Delivery", desc: "1 – 3 months", multiplier: 1.0 },
    { id: "flexible", title: "Flexible Roadmap", desc: "3+ months", multiplier: 0.9 },
  ],
  budgets: [
    { id: "Under $5k", title: "Under $5k", desc: "Focused MVP or landing site" },
    { id: "$5k – $15k", title: "$5k – $15k", desc: "Standard product or web app" },
    { id: "$15k – $50k", title: "$15k – $50k", desc: "Full-scale SaaS or mobile platform" },
    { id: "$50k+", title: "$50k+", desc: "Enterprise-grade multi-system build" },
  ],
};

export const DEFAULT_AVAILABILITY: AvailabilityConfig = {
  statusText: "Currently Open",
  heading: "Limited Project Slots",
  subtext:
    "We cap new projects per quarter to guarantee senior engineering attention. Reserve your slot early.",
  ctaLabel: "Book a Discovery Call",
  ctaHref: "/contact",
  slots: [
    { month: "Q4 2026", spots: 2, taken: 1 },
    { month: "Q1 2027", spots: 3, taken: 1 },
    { month: "Q2 2027", spots: 3, taken: 0 },
  ],
};

export const DEFAULT_CTA: CtaConfig = {
  badgeText: "Currently accepting new projects",
  heading: "Ready to Build Something Remarkable?",
  subtext:
    "Let's turn your ambitious vision into an exceptional digital reality. Our team is ready when you are.",
  cta1Label: "Start a Project",
  cta1Href: "/contact",
  cta2Label: "Estimate Your Budget",
  cta2Href: "/estimator",
  proofItems: [
    { highlight: "120+", label: "Projects shipped" },
    { highlight: "98%", label: "Client satisfaction" },
    { highlight: "4.9★", label: "Average rating" },
    { highlight: "24h", label: "Response time" },
  ],
};

export const DEFAULT_HERO_STATS: HeroStatItem[] = [
  { value: "120+", label: "Projects" },
  { value: "7 yrs", label: "Experience" },
  { value: "98%", label: "Satisfied" },
  { value: "24h", label: "Response" },
];

export const DEFAULT_MAIN_STATS: MainStatItem[] = [
  { end: 120, suffix: "+", label: "Projects Delivered" },
  { end: 98, suffix: "%", label: "Client Satisfaction" },
  { end: 7, suffix: "+", label: "Years Building" },
  { end: 40, suffix: "+", label: "Team Members" },
];

export const DEFAULT_SITE_CONFIG: SiteConfig = {
  siteName: "Xornexz",
  siteTagline: "We build what's next.",
  email: "hello@xornexz.com",
  phone: "+1 (555) 000-0000",
  address: "",
  logoUrl: "",
  logoDarkUrl: "",
  cookieConsentEnabled: true,
  maintenanceMode: false,
  maintenanceMessage: "We'll be back shortly.",
  socials: {
    twitter: "",
    linkedin: "",
    github: "",
    instagram: "",
    youtube: "",
    calUrl: "",
  },
  hero: {
    badgeText: "Accepting new projects — Limited slots open",
    headline: "We Build What's Next.",
    subheadline:
      "A technology studio that partners with ambitious founders and enterprises to engineer world-class digital products — from MVPs to enterprise platforms.",
    cta1Label: "Start a Project",
    cta1Href: "/contact",
    cta2Label: "See Our Work",
    cta2Href: "/portfolio",
    rotatingWords: [
      "Web Applications",
      "SaaS Platforms",
      "Mobile Apps",
      "AI Systems",
      "Design Systems",
    ],
    techPills: ["Next.js", "React Native", "AI / LLMs"],
    stats: DEFAULT_HERO_STATS,
  },
  mainStats: DEFAULT_MAIN_STATS,
  availability: DEFAULT_AVAILABILITY,
  cta: DEFAULT_CTA,
  projectForm: DEFAULT_PROJECT_FORM,
  estimator: DEFAULT_ESTIMATOR,
};

/* eslint-disable @typescript-eslint/no-explicit-any */
export function buildSiteConfigFromRow(row: any): SiteConfig {
  if (!row) return DEFAULT_SITE_CONFIG;

  const extra = (row.statsJson && typeof row.statsJson === "object" ? row.statsJson : {}) as Record<string, any>;
  const socials = (row.socialsJson && typeof row.socialsJson === "object" ? row.socialsJson : {}) as Record<string, any>;
  const pf = (extra.projectForm && typeof extra.projectForm === "object" ? extra.projectForm : {}) as Record<string, any>;
  const est = (extra.estimator && typeof extra.estimator === "object" ? extra.estimator : {}) as Record<string, any>;
  const avail = (extra.availability && typeof extra.availability === "object" ? extra.availability : {}) as Record<string, any>;
  const cta = (extra.cta && typeof extra.cta === "object" ? extra.cta : {}) as Record<string, any>;
  const heroExtra = (extra.hero && typeof extra.hero === "object" ? extra.hero : {}) as Record<string, any>;

  const nonEmptyArray = <T>(val: unknown, fallback: T[]): T[] =>
    Array.isArray(val) && val.length > 0 ? (val as T[]) : fallback;

  return {
    siteName: row.siteName || DEFAULT_SITE_CONFIG.siteName,
    siteTagline: row.siteTagline || DEFAULT_SITE_CONFIG.siteTagline,
    email: row.email || DEFAULT_SITE_CONFIG.email,
    phone: row.phone ?? DEFAULT_SITE_CONFIG.phone,
    address: row.address ?? DEFAULT_SITE_CONFIG.address,
    logoUrl: row.logoUrl || "",
    logoDarkUrl: row.logoDarkUrl || "",
    cookieConsentEnabled: row.cookieConsentEnabled !== false,
    maintenanceMode: Boolean(row.maintenanceMode),
    maintenanceMessage: row.maintenanceMessage || DEFAULT_SITE_CONFIG.maintenanceMessage,
    socials: {
      twitter: socials.twitter || "",
      linkedin: socials.linkedin || "",
      github: socials.github || "",
      instagram: socials.instagram || "",
      youtube: socials.youtube || "",
      calUrl: socials.calUrl || "",
    },
    hero: {
      badgeText: heroExtra.badgeText || DEFAULT_SITE_CONFIG.hero.badgeText,
      headline: row.heroHeadline || DEFAULT_SITE_CONFIG.hero.headline,
      subheadline: row.heroSubheadline || DEFAULT_SITE_CONFIG.hero.subheadline,
      cta1Label: row.heroCta1Label || DEFAULT_SITE_CONFIG.hero.cta1Label,
      cta1Href: row.heroCta1Href || DEFAULT_SITE_CONFIG.hero.cta1Href,
      cta2Label: row.heroCta2Label || DEFAULT_SITE_CONFIG.hero.cta2Label,
      cta2Href: row.heroCta2Href || DEFAULT_SITE_CONFIG.hero.cta2Href,
      rotatingWords: nonEmptyArray(heroExtra.rotatingWords, DEFAULT_SITE_CONFIG.hero.rotatingWords),
      techPills: nonEmptyArray(heroExtra.techPills, DEFAULT_SITE_CONFIG.hero.techPills),
      stats: nonEmptyArray(heroExtra.stats, DEFAULT_HERO_STATS),
    },
    mainStats: nonEmptyArray(extra.mainStats, DEFAULT_MAIN_STATS),
    availability: {
      statusText: avail.statusText || DEFAULT_AVAILABILITY.statusText,
      heading: avail.heading || DEFAULT_AVAILABILITY.heading,
      subtext: avail.subtext || DEFAULT_AVAILABILITY.subtext,
      ctaLabel: avail.ctaLabel || DEFAULT_AVAILABILITY.ctaLabel,
      ctaHref: avail.ctaHref || DEFAULT_AVAILABILITY.ctaHref,
      slots: nonEmptyArray(avail.slots, DEFAULT_AVAILABILITY.slots),
    },
    cta: {
      badgeText: cta.badgeText || DEFAULT_CTA.badgeText,
      heading: cta.heading || DEFAULT_CTA.heading,
      subtext: cta.subtext || DEFAULT_CTA.subtext,
      cta1Label: cta.cta1Label || DEFAULT_CTA.cta1Label,
      cta1Href: cta.cta1Href || DEFAULT_CTA.cta1Href,
      cta2Label: cta.cta2Label || DEFAULT_CTA.cta2Label,
      cta2Href: cta.cta2Href || DEFAULT_CTA.cta2Href,
      proofItems: nonEmptyArray(cta.proofItems, DEFAULT_CTA.proofItems),
    },
    projectForm: {
      badgeText: pf.badgeText || DEFAULT_PROJECT_FORM.badgeText,
      heading: pf.heading || DEFAULT_PROJECT_FORM.heading,
      subheading: pf.subheading || DEFAULT_PROJECT_FORM.subheading,
      responseTime: pf.responseTime || DEFAULT_PROJECT_FORM.responseTime,
      messagePlaceholder: pf.messagePlaceholder || DEFAULT_PROJECT_FORM.messagePlaceholder,
      services: nonEmptyArray(pf.services, DEFAULT_PROJECT_FORM.services),
      budgets: nonEmptyArray(pf.budgets, DEFAULT_PROJECT_FORM.budgets),
      timelines: nonEmptyArray(pf.timelines, DEFAULT_PROJECT_FORM.timelines),
      requirements: Array.isArray(pf.requirements)
        ? pf.requirements
        : DEFAULT_PROJECT_FORM.requirements,
    },
    estimator: {
      heading: est.heading || DEFAULT_ESTIMATOR.heading,
      subheading: est.subheading || DEFAULT_ESTIMATOR.subheading,
      projectTypes: nonEmptyArray(est.projectTypes, DEFAULT_ESTIMATOR.projectTypes),
      features: nonEmptyArray(est.features, DEFAULT_ESTIMATOR.features),
      timelines: nonEmptyArray(est.timelines, DEFAULT_ESTIMATOR.timelines),
      budgets: nonEmptyArray(est.budgets, DEFAULT_ESTIMATOR.budgets),
    },
  };
}

export const getPublicSiteConfig = unstable_cache(
  async (): Promise<SiteConfig> => {
    try {
      const row = await prisma.siteSettings.findUnique({
        where: { id: "default" },
      });
      return buildSiteConfigFromRow(row);
    } catch (err) {
      console.error("[site-config] fallback to defaults:", err);
      return DEFAULT_SITE_CONFIG;
    }
  },
  ["public-site-config"],
  { revalidate: 60, tags: ["site-settings", "home-content"] }
);
