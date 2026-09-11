import Image from "next/image";
import Link from "next/link";
import { poster } from "@/lib/tmdb-types";
import { StarIcon } from "@/components/icons";

export default function MediaCard({
  id,
  kind,
  title,
  date,
  posterPath,
  rating,
}: {
  id: number;
  kind: "movie" | "tv";
  title: string;
  date?: string;
  posterPath: string | null;
  rating: number;
}) {
  const year = date?.slice(0, 4) ?? "—";
  const src = poster(posterPath, "w342");
  return (
    <Link
      href={`/${kind}/${id}`}
      className="group overflow-hidden rounded-xl border border-zinc-800/80 bg-zinc-900/60 transition-all duration-300 hover:-translate-y-1 hover:border-zinc-600 hover:shadow-[0_12px_40px_-12px_rgba(0,0,0,0.8)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-amber-400"
    >
      <div className="relative aspect-[2/3] w-full overflow-hidden bg-zinc-800/60">
        {src ? (
          <Image
            src={src}
            alt={title}
            fill
            sizes="(max-width: 640px) 33vw, (max-width: 1024px) 25vw, 20vw"
            className="object-cover transition-transform duration-500 group-hover:scale-[1.06]"
          />
        ) : (
          <div className="flex h-full items-center justify-center p-3 text-center text-xs text-zinc-500">
            No poster
          </div>
        )}
        <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent opacity-0 transition-opacity duration-300 group-hover:opacity-100" />
        {rating > 0 && (
          <span className="absolute left-2 top-2 flex items-center gap-1 rounded-full bg-black/70 px-2 py-1 text-[11px] font-semibold text-amber-300 backdrop-blur-sm">
            <StarIcon className="h-3 w-3" />
            {rating.toFixed(1)}
          </span>
        )}
      </div>
      <div className="flex flex-col gap-0.5 p-3">
        <p className="truncate text-sm font-semibold text-zinc-100 group-hover:text-amber-200">
          {title}
        </p>
        <p className="text-xs text-zinc-500">{year}</p>
      </div>
    </Link>
  );
}
