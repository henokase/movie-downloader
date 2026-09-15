export function redirectUrl(
  type: "movie" | "tv",
  tmdbId: number,
  season?: number,
  episode?: number,
): string {
  // vidvault.ru 301-redirects to vidvault.to — point directly at .to
  if (type === "movie") return `https://vidvault.to/movie/${tmdbId}`;
  return `https://vidvault.to/tv/${tmdbId}/${season}/${episode}`;
}
