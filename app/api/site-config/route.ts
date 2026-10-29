import { NextResponse } from "next/server";
import { getPublicSiteConfig } from "@/lib/site-config";

export const dynamic = "force-dynamic";

export async function GET() {
  const config = await getPublicSiteConfig();
  return NextResponse.json(config, {
    headers: {
      "Cache-Control": "no-store, max-age=0",
    },
  });
}
