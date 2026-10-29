import { buildMetadata, buildFAQSchema, buildLocalBusinessSchema } from "@/lib/seo";
import PreloaderWrapper from "@/components/home/PreloaderWrapper";
import Hero from "@/components/home/Hero";
import ClientLogos from "@/components/home/ClientLogos";
import StatsSection from "@/components/home/StatsSection";
import ServicesSection from "@/components/home/ServicesSection";
import KineticMarquee from "@/components/home/KineticMarquee";
import FeaturedCaseStudy from "@/components/home/FeaturedCaseStudy";
import FeaturedProjects from "@/components/home/FeaturedProjects";
import WhyUs from "@/components/home/WhyUs";
import ProcessSection from "@/components/home/ProcessSection";
import CodeShowcase from "@/components/home/CodeShowcase";
import TechStack from "@/components/home/TechStack";
import LiveMetrics from "@/components/home/LiveMetrics";
import ComparisonTable from "@/components/home/ComparisonTable";
import Testimonials from "@/components/home/Testimonials";
import Recognition from "@/components/home/Recognition";
import AvailabilityBanner from "@/components/home/AvailabilityBanner";
import PricingSection from "@/components/home/PricingSection";
import FAQSection from "@/components/home/FAQSection";
import CTASection from "@/components/home/CTASection";
import {
  getHomeFaqs,
  getHomeTestimonials,
  getHomePricing,
  getHomeProcessSteps,
  getHomeFeaturedProjects,
  getHomeFeaturedCaseStudy,
  getPublicServices,
  getHomeSections,
} from "@/lib/content";
import { getPublicSiteConfig } from "@/lib/site-config";
import type { ReactNode } from "react";

export const metadata = buildMetadata({
  title: "Xornexz — We Build What's Next",
  description:
    "Xornexz is a premium technology studio building websites, web apps, mobile apps, SaaS platforms, and AI-powered systems for ambitious founders and enterprises worldwide.",
  path: "/",
  keywords: [
    "web development agency",
    "software development company",
    "SaaS development agency",
    "mobile app development studio",
    "AI development company",
    "custom software development",
    "Next.js React agency",
    "technology studio",
  ],
});

export const revalidate = 30;

export default async function HomePage() {
  const [
    faqs,
    testimonials,
    pricing,
    processSteps,
    featured,
    caseStudy,
    services,
    siteConfig,
    homeSections,
  ] = await Promise.all([
    getHomeFaqs(),
    getHomeTestimonials(),
    getHomePricing(),
    getHomeProcessSteps(),
    getHomeFeaturedProjects(),
    getHomeFeaturedCaseStudy(),
    getPublicServices(),
    getPublicSiteConfig(),
    getHomeSections(),
  ]);

  const sectionBlocks: Record<string, ReactNode> = {
    hero: (
      <div key="hero">
        <Hero hero={siteConfig.hero} />
        <ClientLogos />
      </div>
    ),
    stats: <StatsSection key="stats" stats={siteConfig.mainStats} />,
    services: (
      <div key="services">
        <ServicesSection services={services} />
        <KineticMarquee />
      </div>
    ),
    projects: (
      <div key="projects">
        <FeaturedCaseStudy project={caseStudy} />
        <FeaturedProjects projects={featured} />
        <WhyUs />
      </div>
    ),
    process: (
      <div key="process">
        <ProcessSection steps={processSteps} />
        <CodeShowcase />
      </div>
    ),
    techstack: (
      <div key="techstack">
        <TechStack />
        <LiveMetrics />
        <ComparisonTable />
      </div>
    ),
    testimonials: (
      <div key="testimonials">
        <Testimonials testimonials={testimonials} />
        <Recognition />
      </div>
    ),
    pricing: (
      <div key="pricing">
        <AvailabilityBanner
          slots={siteConfig.availability.slots}
          statusText={siteConfig.availability.statusText}
          heading={siteConfig.availability.heading}
          subtext={siteConfig.availability.subtext}
          ctaLabel={siteConfig.availability.ctaLabel}
          ctaHref={siteConfig.availability.ctaHref}
        />
        <PricingSection models={pricing} />
      </div>
    ),
    faq: <FAQSection key="faq" faqs={faqs} />,
    cta: <CTASection key="cta" cta={siteConfig.cta} />,
  };

  const orderedKeys = homeSections.map((s) => s.key);
  const missingKeys = Object.keys(sectionBlocks).filter((k) => !orderedKeys.includes(k));

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify([
            buildLocalBusinessSchema(),
            buildFAQSchema(faqs.map((f: { question: string; answer: string }) => ({ question: f.question, answer: f.answer }))),
          ]),
        }}
      />
      <PreloaderWrapper />
      {homeSections
        .filter((s) => s.enabled !== false)
        .map((s) => sectionBlocks[s.key] ?? null)}
      {missingKeys.map((k) => sectionBlocks[k])}
    </>
  );
}
