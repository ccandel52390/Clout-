import { NextResponse } from "next/server";
import { db } from "@/db";
import { contentItems, userPicks, niches } from "@/db/schema";
import { count, avg, eq, sql } from "drizzle-orm";
import { auth } from "@/lib/auth";

export async function GET() {
  const session = await auth();
  if (!session) {
    return NextResponse.json({ status: "error", message: "Unauthorized" }, { status: 401 });
  }

  try {
    // 1. Total content items
    const [totalItemsRes] = await db.select({ value: count() }).from(contentItems);
    
    // 2. Average viral score
    const [avgScoreRes] = await db.select({ value: avg(contentItems.viralScore) }).from(contentItems);
    
    // 3. Picks published
    const [publishedRes] = await db.select({ value: count() })
      .from(userPicks)
      .where(eq(userPicks.status, "published"));

    // 4. Items per niche
    const nicheStats = await db.select({
      name: niches.name,
      count: count(contentItems.id)
    })
    .from(contentItems)
    .innerJoin(niches, eq(contentItems.nicheId, niches.id))
    .groupBy(niches.name);

    // 5. Picks over time (last 7 days)
    const sevenDaysAgo = Date.now() - 7 * 24 * 60 * 60 * 1000;
    const picksTrend = await db.select({
      date: sql<string>`DATE(createdAt / 1000, 'unixepoch')`,
      count: count()
    })
    .from(userPicks)
    .where(sql`createdAt > ${sevenDaysAgo}`)
    .groupBy(sql`DATE(createdAt / 1000, 'unixepoch')`)
    .orderBy(sql`DATE(createdAt / 1000, 'unixepoch')`);

    // 6. Platform breakdown
    const platformStats = await db.select({
      platform: sql<string>`json_extract(metadata, '$.platform')`,
      count: count()
    })
    .from(contentItems)
    .groupBy(sql`json_extract(metadata, '$.platform')`);

    return NextResponse.json({
      status: "ok",
      data: {
        summary: [
          { name: "Total Content", value: totalItemsRes.value, unit: "items" },
          { name: "Avg. Viral Score", value: Math.round(Number(avgScoreRes.value || 0)), unit: "%" },
          { name: "Published", value: publishedRes.value, unit: "posts" }
        ],
        nicheStats,
        picksTrend,
        platformStats
      }
    });
  } catch (error) {
    console.error("Analytics fetch failed:", error);
    return NextResponse.json({ status: "error", message: "Failed to fetch analytics" }, { status: 500 });
  }
}
