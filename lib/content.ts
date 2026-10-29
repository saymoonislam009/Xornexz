/**
 * Single source of truth bridge between the admin panel (database) and the
 * public website.
 *
 *  - `ensureContentSeeded()` copies the built-in starter content into any EMPTY
 *    table so the admin panel is never blank on a fresh database, and migrates
 *    legacy inline base64 cover strings to fast `/api/media/item/...` URLs.
 *  - `getPublic*()` / `getHome*()` read from the database via Next.js
 *    `unstable_cache` (instant 0ms reads on repeat visits, busted immediately
 *    via `revalidatePublicSite()` whenever admin saves changes).
 */
import { unstable_cache } from "next/cache";
import { randomUUID } from "crypto";
import { prisma } from "@/lib/db";
import { blogPosts as staticBlog } from "@/lib/data/blog";
import { PROJECTS_DATA as staticProjects } from "@/lib/data/projects";
import { SERVICES_DATA as staticServices } from "@/lib/data/services";
import { team as staticTeam } from "@/lib/data/team";
import { jobs as staticJobs } from "@/lib/data/jobs";
import { DEFAULT_FAQS, DEFAULT_TESTIMONIALS, DEFAULT_PRICING, DEFAULT_FEATURED } from "@/lib/data/home";
import { resolveEntityImageUrl, resolveGalleryUrls } from "@/lib/media-url";

/* eslint-disable @typescript-eslint/no-explicit-any */

export const DEFAULT_PROCESS_STEPS = [
  {
    id: "step-1",
    icon: "Search",
    title: "Discovery",
    description:
      "We dive deep into your business goals, target audience, and technical requirements to define a clear roadmap.",
    order: 0,
  },
  {
    id: "step-2",
    icon: "PenTool",
    title: "Design",
    description:
      "Our design team crafts intuitive, conversion-focused wireframes and high-fidelity interactive prototypes.",
    order: 1,
  },
  {
    id: "step-3",
    icon: "Code",
    title: "Build",
    description:
      "We engineer clean, scalable systems using modern cloud-native architecture, prioritizing speed and security.",
    order: 2,
  },
  {
    id: "step-4",
    icon: "Rocket",
    title: "Launch",
    description:
      "Rigorous QA testing, zero-downtime deployment to production, and seamless handover for a flawless launch.",
    order: 3,
  },
  {
    id: "step-5",
    icon: "TrendingUp",
    title: "Scale",
    description:
      "Continuous observability, iterative feature releases, and performance optimization as your user base grows.",
    order: 4,
  },
];

let seeded = false;
let seedPromise: Promise<void> | null = null;

export function ensureContentSeeded(): Promise<void> {
  if (seeded) return Promise.resolve();
  if (!seedPromise) {
    seedPromise = runSeed()
      .then(() => {
        seeded = true;
      })
      .catch((err) => {
        console.error("[content] seed failed:", err);
        seedPromise = null;
      });
  }
  return seedPromise;
}

async function migrateInlineDataUrls() {
  try {
    const inlineProjects = await prisma.project.findMany({
      where: { coverImage: { startsWith: "data:" } },
      select: { id: true, title: true, coverImage: true },
    });
    for (const proj of inlineProjects) {
      const mimeMatch = proj.coverImage.match(/^data:([^;,]+)/);
      const mimeType = mimeMatch?.[1] || "image/webp";
      const created = await prisma.media.create({
        data: {
          key: `inline-${randomUUID()}`,
          url: proj.coverImage,
          mimeType,
          size: Math.round(proj.coverImage.length * 0.75),
          folder: "projects",
          alt: proj.title,
        },
      });
      await prisma.project.update({
        where: { id: proj.id },
        data: { coverImage: `/api/media/item/${created.id}` },
      });
    }

    const inlinePosts = await prisma.blogPost.findMany({
      where: { coverImage: { startsWith: "data:" } },
      select: { id: true, title: true, coverImage: true },
    });
    for (const post of inlinePosts) {
      if (!post.coverImage) continue;
      const mimeMatch = post.coverImage.match(/^data:([^;,]+)/);
      const mimeType = mimeMatch?.[1] || "image/webp";
      const created = await prisma.media.create({
        data: {
          key: `inline-${randomUUID()}`,
          url: post.coverImage,
          mimeType,
          size: Math.round(post.coverImage.length * 0.75),
          folder: "blog",
          alt: post.title,
        },
      });
      await prisma.blogPost.update({
        where: { id: post.id },
        data: { coverImage: `/api/media/item/${created.id}` },
      });
    }
  } catch (err) {
    console.warn("[content] inline media migration skipped:", err);
  }
}

