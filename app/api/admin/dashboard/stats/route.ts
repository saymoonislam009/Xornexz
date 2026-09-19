import { requireRole, isAuthError } from '@/lib/requireRole'
import { NextResponse } from "next/server";
import prisma from "@/lib/db";

export async function GET() {
  const auth = await requireRole('VIEWER')
  if (isAuthError(auth)) return auth

  try {
    const totalLeads = await prisma.lead.count();
    const newLeads = await prisma.lead.count({
      where: { status: "NEW" },
    });
    const totalProjects = await prisma.project.count();
    const totalPosts = await prisma.blogPost.count();

    const recentLeads = await prisma.lead.findMany({
      take: 5,
      orderBy: { createdAt: "desc" },
    });

    // Mock data for charts
    const chartData = [
      { name: "Jan", leads: 40, conversions: 24 },
      { name: "Feb", leads: 30, conversions: 13 },
      { name: "Mar", leads: 20, conversions: 98 },
      { name: "Apr", leads: 27, conversions: 39 },
      { name: "May", leads: 18, conversions: 48 },
      { name: "Jun", leads: 23, conversions: 38 },
      { name: "Jul", leads: 34, conversions: 43 },
    ];

    return NextResponse.json({
      stats: { totalLeads, newLeads, totalProjects, totalPosts },
      recentLeads,
      chartData,
    });
  } catch (error) {
    return NextResponse.json({ error: "Failed to fetch stats" }, { status: 500 });
  }
}
