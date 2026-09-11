import Image from "next/image";
import { notFound } from "next/navigation";
import ResultsTabs from "@/components/ResultsTabs";
import { CalendarIcon, StarIcon } from "@/components/icons";
import { getPerson, getPersonCredits } from "@/lib/tmdb";
import { poster, type MovieResult, type TvResult } from "@/lib/tmdb-types";

export default async function PersonPage(props: PageProps<"/person/[id]">) {
  const { id } = await props.params;

  let person;
  let credits;
  try {
    [person, credits] = await Promise.all([getPerson(id), getPersonCredits(id)]);
  } catch {
    notFound();
  }

  // Acting credits only, deduped, newest first.
  const seen = new Set<string>();
  const acting = (credits.cast ?? []).filter((c) => {
    if (c.media_type !== "movie" && c.media_type !== "tv") return false;
    const key = `${c.media_type}:${c.id}`;
    if (seen.has(key)) return false;
    seen.add(key);
    return true;
  });
  const byDateDesc = (a: string, b: string) => {
    if (!a && !b) return 0;
    if (!a) return 1;
    if (!b) return -1;
    return b.localeCompare(a);
  };

  const movies: MovieResult[] = acting
    .filter((c) => c.media_type === "movie")
    .sort((a, b) => byDateDesc(a.release_date ?? "", b.release_date ?? ""))
    .map((c) => ({
      id: c.id,
      title: c.title ?? c.name ?? "Untitled",
      release_date: c.release_date,
      poster_path: c.poster_path,
      backdrop_path: c.backdrop_path,
      vote_average: c.vote_average,
      overview: c.overview,
    }));

  const tv: TvResult[] = acting
    .filter((c) => c.media_type === "tv")
    .sort((a, b) =>
      byDateDesc(a.first_air_date ?? "", b.first_air_date ?? ""),
    )
    .map((c) => ({
      id: c.id,
      name: c.name ?? c.title ?? "Untitled",
      first_air_date: c.first_air_date,
      poster_path: c.poster_path,
      backdrop_path: c.backdrop_path,
      vote_average: c.vote_average,
      overview: c.overview,
    }));

  const photo = poster(person.profile_path, "h632");
  const facts = [
    person.birthday,
    person.place_of_birth,
    person.deathday ? `† ${person.deathday}` : null,
  ].filter((f): f is string => !!f);

  return (
    <div className="flex flex-col gap-10 pb-4 pt-6">
      <div className="flex flex-col gap-6 sm:flex-row sm:gap-8">
        {/* self-start: without it, flex stretch would force the photo to
            the full row height on long bios, cropping it into a thin strip. */}
        <div className="relative aspect-[2/3] w-40 shrink-0 self-start overflow-hidden rounded-2xl border border-white/10 bg-zinc-800 shadow-[0_24px_60px_-16px_rgba(0,0,0,0.9)] sm:w-56">
          {photo ? (
            <Image
              src={photo}
              alt={person.name}
              fill
              priority
              className="object-cover"
              sizes="(max-width: 640px) 160px, 224px"
            />
          ) : (
            <div className="flex h-full items-center justify-center p-3 text-center text-xs text-zinc-500">
              No photo
            </div>
          )}
        </div>

        <div className="flex min-w-0 flex-1 flex-col justify-center gap-4">
          <div>
            <p className="mb-1.5 flex items-center gap-1.5 text-xs font-semibold uppercase tracking-[0.16em] text-amber-300">
              <StarIcon className="h-3.5 w-3.5" />
              {person.known_for_department}
            </p>
            <h1 className="text-3xl font-extrabold tracking-tight text-white sm:text-5xl">
              {person.name}
            </h1>
          </div>

          {facts.length > 0 && (
            <p className="flex flex-wrap items-center gap-x-4 gap-y-1.5 text-sm text-zinc-400">
              <span className="flex items-center gap-1.5">
                <CalendarIcon className="h-4 w-4" />
                {facts.join(" · ")}
              </span>
            </p>
          )}

          <p className="text-sm font-medium text-zinc-300">
            {movies.length} {movies.length === 1 ? "movie" : "movies"} ·{" "}
            {tv.length} {tv.length === 1 ? "show" : "shows"}
          </p>

          {person.biography && (
            <p className="max-w-3xl whitespace-pre-line text-sm leading-relaxed text-zinc-300">
              {person.biography}
            </p>
          )}
        </div>
      </div>

      <section className="flex flex-col gap-4">
        <h2 className="text-lg font-bold tracking-tight text-zinc-100">
          Filmography
        </h2>
        <ResultsTabs movies={movies} tv={tv} />
      </section>
    </div>
  );
}
