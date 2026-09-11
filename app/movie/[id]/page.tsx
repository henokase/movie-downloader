import { notFound } from "next/navigation";
import DownloadButton from "@/components/DownloadButton";
import DetailHero from "@/components/DetailHero";
import CastList from "@/components/CastList";
import RelatedRow from "@/components/RelatedRow";
import { getMovie } from "@/lib/tmdb";
import { poster } from "@/lib/tmdb-types";

export default async function MoviePage(props: PageProps<"/movie/[id]">) {
  const { id } = await props.params;

  let m;
  try {
    m = await getMovie(id);
  } catch {
    notFound();
  }

  const year = m.release_date?.slice(0, 4) ?? "—";

  return (
    <div className="flex flex-col gap-10 pb-4 pt-2">
      <DetailHero
        eyebrow="Movie"
        backdrop={poster(m.backdrop_path, "w1280")}
        posterSrc={poster(m.poster_path, "w500")}
        title={m.title}
        year={year}
        rating={m.vote_average}
        meta={m.runtime ? [`${m.runtime} min`] : []}
        genres={m.genres.map((g) => g.name)}
        overview={m.overview}
        actions={
          <DownloadButton
            type="movie"
            tmdbId={m.id}
            title={m.title}
            year={year}
            big
          />
        }
      />
      {m.credits && <CastList cast={m.credits.cast} />}
      <RelatedRow kind="movie" id={id} />
    </div>
  );
}
