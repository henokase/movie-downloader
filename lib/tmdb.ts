// Server-side TMDB fetchers. Import ONLY from server components
// and route handlers — the read token must stay on the server.
import "server-only";

import type {
  MovieDetails,
  MovieResult,
  Paged,
  TvDetails,
  TvResult,
} from "@/lib/tmdb-types";

export type { MovieDetails, MovieResult, Paged, TvDetails, TvResult };

const BASE = process.env.TMDB_BASE ?? "https://api.themoviedb.org/3";

function headers() {
  const token = process.env.TMDB_READ_TOKEN;
  if (!token) throw new Error("Missing TMDB_READ_TOKEN in .env.local");
  return {
    Authorization: `Bearer ${token}`,
    "Content-Type": "application/json",
  };
}

async function get<T>(path: string, init?: RequestInit): Promise<T> {
  const res = await fetch(`${BASE}${path}`, { ...init, headers: headers() });
  if (!res.ok) throw new Error(`TMDB ${res.status} on ${path}`);
  return res.json() as Promise<T>;
}

// Search is per-keystroke: never cache.
export function searchMovies(q: string) {
  return get<Paged<MovieResult>>(
    `/search/movie?query=${encodeURIComponent(q)}&include_adult=false`,
    { cache: "no-store" },
  );
}

export function searchTv(q: string) {
  return get<Paged<TvResult>>(
    `/search/tv?query=${encodeURIComponent(q)}&include_adult=false`,
    { cache: "no-store" },
  );
}

// Metadata barely changes: cache details 24h, seasons 1h.
export function getMovie(id: string) {
  return get<MovieDetails>(`/movie/${id}?append_to_response=credits`, {
    next: { revalidate: 86400 },
  });
}

export function getTv(id: string) {
  return get<TvDetails>(`/tv/${id}?append_to_response=credits`, {
    next: { revalidate: 86400 },
  });
}

export function getSeason(tvId: string, season: string) {
  return get<{ episodes: import("@/lib/tmdb-types").Episode[] }>(
    `/tv/${tvId}/season/${season}`,
    { next: { revalidate: 3600 } },
  );
}

export function trendingMovies() {
  return get<Paged<MovieResult>>("/trending/movie/week", {
    next: { revalidate: 21600 },
  });
}

export function trendingTv() {
  return get<Paged<TvResult>>("/trending/tv/week", {
    next: { revalidate: 21600 },
  });
}
