// Shared TMDB types + image helper. Safe to import from
// both server and client components (no secrets here).

export interface MovieResult {
  id: number;
  title: string;
  release_date?: string;
  poster_path: string | null;
  backdrop_path: string | null;
  vote_average: number;
  overview: string;
}

export interface TvResult {
  id: number;
  name: string;
  first_air_date?: string;
  poster_path: string | null;
  backdrop_path: string | null;
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
