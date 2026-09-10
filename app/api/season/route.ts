import { NextResponse } from "next/server";
import { getSeason } from "@/lib/tmdb";

// GET /api/season?tv=95557&s=2 → { episodes: [...] }
export async function GET(req: Request) {
  const sp = new URL(req.url).searchParams;
  const tv = sp.get("tv") ?? "";
  const s = sp.get("s") ?? "";
  if (!tv || !s) return NextResponse.json({ error: "tv and s required" }, { status: 400 });

  try {
    const data = await getSeason(tv, s);
    return NextResponse.json({ episodes: data.episodes });
  } catch {
    return NextResponse.json({ error: "Could not load episodes" }, { status: 502 });
  }
}
