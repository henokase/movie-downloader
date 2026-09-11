import Image from "next/image";
import type { ReactNode } from "react";
import { CalendarIcon, ClockIcon, StarIcon } from "@/components/icons";

// Shared cinematic header for the movie and TV detail pages.
export default function DetailHero({
  backdrop,
  posterSrc,
  title,
  year,
  rating,
  meta,
  genres,
  overview,
  actions,
  eyebrow,
}: {
  backdrop: string | null;
  posterSrc: string | null;
  title: string;
  year: string;
  rating: number;
  meta: string[];
  genres: string[];
  overview: string;
  actions: ReactNode;
  eyebrow: string;
}) {
  return (
    <div>
      <div className="relative -mx-4 h-60 overflow-hidden sm:-mx-6 sm:h-96">
        {backdrop ? (
          <Image
            src={backdrop}
            alt=""
            fill
            priority
            className="object-cover object-top"
            sizes="100vw"
          />
        ) : (
          <div className="absolute inset-0 bg-gradient-to-br from-zinc-800 via-zinc-900 to-black" />
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-[#09090b] via-[#09090b]/45 to-[#09090b]/10" />
        <div className="absolute inset-0 bg-gradient-to-r from-[#09090b]/50 via-transparent to-transparent" />
      </div>

      {/* relative + z-10: this row overlaps the backdrop with negative
          margin, and must paint above the positioned backdrop image. */}
      <div className="relative z-10 -mt-28 flex flex-col gap-6 px-1 sm:-mt-32 sm:flex-row sm:gap-8 sm:px-2">
        {/* self-start: keeps the 2:3 poster shape instead of stretching
            to the row height on long overviews (which would crop it). */}
        <div className="relative aspect-[2/3] w-36 shrink-0 self-start overflow-hidden rounded-2xl border border-white/10 bg-zinc-800 shadow-[0_24px_60px_-16px_rgba(0,0,0,0.9)] sm:w-56">
          {posterSrc ? (
            <Image
              src={posterSrc}
              alt={title}
              fill
              className="object-cover"
              sizes="(max-width: 640px) 144px, 224px"
            />
          ) : (
            <div className="flex h-full items-center justify-center p-3 text-center text-xs text-zinc-500">
              No poster
            </div>
          )}
        </div>

        <div className="flex min-w-0 flex-1 flex-col gap-4 pb-1 sm:justify-end sm:pb-2">
          <div>
            <p className="mb-1.5 text-xs font-semibold uppercase tracking-[0.16em] text-amber-300">
              {eyebrow}
            </p>
            <h1 className="text-3xl font-extrabold tracking-tight text-white sm:text-5xl">
              {title}{" "}
              <span className="font-medium text-zinc-500">({year})</span>
            </h1>
          </div>

          <div className="flex flex-wrap items-center gap-x-4 gap-y-2 text-sm text-zinc-300">
            {rating > 0 && (
              <span className="flex items-center gap-1.5 rounded-full bg-amber-400/10 px-3 py-1 font-semibold text-amber-300">
                <StarIcon className="h-4 w-4" />
                {rating.toFixed(1)}
                <span className="font-normal text-amber-300/60">/ 10</span>
              </span>
            )}
            <span className="flex items-center gap-1.5 text-zinc-400">
              <CalendarIcon className="h-4 w-4" />
              {year}
            </span>
            {meta.map((m) => (
              <span key={m} className="flex items-center gap-1.5 text-zinc-400">
                <ClockIcon className="h-4 w-4" />
                {m}
              </span>
            ))}
          </div>

          {genres.length > 0 && (
            <div className="flex flex-wrap gap-2">
              {genres.map((g) => (
                <span
                  key={g}
                  className="rounded-full border border-white/10 bg-white/[0.04] px-3 py-1 text-xs font-medium text-zinc-300"
                >
                  {g}
                </span>
              ))}
            </div>
          )}

          <p className="max-w-3xl text-sm leading-relaxed text-zinc-300 sm:text-[15px]">
            {overview || "No overview available."}
          </p>

          <div className="flex flex-wrap items-center gap-3">{actions}</div>
        </div>
      </div>
    </div>
  );
}
