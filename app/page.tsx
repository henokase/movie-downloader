import SearchBar from "@/components/SearchBar";
import MediaCard from "@/components/MediaCard";
import { trendingMovies, trendingTv } from "@/lib/tmdb";

export default async function Home() {
  let movies: Awaited<ReturnType<typeof trendingMovies>> | null = null;
  let tv: Awaited<ReturnType<typeof trendingTv>> | null = null;
  let tmdbError: string | null = null;

  try {
    [movies, tv] = await Promise.all([trendingMovies(), trendingTv()]);
  } catch (e) {
    tmdbError =
      e instanceof Error && e.message.includes("Missing TMDB_READ_TOKEN")
        ? "Add your TMDB_READ_TOKEN to .env.local (see .env.example) and restart the dev server."
        : "Could not reach TMDB. Check your connection and restart.";
  }

  return (
    <div className="flex flex-col gap-10">
      <section className="flex flex-col items-center gap-4 pt-10 text-center">
        <h1 className="text-3xl font-bold sm:text-4xl">
          Find movies & TV shows
        </h1>
        <p className="max-w-md text-sm text-zinc-400">
          Search by title, pick a result, then download via redirect link or
          direct links.
        </p>
        <div className="w-full max-w-xl">
          <SearchBar big autoFocus />
        </div>
      </section>

      {tmdbError ? (
        <p className="rounded-lg border border-amber-700 bg-amber-950 p-4 text-sm text-amber-200">
          {tmdbError}
        </p>
      ) : (
        <>
          <section>
            <h2 className="mb-3 text-xl font-semibold">Trending movies</h2>
            <div className="grid grid-cols-3 gap-3 sm:grid-cols-4 md:grid-cols-5">
              {(movies?.results ?? []).slice(0, 10).map((m) => (
                <MediaCard
                  key={m.id}
                  id={m.id}
                  kind="movie"
                  title={m.title}
                  date={m.release_date}
                  posterPath={m.poster_path}
                  rating={m.vote_average}
                />
              ))}
            </div>
          </section>
          <section>
            <h2 className="mb-3 text-xl font-semibold">Trending TV shows</h2>
            <div className="grid grid-cols-3 gap-3 sm:grid-cols-4 md:grid-cols-5">
              {(tv?.results ?? []).slice(0, 10).map((s) => (
                <MediaCard
                  key={s.id}
                  id={s.id}
                  kind="tv"
                  title={s.name}
                  date={s.first_air_date}
                  posterPath={s.poster_path}
                  rating={s.vote_average}
                />
              ))}
            </div>
          </section>
        </>
      )}
    </div>
  );
}
