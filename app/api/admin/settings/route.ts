import { requireRole, isAuthError } from '@/lib/requireRole'
import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { revalidateTag } from "next/cache";

export async function GET(req: NextRequest) {
  const auth = await requireRole('VIEWER')
  if (isAuthError(auth)) return auth

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
  } catch (error) {
    return NextResponse.json({ error: "Failed to fetch settings" }, { status: 500 });
  }
}

import { z } from 'zod';

const SettingsSchema = z.object({
  siteName: z.string().min(1).max(100).optional(),
  siteTagline: z.string().max(200).optional(),
  email: z.string().email().optional(),
  phone: z.string().max(50).optional(),
  heroHeadline: z.string().max(200).optional(),
  heroSubheadline: z.string().max(500).optional(),
  heroCta1Label: z.string().max(50).optional(),
  heroCta1Href: z.string().max(200).optional(),
  heroCta2Label: z.string().max(50).optional(),
  heroCta2Href: z.string().max(200).optional(),
  maintenanceMode: z.boolean().optional(),
  maintenanceMessage: z.string().max(500).optional(),
  analyticsId: z.string().max(100).optional(),
});

export async function PUT(req: NextRequest) {
  const auth = await requireRole('ADMIN')
  if (isAuthError(auth)) return auth

  try {
    const body = await req.json();
    const parsed = SettingsSchema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json({ error: 'Invalid input' }, { status: 400 });
    }
    
    const settings = await prisma.siteSettings.upsert({
      where: { id: "default" },
      update: parsed.data,
      create: { id: "default", ...parsed.data },
    });

    revalidateTag('site-settings');
    return NextResponse.json(settings);
  } catch (error) {
    return NextResponse.json({ error: "Failed to update settings" }, { status: 500 });
  }
}
