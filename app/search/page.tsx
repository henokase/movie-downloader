import SearchBar from "@/components/SearchBar";
import ResultsTabs from "@/components/ResultsTabs";
import EmptyState from "@/components/EmptyState";
import { AlertIcon, SearchIcon } from "@/components/icons";
import { searchMovies, searchTv } from "@/lib/tmdb";
import type { MovieResult, TvResult } from "@/lib/tmdb-types";

export default async function SearchPage(props: PageProps<"/search">) {
  const params = await props.searchParams;
  const q = (params.q ?? "").toString().trim();

  if (q.length < 2) {
    return (
      <div className="flex flex-col gap-6 pt-4">
        <SearchBar autoFocus />
        <EmptyState
          icon={<SearchIcon className="h-6 w-6" />}
          title="Start typing to search"
          hint="Enter at least 2 characters — results cover both movies and TV shows."
        />
      </div>
    );
  }

  let movies: MovieResult[] = [];
  let tv: TvResult[] = [];
  let failed = false;
  try {
    const [m, t] = await Promise.all([searchMovies(q), searchTv(q)]);
    movies = m.results;
    tv = t.results;
  } catch {
    failed = true;
  }

  return (
    <div className="flex flex-col gap-6 pt-4">
      <SearchBar initial={q} />
      {failed ? (
        <EmptyState
          tone="error"
          icon={<AlertIcon className="h-6 w-6" />}
          title="Search failed"
          hint="Check TMDB_READ_TOKEN in .env.local and your connection, then try again."
        />
      ) : (
        <>
          <div className="flex flex-wrap items-baseline gap-x-3 gap-y-1">
            <h1 className="text-2xl font-bold tracking-tight text-zinc-50">
              Results for &ldquo;{q}&rdquo;
            </h1>
            <p className="text-sm text-zinc-500">
              {movies.length + tv.length}{" "}
              {(movies.length + tv.length) === 1 ? "title" : "titles"} found
            </p>
          </div>
          <ResultsTabs movies={movies} tv={tv} />
        </>
      )}
    </div>
  );
}
