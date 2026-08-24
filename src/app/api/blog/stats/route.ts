import { NextResponse } from "next/server";
import { db, isDbConfigured } from "@/lib/db";

/**
 * Batch view counts for the blog index, so the listing needs one request
 * regardless of how many posts it renders.
 */
export async function GET() {
  if (!isDbConfigured()) {
    return NextResponse.json({ views: {} });
  }

  try {
    const rows = await db()`select slug, views::int as views from post_stats`;
    const views: Record<string, number> = {};
    for (const row of rows) {
      views[row.slug as string] = row.views as number;
    }
    return NextResponse.json({ views });
  } catch (error) {
    console.error("[stats] failed", error);
    return NextResponse.json({ views: {} });
  }
}
