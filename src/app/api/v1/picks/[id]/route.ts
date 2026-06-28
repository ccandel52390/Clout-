import { NextRequest, NextResponse } from "next/server";
import { db } from "@/db";
import { contentItems, userPicks } from "@/db/schema";
import { eq, sql } from "drizzle-orm";
import { auth } from "@/lib/auth";

/**
 * GET /api/v1/picks/[id]
 * Returns a single pick by ID.
 */
export async function GET(
  _request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const session = await auth();
  if (!session?.user?.id) {
    return NextResponse.json({ status: "error", error: "Unauthorized" }, { status: 401 });
  }

  const { id } = await params;

  try {
    const item = await db
      .select()
      .from(contentItems)
      .where(eq(contentItems.id, id))
      .limit(1);

    if (item.length === 0) {
      return NextResponse.json(
        { status: "error", error: "Pick not found" },
        { status: 404 }
      );
    }

    const metadata = item[0].metadata ? JSON.parse(item[0].metadata as string) : {};

    return NextResponse.json({
      status: "ok",
      data: {
        pick_id: `pick_${item[0].id}`,
        video: {
          video_id: item[0].id,
          title: item[0].title,
          description: item[0].description,
          hook: item[0].hook,
        },
        clip: metadata.clip || {},
        post: metadata.post || {},
        score: {
          overall_score: item[0].viralScore || 50,
          breakdown: metadata.score_breakdown || {},
        },
        viral_probability: item[0].viralScore || 50,
      },
    });
  } catch (error) {
    console.error("Error fetching pick:", error);
    return NextResponse.json(
      { status: "error", error: "Failed to fetch pick" },
      { status: 500 }
    );
  }
}

/**
 * POST /api/v1/picks/[id]/publish
 * Mark a pick as published.
 */
export async function POST(
  _request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const session = await auth();
  if (!session?.user?.id) {
    return NextResponse.json({ status: "error", error: "Unauthorized" }, { status: 401 });
  }

  const { id } = await params;

  try {
    const existing = await db
      .select()
      .from(userPicks)
      .where(
        sql`${userPicks.userId} = ${session.user.id} AND ${userPicks.contentItemId} = ${id}`
      )
      .limit(1);

    if (existing.length > 0) {
      await db
        .update(userPicks)
        .set({ status: "published" })
        .where(
          sql`${userPicks.userId} = ${session.user.id} AND ${userPicks.contentItemId} = ${id}`
        );
    } else {
      await db.insert(userPicks).values({
        userId: session.user.id,
        contentItemId: id,
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
