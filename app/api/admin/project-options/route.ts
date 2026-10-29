import { NextRequest, NextResponse } from "next/server";
import { requireRole, isAuthError } from "@/lib/requireRole";
import { prisma } from "@/lib/db";
import { buildSiteConfigFromRow } from "@/lib/site-config";
import { revalidatePublicSite } from "@/lib/revalidate";

export const dynamic = "force-dynamic";

export async function GET() {
  const auth = await requireRole("VIEWER");
  if (isAuthError(auth)) return auth;

  try {
    let row = await prisma.siteSettings.findUnique({ where: { id: "default" } });
    if (!row) {
      row = await prisma.siteSettings.create({ data: { id: "default" } });
    }
    return NextResponse.json(buildSiteConfigFromRow(row));
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : "Failed to load options";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}

export async function PUT(req: NextRequest) {
  const auth = await requireRole("EDITOR");
  if (isAuthError(auth)) return auth;

  try {
    const body = await req.json();
    const existing = await prisma.siteSettings.findUnique({ where: { id: "default" } });
    const prevStats =
      existing?.statsJson && typeof existing.statsJson === "object"
        ? (existing.statsJson as Record<string, unknown>)
        : {};

    const nextStats: Record<string, unknown> = {
      ...prevStats,
    };

    if (body.projectForm !== undefined) nextStats.projectForm = body.projectForm;
    if (body.estimator !== undefined) nextStats.estimator = body.estimator;
    if (body.availability !== undefined) nextStats.availability = body.availability;
    if (body.cta !== undefined) nextStats.cta = body.cta;
    if (body.mainStats !== undefined) nextStats.mainStats = body.mainStats;
    if (body.hero !== undefined) nextStats.hero = body.hero;

    const updatePayload: Record<string, unknown> = {
      statsJson: nextStats,
    };

    if (body.hero?.headline) updatePayload.heroHeadline = String(body.hero.headline).slice(0, 200);
    if (body.hero?.subheadline) updatePayload.heroSubheadline = String(body.hero.subheadline).slice(0, 500);
    if (body.hero?.cta1Label) updatePayload.heroCta1Label = String(body.hero.cta1Label).slice(0, 50);
    if (body.hero?.cta1Href) updatePayload.heroCta1Href = String(body.hero.cta1Href).slice(0, 200);
    if (body.hero?.cta2Label) updatePayload.heroCta2Label = String(body.hero.cta2Label).slice(0, 50);
    if (body.hero?.cta2Href) updatePayload.heroCta2Href = String(body.hero.cta2Href).slice(0, 200);

    const saved = await prisma.siteSettings.upsert({
      where: { id: "default" },
      update: updatePayload as never,
      create: { id: "default", ...(updatePayload as Record<string, never>) },
    });

    revalidatePublicSite(["site-settings"], ["/contact", "/estimator"]);

    return NextResponse.json(buildSiteConfigFromRow(saved));
  } catch (err: unknown) {
    console.error("[admin/project-options]", err);
    const message = err instanceof Error ? err.message : "Failed to save options";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