async function runSeed() {
  const [services, projects, posts, team, jobs, faqCount, testiCount, planCount, procCount] =
    await Promise.all([
      prisma.service.count(),
      prisma.project.count(),
      prisma.blogPost.count(),
      prisma.teamMember.count(),
      prisma.job.count(),
      prisma.fAQ.count(),
      prisma.testimonial.count(),
      prisma.pricingPlan.count(),
      prisma.processStep.count(),
    ]);

  if (services === 0) {
    for (const [i, s] of (staticServices as any[]).entries()) {
      await prisma.service.upsert({
        where: { slug: s.slug },
        update: {},
        create: {
          slug: s.slug,
          title: s.title,
          tagline: s.tagline,
          description: s.description,
          icon: s.icon,
          features: s.features ?? [],
          deliverables: s.deliverables ?? [],
          techStack: s.techStack ?? [],
          processSteps: s.processSteps ?? [],
          isActive: true,
          order: s.order ?? i,
        },
      });
    }
  }

  if (projects === 0) {
    for (const [i, p] of (staticProjects as any[]).entries()) {
      await prisma.project.upsert({
        where: { slug: p.slug },
        update: {},
        create: {
          slug: p.slug,
          title: p.title,
          tagline: p.tagline,
          description: p.description,
          content: p.solution ?? null,
          client: p.client ?? null,
          coverImage: p.coverImage ?? "",
          gallery: p.gallery ?? [],
          category: p.category,
          tags: p.tags ?? [],
          techStack: p.techStack ?? [],
          status: "PUBLISHED",
          featured: !!p.featured,
          order: p.order ?? i,
          metrics: p.results ?? undefined,
          publishedAt: new Date(),
        },
      });
    }
  }

  if (posts === 0) {
    const author =
      (await prisma.user.findFirst({
        where: { role: { in: ["SUPER_ADMIN", "ADMIN"] }, isActive: true },
        orderBy: { createdAt: "asc" },
      })) ?? (await prisma.user.findFirst());
    if (author) {
      for (const b of staticBlog as any[]) {
        const minutes = parseInt(String(b.readingTime ?? "5"), 10) || 5;
        await prisma.blogPost.upsert({
          where: { slug: b.slug },
          update: {
            coverImage: b.coverImage ?? null,
          },
          create: {
            slug: b.slug,
            title: b.title,
            excerpt: b.excerpt,
            content: b.content,
            coverImage: b.coverImage ?? null,
            authorId: author.id,
            category: b.category,
            tags: b.tags ?? [],
            status: "PUBLISHED",
            readingTime: minutes,
            publishedAt: b.publishedAt ? new Date(b.publishedAt) : new Date(),
          },
        });
      }
    }
  }

  if (team === 0) {
    for (const [i, m] of (staticTeam as any[]).entries()) {
      await prisma.teamMember.create({
        data: {
          name: m.name,
          role: m.role,
          bio: m.bio ?? null,
          avatarUrl: m.image ?? null,
          isActive: true,
          order: i,
        },
      });
    }
  }

  if (faqCount === 0) {
    for (const [i, f] of DEFAULT_FAQS.entries()) {
      await prisma.fAQ.create({
        data: { question: f.question, answer: f.answer, order: i, isActive: true },
      });
    }
  }

  if (testiCount === 0) {
    for (const [i, t] of DEFAULT_TESTIMONIALS.entries()) {
      await prisma.testimonial.create({
        data: {
          name: t.name,
          title: t.title,
          company: t.title.includes(",")
            ? t.title.split(",").slice(1).join(",").trim()
            : "Xornexz Client",
          avatarUrl: t.avatar,
          content: t.quote,
          rating: t.rating,
          featured: true,
          isActive: true,
          order: i,
        },
      });
    }
  }

  if (planCount === 0) {
    for (const [i, p] of DEFAULT_PRICING.entries()) {
      await prisma.pricingPlan.create({
        data: {
          name: p.name,
          tagline: p.description,
          price: i === 0 ? "From $8,000" : i === 1 ? "From $6,500/mo" : "Custom quote",
          period: i === 0 ? "per project" : i === 1 ? "monthly" : null,
          features: p.features,
          highlighted: p.highlighted,
          order: i,
        },
      });
    }
  }

  if (procCount === 0) {
    for (const step of DEFAULT_PROCESS_STEPS) {
      await prisma.processStep.create({
        data: {
          icon: step.icon,
          title: step.title,
          description: step.description,
          order: step.order,
        },
      });
    }
  }

  if (jobs === 0) {
    for (const [i, j] of (staticJobs as any[]).entries()) {
      await prisma.job.upsert({
        where: { slug: j.slug },
        update: {},
        create: {
          slug: j.slug,
          title: j.title,
          department: j.department,
          location: j.location,
          type: j.type,
          description: j.description,
          requirements: j.requirements ?? [],
          benefits: [],
          niceToHave: j.responsibilities ?? [],
          status: "OPEN",
          order: i,
          publishedAt: new Date(),
        },
      });
    }
  }

  await migrateInlineDataUrls();
}

