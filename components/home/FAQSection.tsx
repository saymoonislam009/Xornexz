"use client";

import * as Accordion from "@radix-ui/react-accordion";
import { ChevronDown } from "lucide-react";
import React from "react";

const faqs = [
  {
    question: "What is your typical project timeline?",
    answer: "Project timelines vary depending on scope and complexity. A typical marketing website takes 4-6 weeks, while complex web applications or SaaS platforms can take 3-6 months. We'll provide a detailed timeline during the discovery phase."
  },
  {
    question: "Do you offer post-launch support?",
    answer: "Absolutely. We offer various monthly retainer packages for maintenance, security updates, and continued feature development to ensure your product scales smoothly."
  },
  {
    question: "Who owns the intellectual property (IP)?",
    answer: "You do. Upon full payment for the project, all source code, design files, and intellectual property rights are completely transferred to you."
  },
  {
    question: "What technologies do you use?",
    answer: "We specialize in modern JavaScript/TypeScript ecosystems. Our primary stack includes Next.js, React, Node.js, and PostgreSQL. We also utilize Python for AI/ML features and AWS/Vercel for robust hosting."
  },
  {
    question: "How do you handle revisions during design?",
    answer: "Our process includes structured feedback loops. We provide multiple concepts initially, followed by 2-3 rounds of revisions on the chosen direction to ensure we hit the mark before development begins."
  },
  {
    question: "Can you work with our existing backend or APIs?",
    answer: "Yes, we frequently build modern frontend interfaces that integrate seamlessly with existing legacy backends, third-party APIs, or headless CMS platforms."
  },
  {
    question: "How much do your services cost?",
    answer: "Since every project is unique, we custom quote based on your specific requirements. We offer fixed-scope pricing for defined projects and dedicated team models for ongoing work. Contact us for a precise estimate."
  },
  {
    question: "How do we get started?",
    answer: "It starts with a conversation. Reach out via our contact form, and we'll schedule a discovery call to understand your goals, discuss feasibility, and outline the next steps."
  }
];

export default function FAQSection() {
  const midpoint = Math.ceil(faqs.length / 2);
  const leftColumn = faqs.slice(0, midpoint);
  const rightColumn = faqs.slice(midpoint);

  const AccordionItem = ({ value, question, answer }: { value: string, question: string, answer: string }) => (
    <Accordion.Item 
      value={value} 
      className="mb-4 overflow-hidden rounded-2xl border border-white/10 bg-white/[0.02] data-[state=open]:bg-white/[0.04] transition-colors"
    >
      <Accordion.Header className="flex">
        <Accordion.Trigger className="group flex flex-1 items-center justify-between p-6 text-left text-lg font-medium text-white transition-all hover:text-cyan-400 focus:outline-none focus-visible:ring-2 focus-visible:ring-cyan-500 focus-visible:ring-inset rounded-2xl">
          {question}
          <ChevronDown 
            className="h-5 w-5 shrink-0 text-gray-500 transition-transform duration-300 ease-[cubic-bezier(0.87,_0,_0.13,_1)] group-data-[state=open]:rotate-180 group-data-[state=open]:text-cyan-400 ml-4" 
            aria-hidden
          />
        </Accordion.Trigger>
      </Accordion.Header>
      <Accordion.Content className="overflow-hidden text-gray-400 data-[state=closed]:animate-accordion-up data-[state=open]:animate-accordion-down">
        <div className="p-6 pt-0 leading-relaxed text-sm md:text-base">
          {answer}
        </div>
      </Accordion.Content>
    </Accordion.Item>
  );

  return (
    <section className="py-32 bg-[#05060A]" id="faq">
      <div className="container mx-auto px-4 md:px-6">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold font-display text-white mb-4">
            Common Questions
          </h2>
          <p className="text-gray-400 text-lg max-w-2xl mx-auto">
            Everything you need to know about working with us.
          </p>
        </div>

        <Accordion.Root type="multiple" className="grid grid-cols-1 lg:grid-cols-2 gap-x-6">
          <div className="flex flex-col">
            {leftColumn.map((faq, i) => (
              <AccordionItem key={i} value={`item-l-${i}`} question={faq.question} answer={faq.answer} />
            ))}
          </div>
          <div className="flex flex-col">
            {rightColumn.map((faq, i) => (
              <AccordionItem key={i} value={`item-r-${i}`} question={faq.question} answer={faq.answer} />
            ))}
          </div>
        </Accordion.Root>
      </div>
    </section>
  );
}
