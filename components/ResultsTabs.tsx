"use client";

import { useState } from "react";
import MediaCard from "@/components/MediaCard";
import EmptyState from "@/components/EmptyState";
import { FilmIcon, TvIcon } from "@/components/icons";
import type { MovieResult, TvResult } from "@/lib/tmdb-types";

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

  const tabs = [
    { key: "movie", label: "Movies", count: movies.length, icon: <FilmIcon className="h-4 w-4" /> },
    { key: "tv", label: "TV Shows", count: tv.length, icon: <TvIcon className="h-4 w-4" /> },
  ] as const;

  return (
    <div>
      <div
        role="tablist"
        aria-label="Result types"
        className="mb-5 inline-flex rounded-2xl border border-zinc-800 bg-zinc-900/70 p-1"
      >
        {tabs.map((t) => {
          const active = tab === t.key;
          return (
            <button
              key={t.key}
              role="tab"
              aria-selected={active}
              onClick={() => setTab(t.key)}
              className={`flex items-center gap-2 rounded-xl px-4 py-2 text-sm font-semibold transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-amber-400 ${
                active
                  ? "bg-amber-400 text-zinc-950"
                  : "text-zinc-400 hover:bg-zinc-800 hover:text-zinc-100"
              }`}
            >
              {t.icon}
              {t.label}
              <span
                className={`rounded-full px-2 py-0.5 text-xs font-bold ${
                  active ? "bg-zinc-950/15" : "bg-zinc-800 text-zinc-400"
                }`}
              >
                {t.count}
              </span>
            </button>
          );
        })}
      </div>

      {tab === "movie" ? (
        movies.length === 0 ? (
          <EmptyState
            icon={<FilmIcon />}
            title="No movies found"
            hint="Try a different spelling, the original-language title, or fewer words."
          />
        ) : (
          <div className="grid grid-cols-3 gap-3 sm:grid-cols-4 sm:gap-4 lg:grid-cols-5 xl:grid-cols-6">
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
        <EmptyState
          icon={<TvIcon />}
          title="No TV shows found"
          hint="Try a different spelling, the original-language title, or fewer words."
        />
      ) : (
        <div className="grid grid-cols-3 gap-3 sm:grid-cols-4 sm:gap-4 lg:grid-cols-5 xl:grid-cols-6">
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
