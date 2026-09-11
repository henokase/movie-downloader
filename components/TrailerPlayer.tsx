"use client";

import { useEffect, useRef, useState } from "react";
import {
  CloseIcon,
  ExternalIcon,
  PlayIcon,
} from "@/components/icons";

// Autoplaying YouTube (privacy-enhanced) player with a fullscreen toggle.
// Browsers only grant fullscreen on a user gesture, so auto-fullscreen on
// load isn't possible — one tap on the button gets there.
export default function TrailerPlayer({
  youtubeKey,
  title,
}: {
  youtubeKey: string;
  title: string;
}) {
  const wrapRef = useRef<HTMLDivElement>(null);
  const [isFull, setIsFull] = useState(false);

  useEffect(() => {
    const onChange = () => setIsFull(!!document.fullscreenElement);
    document.addEventListener("fullscreenchange", onChange);
    return () => document.removeEventListener("fullscreenchange", onChange);
  }, []);

  const toggle = async () => {
    const el = wrapRef.current;
    if (!el) return;
    try {
      if (document.fullscreenElement) {
        await document.exitFullscreen();
      } else {
        await el.requestFullscreen();
      }
    } catch {
      // Fullscreen unavailable (e.g. embedded webview) — the inline
      // player plus the YouTube link below still work.
    }
  };

  return (
    <div className="flex flex-col gap-4">
      <div
        ref={wrapRef}
        className="relative aspect-video w-full overflow-hidden rounded-2xl border border-white/10 bg-black shadow-2xl"
      >
        <iframe
          key={youtubeKey}
          src={`https://www.youtube-nocookie.com/embed/${youtubeKey}?autoplay=1&rel=0`}
          title={`${title} — trailer`}
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share fullscreen"
          allowFullScreen
          className="absolute inset-0 h-full w-full"
        />
      </div>

      <div className="flex flex-wrap items-center gap-2.5">
        <button
          onClick={toggle}
          className="inline-flex items-center gap-2 rounded-xl bg-amber-400 px-5 py-2.5 text-sm font-bold text-zinc-950 transition-colors hover:bg-amber-300 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-amber-200"
        >
          {isFull ? (
            <CloseIcon className="h-4 w-4" />
          ) : (
            <PlayIcon className="h-4 w-4" />
          )}
          {isFull ? "Exit fullscreen" : "Watch fullscreen"}
        </button>
        <a
          href={`https://www.youtube.com/watch?v=${youtubeKey}`}
          target="_blank"
          rel="noopener"
          className="inline-flex items-center gap-2 rounded-xl border border-white/15 px-5 py-2.5 text-sm font-semibold text-zinc-200 transition-colors hover:bg-white/5"
        >
          <ExternalIcon className="h-4 w-4" />
          Open on YouTube
        </a>
      </div>
    </div>
  );
}
