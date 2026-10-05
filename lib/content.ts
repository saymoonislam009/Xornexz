/**
 * Single source of truth bridge between the admin panel (database) and the
 * public website.
 *
 *  - `ensureContentSeeded()` copies the built-in starter content into any EMPTY
 *    table so the admin panel is never blank on a fresh database.
 *  - `getPublic*()` read from the database (what the admin edits) and only fall
 *    back to the built-in data if the database is unreachable.
 */
import { prisma } from "@/lib/db";
import { blogPosts as staticBlog } from "@/lib/data/blog";
import { PROJECTS_DATA as staticProjects } from "@/lib/data/projects";
import { SERVICES_DATA as staticServices } from "@/lib/data/services";
import { team as staticTeam } from "@/lib/data/team";
import { jobs as staticJobs } from "@/lib/data/jobs";
import { DEFAULT_FAQS, DEFAULT_TESTIMONIALS, DEFAULT_PRICING, DEFAULT_FEATURED } from "@/lib/data/home";

/* eslint-disable @typescript-eslint/no-explicit-any */

let seedPromise: Promise<void> | null = null;

export function ensureContentSeeded(): Promise<void> {
  if (!seedPromise) {
    seedPromise = runSeed().catch((err) => {
      console.error("[content] seed failed:", err);
      seedPromise = null; // allow retry next request
    });
  }
  return seedPromise;
}

async function runSeed() {
  const [services, projects, posts, team, jobs, faqCount, testiCount, planCount] = await Promise.all([
    prisma.service.count(),
    prisma.project.count(),
    prisma.blogPost.count(),
    prisma.teamMember.count(),
    prisma.job.count(),
    prisma.fAQ.count(),
    prisma.testimonial.count(),
    prisma.pricingPlan.count(),
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
          company: t.title.includes(",") ? t.title.split(",").slice(1).join(",").trim() : "Xornexz Client",
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
          price: "Custom quote",
          features: p.features,
          highlighted: p.highlighted,
          order: i,
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
          niceToHave: [],
          status: "OPEN",
          order: i,
          publishedAt: new Date(),
        },
      });
    }
  }
}

/* ───────────────────────── Public getters ───────────────────────── */

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

