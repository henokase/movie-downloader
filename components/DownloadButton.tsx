"use client";

import { useState } from "react";
import { useSettings } from "@/lib/settings";
import { redirectUrl } from "@/lib/download";
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
        className={`rounded-lg bg-white font-medium text-black hover:bg-zinc-200 ${
          big ? "px-6 py-3 text-base" : "px-3 py-1.5 text-sm"
        }`}
      >
        ⬇ Download
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
