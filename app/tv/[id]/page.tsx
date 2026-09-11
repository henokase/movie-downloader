import { notFound } from "next/navigation";
import SeasonEpisodes from "@/components/SeasonEpisodes";
import DetailHero from "@/components/DetailHero";
import CastList from "@/components/CastList";
import RelatedRow from "@/components/RelatedRow";
import { getSeason, getTv } from "@/lib/tmdb";
import { bestTrailerKey, poster } from "@/lib/tmdb-types";

export default async function TvPage(props: PageProps<"/tv/[id]">) {
  const { id } = await props.params;

  let show;
  try {
    show = await getTv(id);
  } catch {
    notFound();
  }

  const year = show.first_air_date?.slice(0, 4) ?? "—";
  const trailerKey = bestTrailerKey(show.videos);
  const firstSeason =
    show.seasons.find((s) => s.season_number > 0)?.season_number ?? 1;

  let initialEpisodes: Awaited<ReturnType<typeof getSeason>>["episodes"] = [];
  try {
    initialEpisodes = (await getSeason(id, String(firstSeason))).episodes;
  } catch {
    initialEpisodes = [];
  }

  const seasonLabel = `${show.number_of_seasons} season${show.number_of_seasons === 1 ? "" : "s"}`;

  return (
    <div className="flex flex-col gap-10 pb-4 pt-2">
      <DetailHero
        eyebrow="TV Series"
        backdrop={poster(show.backdrop_path, "w1280")}
        posterSrc={poster(show.poster_path, "w500")}
        title={show.name}
        year={year}
        rating={show.vote_average}
        meta={[seasonLabel]}
        genres={show.genres.map((g) => g.name)}
        overview={show.overview}
        trailerHref={trailerKey ? `/trailer/tv/${show.id}` : null}
        actions={null}
      />
      {show.credits && <CastList cast={show.credits.cast} />}
      <SeasonEpisodes
        tvId={show.id}
        title={show.name}
        year={year}
        seasons={show.seasons}
        initialSeason={firstSeason}
        initialEpisodes={initialEpisodes}
      />
      <RelatedRow kind="tv" id={id} />
    </div>
  );
}
