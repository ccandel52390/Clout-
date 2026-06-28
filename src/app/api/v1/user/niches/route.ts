import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { db } from "@/db";
import { userNiches } from "@/db/schema";
import { eq } from "drizzle-orm";

export async function POST(request: Request) {
  const session = await auth();
  const userId = session?.user?.id;

  if (!userId) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const { nicheIds } = await request.json();

    // Clear existing niches
    await db.delete(userNiches).where(eq(userNiches.userId, userId));

    // Insert new ones
    if (nicheIds.length > 0) {
      await db.insert(userNiches).values(
        nicheIds.map((nicheId: string) => ({
          userId,
          nicheId,
        }))
      );
    }

    return NextResponse.json({ status: "ok" });
  } catch (error) {
    console.error("Error saving user niches:", error);
    return NextResponse.json({ error: "Failed to save niches" }, { status: 500 });
  }
}
