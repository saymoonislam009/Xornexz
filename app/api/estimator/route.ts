import { prisma } from "@/lib/db";
import { NextResponse } from "next/server";
import { Resend } from "resend";
import { z } from "zod";

const resend = new Resend(process.env.RESEND_API_KEY || "re_dummy");

const estimatorSchema = z.object({
  name: z.string().min(1, "Name is required"),
  email: z.string().email("Invalid email address"),
  company: z.string().optional(),
  phone: z.string().optional(),
  projectType: z.string().min(1, "Project type is required"),
  features: z.array(z.string()).default([]),
  timeline: z.string().min(1, "Timeline is required"),
  budget: z.string().min(1, "Budget is required"),
  description: z.string().optional(),
});

export async function POST(req: Request) {
  try {
    const ipAddress = req.headers.get("x-forwarded-for") || "unknown";
    
    const body = await req.json();
    const validatedData = estimatorSchema.parse(body);

    // Calculate rough estimate based on features/type (dummy logic for example)
    let estimateMin = 5000;
    let estimateMax = 10000;
    
    if (validatedData.projectType === "ecommerce") {
      estimateMin += 5000; estimateMax += 10000;
    }
    estimateMin += validatedData.features.length * 1000;
    estimateMax += validatedData.features.length * 2000;

    // Save to database
    const estimate = await prisma.estimate.create({
      data: {
        name: validatedData.name,
        email: validatedData.email,
        company: validatedData.company,
        phone: validatedData.phone,
        projectType: validatedData.projectType,
        features: validatedData.features,
        timeline: validatedData.timeline,
        budget: validatedData.budget,
        description: validatedData.description,
        estimateMin,
        estimateMax,
        ipAddress,
      },
    });

    // Send email notification
    if (process.env.RESEND_API_KEY) {
      await resend.emails.send({
        from: "Xornexz Estimator <estimator@xornexz.com>",
        to: ["admin@xornexz.com", validatedData.email],
        subject: `Project Estimate Request: ${validatedData.projectType}`,
        html: `
          <h1>Project Estimate Request</h1>
          <p><strong>Name:</strong> ${validatedData.name}</p>
          <p><strong>Email:</strong> ${validatedData.email}</p>
          <p><strong>Company:</strong> ${validatedData.company || "N/A"}</p>
          <p><strong>Project Type:</strong> ${validatedData.projectType}</p>
          <p><strong>Timeline:</strong> ${validatedData.timeline}</p>
          <p><strong>Client Budget:</strong> ${validatedData.budget}</p>
          <p><strong>Features:</strong> ${validatedData.features.join(", ")}</p>
          <h2>Calculated Estimate:</h2>
          <p>$${estimateMin.toLocaleString()} - $${estimateMax.toLocaleString()}</p>
        `,
      });
    }

    return NextResponse.json({ success: true, estimate }, { status: 200 });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json({ error: error.errors }, { status: 400 });
    }
    console.error("Estimator error:", error);
    return NextResponse.json(
      { error: "Failed to process request" },
      { status: 500 }
    );
  }
}
