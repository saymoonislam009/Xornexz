import { prisma } from "@/lib/db";
import { NextResponse } from "next/server";
import { Resend } from "resend";
import { z } from "zod";
import { getPublicSiteConfig } from "@/lib/site-config";

const estimatorSchema = z.object({
  name: z.string().trim().min(1, "Name is required"),
  email: z.string().trim().email("Invalid email address"),
  company: z.string().optional().default(""),
  phone: z.string().optional().default(""),
  projectType: z.string().min(1, "Project type is required"),
  features: z.array(z.string()).default([]),
  timeline: z.string().min(1, "Timeline is required"),
  budget: z.string().min(1, "Budget is required"),
  description: z.string().optional().default(""),
});

export async function POST(req: Request) {
  try {
    const ipAddress =
      req.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ||
      req.headers.get("x-real-ip") ||
      "unknown";

    const body = await req.json();
    const parsed = estimatorSchema.safeParse(body);
    if (!parsed.success) {
      const msg = parsed.error.issues[0]?.message || "Please complete all required fields.";
      return NextResponse.json({ error: msg }, { status: 400 });
    }
    const validatedData = parsed.data;

    // Calculate estimate dynamically using admin-configured estimator pricing
    const siteConfig = await getPublicSiteConfig();
    const estConfig = siteConfig.estimator;

    const matchedType = estConfig.projectTypes.find(
      (t) => t.id === validatedData.projectType || t.title === validatedData.projectType
    );
    const base = matchedType?.basePrice ?? 4000;

    const featureTotal = validatedData.features.reduce((sum, featId) => {
      const f = estConfig.features.find((x) => x.id === featId || x.title === featId);
      return sum + (f?.price ?? 900);
    }, 0);

    const matchedTimeline = estConfig.timelines.find(
      (t) => t.id === validatedData.timeline || t.title === validatedData.timeline
    );
    const mult = matchedTimeline?.multiplier ?? 1;

    const mid = Math.round((base + featureTotal) * mult);
    const estimateMin = Math.round(mid * 0.85);
    const estimateMax = Math.round(mid * 1.15);

    const typeLabel = matchedType?.title || validatedData.projectType;
    const timelineLabel = matchedTimeline?.title || validatedData.timeline;
    const featureLabels = validatedData.features.map(
      (fid) => estConfig.features.find((x) => x.id === fid || x.title === fid)?.title || fid
    );

    // 1. Save to Estimate table
    const estimate = await prisma.estimate.create({
      data: {
        name: validatedData.name,
        email: validatedData.email,
        company: validatedData.company || null,
        phone: validatedData.phone || null,
        projectType: typeLabel,
        features: featureLabels,
        timeline: timelineLabel,
        budget: validatedData.budget,
        description: validatedData.description || null,
        estimateMin,
        estimateMax,
        ipAddress,
      },
    });

    const summaryMessage = [
      `Project Type: ${typeLabel}`,
      `Timeline: ${timelineLabel}`,
      `Selected Budget: ${validatedData.budget}`,
      featureLabels.length > 0 ? `Features: ${featureLabels.join(", ")}` : null,
      `Calculated Range: $${estimateMin.toLocaleString()} – $${estimateMax.toLocaleString()}`,
      validatedData.description ? `\nNotes:\n${validatedData.description}` : null,
    ]
      .filter(Boolean)
      .join("\n");

    // 2. Also create Lead record for CRM board
    try {
      const lead = await prisma.lead.create({
        data: {
          name: validatedData.name,
          email: validatedData.email,
          phone: validatedData.phone || null,
          company: validatedData.company || null,
          message: summaryMessage,
          budget: validatedData.budget,
          timeline: timelineLabel,
          projectType: typeLabel,
          tags: featureLabels,
          source: "ESTIMATOR",
          status: "NEW",
          ipAddress,
        },
      });
      await prisma.estimate.update({
        where: { id: estimate.id },
        data: { convertedToLead: true, leadId: lead.id },
      });
    } catch (leadErr) {
      console.warn("[estimator] Could not create lead record:", leadErr);
    }

    // 3. Also mirror to ContactSubmission so it shows in Admin Contact inbox too
    try {
      await prisma.contactSubmission.create({
        data: {
          name: validatedData.name,
          email: validatedData.email,
          company: validatedData.company || null,
          subject: `[Project Estimate] ${typeLabel}`,
          budget: validatedData.budget,
          message: summaryMessage,
          ipAddress,
        },
      });
    } catch (csErr) {
      console.warn("[estimator] Could not mirror contact submission:", csErr);
    }

    // 4. Optional email notification
    if (process.env.RESEND_API_KEY) {
      try {
        const resend = new Resend(process.env.RESEND_API_KEY);
        await resend.emails.send({
          from: `${process.env.RESEND_FROM_NAME ?? "Xornexz"} <${process.env.RESEND_FROM_EMAIL ?? "hello@xornexz.com"}>`,
          to: [process.env.RESEND_FROM_EMAIL ?? siteConfig.email ?? "hello@xornexz.com"],
          subject: `Project Estimate Request: ${typeLabel} (${validatedData.name})`,
          html: `<pre style="font-family:sans-serif;white-space:pre-wrap">${summaryMessage}</pre>`,
        });
      } catch (emailErr) {
        console.warn("[estimator] email send skipped:", emailErr);
      }
    }

    return NextResponse.json({ success: true, estimateMin, estimateMax }, { status: 200 });
  } catch (error) {
    console.error("Estimator error:", error);
    return NextResponse.json(
      { error: "Failed to process estimate request. Please try again." },
      { status: 500 }
    );
  }
}
