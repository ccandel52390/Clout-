import { NextResponse } from "next/server";
import fs from "fs/promises";
import path from "path";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const niche = searchParams.get("niche");

  try {
    const filePath = path.join(process.cwd(), "data", "daily_picks.json");
    const fileContent = await fs.readFile(filePath, "utf-8");
    let picks = JSON.parse(fileContent);

    if (niche && niche !== "All Niches") {
      picks = picks.filter((p: any) => p.video.niche.toLowerCase() === niche.toLowerCase());
    }

    return NextResponse.json({
      status: "ok",
      data: picks,
      meta: {
        generated_at: new Date().toISOString(),
        count: picks.length,
      },
    });
  } catch (error) {
    console.error("Error reading daily picks:", error);
    return NextResponse.json(
      { status: "error", message: "Failed to load daily picks" },
      { status: 500 }
    );
  }
}
