import { NextResponse } from "next/server";
import { searchMovies, searchTv } from "@/lib/tmdb";

// GET /api/search?q=invincible → { movies: [], tv: [] }
// Server-side so the TMDB token never reaches the browser.
export async function GET(req: Request) {
  const q = new URL(req.url).searchParams.get("q")?.trim() ?? "";
  if (q.length < 2) return NextResponse.json({ movies: [], tv: [] });

  try {
    const [movies, tv] = await Promise.all([searchMovies(q), searchTv(q)]);
    return NextResponse.json({
      movies: movies.results.slice(0, 20),
      tv: tv.results.slice(0, 20),
    });
  } catch (e) {
    const msg = e instanceof Error ? e.message : "TMDB request failed";
    const status = msg.includes("Missing TMDB_READ_TOKEN") ? 500 : 502;
    return NextResponse.json({ error: msg }, { status });
  }
}
