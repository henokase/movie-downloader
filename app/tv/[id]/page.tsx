import Image from "next/image";
import { notFound } from "next/navigation";
import SeasonEpisodes from "@/components/SeasonEpisodes";
import { getSeason, getTv } from "@/lib/tmdb";
import { poster } from "@/lib/tmdb-types";

export default async function TvPage(props: PageProps<"/tv/[id]">) {
  const { id } = await props.params;

  let show;
  try {
    show = await getTv(id);
  } catch {
    notFound();
  }

  const year = show.first_air_date?.slice(0, 4) ?? "—";
  const backdrop = poster(show.backdrop_path, "original");
  const firstSeason =
    show.seasons.find((s) => s.season_number > 0)?.season_number ?? 1;

  let initialEpisodes: Awaited<ReturnType<typeof getSeason>>["episodes"] = [];
  try {
    initialEpisodes = (await getSeason(id, String(firstSeason))).episodes;
  } catch {
    initialEpisodes = [];
  }

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
          {poster(show.poster_path, "w500") && (
            <Image
              src={poster(show.poster_path, "w500") as string}
              alt={show.name}
              fill
              className="object-cover"
            />
          )}
        </div>

        <div className="flex flex-1 flex-col gap-3">
          <h1 className="text-2xl font-bold sm:text-3xl">
            {show.name}{" "}
            <span className="font-normal text-zinc-400">({year})</span>
          </h1>
          <p className="text-sm text-zinc-400">
            ★ {show.vote_average.toFixed(1)} · {show.number_of_seasons}{" "}
            season{show.number_of_seasons === 1 ? "" : "s"}
            {show.genres.length > 0 &&
              ` · ${show.genres.map((g) => g.name).join(", ")}`}
          </p>
          <p className="max-w-2xl text-sm leading-6 text-zinc-300">
            {show.overview || "No overview available."}
          </p>
        </div>
      </div>

      {show.credits && show.credits.cast.length > 0 && (
        <section>
          <h2 className="mb-2 text-lg font-semibold">Cast</h2>
          <ul className="flex flex-col gap-1 text-sm text-zinc-300">
            {show.credits.cast.slice(0, 10).map((c) => (
              <li key={c.id}>
                {c.name} <span className="text-zinc-500">as {c.character}</span>
              </li>
            ))}
          </ul>
        </section>
      )}

      <SeasonEpisodes
        tvId={show.id}
        title={show.name}
        year={year}
        seasons={show.seasons}
        initialSeason={firstSeason}
        initialEpisodes={initialEpisodes}
      />
    </div>
  );
}