export async function getPublicServices() {
  try {
    await ensureContentSeeded();
    const rows = await prisma.service.findMany({
      where: { isActive: true },
      orderBy: { order: "asc" },
    });
    return rows.map((s) => ({
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
}

export async function getPublicProjects() {
  try {
    await ensureContentSeeded();
    const rows = await prisma.project.findMany({
      where: { status: "PUBLISHED" },
      orderBy: [{ order: "asc" }, { createdAt: "desc" }],
    });
    return rows.map((p, i) => {
      const staticMatch = (staticProjects as any[]).find((s) => s.slug === p.slug);
      const defaultImg =
        staticMatch?.coverImage ||
        DEFAULT_FEATURED.find((d) => d.slug === p.slug)?.image ||
        DEFAULT_FEATURED[i % DEFAULT_FEATURED.length]?.image;

      const hasRealCover =
        p.coverImage &&
        p.coverImage.trim() !== "" &&
        !p.coverImage.startsWith("linear-gradient");

      return {
        id: p.id,
        slug: p.slug,
        title: p.title,
        tagline: p.tagline,
        client: p.client || "",
        category: p.category,
        tags: p.tags && p.tags.length > 0 ? p.tags : (staticMatch?.tags || ["Engineering"]),
        coverGradient: GRADIENTS[i % GRADIENTS.length],
        coverImage: hasRealCover ? p.coverImage : defaultImg,
        gallery: p.gallery && p.gallery.length > 0 ? p.gallery : (staticMatch?.gallery || []),
        year: String((p.publishedAt ?? p.createdAt).getFullYear()),
        featured: p.featured,
      };
    });
  } catch (e) {
    console.error("[content] projects fallback:", e);
    return (staticProjects as any[]).map((p) => ({ ...p }));
  }
}

export async function getPublicBlogPosts() {
  try {
    await ensureContentSeeded();
    const rows = await prisma.blogPost.findMany({
      where: { status: "PUBLISHED" },
      orderBy: [{ publishedAt: "desc" }, { createdAt: "desc" }],
      include: { author: { select: { name: true } } },
    });
    return rows.map((p, i) => {
      const name = p.author?.name || "Xornexz Editorial";
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
        coverImage: p.coverImage || null,
      };
    });
  } catch (e) {
    console.error("[content] blog fallback:", e);
    return staticBlog as any[];
  }
}

export async function getPublicTeam() {
  try {
    await ensureContentSeeded();
    const rows = await prisma.teamMember.findMany({
      where: { isActive: true },
      orderBy: { order: "asc" },
    });
    return rows.map((m) => ({
      name: m.name,
      role: m.role,
      bio: m.bio ?? "",
      image: m.avatarUrl ?? "",
    }));
  } catch (e) {
    console.error("[content] team fallback:", e);
    return staticTeam as any[];
  }
}

export async function getHomeFaqs() {
  try {
    await ensureContentSeeded();
    const rows = await prisma.fAQ.findMany({ where: { isActive: true }, orderBy: { order: "asc" } });
    return rows.map((f) => ({ question: f.question, answer: f.answer }));
  } catch (e) {
    console.error("[content] faq fallback:", e);
    return DEFAULT_FAQS;
  }
}

export async function getHomeTestimonials() {
  try {
    await ensureContentSeeded();
    const rows = await prisma.testimonial.findMany({
      where: { isActive: true },
      orderBy: [{ order: "asc" }, { createdAt: "desc" }],
    });
    return rows.map((t) => ({
      id: t.id,
      name: t.name,
      title: t.company ? `${t.title}, ${t.company}` : t.title,
      avatar: t.avatarUrl || DEFAULT_TESTIMONIALS[0].avatar,
      quote: t.content,
      rating: t.rating,
    }));
  } catch (e) {
    console.error("[content] testimonials fallback:", e);
    return DEFAULT_TESTIMONIALS;
  }
}

export async function getHomePricing() {
  try {
    await ensureContentSeeded();
    const rows = await prisma.pricingPlan.findMany({ orderBy: { order: "asc" } });
    return rows.map((p) => ({
      name: p.name,
      description: p.tagline,
      features: Array.isArray(p.features) ? (p.features as string[]) : [],
      highlighted: p.highlighted,
    }));
  } catch (e) {
    console.error("[content] pricing fallback:", e);
    return DEFAULT_PRICING;
  }
}

export async function getHomeFeaturedProjects() {
  try {
    await ensureContentSeeded();
    // Fetch published projects: prioritize featured, then recently updated, then order
    const rows = await prisma.project.findMany({
      where: { status: "PUBLISHED" },
      orderBy: [
        { featured: "desc" },
        { updatedAt: "desc" },
        { order: "asc" },
      ],
      take: 6,
    });

    if (rows.length === 0) {
      return DEFAULT_FEATURED;
    }

    return rows.map((p, i) => {
      const defaultImg =
        DEFAULT_FEATURED.find((d) => d.slug === p.slug)?.image ||
        (staticProjects as any[]).find((s) => s.slug === p.slug)?.coverImage ||
        DEFAULT_FEATURED[i % DEFAULT_FEATURED.length]?.image ||
        "https://images.unsplash.com/photo-1551288049-bebda4e38f71?auto=format&fit=crop&q=80&w=2070";

      const hasRealCover =
        p.coverImage &&
        p.coverImage.trim() !== "" &&
        !p.coverImage.startsWith("linear-gradient");

      return {
        id: p.id,
        title: p.title,
        client: p.client || "",
        category: p.category,
        image: hasRealCover ? p.coverImage : defaultImg,
        slug: p.slug,
        year: String((p.publishedAt ?? p.createdAt).getFullYear()),
      };
    });
  } catch (e) {
    console.error("[content] featured fallback:", e);
    return DEFAULT_FEATURED;
  }
}

export async function getHomeFeaturedCaseStudy() {
  try {
    await ensureContentSeeded();
    // Prioritize the most recently updated featured project or primary project
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

    const hasRealCover =
      project.coverImage &&
      project.coverImage.trim() !== "" &&
      !project.coverImage.startsWith("linear-gradient");

    return {
      id: project.id,
      title: project.title,
      tagline: project.tagline,
      description: project.description,
      client: project.client || "Featured Client",
      coverImage: hasRealCover ? project.coverImage : defaultImg,
      slug: project.slug,
      metrics: (project.metrics as any) || null,
    };
  } catch (e) {
    console.error("[content] case study fallback:", e);
    return null;
  }
}