/* ───────────────────────── Public Cached Getters ───────────────────────── */

const GRADIENTS = [
  "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
  "linear-gradient(135deg, #11998e 0%, #38ef7d 100%)",
  "linear-gradient(135deg, #f093fb 0%, #f5576c 100%)",
  "linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)",
  "linear-gradient(135deg, #fa709a 0%, #fee140 100%)",
];
const BLOG_GRADIENTS = [
  "from-violet-600 to-cyan-500",
  "from-fuchsia-600 to-violet-500",
  "from-cyan-500 to-blue-600",
  "from-emerald-500 to-cyan-500",
];

export const getPublicServices = unstable_cache(
  async () => {
    try {
      let rows = await prisma.service.findMany({
        where: { isActive: true },
        orderBy: { order: "asc" },
      });
      if (rows.length === 0) {
        await ensureContentSeeded();
        rows = await prisma.service.findMany({
          where: { isActive: true },
          orderBy: { order: "asc" },
        });
      }
      if (rows.length === 0) return staticServices as any[];
      return rows.map((s) => ({
        id: s.id,
        slug: s.slug,
        title: s.title,
        tagline: s.tagline,
        description: s.description,
        icon: s.icon,
        features: s.features,
        deliverables: s.deliverables,
        techStack: s.techStack,
        processSteps: Array.isArray(s.processSteps) ? (s.processSteps as any[]) : [],
        startingPrice:
          (staticServices as any[]).find((x) => x.slug === s.slug)?.startingPrice ?? 8000,
        order: s.order,
      }));
    } catch (e) {
      console.error("[content] services fallback:", e);
      return staticServices as any[];
    }
  },
  ["public-services"],
  { revalidate: 60, tags: ["services", "home-content"] }
);

