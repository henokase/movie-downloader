import Link from "next/link";
import { FilmIcon, SearchIcon } from "@/components/icons";

// Branded 404 for unknown movie/TV ids and stray routes.
export default function NotFound() {
  return (
    <div className="flex flex-col items-center gap-4 py-20 text-center">
      <span className="flex h-14 w-14 items-center justify-center rounded-3xl bg-white/[0.06] text-amber-300">
        <FilmIcon className="h-7 w-7" />
      </span>
      <p className="text-6xl font-extrabold tracking-tight text-zinc-800">404</p>
      <h1 className="text-xl font-bold text-zinc-100">This title fell off the shelf</h1>
      <p className="max-w-sm text-sm leading-relaxed text-zinc-400">
        The page you asked for doesn&apos;t exist or the TMDB id is invalid.
      </p>
      <Link
        href="/"
        className="mt-2 inline-flex items-center gap-2 rounded-xl bg-amber-400 px-5 py-2.5 text-sm font-bold text-zinc-950 transition-colors hover:bg-amber-300"
      >
        <SearchIcon className="h-4 w-4" />
        Back to browse
      </Link>
    </div>
  );
}
