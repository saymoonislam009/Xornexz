import { requireRole, isAuthError } from "@/lib/requireRole";
import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { revalidateTag } from "next/cache";
import { z } from "zod";

export const dynamic = "force-dynamic";

export async function GET(_req: NextRequest) {
  const auth = await requireRole("VIEWER");
  if (isAuthError(auth)) return auth;

  try {
    let settings = await prisma.siteSettings.findUnique({
      where: { id: "default" },
    });

    if (!settings) {
      settings = await prisma.siteSettings.create({
        data: { id: "default" },
      });
    }

    return NextResponse.json(settings);
  } catch (error: any) {
    console.error("Failed to fetch settings:", error);
    return NextResponse.json({ error: "Failed to fetch settings" }, { status: 500 });
  }
}

const SettingsSchema = z.object({
  siteName: z.string().max(100).optional(),
  siteTagline: z.string().max(200).optional(),
  email: z.string().max(200).optional(),
  phone: z.string().max(50).nullish(),
  address: z.string().max(500).nullish(),
  logoUrl: z.string().nullish(),
  logoDarkUrl: z.string().nullish(),
  faviconUrl: z.string().nullish(),
  defaultOgImageUrl: z.string().nullish(),
  heroHeadline: z.string().max(200).optional(),
  heroSubheadline: z.string().max(500).optional(),
  heroCta1Label: z.string().max(50).optional(),
  heroCta1Href: z.string().max(200).optional(),
  heroCta2Label: z.string().max(50).optional(),
  heroCta2Href: z.string().max(200).optional(),
  maintenanceMode: z.boolean().optional(),
  maintenanceMessage: z.string().max(500).optional(),
  cookieConsentEnabled: z.boolean().optional(),
  analyticsId: z.string().max(100).nullish(),
  socialsJson: z.any().optional(),
  statsJson: z.any().optional(),
  navLinksJson: z.any().optional(),
  footerLinksJson: z.any().optional(),
});

export async function PUT(req: NextRequest) {
  const auth = await requireRole("ADMIN");
  if (isAuthError(auth)) return auth;

  try {
    const body = await req.json();

    // Map legacy / alternative frontend fields
    const defaultOgImageUrl = body.defaultOgImageUrl || body.defaultOgImage || undefined;
    const analyticsId = body.analyticsId || body.googleAnalyticsId || body.plausibleDomain || undefined;

    let socialsJson = body.socialsJson;
    if (!socialsJson && (body.twitterUrl || body.linkedinUrl || body.githubUrl || body.instagramUrl || body.youtubeUrl)) {
      socialsJson = {
        twitter: body.twitterUrl || "",
        linkedin: body.linkedinUrl || "",
        github: body.githubUrl || "",
        instagram: body.instagramUrl || "",
        youtube: body.youtubeUrl || "",
      };
    }

    const payload: Record<string, any> = {
      ...body,
      defaultOgImageUrl: defaultOgImageUrl ?? body.defaultOgImageUrl,
      analyticsId: analyticsId ?? body.analyticsId,
      socialsJson: socialsJson ?? body.socialsJson,
    };

    if (!payload.email || typeof payload.email !== "string" || !payload.email.trim()) {
      delete payload.email;
    }

    const parsed = SettingsSchema.safeParse(payload);
    if (!parsed.success) {
      console.warn("Settings validation error:", parsed.error.format());
      return NextResponse.json({ error: "Invalid input", details: parsed.error.flatten() }, { status: 400 });
    }

    const dataToSave: Record<string, any> = { ...parsed.data };
    // Remove undefined values
    for (const key of Object.keys(dataToSave)) {
      if (dataToSave[key] === undefined) {
        delete dataToSave[key];
      }
    }

    const settings = await prisma.siteSettings.upsert({
      where: { id: "default" },
      update: dataToSave as any,
      create: { id: "default", ...dataToSave } as any,
    });

    revalidateTag("site-settings");
    return NextResponse.json(settings);
  } catch (error: any) {
    console.error("Failed to update settings:", error);
    return NextResponse.json({ error: error.message || "Failed to update settings" }, { status: 500 });
  }
}

export const PATCH = PUT;
