import { Metadata } from "next";
import PreloaderWrapper from "@/components/home/PreloaderWrapper";
import Hero from "@/components/home/Hero";
import StatsSection from "@/components/home/StatsSection";
import ServicesSection from "@/components/home/ServicesSection";
import FeaturedProjects from "@/components/home/FeaturedProjects";
import ProcessSection from "@/components/home/ProcessSection";
import TechStack from "@/components/home/TechStack";
import PricingSection from "@/components/home/PricingSection";
import FAQSection from "@/components/home/FAQSection";
import CTASection from "@/components/home/CTASection";

import Testimonials from "@/components/home/Testimonials";

export const metadata: Metadata = {
  title: "Xornexz | We build what's next.",
  description:
    "Xornexz designs and builds websites, web apps, SaaS platforms, and AI-powered systems that make your competitors sweat.",
};

export default function HomePage() {
  return (
    <>
      <PreloaderWrapper />
      <Hero />
      <StatsSection />
      <ServicesSection />
      <FeaturedProjects />
      <ProcessSection />
      <TechStack />
      <Testimonials />
      <PricingSection />
      <FAQSection />
      <CTASection />
    </>
  );
}
