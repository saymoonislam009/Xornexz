import { NextResponse } from "next/server";
import { randomUUID } from "crypto";
import { prisma } from "@/lib/db";
import { revalidatePublicSite } from "@/lib/revalidate";

const MAX_RESUME_BYTES = 4 * 1024 * 1024; // 4 MB

export async function POST(req: Request) {
  try {
    const formData = await req.formData();

    const rawJobId = String(formData.get("jobId") ?? "").trim();
    const jobSlug = String(formData.get("jobSlug") ?? "").trim();
    const jobTitle = String(formData.get("jobTitle") ?? "Open Position").trim();
    const firstName = String(formData.get("firstName") ?? "").trim();
    const lastName = String(formData.get("lastName") ?? "").trim();
    const email = String(formData.get("email") ?? "").trim();
    const phone = String(formData.get("phone") ?? "").trim();
    const linkedin = String(formData.get("linkedin") ?? "").trim();
    const portfolio = String(formData.get("portfolio") ?? "").trim();
    const coverLetter = String(formData.get("coverLetter") ?? "").trim();
    const expectedSalary = String(formData.get("expectedSalary") ?? "").trim();
    const resume = formData.get("resume") as File | null;

    if (!firstName || !lastName || !email) {
      return NextResponse.json(
        { error: "First name, last name, and email are required." },
        { status: 400 }
      );
    }

    // Resolve the real DB Job row (by id or slug)
    let dbJob = rawJobId
      ? await prisma.job.findUnique({ where: { id: rawJobId } }).catch(() => null)
      : null;
    if (!dbJob && jobSlug) {
      dbJob = await prisma.job.findUnique({ where: { slug: jobSlug } }).catch(() => null);
    }
    if (!dbJob) {
      dbJob = await prisma.job.findFirst({
        where: { title: jobTitle },
      });
    }

    let resumeUrl: string | null = null;
    if (resume && resume.size > 0) {
      if (resume.size > MAX_RESUME_BYTES) {
        return NextResponse.json(
          { error: "Resume file is too large (maximum 4 MB)." },
          { status: 413 }
        );
      }
      const buffer = Buffer.from(await resume.arrayBuffer());
      const mimeType = resume.type || "application/pdf";
      const dataUrl = `data:${mimeType};base64,${buffer.toString("base64")}`;
      try {
        const media = await prisma.media.create({
          data: {
            key: `inline-resume-${randomUUID()}`,
            url: dataUrl,
            mimeType,
            size: resume.size,
            folder: "uploads",
            alt: `Resume - ${firstName} ${lastName}`,
          },
        });
        resumeUrl = `/api/media/item/${media.id}`;
      } catch (mediaErr) {
        console.warn("[careers/apply] resume media save warning:", mediaErr);
      }
    }

    const fullName = `${firstName} ${lastName}`.trim();

    if (dbJob) {
      await prisma.application.create({
        data: {
          jobId: dbJob.id,
          name: fullName,
          email,
          phone: phone || null,
          linkedinUrl: linkedin || null,
          portfolioUrl: portfolio || null,
          coverLetter: coverLetter || null,
          expectedSalary: expectedSalary || null,
          resumeUrl,
          status: "PENDING",
        },
      });
    }

    // Also save to ContactSubmission so the admin sees career applications in Contact inbox too
    const summary = [
      `Position: ${dbJob?.title || jobTitle}`,
      phone ? `Phone: ${phone}` : null,
      expectedSalary ? `Expected Salary: ${expectedSalary}` : null,
      linkedin ? `LinkedIn: ${linkedin}` : null,
      portfolio ? `Portfolio: ${portfolio}` : null,
      resumeUrl ? `Resume: ${resumeUrl}` : null,
      coverLetter ? `\nCover Letter:\n${coverLetter}` : null,
    ]
      .filter(Boolean)
      .join("\n");

    await prisma.contactSubmission.create({
      data: {
        name: fullName,
        email,
        subject: `[Job Application] ${dbJob?.title || jobTitle}`,
        message: summary,
      },
    });

    revalidatePublicSite(["jobs"]);

    return NextResponse.json(
      { success: true, message: "Application submitted successfully" },
      { status: 200 }
    );
  } catch (error) {
    console.error("Application submission error:", error);
    return NextResponse.json(
      { error: "Could not submit application. Please try again." },
      { status: 500 }
    );
  }
}
