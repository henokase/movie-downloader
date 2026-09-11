import Rail from "@/components/Rail";
import MediaCard from "@/components/MediaCard";
import { getRelatedMovie, getRelatedTv } from "@/lib/tmdb";
import type { MovieResult, TvResult } from "@/lib/tmdb-types";

// Server wrapper: fetches recommendations (similar as fallback) and
// renders them as a poster rail. Renders nothing when empty/unreachable.
export default async function RelatedRow({
  kind,
  id,
  title = "More like this",
}: {
  kind: "movie" | "tv";
  id: string;
  title?: string;
}) {
  let items: (MovieResult | TvResult)[] = [];
  try {
    const all =
      kind === "movie" ? await getRelatedMovie(id) : await getRelatedTv(id);
    items = all.filter((m) => String(m.id) !== String(id)).slice(0, 12);
  } catch {
    return null;
  }
  if (items.length === 0) return null;

  return (
    <Rail title={title}>
      {kind === "movie"
        ? (items as MovieResult[]).map((m) => (
            <div key={m.id} className="w-32 shrink-0 snap-start sm:w-40">
              <MediaCard
                id={m.id}
                kind="movie"
                title={m.title}
                date={m.release_date}
                posterPath={m.poster_path}
                rating={m.vote_average}
              />
            </div>
          ))
        : (items as TvResult[]).map((s) => (
            <div key={s.id} className="w-32 shrink-0 snap-start sm:w-40">
              <MediaCard
                id={s.id}
                kind="tv"
                title={s.name}
                date={s.first_air_date}
                posterPath={s.poster_path}
                rating={s.vote_average}
              />
            </div>
          ))}
    </Rail>
  );
}
