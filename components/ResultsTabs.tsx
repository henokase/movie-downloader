"use client";

import { useState } from "react";
import MediaCard from "@/components/MediaCard";
import type { MovieResult, TvResult } from "@/lib/tmdb";

export default function ResultsTabs({
  movies,
  tv,
}: {
  movies: MovieResult[];
  tv: TvResult[];
}) {
  const [tab, setTab] = useState<"movie" | "tv">(
    movies.length === 0 && tv.length > 0 ? "tv" : "movie",
  );

  const btn = (active: boolean) =>
    `rounded-lg px-4 py-2 text-sm font-medium ${
      active ? "bg-white text-black" : "bg-zinc-800 text-zinc-300 hover:bg-zinc-700"
    }`;

  return (
    <div>
      <div className="mb-4 flex gap-2">
        <button onClick={() => setTab("movie")} className={btn(tab === "movie")}>
          Movies ({movies.length})
        </button>
        <button onClick={() => setTab("tv")} className={btn(tab === "tv")}>
          TV Shows ({tv.length})
        </button>
      </div>

      {tab === "movie" ? (
        movies.length === 0 ? (
          <p className="text-sm text-zinc-400">No movies found.</p>
        ) : (
          <div className="grid grid-cols-3 gap-3 sm:grid-cols-4 md:grid-cols-5">
            {movies.map((m) => (
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
        )
      ) : tv.length === 0 ? (
        <p className="text-sm text-zinc-400">No TV shows found.</p>
      ) : (
        <div className="grid grid-cols-3 gap-3 sm:grid-cols-4 md:grid-cols-5">
          {tv.map((s) => (
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
      )}
    </div>
  );
}
