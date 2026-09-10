import Image from "next/image";
import Link from "next/link";
import { poster } from "@/lib/tmdb-types";

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
      className="group overflow-hidden rounded-lg border border-zinc-800 bg-zinc-900 hover:border-zinc-500"
    >
      <div className="relative aspect-[2/3] w-full bg-zinc-800">
        {src ? (
          <Image
            src={src}
            alt={title}
            fill
            sizes="(max-width: 640px) 33vw, 20vw"
            className="object-cover"
          />
        ) : (
          <div className="flex h-full items-center justify-center p-2 text-center text-xs text-zinc-500">
            No poster
          </div>
        )}
      </div>
      <div className="p-2">
        <p className="truncate text-sm font-medium group-hover:underline">
          {title}
        </p>
        <p className="text-xs text-zinc-400">
          {year} · ★ {rating.toFixed(1)}
        </p>
      </div>
    </Link>
  );
}
