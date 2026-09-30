import { Metadata } from "next";
import PreloaderWrapper from "@/components/home/PreloaderWrapper";
import Hero from "@/components/home/Hero";
import ClientLogos from "@/components/home/ClientLogos";
import StatsSection from "@/components/home/StatsSection";
import ServicesSection from "@/components/home/ServicesSection";
import FeaturedProjects from "@/components/home/FeaturedProjects";
import WhyUs from "@/components/home/WhyUs";
import ProcessSection from "@/components/home/ProcessSection";
import TechStack from "@/components/home/TechStack";
import ComparisonTable from "@/components/home/ComparisonTable";
import Testimonials from "@/components/home/Testimonials";
import Recognition from "@/components/home/Recognition";
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
      <FeaturedProjects />
      <WhyUs />
      <ProcessSection />
      <TechStack />
      <ComparisonTable />
      <Testimonials />
      <Recognition />
      <PricingSection />
      <FAQSection />
      <CTASection />
    </>
  );
}
