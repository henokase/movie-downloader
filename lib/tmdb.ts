// Server-side TMDB client. Never import from client components —
// the read token must stay on the server.
import "server-only";

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

export interface MovieResult {
  id: number;
  title: string;
  release_date?: string;
  poster_path: string | null;
  vote_average: number;
  overview: string;
}

export interface TvResult {
  id: number;
  name: string;
  first_air_date?: string;
  poster_path: string | null;
  vote_average: number;
  overview: string;
}

export interface Paged<T> {
  results: T[];
  total_results: number;
}

export interface SeasonSummary {
  season_number: number;
  name: string;
  episode_count: number;
  poster_path: string | null;
}

export interface Episode {
  episode_number: number;
  season_number: number;
  name: string;
  overview: string;
  air_date?: string;
  still_path: string | null;
}

export interface Credits {
  cast: { id: number; name: string; character: string }[];
}

export interface MovieDetails extends MovieResult {
  runtime?: number;
  genres: { id: number; name: string }[];
  credits?: Credits;
}

export interface TvDetails extends TvResult {
  number_of_seasons: number;
  genres: { id: number; name: string }[];
  seasons: SeasonSummary[];
  credits?: Credits;
}

export const poster = (p: string | null, size = "w500") =>
  p ? `https://image.tmdb.org/t/p/${size}${p}` : null;

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
  return get<{ episodes: Episode[] }>(`/tv/${tvId}/season/${season}`, {
    next: { revalidate: 3600 },
  });
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
