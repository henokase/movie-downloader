"use client";

import { useEffect, useState } from "react";
import { getLinks, redirectUrl, type LinksResult } from "@/lib/download";
import { ModalLinksSkeleton } from "@/components/skeletons";
import {
  AlertIcon,
  CaptionsIcon,
  CheckIcon,
  CloseIcon,
  DownloadIcon,
  ExternalIcon,
  FilmIcon,
  RefreshIcon,
} from "@/components/icons";

type State =
  | { kind: "loading" }
  | { kind: "redirecting" }
  | { kind: "error"; message: string }
  | { kind: "done"; data: LinksResult };

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
  const [state, setState] = useState<State>({ kind: "loading" });
  const [attempt, setAttempt] = useState(0);

  useEffect(() => {
    let cancelled = false;
    getLinks(type, tmdbId, title, year, season, episode).then(
      (data) => {
        if (cancelled) return;
        const mkvCount = (data.videos["MKV"] ?? []).filter(
          (f) => !f.locked,
        ).length;
        if (mkvCount === 0) {
          // No working direct files — skip the empty modal and go straight
          // to the provider page. Same-tab navigation on purpose: a
          // window.open from this async callback would be popup-blocked.
          setState({ kind: "redirecting" });
          window.location.href = redirectUrl(type, tmdbId, season, episode);
          return;
        }
        setState({ kind: "done", data });
      },
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
    // Props are fixed for the lifetime of one open modal; `attempt` re-runs on retry.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [attempt]);

  const retry = () => {
    setState({ kind: "loading" });
    setAttempt((n) => n + 1);
  };

  // ESC closes; lock background scroll while open.
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && onClose();
    document.addEventListener("keydown", onKey);
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", onKey);
      document.body.style.overflow = prev;
    };
  }, [onClose]);

  const label = type === "movie" ? title : `${title} S${season}E${episode}`;
  const fallback = redirectUrl(type, tmdbId, season, episode);

  return (
    <div
      className="animate-fade-in fixed inset-0 z-50 flex items-end justify-center bg-black/75 p-0 backdrop-blur-sm sm:items-center sm:p-4"
      onClick={onClose}
      role="dialog"
      aria-modal="true"
      aria-label={`Download ${label}`}
    >
      <div
        className="animate-pop-in thin-scroll max-h-[92vh] w-full max-w-xl overflow-y-auto rounded-t-3xl border border-white/10 bg-zinc-950 p-5 shadow-2xl sm:rounded-3xl sm:p-6"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="mb-1 flex items-start justify-between gap-3">
          <div className="flex min-w-0 items-center gap-3">
            <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-amber-400/15 text-amber-300">
              <DownloadIcon className="h-5 w-5" />
            </span>
            <div className="min-w-0">
              <h2 className="truncate text-lg font-bold tracking-tight text-zinc-50">
                {label}
              </h2>
              <p className="text-xs text-zinc-500">
                {type === "movie" ? `Movie · ${year}` : `Episode · ${year}`}
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            aria-label="Close"
            autoFocus
            className="shrink-0 rounded-full p-2 text-zinc-400 transition-colors hover:bg-white/10 hover:text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-amber-400"
          >
            <CloseIcon className="h-5 w-5" />
          </button>
        </div>

        <div className="mt-4">
          {state.kind === "loading" && <ModalLinksSkeleton />}

          {state.kind === "redirecting" && (
            <div className="flex flex-col items-center gap-3 rounded-2xl border border-white/10 bg-white/[0.03] px-6 py-8 text-center">
              <span className="flex h-11 w-11 items-center justify-center rounded-2xl bg-white/[0.06] text-amber-300">
                <ExternalIcon className="h-5 w-5" />
              </span>
              <p className="text-sm font-medium text-zinc-200">
                No MKV files available — opening the download page…
              </p>
            </div>
          )}

          {state.kind === "error" && (
            <div className="flex flex-col items-center gap-3 rounded-2xl border border-red-900/60 bg-red-950/40 px-6 py-8 text-center">
              <span className="flex h-11 w-11 items-center justify-center rounded-2xl bg-red-900/60 text-red-300">
                <AlertIcon className="h-5 w-5" />
              </span>
              <p className="text-sm font-medium text-red-100">{state.message}</p>
              <div className="flex flex-wrap justify-center gap-2">
                <button
                  onClick={retry}
                  className="inline-flex items-center gap-2 rounded-xl bg-white/10 px-4 py-2 text-sm font-semibold text-white transition-colors hover:bg-white/15"
                >
                  <RefreshIcon className="h-4 w-4" />
                  Retry
                </button>
                <a
                  href={fallback}
                  target="_blank"
                  rel="noopener"
                  className="inline-flex items-center gap-2 rounded-xl border border-white/15 px-4 py-2 text-sm font-semibold text-zinc-200 transition-colors hover:bg-white/5"
                >
                  <ExternalIcon className="h-4 w-4" />
                  Open redirect page
                </a>
              </div>
            </div>
          )}

          {state.kind === "done" && (
            <ModalBody data={state.data} fallback={fallback} />
          )}
        </div>
      </div>
    </div>
  );
}
function ModalBody({ data, fallback }: { data: LinksResult; fallback: string }) {
  // MKV-only: the MP4 file host throttles this network (HTTP 429), so MP4
  // rows are hidden instead of teasing dead options — the single MKV
  // section below renders only when it has files, with no division titles
  // for empty groups. The parent auto-redirects when MKV is empty, so no
  // empty-state is reachable here.
  const mkv = (data.videos["MKV"] ?? []).filter((f) => !f.locked);
  return (
    <div className="flex flex-col gap-5">
      {data.limited && (
        <div className="flex items-start gap-3 rounded-2xl border border-amber-900/60 bg-amber-950/40 p-4">
          <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-amber-900/60 text-amber-300">
            <AlertIcon className="h-4 w-4" />
          </span>
          <div>
            <p className="text-sm font-semibold text-amber-100">
              Download limit reached
            </p>
            <p className="mt-0.5 text-xs leading-relaxed text-amber-200/80">
              Try again later, or use the redirect link below.
            </p>
          </div>
        </div>
      )}

      {data.freeNum !== null && !data.limited && (
        <p className="inline-flex items-center gap-2 text-xs font-medium text-zinc-400">
          <span className="flex h-6 w-6 items-center justify-center rounded-full bg-emerald-400/15 text-emerald-300">
            <CheckIcon className="h-3.5 w-3.5" />
          </span>
          {data.freeNum} free {data.freeNum === 1 ? "download" : "downloads"} left
        </p>
      )}

      {mkv.length > 0 && (
        <section>
          <h3 className="mb-2.5 flex items-center gap-2 text-[13px] font-bold uppercase tracking-[0.1em] text-zinc-400">
            <FilmIcon className="h-4 w-4" />
            MKV · subtitles included
          </h3>
          <ul className="flex flex-col gap-2">
            {mkv.map((f, i) => (
              <li
                key={i}
                className="flex items-center justify-between gap-3 rounded-2xl border border-white/[0.06] bg-white/[0.03] px-4 py-3 transition-colors hover:border-white/[0.12] hover:bg-white/[0.05]"
              >
          <div className="flex min-w-0 flex-1 items-center gap-3">
                  <span className="shrink-0 rounded-lg bg-amber-400/15 px-2.5 py-1 text-xs font-bold text-amber-300">
                    {f.resolution ? `${f.resolution}p` : "MKV"}
                  </span>
                  <div className="min-w-0">
                    <p className="truncate text-sm font-medium text-zinc-100">
                      {f.size}
                      {f.note ? ` · ${f.note}` : ""}
                    </p>
                    <p className="text-xs text-zinc-500">
                      Matroska · direct file
                    </p>
                  </div>
                </div>
                <a
                  href={f.url}
                  className="inline-flex shrink-0 items-center gap-1.5 rounded-xl bg-amber-400 px-4 py-2 text-[13px] font-bold text-zinc-950 transition-colors hover:bg-amber-300"
                >
                  <DownloadIcon className="h-4 w-4" />
                  Get
                </a>
              </li>
            ))}
          </ul>
        </section>
      )}

      {data.subtitles.length > 0 && (
        <section>
          <h3 className="mb-2.5 flex items-center gap-2 text-[13px] font-bold uppercase tracking-[0.1em] text-zinc-400">
            <CaptionsIcon className="h-4 w-4" />
            Subtitles · {data.subtitles.length}
          </h3>
          <ul className="thin-scroll flex max-h-52 flex-col gap-1.5 overflow-y-auto rounded-2xl border border-white/[0.06] bg-white/[0.02] p-2">
            {data.subtitles.map((s, i) => (
              <li
                key={i}
                className="flex items-center justify-between gap-2 rounded-xl px-3 py-2 text-[13px] transition-colors hover:bg-white/[0.05]"
              >
                <span className="truncate text-zinc-300">
                  {s.lanName} <span className="text-zinc-600">· {s.size}</span>
                </span>
                <a
                  href={s.url}
                  className="shrink-0 rounded-lg bg-white/10 px-3 py-1 text-xs font-bold text-white transition-colors hover:bg-white/15"
                >
                  SRT
                </a>
              </li>
            ))}
          </ul>
        </section>
      )}

      <a
        href={fallback}
        target="_blank"
        rel="noopener"
        className="inline-flex items-center justify-center gap-2 rounded-2xl border border-dashed border-white/15 px-4 py-3 text-sm font-medium text-zinc-400 transition-colors hover:border-white/25 hover:text-zinc-200"
      >
        Prefer the redirect download page?
        <ExternalIcon className="h-4 w-4" />
      </a>
    </div>
  );
}