export const getPublicProjects = unstable_cache(
  async () => {
    try {
      let rows = await prisma.project.findMany({
        where: { status: "PUBLISHED" },
        orderBy: [{ order: "asc" }, { updatedAt: "desc" }],
      });
      if (rows.length === 0) {
        await ensureContentSeeded();
        rows = await prisma.project.findMany({
          where: { status: "PUBLISHED" },
          orderBy: [{ order: "asc" }, { updatedAt: "desc" }],
        });
      }
      if (rows.length === 0) {
        return (staticProjects as any[]).map((p) => ({ ...p }));
      }
      return rows.map((p, i) => {
        const staticMatch = (staticProjects as any[]).find((s) => s.slug === p.slug);
        const defaultImg =
          staticMatch?.coverImage ||
          DEFAULT_FEATURED.find((d) => d.slug === p.slug)?.image ||
          DEFAULT_FEATURED[i % DEFAULT_FEATURED.length]?.image ||
          "https://images.unsplash.com/photo-1551288049-bebda4e38f71?auto=format&fit=crop&q=80&w=2070";

        return {
          id: p.id,
          slug: p.slug,
          title: p.title,
          tagline: p.tagline,
          client: p.client || "",
          category: p.category,
          tags: p.tags && p.tags.length > 0 ? p.tags : staticMatch?.tags || ["Engineering"],
          coverGradient: GRADIENTS[i % GRADIENTS.length],
          coverImage: resolveEntityImageUrl(p.coverImage, "project", p.id, p.updatedAt, defaultImg),
          gallery: resolveGalleryUrls(p.gallery, p.id, p.updatedAt, staticMatch?.gallery || []),
          year: String((p.publishedAt ?? p.createdAt).getFullYear()),
          featured: p.featured,
        };
      });
    } catch (e) {
      console.error("[content] projects fallback:", e);
      return (staticProjects as any[]).map((p) => ({ ...p }));
    }
  },
  ["public-projects"],
  { revalidate: 60, tags: ["projects", "home-content"] }
);

export const getPublicBlogPosts = unstable_cache(
  async () => {
    try {
      let rows = await prisma.blogPost.findMany({
        where: { status: "PUBLISHED" },
        orderBy: [{ publishedAt: "desc" }, { createdAt: "desc" }],
        include: { author: { select: { name: true } } },
      });
      if (rows.length === 0) {
        await ensureContentSeeded();
        rows = await prisma.blogPost.findMany({
          where: { status: "PUBLISHED" },
          orderBy: [{ publishedAt: "desc" }, { createdAt: "desc" }],
          include: { author: { select: { name: true } } },
        });
      }
      if (rows.length === 0) return staticBlog as any[];
      return rows.map((p, i) => {
        const name = p.author?.name || "Xornexz Editorial";
        const staticMatch = (staticBlog as any[]).find((b) => b.slug === p.slug);
        return {
          slug: p.slug,
          title: p.title,
          excerpt: p.excerpt,
          content: p.content,
          author: {
            name,
            role: "Engineering Team",
            avatar: name.slice(0, 2).toUpperCase(),
          },
          publishedAt: (p.publishedAt ?? p.createdAt).toISOString(),
          readingTime: `${p.readingTime ?? 5} min read`,
          category: p.category,
          tags: p.tags,
          coverGradient: BLOG_GRADIENTS[i % BLOG_GRADIENTS.length],
          coverImage:
            resolveEntityImageUrl(
              p.coverImage,
              "blog",
              p.id,
              p.updatedAt,
              staticMatch?.coverImage || ""
            ) || null,
        };
      });
    } catch (e) {
      console.error("[content] blog fallback:", e);
      return staticBlog as any[];
    }
  },
  ["public-blog"],
  { revalidate: 60, tags: ["blog", "home-content"] }
);

export const getPublicTeam = unstable_cache(
  async () => {
    try {
      let rows = await prisma.teamMember.findMany({
        where: { isActive: true },
        orderBy: { order: "asc" },
      });
      if (rows.length === 0) {
        await ensureContentSeeded();
        rows = await prisma.teamMember.findMany({
          where: { isActive: true },
          orderBy: { order: "asc" },
        });
      }
      if (rows.length === 0) return staticTeam as any[];
      return rows.map((m) => ({
        name: m.name,
        role: m.role,
        bio: m.bio ?? "",
        image: resolveEntityImageUrl(m.avatarUrl, "team", m.id, m.updatedAt, ""),
      }));
    } catch (e) {
      console.error("[content] team fallback:", e);
      return staticTeam as any[];
    }
  },
  ["public-team"],
  { revalidate: 60, tags: ["team", "home-content"] }
);

