import { buildMetadata, buildFAQSchema, buildLocalBusinessSchema, BASE_URL } from '@/lib/seo';

export const metadata = buildMetadata({
  title: "Xornexz — We Build What's Next",
  description:
    'Xornexz is a premium technology studio building websites, web apps, mobile apps, SaaS platforms, and AI-powered systems for ambitious founders and enterprises worldwide.',
  path: '/',
  keywords: [
    'web development agency',
    'software development company',
    'SaaS development agency',
    'mobile app development studio',
    'AI development company',
    'custom software development',
    'Next.js React agency',
    'technology studio',
  ],
});

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
import { getHomeFaqs, getHomeTestimonials, getHomePricing, getHomeFeaturedProjects, getHomeFeaturedCaseStudy } from "@/lib/content";

export const dynamic = 'force-dynamic';



export default async function HomePage() {
  const [faqs, testimonials, pricing, featured, caseStudy] = await Promise.all([
    getHomeFaqs(),
    getHomeTestimonials(),
    getHomePricing(),
    getHomeFeaturedProjects(),
    getHomeFeaturedCaseStudy(),
  ]);
  return (
    <>
      
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify([
            buildLocalBusinessSchema(),
            buildFAQSchema(faqs.map((f: any) => ({ question: f.question, answer: f.answer }))),
          ]),
        }}
      />
<PreloaderWrapper />
      <Hero />
      <ClientLogos />
      <StatsSection />
      <ServicesSection />
      <KineticMarquee />
      <FeaturedCaseStudy project={caseStudy} />
      <FeaturedProjects projects={featured} />
      <WhyUs />
      <ProcessSection />
      <CodeShowcase />
      <TechStack />
      <LiveMetrics />
      <ComparisonTable />
      <Testimonials testimonials={testimonials} />
      <Recognition />
      <AvailabilityBanner />
      <PricingSection models={pricing} />
      <FAQSection faqs={faqs} />
      <CTASection />
    </>
  );
}
