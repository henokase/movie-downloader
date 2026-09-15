"use client";

import { redirectUrl } from "@/lib/download";
import { DownloadIcon } from "@/components/icons";

export default function DownloadButton({
  type,
  tmdbId,
  season,
  episode,
  big = false,
}: {
  type: "movie" | "tv";
  tmdbId: number;
  title: string;
  year: string;
  season?: number;
  episode?: number;
  big?: boolean;
}) {
  const href = redirectUrl(type, tmdbId, season, episode);

  return (
    <a
      href={href}
      target="_blank"
      rel="noopener"
      className={`inline-flex items-center justify-center gap-2 rounded-xl bg-amber-400 font-bold text-zinc-950 shadow-[0_8px_30px_-8px_rgba(251,191,36,0.5)] transition-all hover:-translate-y-px hover:bg-amber-300 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-amber-200 active:translate-y-0 ${
        big ? "px-7 py-3.5 text-base" : "px-3.5 py-2 text-[13px]"
      }`}
    >
      <DownloadIcon className={big ? "h-5 w-5" : "h-4 w-4"} />
      Download
    </a>
  );
}