export const getHomeFaqs = unstable_cache(
  async () => {
    try {
      let rows = await prisma.fAQ.findMany({
        where: { isActive: true },
        orderBy: { order: "asc" },
      });
      if (rows.length === 0) {
        await ensureContentSeeded();
        rows = await prisma.fAQ.findMany({
          where: { isActive: true },
          orderBy: { order: "asc" },
        });
      }
      if (rows.length === 0) return DEFAULT_FAQS;
      return rows.map((f) => ({ question: f.question, answer: f.answer }));
    } catch (e) {
      console.error("[content] faq fallback:", e);
      return DEFAULT_FAQS;
    }
  },
  ["home-faqs"],
  { revalidate: 60, tags: ["faqs", "home-content"] }
);

export const getHomeTestimonials = unstable_cache(
  async () => {
    try {
      let rows = await prisma.testimonial.findMany({
        where: { isActive: true },
        orderBy: [{ order: "asc" }, { createdAt: "desc" }],
      });
      if (rows.length === 0) {
        await ensureContentSeeded();
        rows = await prisma.testimonial.findMany({
          where: { isActive: true },
          orderBy: [{ order: "asc" }, { createdAt: "desc" }],
        });
      }
      if (rows.length === 0) return DEFAULT_TESTIMONIALS;
      return rows.map((t) => ({
        id: t.id,
        name: t.name,
        title: t.company ? `${t.title}, ${t.company}` : t.title,
        avatar: resolveEntityImageUrl(
          t.avatarUrl,
          "testimonial",
          t.id,
          t.updatedAt,
          DEFAULT_TESTIMONIALS[0].avatar
        ),
        quote: t.content,
        rating: t.rating,
      }));
    } catch (e) {
      console.error("[content] testimonials fallback:", e);
      return DEFAULT_TESTIMONIALS;
    }
  },
  ["home-testimonials"],
  { revalidate: 60, tags: ["testimonials", "home-content"] }
);

export const getHomePricing = unstable_cache(
  async () => {
    try {
      let rows = await prisma.pricingPlan.findMany({ orderBy: { order: "asc" } });
      if (rows.length === 0) {
        await ensureContentSeeded();
        rows = await prisma.pricingPlan.findMany({ orderBy: { order: "asc" } });
      }
      if (rows.length === 0) return DEFAULT_PRICING;
      return rows.map((p) => ({
        id: p.id,
        name: p.name,
        description: p.tagline,
        price: p.price,
        period: p.period,
        ctaLabel: p.ctaLabel || "Let's Talk",
        ctaHref: p.ctaHref || "/contact",
        features: Array.isArray(p.features) ? (p.features as string[]) : [],
        highlighted: p.highlighted,
      }));
    } catch (e) {
      console.error("[content] pricing fallback:", e);
      return DEFAULT_PRICING;
    }
  },
  ["home-pricing"],
  { revalidate: 60, tags: ["pricing", "home-content"] }
);

export const getHomeProcessSteps = unstable_cache(
  async () => {
    try {
      let rows = await prisma.processStep.findMany({ orderBy: { order: "asc" } });
      if (rows.length === 0) {
        await ensureContentSeeded();
        rows = await prisma.processStep.findMany({ orderBy: { order: "asc" } });
      }
      if (rows.length === 0) return DEFAULT_PROCESS_STEPS;
      return rows.map((s, i) => ({
        id: s.id,
        icon: s.icon,
        title: s.title,
        description: s.description,
        order: s.order ?? i,
      }));
    } catch (e) {
      console.error("[content] process steps fallback:", e);
      return DEFAULT_PROCESS_STEPS;
    }
  },
  ["home-process"],
  { revalidate: 60, tags: ["process", "home-content"] }
);

