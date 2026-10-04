"use client";

import * as Accordion from "@radix-ui/react-accordion";
import { ChevronDown } from "lucide-react";
import React from "react";


// AccordionItem MUST be defined outside FAQSection — defining it inside causes
// React to see a new component type on every render, forcing Radix to
// unmount/remount and crash accordion state.
function AccordionItem({ value, question, answer }: { value: string; question: string; answer: string }) {
  return (
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
}

export default function FAQSection({ faqs }: { faqs: { question: string; answer: string }[] }) {
  if (!faqs.length) return null;
  const midpoint = Math.ceil(faqs.length / 2);
  const leftColumn = faqs.slice(0, midpoint);
  const rightColumn = faqs.slice(midpoint);

  return (
    <section className="py-32 bg-[#05060A] relative overflow-hidden" id="faq">
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
