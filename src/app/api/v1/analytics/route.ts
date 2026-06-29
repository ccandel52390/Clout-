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
    
    // 3. Picks published (total across all users for global stats, or filter by user?)
    // Task says "Query clout_user_pick for picks published", usually dashboard is user-specific.
    // But "daily active users" sounds like an admin/global stat.
    // Let's get user-specific picks published for the top stats, and global for admin-like view if needed.
    // For now, let's stick to user-specific for the top cards.
    const [userPublishedRes] = await db.select({ value: count() })
      .from(userPicks)
      .where(eq(userPicks.userId, session.user?.id as string));

    // 4. Items by niche
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
    // Extract platform from metadata JSON
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
          { name: "My Published", value: userPublishedRes.value, unit: "posts" }
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
