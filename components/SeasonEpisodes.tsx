"use client";

import { useState } from "react";
import Image from "next/image";
import DownloadButton from "@/components/DownloadButton";
import { poster, type Episode, type SeasonSummary } from "@/lib/tmdb";

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
    <section className="flex flex-col gap-3">
      <div className="flex items-center gap-3">
        <h2 className="text-lg font-semibold">Episodes</h2>
        <select
          value={season}
          onChange={(e) => change(Number(e.target.value))}
          className="rounded-lg border border-zinc-700 bg-zinc-900 px-3 py-1.5 text-sm"
        >
          {(realSeasons.length > 0 ? realSeasons : seasons).map((s) => (
            <option key={s.season_number} value={s.season_number}>
              {s.name} ({s.episode_count})
            </option>
          ))}
        </select>
      </div>

      {loading && <p className="text-sm text-zinc-400">Loading episodes…</p>}
      {error && <p className="text-sm text-red-300">{error}</p>}

      <ul className="flex flex-col gap-2">
        {episodes.map((ep) => (
          <li
            key={ep.episode_number}
            className="flex items-center gap-3 rounded-lg border border-zinc-800 bg-zinc-900 p-2"
          >
            {ep.still_path ? (
              <div className="relative h-14 w-24 shrink-0 overflow-hidden rounded bg-zinc-800">
                <Image
                  src={poster(ep.still_path, "w300") as string}
                  alt=""
                  fill
                  className="object-cover"
                />
              </div>
            ) : (
              <div className="flex h-14 w-24 shrink-0 items-center justify-center rounded bg-zinc-800 text-xs text-zinc-500">
                E{ep.episode_number}
              </div>
            )}
            <div className="min-w-0 flex-1">
              <p className="truncate text-sm font-medium">
                {ep.episode_number}. {ep.name}
              </p>
              <p className="truncate text-xs text-zinc-500">
                {ep.air_date ?? ""} {ep.overview ? `· ${ep.overview}` : ""}
              </p>
            </div>
            <DownloadButton
              type="tv"
              tmdbId={tvId}
              title={title}
              year={year}
              season={season}
              episode={ep.episode_number}
            />
          </li>
        ))}
      </ul>
    </section>
  );
}
