import Link from "next/link";
import { notFound } from "next/navigation";
import TrailerPlayer from "@/components/TrailerPlayer";
import { PlayIcon } from "@/components/icons";
import { getMovie, getTv } from "@/lib/tmdb";
import { bestTrailerKey } from "@/lib/tmdb-types";

// Standalone trailer page — detail pages link here with target _blank,
// so the trailer opens in a new tab with an instant fullscreen option.
export default async function TrailerPage(
  props: PageProps<"/trailer/[kind]/[id]">,
) {
  const { kind, id } = await props.params;
  if (kind !== "movie" && kind !== "tv") notFound();

  let title = "";
  let key: string | null = null;
  try {
    if (kind === "movie") {
      const m = await getMovie(id);
      title = m.title;
      key = bestTrailerKey(m.videos);
    } else {
      const s = await getTv(id);
      title = s.name;
      key = bestTrailerKey(s.videos);
    }
  } catch {
    notFound();
  }
  if (!key) notFound();

  return (
    <div className="mx-auto flex w-full max-w-5xl flex-col gap-5 pt-6">
      <div className="flex items-center gap-3">
        <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-amber-400/15 text-amber-300">
          <PlayIcon className="h-5 w-5" />
        </span>
        <div>
          <h1 className="text-xl font-extrabold tracking-tight text-zinc-50 sm:text-2xl">
            {title}
          </h1>
          <p className="text-xs text-zinc-500">Official trailer</p>
        </div>
        <Link
          href={kind === "movie" ? `/movie/${id}` : `/tv/${id}`}
          className="ml-auto shrink-0 rounded-xl border border-white/15 px-4 py-2 text-sm font-semibold text-zinc-200 transition-colors hover:bg-white/5"
        >
          Back to details
        </Link>
      </div>

      <TrailerPlayer youtubeKey={key} title={title} />
    </div>
  );
}
