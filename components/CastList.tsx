import Image from "next/image";
import Link from "next/link";
import { poster } from "@/lib/tmdb-types";

// Cast rail with real headshots. Each tile links to the person's
// filmography page. Falls back to initials when TMDB has no photo.
export default function CastList({
  cast,
}: {
  cast: {
    id: number;
    name: string;
    character: string;
    profile_path: string | null;
  }[];
}) {
  if (cast.length === 0) return null;
  return (
    <section>
      <h2 className="mb-4 text-lg font-bold tracking-tight text-zinc-100">
        Top cast
      </h2>
      <div className="no-scrollbar -mx-1 flex gap-3 overflow-x-auto px-1 pb-1">
        {cast.slice(0, 12).map((c) => {
          const initials = c.name
            .split(" ")
            .map((w) => w[0])
            .slice(0, 2)
            .join("")
            .toUpperCase();
          const src = poster(c.profile_path, "w185");
          return (
            <Link
              key={c.id}
              href={`/person/${c.id}`}
              className="group flex w-36 shrink-0 flex-col items-center gap-2.5 rounded-2xl bg-zinc-900/60 ring-1 ring-white/[0.08] transition-all duration-300 hover:-translate-y-0.5 hover:ring-white/15 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-amber-400"
            >
              <span className="relative flex h-16 w-16 shrink-0 items-center justify-center overflow-hidden rounded-full bg-gradient-to-br from-amber-400/25 to-zinc-700/40 text-base font-bold text-amber-200">
                {src ? (
                  <Image
                    src={src}
                    alt={c.name}
                    fill
                    sizes="64px"
                    className="object-cover transition-transform duration-500 group-hover:scale-110"
                  />
                ) : (
                  initials
                )}
              </span>
              {/* w-full: column flex items size to content — without it,
                  truncate on the lines below can't constrain long names. */}
              <span className="flex w-full min-w-0 flex-col gap-0.5">
                <span className="truncate text-[13px] font-semibold text-zinc-100 group-hover:text-amber-200">
                  {c.name}
                </span>
                <span className="truncate text-xs text-zinc-500">
                  {c.character}
                </span>
              </span>
            </Link>
          );
        })}
      </div>
    </section>
  );
}