export const getHomeFeaturedProjects = unstable_cache(
  async () => {
    try {
      let rows = await prisma.project.findMany({
        where: { status: "PUBLISHED" },
        orderBy: [{ featured: "desc" }, { order: "asc" }, { updatedAt: "desc" }],
        take: 6,
      });

      if (rows.length === 0) {
        await ensureContentSeeded();
        rows = await prisma.project.findMany({
          where: { status: "PUBLISHED" },
          orderBy: [{ featured: "desc" }, { order: "asc" }, { updatedAt: "desc" }],
          take: 6,
        });
      }

      if (rows.length === 0) {
        return DEFAULT_FEATURED;
      }

      return rows.map((p, i) => {
        const defaultImg =
          DEFAULT_FEATURED.find((d) => d.slug === p.slug)?.image ||
          (staticProjects as any[]).find((s) => s.slug === p.slug)?.coverImage ||
          DEFAULT_FEATURED[i % DEFAULT_FEATURED.length]?.image ||
          "https://images.unsplash.com/photo-1551288049-bebda4e38f71?auto=format&fit=crop&q=80&w=2070";

        return {
          id: p.id,
          title: p.title,
          client: p.client || "",
          category: p.category,
          image: resolveEntityImageUrl(p.coverImage, "project", p.id, p.updatedAt, defaultImg),
          slug: p.slug,
          year: String((p.publishedAt ?? p.createdAt).getFullYear()),
        };
      });
    } catch (e) {
      console.error("[content] featured fallback:", e);
      return DEFAULT_FEATURED;
    }
  },
  ["home-featured-projects"],
  { revalidate: 60, tags: ["projects", "home-content"] }
);

export const getHomeFeaturedCaseStudy = unstable_cache(
  async () => {
    try {
      let project = await prisma.project.findFirst({
        where: { status: "PUBLISHED", featured: true },
        orderBy: [{ updatedAt: "desc" }, { order: "asc" }],
      });
      if (!project) {
        project = await prisma.project.findFirst({
          where: { status: "PUBLISHED" },
          orderBy: [{ updatedAt: "desc" }, { order: "asc" }],
        });
      }
      if (!project) return null;

      const defaultImg =
        (staticProjects as any[]).find((s) => s.slug === project.slug)?.coverImage ||
        "https://images.unsplash.com/photo-1551288049-bebda4e38f71?auto=format&fit=crop&q=80&w=1470";

      return {
        id: project.id,
        title: project.title,
        tagline: project.tagline,
        description: project.description,
        client: project.client || "Featured Client",
        coverImage: resolveEntityImageUrl(
          project.coverImage,
          "project",
          project.id,
          project.updatedAt,
          defaultImg
        ),
        slug: project.slug,
        metrics: (project.metrics as any) || null,
      };
    } catch (e) {
      console.error("[content] case study fallback:", e);
      return null;
    }
  },
  ["home-featured-case-study"],
  { revalidate: 60, tags: ["projects", "home-content"] }
);

export const DEFAULT_HOME_SECTIONS = [
  { key: "hero", order: 0, enabled: true },
  { key: "stats", order: 1, enabled: true },
  { key: "services", order: 2, enabled: true },
  { key: "projects", order: 3, enabled: true },
  { key: "process", order: 4, enabled: true },
  { key: "techstack", order: 5, enabled: true },
  { key: "testimonials", order: 6, enabled: true },
  { key: "pricing", order: 7, enabled: true },
  { key: "faq", order: 8, enabled: true },
  { key: "cta", order: 9, enabled: true },
];

export const getHomeSections = unstable_cache(
  async () => {
    try {
      const rows = await prisma.homeSection.findMany({ orderBy: { order: "asc" } });
      if (rows.length === 0) return DEFAULT_HOME_SECTIONS;
      return rows.map((r, i) => ({
        key: r.key,
        order: r.order ?? i,
        enabled: r.enabled,
      }));
    } catch (e) {
      console.error("[content] home sections fallback:", e);
      return DEFAULT_HOME_SECTIONS;
    }
  },
  ["home-sections-config"],
  { revalidate: 60, tags: ["home-sections", "home-content"] }
);
