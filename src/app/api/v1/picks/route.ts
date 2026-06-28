import { NextRequest, NextResponse } from "next/server";
import { db } from "@/db";
import { contentItems, niches, userPicks } from "@/db/schema";
import { eq, desc, sql } from "drizzle-orm";
import { auth } from "@/lib/auth";

/**
 * GET /api/v1/picks
 * Returns today's picks for the current user.
 * Supports filtering by niche via ?niche=slug
 */
export async function GET(request: NextRequest) {
  const session = await auth();
  if (!session?.user?.id) {
    return NextResponse.json({ status: "error", error: "Unauthorized" }, { status: 401 });
  }

  const { searchParams } = new URL(request.url);
  const nicheSlug = searchParams.get("niche");

  try {
    // Build query for content items with niche info
    const query = db
      .select({
        id: contentItems.id,
        title: contentItems.title,
        description: contentItems.description,
        url: contentItems.url,
        type: contentItems.type,
        hook: contentItems.hook,
        viralScore: contentItems.viralScore,
        nicheId: contentItems.nicheId,
        nicheName: niches.name,
        nicheSlug: niches.slug,
        metadata: contentItems.metadata,
        createdAt: contentItems.createdAt,
      })
      .from(contentItems)
      .leftJoin(niches, eq(contentItems.nicheId, niches.id));

    // Apply niche filter if provided
    if (nicheSlug) {
      query.where(eq(niches.slug, nicheSlug));
    }

    // Order by viral score descending
    query.orderBy(desc(contentItems.viralScore));

    const items = await query;

    // Transform to the data contract format
    const picks = items.map((item) => {
      const metadata = item.metadata ? JSON.parse(item.metadata as string) : {};
      return {
        pick_id: `pick_${item.id}`,
        video: {
          video_id: item.id,
          title: item.title,
          channel: metadata.channel || metadata.platform_display || item.nicheName || "Unknown",
          platform: metadata.platform || "youtube",
          duration_sec: metadata.duration_sec || 0,
          view_count: metadata.view_count || 0,
          like_count: metadata.like_count || 0,
          comment_count: metadata.comment_count || 0,
          published_at: item.createdAt
            ? new Date(item.createdAt).toISOString()
            : new Date().toISOString(),
          niche: item.nicheSlug || item.nicheId,
          thumbnail_url: metadata.thumbnail_url || "",
          description: item.description || "",
          tags: metadata.post?.hashtags || [],
        },
        clip: {
          video_id: item.id,
          start_sec: metadata.clip?.start_sec || 0,
          end_sec: metadata.clip?.end_sec || 30,
          duration_sec: metadata.clip?.duration_sec || 30,
          clip_type: metadata.clip?.clip_type || "hook",
          confidence: metadata.clip?.confidence || 0.7,
          text_transcript: metadata.clip?.text_transcript || "",
          reasoning: metadata.clip?.reasoning || "ML-identified high-engagement segment",
        },
        post: {
          source_video_id: item.id,
          niche: item.nicheSlug || item.nicheId,
          captions: metadata.post?.captions || [
            item.hook || item.title,
            `🔥 Check this out!`,
          ],
          hashtags: metadata.post?.hashtags || ["#viral", "#trending"],
          thumbnail_concept: metadata.post?.thumbnail_concept || "Highlight frame",
          platform_recommendations: metadata.post?.platform_recommendations || [
            "tiktok",
            "youtube_shorts",
          ],
          post_type: item.type || "clip",
        },
        score: {
          overall_score: item.viralScore || 50,
          breakdown: metadata.score_breakdown || {
            hook_strength: 70,
            engagement_rate: 50,
            niche_trending: 50,
            platform_fit: 50,
            timeliness: 50,
            seasonality: 50,
          },
          reasoning: `Score: ${item.viralScore}% — niche: ${item.nicheSlug || item.nicheId}`,
        },
        viral_probability: item.viralScore || 50,
      };
    });

    return NextResponse.json({
      status: "ok",
      data: picks,
      meta: {
        generated_at: new Date().toISOString(),
        count: picks.length,
      },
    });
  } catch (error) {
    console.error("Error fetching picks:", error);
    return NextResponse.json(
      { status: "error", error: "Failed to fetch picks" },
      { status: 500 }
    );
  }
}

/**
 * POST /api/v1/picks/:id/publish
 * Mark a pick as published.
 */
export async function POST(request: NextRequest) {
  const session = await auth();
  if (!session?.user?.id) {
    return NextResponse.json({ status: "error", error: "Unauthorized" }, { status: 401 });
  }

  // Get content item ID from URL path
  const url = new URL(request.url);
  const pathParts = url.pathname.split("/");
  const contentItemId = pathParts[pathParts.length - 2]; // /api/v1/picks/{id}/publish

  if (!contentItemId || contentItemId === "picks") {
    return NextResponse.json(
      { status: "error", error: "Content item ID required" },
      { status: 400 }
    );
  }

  try {
    // Check if pick already exists
    const existing = await db
      .select()
      .from(userPicks)
      .where(
        sql`${userPicks.userId} = ${session.user.id} AND ${userPicks.contentItemId} = ${contentItemId}`
      )
      .limit(1);

    if (existing.length > 0) {
      // Update status to published
      await db
        .update(userPicks)
        .set({ status: "published" })
        .where(
          sql`${userPicks.userId} = ${session.user.id} AND ${userPicks.contentItemId} = ${contentItemId}`
        );
    } else {
      // Create new pick record
      await db.insert(userPicks).values({
        userId: session.user.id,
        contentItemId: contentItemId,
        status: "published",
      });
    }

    return NextResponse.json({ status: "ok", data: { published: true } });
  } catch (error) {
    console.error("Error publishing pick:", error);
    return NextResponse.json(
      { status: "error", error: "Failed to publish pick" },
      { status: 500 }
    );
  }
}
