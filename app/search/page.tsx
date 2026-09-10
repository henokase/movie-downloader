import SearchBar from "@/components/SearchBar";
import ResultsTabs from "@/components/ResultsTabs";
import { searchMovies, searchTv } from "@/lib/tmdb";

export default async function SearchPage(props: PageProps<"/search">) {
  const params = await props.searchParams;
  const q = (params.q ?? "").toString().trim();

  if (q.length < 2) {
    return (
      <div className="flex flex-col gap-4">
        <SearchBar autoFocus />
        <p className="text-sm text-zinc-400">Type at least 2 characters.</p>
      </div>
    );
  }

  try {
    const [movies, tv] = await Promise.all([searchMovies(q), searchTv(q)]);
    return (
      <div className="flex flex-col gap-4">
        <SearchBar initial={q} />
        <h1 className="text-xl font-semibold">
          Results for “{q}”
        </h1>
        <ResultsTabs movies={movies.results} tv={tv.results} />
      </div>
    );
  } catch {
    return (
      <div className="flex flex-col gap-4">
        <SearchBar initial={q} />
        <p className="rounded-lg border border-red-800 bg-red-950 p-4 text-sm text-red-200">
          Search failed. Check TMDB_READ_TOKEN in .env.local and your
          connection.
        </p>
      </div>
    );
  }
}
