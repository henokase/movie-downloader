import Image from "next/image";
import SearchBar from "@/components/SearchBar";
import MediaCard from "@/components/MediaCard";
import Rail from "@/components/Rail";
import EmptyState from "@/components/EmptyState";
import { AlertIcon } from "@/components/icons";
import { trendingMovies, trendingTv } from "@/lib/tmdb";
import { poster } from "@/lib/tmdb-types";

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

  const heroBackdrop = poster(movies?.results[0]?.backdrop_path ?? null, "w1280");

  return (
    <div className="flex flex-col gap-12">
      {/* hero */}
      <section className="relative -mx-4 overflow-hidden sm:-mx-6">
        {heroBackdrop && (
          <>
            <div className="absolute inset-0">
              <Image
                src={heroBackdrop}
                alt=""
                fill
                priority
                className="object-cover object-top"
                sizes="100vw"
              />
            </div>
            <div className="absolute inset-0 bg-gradient-to-b from-[#09090b]/70 via-[#09090b]/55 to-[#09090b]" />
            <div className="absolute inset-0 bg-gradient-to-r from-[#09090b]/60 via-transparent to-transparent" />
          </>
        )}
        <div className="relative mx-auto flex w-full max-w-6xl flex-col items-start gap-5 px-4 pb-14 pt-16 sm:items-center sm:px-6 sm:pb-20 sm:pt-24 sm:text-center">
          <p
            className="animate-fade-up rounded-full border border-amber-400/30 bg-amber-400/10 px-3.5 py-1.5 text-xs font-semibold uppercase tracking-[0.14em] text-amber-300"
          >
            Movies & TV · direct downloads
          </p>
          <h1
            className="animate-fade-up max-w-2xl text-4xl font-extrabold leading-[1.05] tracking-tight text-white sm:text-6xl"
            style={{ animationDelay: "80ms" }}
          >
            Find it. <span className="text-amber-400">Download it.</span>
          </h1>
          <p
            className="animate-fade-up max-w-xl text-sm leading-relaxed text-zinc-300 sm:text-base"
            style={{ animationDelay: "160ms" }}
          >
            Search any title, open it, and grab MP4 or MKV files — via a
            redirect page or direct links, straight from your own connection.
          </p>
          <div
            className="animate-fade-up w-full max-w-xl"
            style={{ animationDelay: "240ms" }}
          >
            <SearchBar big autoFocus />
          </div>
        </div>
      </section>

      {tmdbError ? (
        <EmptyState
          tone="warn"
          icon={<AlertIcon className="h-6 w-6" />}
          title="Trending is unavailable"
          hint={tmdbError}
        />
      ) : (
        <>
          <Rail title="Trending movies">
            {(movies?.results ?? []).slice(0, 10).map((m) => (
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
            ))}
          </Rail>
          <Rail title="Trending TV shows">
            {(tv?.results ?? []).slice(0, 10).map((s) => (
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
        </>
      )}
    </div>
  );
}
