import { notFound } from 'next/navigation';
import { prisma } from '@/lib/db';
import { jobs as staticJobs, type Job } from '@/lib/data/jobs';
import { ensureContentSeeded } from '@/lib/content';
import JobDetailClient from './JobDetailClient';

export const dynamic = 'force-dynamic';

async function getJob(slug: string): Promise<Job | null> {
  try {
    await ensureContentSeeded();
    const j = await prisma.job.findUnique({ where: { slug } });
    if (j) {
      if (j.status !== 'OPEN') return null;
      const stat = staticJobs.find((s) => s.slug === slug);
      return {
        id: j.id,
        slug: j.slug,
        title: j.title,
        department: j.department,
        location: j.location,
        type: j.type,
        experience: stat?.experience ?? '3+ years',
        description: j.description,
        responsibilities: stat?.responsibilities ?? j.niceToHave ?? [],
        requirements: j.requirements,
      };
    }
    return null;
  } catch {
    return staticJobs.find((s) => s.slug === slug) ?? null;
  }
}

export default async function JobDetailPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const job = await getJob(slug);
  if (!job) notFound();
  return <JobDetailClient job={job} />;
}
