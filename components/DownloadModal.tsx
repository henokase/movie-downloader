"use client";

import { useEffect, useState } from "react";
import { getLinks, type LinksResult } from "@/lib/download";

export default function DownloadModal({
  type,
  tmdbId,
  title,
  year,
  season,
  episode,
  onClose,
}: {
  type: "movie" | "tv";
  tmdbId: number;
  title: string;
  year: string;
  season?: number;
  episode?: number;
  onClose: () => void;
}) {
  const [state, setState] = useState<
    { kind: "loading" } | { kind: "error"; message: string } | { kind: "done"; data: LinksResult }
  >({ kind: "loading" });

  useEffect(() => {
    let cancelled = false;
    getLinks(type, tmdbId, title, year, season, episode).then(
      (data) => !cancelled && setState({ kind: "done", data }),
      (e: unknown) => {
        if (cancelled) return;
        const err = e as Error & { code?: string };
        const message =
          err.code === "rate-limited"
            ? "Too many requests — wait a minute and try again."
            : err.code === "verification"
              ? "Blocked by verification — open the redirect link instead."
              : "Could not load download links. The backend may be down.";
        setState({ kind: "error", message });
      },
    );
    return () => {
      cancelled = true;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const label =
    type === "movie" ? title : `${title} S${season}E${episode}`;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 p-4"
      onClick={onClose}
    >
      <div
        className="max-h-[85vh] w-full max-w-lg overflow-y-auto rounded-xl border border-zinc-700 bg-zinc-900 p-5"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="mb-4 flex items-start justify-between gap-2">
          <h2 className="text-lg font-semibold">{label}</h2>
          <button
            onClick={onClose}
            className="rounded px-2 py-1 text-zinc-400 hover:bg-zinc-800 hover:text-white"
            aria-label="Close"
          >
            ✕
          </button>
        </div>

        {state.kind === "loading" && (
          <p className="py-8 text-center text-sm text-zinc-400">
            Loading download links…
          </p>
        )}

        {state.kind === "error" && (
          <p className="rounded-lg border border-red-800 bg-red-950 p-3 text-sm text-red-200">
            {state.message}
          </p>
        )}

        {state.kind === "done" && (
          <div className="flex flex-col gap-4">
            {state.data.limited && (
              <p className="rounded-lg border border-amber-700 bg-amber-950 p-3 text-sm text-amber-200">
                Download limit reached. Try again later or use a redirect link.
              </p>
            )}
            {state.data.freeNum !== null && (
              <p className="text-xs text-zinc-400">
                {state.data.freeNum} free downloads left
              </p>
            )}

            {Object.keys(state.data.videos).length === 0 && (
              <p className="text-sm text-zinc-400">No video files available.</p>
            )}
            {Object.entries(state.data.videos).map(([format, files]) => (
              <section key={format}>
                <h3 className="mb-2 text-sm font-semibold text-zinc-300">
                  {format === "MKV" ? "MKV (subtitles included)" : "MP4 (no subtitles)"}
                </h3>
                <ul className="flex flex-col gap-2">
                  {files.map((f, i) => (
                    <li
                      key={i}
                      className="flex items-center justify-between gap-2 rounded-lg bg-zinc-800 px-3 py-2 text-sm"
                    >
                      <span>
                        {f.resolution ? `${f.resolution}p` : format} · {f.size}
                      </span>
                      {f.locked ? (
                        <span className="rounded bg-zinc-700 px-3 py-1 text-xs text-zinc-400">
                          VIP 🔒
                        </span>
                      ) : (
                        <a
                          href={f.url}
                          target="_blank"
                          rel="noopener"
                          className="rounded bg-white px-3 py-1 text-xs font-medium text-black hover:bg-zinc-200"
                        >
                          Download
                        </a>
                      )}
                    </li>
                  ))}
                </ul>
              </section>
            ))}

            {state.data.subtitles.length > 0 && (
              <section>
                <h3 className="mb-2 text-sm font-semibold text-zinc-300">
                  Subtitles
                </h3>
                <ul className="flex max-h-48 flex-col gap-1 overflow-y-auto">
                  {state.data.subtitles.map((s, i) => (
                    <li
                      key={i}
                      className="flex items-center justify-between gap-2 rounded bg-zinc-800/60 px-3 py-1.5 text-xs"
                    >
                      <span>
                        {s.lanName} · {s.size}
                      </span>
                      <a
                        href={s.url}
                        target="_blank"
                        rel="noopener"
                        className="text-zinc-200 underline hover:text-white"
                      >
                        SRT
                      </a>
                    </li>
                  ))}
                </ul>
              </section>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
