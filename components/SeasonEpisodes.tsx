"use client";

import { useState } from "react";
import Image from "next/image";
import DownloadButton from "@/components/DownloadButton";
import { EpisodeListSkeleton } from "@/components/skeletons";
import { AlertIcon, ChevronDownIcon, RefreshIcon } from "@/components/icons";
import { poster, type Episode, type SeasonSummary } from "@/lib/tmdb-types";

export default function SeasonEpisodes({
  tvId,
  title,
  year,
  seasons,
  initialSeason,
  initialEpisodes,
}: {
  tvId: number;
  title: string;
  year: string;
  seasons: SeasonSummary[];
  initialSeason: number;
  initialEpisodes: Episode[];
}) {
  const realSeasons = seasons.filter((s) => s.season_number > 0);
  const [season, setSeason] = useState(initialSeason);
  const [episodes, setEpisodes] = useState(initialEpisodes);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const change = async (n: number) => {
    if (n === season && episodes.length > 0) return;
    setSeason(n);
    setLoading(true);
    setError(null);
    try {
      const res = await fetch(`/api/season?tv=${tvId}&s=${n}`);
      if (!res.ok) throw new Error();
      const json = await res.json();
      setEpisodes(json.episodes ?? []);
    } catch {
      setError("Could not load episodes.");
      setEpisodes([]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <section className="flex flex-col gap-4">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <h2 className="text-lg font-bold tracking-tight text-zinc-100">
          Episodes
          {!loading && episodes.length > 0 && (
            <span className="ml-2 rounded-full bg-white/[0.06] px-2.5 py-1 text-xs font-semibold text-zinc-400">
              {episodes.length}
            </span>
          )}
        </h2>
        <label className="relative inline-flex items-center">
          <span className="sr-only">Choose season</span>
          <select
            value={season}
            onChange={(e) => change(Number(e.target.value))}
            className="appearance-none rounded-xl border border-zinc-700/80 bg-zinc-900 py-2.5 pl-4 pr-10 text-sm font-medium text-zinc-100 transition-colors hover:border-zinc-500 focus:border-amber-400/70 focus:outline-none"
          >
            {(realSeasons.length > 0 ? realSeasons : seasons).map((s) => (
              <option key={s.season_number} value={s.season_number}>
                {s.name} · {s.episode_count} ep
              </option>
            ))}
          </select>
          <ChevronDownIcon className="pointer-events-none absolute right-3 h-4 w-4 text-zinc-500" />
        </label>
      </div>

      {loading && <EpisodeListSkeleton count={4} />}

      {error && !loading && (
        <div className="flex items-center justify-between gap-3 rounded-2xl border border-red-900/60 bg-red-950/40 px-4 py-3.5">
          <p className="flex items-center gap-2.5 text-sm text-red-200">
            <AlertIcon className="h-4 w-4 shrink-0" />
            {error}
          </p>
          <button
            onClick={() => change(season)}
            className="inline-flex shrink-0 items-center gap-1.5 rounded-xl bg-white/10 px-3.5 py-2 text-[13px] font-semibold text-white transition-colors hover:bg-white/15"
          >
            <RefreshIcon className="h-3.5 w-3.5" />
            Retry
          </button>
        </div>
      )}

      {!loading && !error && episodes.length === 0 && (
        <p className="rounded-2xl border border-white/[0.06] bg-white/[0.02] px-4 py-6 text-center text-sm text-zinc-500">
          No episodes listed for this season yet.
        </p>
      )}

      {!loading && (
        <ul className="flex flex-col gap-2.5">
          {episodes.map((ep) => (
            <li
              key={ep.episode_number}
              className="group flex items-center gap-3 rounded-2xl border border-white/[0.06] bg-white/[0.02] p-3 transition-colors hover:border-white/[0.12] hover:bg-white/[0.04] sm:gap-4 sm:p-3.5"
            >
              {ep.still_path ? (
                <div className="relative h-16 w-28 shrink-0 overflow-hidden rounded-xl bg-zinc-800 sm:h-[72px] sm:w-36">
                  <Image
                    src={poster(ep.still_path, "w300") as string}
                    alt=""
                    fill
                    sizes="144px"
                    className="object-cover"
                  />
                  <span className="absolute bottom-1 left-1 rounded-md bg-black/70 px-1.5 py-0.5 text-[10px] font-bold text-white">
                    E{ep.episode_number}
                  </span>
                </div>
              ) : (
                <div className="flex h-16 w-28 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-zinc-800 to-zinc-900 text-sm font-bold text-zinc-500 sm:h-[72px] sm:w-36">
                  E{ep.episode_number}
                </div>
              )}
              <div className="min-w-0 flex-1">
                <p className="truncate text-sm font-semibold text-zinc-100">
                  <span className="mr-1.5 text-zinc-500">{ep.episode_number}.</span>
                  {ep.name || "Untitled episode"}
                </p>
                <p className="mt-0.5 line-clamp-2 text-xs leading-relaxed text-zinc-500">
                  {[ep.air_date, ep.overview].filter(Boolean).join(" · ")}
                </p>
              </div>
              <div className="shrink-0">
                <DownloadButton
                  type="tv"
                  tmdbId={tvId}
                  title={title}
                  year={year}
                  season={season}
                  episode={ep.episode_number}
                />
              </div>
            </li>
          ))}
        </ul>
      )}
    </section>
  );
}
