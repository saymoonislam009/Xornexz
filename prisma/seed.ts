import { PrismaClient, UserRole } from '@prisma/client'
import bcrypt from 'bcryptjs'

const prisma = new PrismaClient()
const isReset = process.argv.includes('--reset')

async function main() {
  console.log('Starting seed...')
  
  if (isReset) {
    console.log('--reset flag: deleting all existing data...')
    await prisma.auditLog.deleteMany()
    await prisma.leadNote.deleteMany()
    await prisma.lead.deleteMany()
    await prisma.application.deleteMany()
    await prisma.job.deleteMany()
    await prisma.fAQ.deleteMany()
    await prisma.processStep.deleteMany()
    await prisma.techItem.deleteMany()
    await prisma.pricingPlan.deleteMany()
    await prisma.homeSection.deleteMany()
    await prisma.testimonial.deleteMany()
    await prisma.teamMember.deleteMany()
    await prisma.blogPost.deleteMany()
    await prisma.service.deleteMany()
    await prisma.project.deleteMany()
    await prisma.newsletterSubscriber.deleteMany()
    await prisma.siteSettings.deleteMany()
    await prisma.user.deleteMany()
  }

  // Admin user
  const email = process.env.ADMIN_EMAIL || 'admin@xornexz.com'
  const password = process.env.ADMIN_PASSWORD || 'ChangeMe123!'
  const existing = await prisma.user.findUnique({ where: { email } })
  if (!existing) {
    const hashed = await bcrypt.hash(password, 12)
    await prisma.user.create({
      data: { name: 'Admin', email, password: hashed, role: UserRole.SUPER_ADMIN }
    })
    console.log(`Created admin: ${email}`)
  } else {
    console.log(`Admin already exists: ${email}`)
  }

  // Site settings
  await prisma.siteSettings.upsert({
    where: { id: 'default' },
    create: {
      id: 'default',
      siteName: 'Xornexz',
      siteTagline: "We build what's next.",
      email: 'hello@xornexz.com',
      phone: '+1 (555) 100-2000',
      heroHeadline: "We Build What's Next.",
      heroSubheadline: 'Xornexz designs and builds websites, web apps, SaaS platforms, and AI-powered systems that make your competitors sweat.',
      heroCta1Label: 'Start a Project',
      heroCta1Href: '/contact',
      heroCta2Label: 'See Our Work',
      heroCta2Href: '/portfolio',
      statsJson: [
        { value: '50+', label: 'Projects Shipped' },
        { value: '30+', label: 'Clients Served' },
        { value: '8', label: 'Years in Business' },
        { value: '99%', label: 'Client Retention' },
      ],
      socialsJson: {
        twitter: 'https://twitter.com/xornexz',
        linkedin: 'https://linkedin.com/company/xornexz',
        github: 'https://github.com/xornexz',
      },
    },
    update: {},
  })

  // Home sections
  const sections = [
    { key: 'hero', order: 0 },
    { key: 'stats', order: 1 },
    { key: 'services', order: 2 },
    { key: 'projects', order: 3 },
    { key: 'process', order: 4 },
    { key: 'techstack', order: 5 },
    { key: 'testimonials', order: 6 },
    { key: 'pricing', order: 7 },
    { key: 'faq', order: 8 },
    { key: 'cta', order: 9 },
  ]
  for (const s of sections) {
    await prisma.homeSection.upsert({
      where: { key: s.key },
      create: { ...s, enabled: true },
      update: {},
    })
  }

  // Services (7)
  const services = [
    { slug: 'web-development', title: 'Web Development', tagline: 'Scalable web apps that perform', icon: 'Monitor', description: 'From marketing sites to complex SaaS dashboards, we build web experiences that are fast, accessible, and built to scale.', order: 0 },
    { slug: 'mobile-apps', title: 'Mobile Apps', tagline: 'iOS and Android, native and cross-platform', icon: 'Smartphone', description: 'React Native and Flutter apps that feel at home on every device, with offline support and push notifications built in.', order: 1 },
    { slug: 'saas-software', title: 'SaaS Platforms', tagline: 'Build your product, not your infrastructure', icon: 'Cloud', description: 'Multi-tenant SaaS with subscription billing, team management, analytics, and everything you need to grow.', order: 2 },
    { slug: 'ui-ux-design', title: 'UI/UX Design', tagline: 'Design that converts and delights', icon: 'Layers', description: 'Research-led design from wireframes to polished, pixel-perfect interfaces. We ship design systems that scale.', order: 3 },
    { slug: 'ai-automation', title: 'AI & Automation', tagline: 'Intelligent systems that work for you', icon: 'Cpu', description: 'LLM integrations, custom ML pipelines, workflow automation, and AI-powered features that give your product an edge.', order: 4 },
    { slug: 'api-integrations', title: 'API & Integrations', tagline: 'Connect everything, automate anything', icon: 'Plug', description: 'Third-party API integrations, payment gateways, CRM sync, webhooks, and custom middleware that keeps your stack talking.', order: 5 },
    { slug: 'custom-software', title: 'Custom Software', tagline: 'Engineered for your exact requirements', icon: 'Code', description: 'Bespoke software solutions when off-the-shelf does not cut it. We scope, architect, and deliver.', order: 6 },
  ]
  for (const s of services) {
    await prisma.service.upsert({
      where: { slug: s.slug },
      create: s,
      update: { title: s.title, tagline: s.tagline, description: s.description, order: s.order },
    })
  }

  // Projects (6)
  const projects = [
    { slug: 'nexus-commerce', title: 'Nexus Commerce', tagline: 'Next-generation e-commerce infrastructure', client: 'Nexus Corp', category: 'E-commerce', year: 2024, description: 'A high-performance, multi-vendor e-commerce platform handling 50,000+ SKUs with real-time inventory and AI-powered recommendations.', coverImage: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)', featured: true, order: 0 },
    { slug: 'pulsehealth', title: 'PulseHealth', tagline: 'Telehealth platform connecting patients to care', client: 'PulseHealth Inc.', category: 'HealthTech', year: 2024, description: 'HIPAA-compliant telehealth platform with video consultations, e-prescriptions, and EHR integration for 200+ providers.', coverImage: 'linear-gradient(135deg, #f093fb 0%, #f5576c 100%)', featured: true, order: 1 },
    { slug: 'vaultai', title: 'VaultAI', tagline: 'AI-powered document intelligence platform', client: 'VaultAI Ltd.', category: 'AI / SaaS', year: 2023, description: 'Document processing SaaS that uses LLMs to extract, classify, and summarize contracts, invoices, and legal documents at scale.', coverImage: 'linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)', featured: true, order: 2 },
    { slug: 'flowsync', title: 'FlowSync', tagline: 'Unified workflow automation for operations teams', client: 'FlowSync GmbH', category: 'B2B SaaS', year: 2023, description: 'No-code workflow builder with 200+ integrations, conditional logic, approval flows, and real-time audit trails.', coverImage: 'linear-gradient(135deg, #43e97b 0%, #38f9d7 100%)', featured: false, order: 3 },
    { slug: 'aura-design-system', title: 'Aura Design System', tagline: 'Enterprise design system and component library', client: 'Aura Financial', category: 'Design Systems', year: 2023, description: 'A comprehensive design system with 120+ components, accessibility-first, dark/light modes, and detailed Storybook documentation.', coverImage: 'linear-gradient(135deg, #fa709a 0%, #fee140 100%)', featured: false, order: 4 },
    { slug: 'autopilot-analytics', title: 'AutoPilot Analytics', tagline: 'Real-time business intelligence for growth teams', client: 'AutoPilot Inc.', category: 'Analytics', year: 2024, description: 'Self-serve analytics dashboard with cohort analysis, funnel visualisation, and automated insight reports delivered by email.', coverImage: 'linear-gradient(135deg, #a18cd1 0%, #fbc2eb 100%)', featured: true, order: 5 },
  ]
  for (const p of projects) {
    await prisma.project.upsert({
      where: { slug: p.slug },
      create: p,
      update: { title: p.title, tagline: p.tagline, description: p.description, featured: p.featured, order: p.order },
    })
  }

  // Process steps (5)
  const processSteps = [
    { icon: 'MessageSquare', title: 'Discovery', description: 'We start with a deep-dive into your business goals, user needs, and technical constraints. Honest scoping, no fluff.', order: 0 },
    { icon: 'Layers', title: 'Design', description: 'Wireframes, prototypes, and high-fidelity designs reviewed in real time. Your feedback shapes every screen.', order: 1 },
    { icon: 'Code2', title: 'Build', description: 'Iterative, test-driven development with weekly demos. You always know exactly where things stand.', order: 2 },
    { icon: 'Rocket', title: 'Launch', description: 'Staged rollout, performance audits, and load testing before go-live. We stay on-call for the first 48 hours.', order: 3 },
    { icon: 'TrendingUp', title: 'Grow', description: 'Post-launch analytics review, iteration sprints, and ongoing support. We treat your success as our own.', order: 4 },
  ]
  for (const s of processSteps) {
    await prisma.processStep.upsert({
      where: { id: `process-${s.order}` },
      create: { id: `process-${s.order}`, ...s },
      update: { title: s.title, description: s.description, icon: s.icon },
    })
  }

  // Pricing plans (3)
  const pricingPlans = [
    { id: 'plan-sprint', name: 'Sprint', tagline: 'Best for focused features or MVPs', price: 'From $5,000', period: 'one-time', features: ['Up to 6 weeks', 'Dedicated engineer', 'Figma prototype included', 'Code handoff', 'Post-launch support (2 weeks)'], ctaLabel: 'Start a Sprint', ctaHref: '/contact', highlighted: false, order: 0 },
    { id: 'plan-studio', name: 'Studio', tagline: 'Ongoing product development partnership', price: 'From $8,000', period: 'per month', features: ['Full team (PM, design, eng)', '4 engineers included', 'Weekly demos', 'Priority Slack support', 'Cancel any month'], ctaLabel: 'Partner With Us', ctaHref: '/contact', highlighted: true, order: 1 },
    { id: 'plan-enterprise', name: 'Enterprise', tagline: 'For complex systems and large teams', price: 'Custom', features: ['Dedicated team (5–15 people)', 'SLA-backed delivery', 'On-site workshops', 'Security reviews', 'NDA & IP assignment'], ctaLabel: 'Talk to Sales', ctaHref: '/contact', highlighted: false, order: 2 },
  ]
  for (const p of pricingPlans) {
    await prisma.pricingPlan.upsert({
      where: { id: p.id },
      create: p,
      update: { name: p.name, tagline: p.tagline, price: p.price, features: p.features, highlighted: p.highlighted },
    })
  }

  // FAQs (8)
  const faqs = [
    { question: 'How long does a typical project take?', answer: 'Most projects take 8 to 16 weeks from kickoff to launch. MVPs and focused feature sprints can be as short as 3 weeks. We give you a detailed timeline in the proposal stage.', order: 0 },
    { question: 'Do you work with early-stage startups?', answer: 'Yes. We have helped founders go from idea to funded product. We offer fixed-scope Sprint engagements designed for early-stage budgets.', order: 1 },
    { question: 'What does the process look like after I reach out?', answer: 'We schedule a 30-minute discovery call, then send a proposal within 72 hours. Once approved, we start with a one-week discovery sprint before any design or engineering begins.', order: 2 },
    { question: 'Do you offer ongoing support after launch?', answer: 'All projects include two weeks of post-launch support. Studio and Enterprise clients get dedicated support channels and SLA-backed response times.', order: 3 },
    { question: 'Who owns the code?', answer: 'You do, fully. We sign an IP assignment as part of every contract. The repository is yours from day one.', order: 4 },
    { question: 'Can you integrate with our existing systems?', answer: 'Integration is one of our core strengths. We have connected to Salesforce, HubSpot, Stripe, Plaid, Twilio, and dozens of custom enterprise systems.', order: 5 },
    { question: 'How do you handle design if I already have a brand?', answer: 'We work within your existing design language and brand guidelines. If you have a Figma library, we extend it rather than replace it.', order: 6 },
    { question: 'What technologies do you use?', answer: 'Our default stack is Next.js, React, TypeScript, Tailwind, and PostgreSQL, deployed on Vercel and AWS. We adapt to client preferences and can work in your existing stack.', order: 7 },
  ]
  for (const f of faqs) {
    await prisma.fAQ.upsert({
      where: { id: `faq-${f.order}` },
      create: { id: `faq-${f.order}`, question: f.question, answer: f.answer, order: f.order },
      update: { question: f.question, answer: f.answer },
    })
  }

  // Tech items (15)
  const techItems = [
    { id: 'ti-nextjs', name: 'Next.js', category: 'frontend', order: 0 },
    { id: 'ti-react', name: 'React', category: 'frontend', order: 1 },
    { id: 'ti-typescript', name: 'TypeScript', category: 'language', order: 2 },
    { id: 'ti-tailwind', name: 'Tailwind CSS', category: 'styling', order: 3 },
    { id: 'ti-nodejs', name: 'Node.js', category: 'backend', order: 4 },
    { id: 'ti-postgres', name: 'PostgreSQL', category: 'database', order: 5 },
    { id: 'ti-prisma', name: 'Prisma', category: 'database', order: 6 },
    { id: 'ti-graphql', name: 'GraphQL', category: 'api', order: 7 },
    { id: 'ti-stripe', name: 'Stripe', category: 'payments', order: 8 },
    { id: 'ti-aws', name: 'AWS', category: 'cloud', order: 9 },
    { id: 'ti-vercel', name: 'Vercel', category: 'cloud', order: 10 },
    { id: 'ti-figma', name: 'Figma', category: 'design', order: 11 },
    { id: 'ti-rn', name: 'React Native', category: 'mobile', order: 12 },
    { id: 'ti-flutter', name: 'Flutter', category: 'mobile', order: 13 },
    { id: 'ti-openai', name: 'OpenAI API', category: 'ai', order: 14 },
  ]
  for (const t of techItems) {
    await prisma.techItem.upsert({
      where: { id: t.id },
      create: t,
      update: { name: t.name, category: t.category, order: t.order },
    })
  }

  // Team members (6)
  const team = [
    { name: 'Marcus Chen', role: 'Founder & CTO', bio: 'Previously VP Eng at Series B SaaS. Built systems processing 10M events/day. Obsessed with developer experience.', order: 0 },
    { name: 'Sofia Rivera', role: 'Head of Design', bio: 'Led design at three product studios. Believer that great UX is invisible, great UI is intentional.', order: 1 },
    { name: 'James Okafor', role: 'Lead Engineer', bio: 'Full-stack specialist. Contributor to several open-source projects. Solves hard problems without drama.', order: 2 },
    { name: 'Priya Sharma', role: 'Product Lead', bio: 'Former PM at Stripe. Turns ambiguous problems into clear product strategies and shipped features.', order: 3 },
    { name: 'Luca Ferrari', role: 'Mobile Engineer', bio: 'React Native and Flutter expert. Published two apps with 100k+ downloads. Obsesses over performance.', order: 4 },
    { name: 'Aisha Mbeki', role: 'AI / ML Engineer', bio: 'MSc in Machine Learning. Built production LLM pipelines and custom embedding models for enterprise clients.', order: 5 },
  ]
  for (const t of team) {
    const slug = t.name.toLowerCase().replace(/\s+/g, '-')
    await prisma.teamMember.upsert({
      where: { id: `team-${slug}` },
      create: { id: `team-${slug}`, ...t },
      update: { role: t.role, bio: t.bio },
    })
  }

  // Testimonials (4)
  const testimonials = [
    { name: 'Rahul Verma', title: 'CTO', company: 'Nexus Corp', content: 'Xornexz delivered a production-grade e-commerce platform in 10 weeks. Their engineering quality is exceptional and their communication is even better.', rating: 5, featured: true },
    { name: 'Sarah Thompson', title: 'CEO', company: 'PulseHealth Inc.', content: 'We needed a HIPAA-compliant telehealth platform built fast and built right. Xornexz hit every milestone and the code quality was outstanding.', rating: 5, featured: true },
    { name: 'David Park', title: 'Head of Product', company: 'VaultAI Ltd.', content: 'Their AI integration work cut our document processing time by 87%. They understood the technical complexity from day one.', rating: 5, featured: true },
    { name: 'Emma Wilson', title: 'Founder', company: 'FlowSync GmbH', content: 'From MVP to our first enterprise client in 4 months. Xornexz were true partners throughout the journey.', rating: 5, featured: false },
  ]
  for (const t of testimonials) {
    await prisma.testimonial.upsert({
      where: { id: `testimonial-${t.name.toLowerCase().replace(/\s+/g, '-')}` },
      create: { id: `testimonial-${t.name.toLowerCase().replace(/\s+/g, '-')}`, ...t },
      update: { content: t.content },
    })
  }

  console.log('Seed complete.')
}

main()
  .catch((e) => { console.error(e); process.exit(1) })
  .finally(() => prisma.$disconnect())
