/* Starter content for the homepage. Seeded into the DB on first run; after that the admin panel is the source of truth. */
export const DEFAULT_FAQS = [
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

export const DEFAULT_TESTIMONIALS = [
  {
    id: 1,
    name: "Sarah Jenkins",
    title: "CTO, NexScale",
    avatar: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&q=80&w=150&h=150",
    quote: "Xornexz didn't just build our platform; they completely reimagined how we handle data scaling. The result is 10x faster and absolutely beautiful. Truly an Awwwards-level team.",
    rating: 5,
  },
  {
    id: 2,
    name: "Michael Chen",
    title: "Founder, FinFlow",
    avatar: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=crop&q=80&w=150&h=150",
    quote: "Their attention to detail is unmatched. The mobile app they built for us has over 4.9 stars on the App Store, and the seamless UX is a big reason why.",
    rating: 5,
  },
  {
    id: 3,
    name: "Elena Rodriguez",
    title: "Director of Product, Aura",
    avatar: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?auto=format&fit=crop&q=80&w=150&h=150",
    quote: "Working with them was the best decision we made this year. They took our complex requirements and delivered a streamlined, intuitive solution ahead of schedule.",
    rating: 5,
  }
];

export const DEFAULT_PRICING = [
  {
    name: "Fixed-Scope Project",
    description: "Perfect for well-defined projects with clear deliverables and timelines.",
    features: [
      "Fixed timeline and budget",
      "Dedicated project manager",
      "Defined milestones & deliverables",
      "Best for MVPs & V1 launches"
    ],
    highlighted: false,
  },
  {
    name: "Dedicated Team",
    description: "Scale your capacity instantly with our senior engineers and designers.",
    features: [
      "Full-time dedicated resources",
      "Direct communication channel",
      "Flexible priority management",
      "Ideal for ongoing development"
    ],
    highlighted: true,
  },
  {
    name: "Monthly Retainer",
    description: "Ongoing support, maintenance, and incremental feature updates.",
    features: [
      "Guaranteed monthly hours",
      "Priority response times",
      "Regular technical audits",
      "Continuous optimization"
    ],
    highlighted: false,
  }
];

export const DEFAULT_FEATURED = [
  {
    id: 1,
    title: "Nexus Commerce",
    client: "Nexus Retail Group",
    category: "Web Development",
    image: "https://images.unsplash.com/photo-1551288049-bebda4e38f71?auto=format&fit=crop&q=80&w=2070",
    slug: "nexus-commerce",
    year: "2024",
  },
  {
    id: 2,
    title: "PulseHealth",
    client: "PulseHealth Inc.",
    category: "Mobile App",
    image: "https://images.unsplash.com/photo-1563986768609-322da13575f3?auto=format&fit=crop&q=80&w=1470",
    slug: "pulsehealth",
    year: "2024",
  },
  {
    id: 3,
    title: "VaultAI",
    client: "VaultAI (YC W24)",
    category: "SaaS Platform",
    image: "https://images.unsplash.com/photo-1551434678-e076c223a692?auto=format&fit=crop&q=80&w=2070",
    slug: "vaultai",
    year: "2023",
  },
  {
    id: 4,
    title: "FlowSync",
    client: "FlowSync Logistics",
    category: "API Integration",
    image: "https://images.unsplash.com/photo-1460925895917-afdab827c52f?auto=format&fit=crop&q=80&w=2015",
    slug: "flowsync",
    year: "2023",
  },
];
