"use client";

import { useState } from "react";
import { useSettings } from "@/lib/settings";
import { redirectUrl } from "@/lib/download";
import { DownloadIcon } from "@/components/icons";
import DownloadModal from "@/components/DownloadModal";

export default function DownloadButton({
  type,
  tmdbId,
  title,
  year,
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
  const { settings } = useSettings();
  const [open, setOpen] = useState(false);

  const click = () => {
    if (settings.downloadMode === "redirect") {
      const url = redirectUrl(type, tmdbId, season, episode);
      if (settings.openInNewTab) window.open(url, "_blank", "noopener");
      else window.location.href = url;
    } else {
      setOpen(true);
    }
  };

  return (
    <>
      <button
        onClick={click}
        className={`inline-flex items-center justify-center gap-2 rounded-xl bg-amber-400 font-bold text-zinc-950 shadow-[0_8px_30px_-8px_rgba(251,191,36,0.5)] transition-all hover:-translate-y-px hover:bg-amber-300 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-amber-200 active:translate-y-0 ${
          big ? "px-7 py-3.5 text-base" : "px-3.5 py-2 text-[13px]"
        }`}
      >
        <DownloadIcon className={big ? "h-5 w-5" : "h-4 w-4"} />
        Download
      </button>
      {open && (
        <DownloadModal
          type={type}
          tmdbId={tmdbId}
          title={title}
          year={year}
          season={season}
          episode={episode}
          onClose={() => setOpen(false)}
        />
      )}
    </>
  );
}
