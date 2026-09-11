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
  cast: {
    id: number;
    name: string;
    character: string;
    profile_path: string | null;
  }[];
}

export interface MovieDetails extends MovieResult {
  runtime?: number;
  genres: { id: number; name: string }[];
  credits?: Credits;
  videos?: Videos;
}

export interface TvDetails extends TvResult {
  number_of_seasons: number;
  genres: { id: number; name: string }[];
  seasons: SeasonSummary[];
  credits?: Credits;
  videos?: Videos;
}

// append_to_response=videos — YouTube keys for the trailer page.
export interface VideoEntry {
  key: string;
  site: string;
  type: string;
  official: boolean;
  name: string;
}

export interface Videos {
  results: VideoEntry[];
}

// Best playable trailer: official YouTube trailer first, then any
// trailer, teaser, and finally any other YouTube video.
export function bestTrailerKey(videos?: Videos): string | null {
  const yt = (videos?.results ?? []).filter((v) => v.site === "YouTube");
  if (yt.length === 0) return null;
  return (
    yt.find((v) => v.type === "Trailer" && v.official)?.key ??
    yt.find((v) => v.type === "Trailer")?.key ??
    yt.find((v) => v.type === "Teaser")?.key ??
    yt[0].key
  );
}

export const poster = (p: string | null, size = "w500") =>
  p ? `https://image.tmdb.org/t/p/${size}${p}` : null;

// GET /person/{id} — profile header for the person page.
export interface PersonDetails {
  id: number;
  name: string;
  biography: string;
  birthday: string | null;
  deathday: string | null;
  place_of_birth: string | null;
  profile_path: string | null;
  known_for_department: string;
}

// GET /person/{id}/combined_credits — full acting filmography in one call.
// Each entry declares its own media_type ("movie" or "tv").
export interface PersonCredit {
  id: number;
  media_type: "movie" | "tv";
  title?: string;
  name?: string;
  poster_path: string | null;
  backdrop_path: string | null;
  vote_average: number;
  overview: string;
  release_date?: string;
  first_air_date?: string;
  character?: string;
}

export interface CombinedCredits {
  cast: PersonCredit[];
}
