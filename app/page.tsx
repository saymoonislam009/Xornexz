import { Metadata } from "next";
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
      <ClientLogos />
      <StatsSection />
      <ServicesSection />
      <KineticMarquee />
      <FeaturedCaseStudy />
      <FeaturedProjects />
      <WhyUs />
      <ProcessSection />
      <CodeShowcase />
      <TechStack />
      <LiveMetrics />
      <ComparisonTable />
      <Testimonials />
      <Recognition />
      <AvailabilityBanner />
      <PricingSection />
      <FAQSection />
      <CTASection />
    </>
  );
}
