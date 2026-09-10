import Image from "next/image";
import { notFound } from "next/navigation";
import DownloadButton from "@/components/DownloadButton";
import { getMovie, poster } from "@/lib/tmdb";

export default async function MoviePage(props: PageProps<"/movie/[id]">) {
  const { id } = await props.params;

  let m;
  try {
    m = await getMovie(id);
  } catch {
    notFound();
  }

  const year = m.release_date?.slice(0, 4) ?? "—";
  const backdrop = poster(m.backdrop_path, "original");

  return (
    <div className="flex flex-col gap-6">
      {backdrop && (
        <div className="relative h-48 w-full overflow-hidden rounded-xl sm:h-64">
          <Image src={backdrop} alt="" fill className="object-cover" priority />
          <div className="absolute inset-0 bg-gradient-to-t from-zinc-950 to-transparent" />
        </div>
      )}

      <div className="flex flex-col gap-4 sm:flex-row">
        <div className="relative aspect-[2/3] w-40 shrink-0 overflow-hidden rounded-lg bg-zinc-800 sm:w-52">
          {poster(m.poster_path, "w500") && (
            <Image
              src={poster(m.poster_path, "w500") as string}
              alt={m.title}
              fill
              className="object-cover"
            />
          )}
        </div>

        <div className="flex flex-1 flex-col gap-3">
          <h1 className="text-2xl font-bold sm:text-3xl">
            {m.title} <span className="font-normal text-zinc-400">({year})</span>
          </h1>
          <p className="text-sm text-zinc-400">
            ★ {m.vote_average.toFixed(1)}
            {m.runtime ? ` · ${m.runtime} min` : ""}
            {m.genres.length > 0 &&
              ` · ${m.genres.map((g) => g.name).join(", ")}`}
          </p>
          <p className="max-w-2xl text-sm leading-6 text-zinc-300">
            {m.overview || "No overview available."}
          </p>
          <div>
            <DownloadButton
              type="movie"
              tmdbId={m.id}
              title={m.title}
              year={year}
              big
            />
          </div>
        </div>
      </div>

      {m.credits && m.credits.cast.length > 0 && (
        <section>
          <h2 className="mb-2 text-lg font-semibold">Cast</h2>
          <ul className="flex flex-col gap-1 text-sm text-zinc-300">
            {m.credits.cast.slice(0, 10).map((c) => (
              <li key={c.id}>
                {c.name} <span className="text-zinc-500">as {c.character}</span>
              </li>
            ))}
          </ul>
        </section>
      )}
    </div>
  );
}
