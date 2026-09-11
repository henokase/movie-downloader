"use client";

import { useRouter } from "next/navigation";
import { useState, type FormEvent } from "react";
import { CloseIcon, SearchIcon } from "@/components/icons";

export default function SearchBar({
  initial = "",
  autoFocus = false,
  big = false,
}: {
  initial?: string;
  autoFocus?: boolean;
  big?: boolean;
}) {
  const [value, setValue] = useState(initial);
  const router = useRouter();

  const submit = (e: FormEvent) => {
    e.preventDefault();
    const q = value.trim();
    if (q.length >= 2) router.push(`/search?q=${encodeURIComponent(q)}`);
  };

  return (
    <form onSubmit={submit} role="search" className="w-full">
      <div
        className={`group flex items-center gap-2 rounded-2xl border border-zinc-700/80 bg-zinc-900/80 backdrop-blur transition-colors focus-within:border-amber-400/70 focus-within:bg-zinc-900 hover:border-zinc-600 ${
          big ? "p-2 pl-5 shadow-[0_8px_40px_-12px_rgba(0,0,0,0.7)]" : "p-1.5 pl-4"
        }`}
      >
        <SearchIcon
          className={`shrink-0 text-zinc-500 transition-colors group-focus-within:text-amber-300 ${big ? "h-6 w-6" : "h-5 w-5"}`}
        />
        <input
          value={value}
          onChange={(e) => setValue(e.target.value)}
          autoFocus={autoFocus}
          placeholder="Search movies or TV shows…"
          minLength={2}
          aria-label="Search movies or TV shows"
          className={`min-w-0 flex-1 bg-transparent text-zinc-100 placeholder:text-zinc-500 focus:outline-none ${
            big ? "py-2.5 text-lg" : "py-1.5 text-sm"
          }`}
        />
        {value && (
          <button
            type="button"
            onClick={() => setValue("")}
            aria-label="Clear search"
            className="shrink-0 rounded-full p-1.5 text-zinc-500 hover:bg-zinc-800 hover:text-zinc-200"
          >
            <CloseIcon className="h-4 w-4" />
          </button>
        )}
        <button
          type="submit"
          className={`shrink-0 rounded-xl bg-amber-400 font-semibold text-zinc-950 transition-colors hover:bg-amber-300 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-amber-200 ${
            big ? "px-7 py-3 text-base" : "px-5 py-2 text-sm"
          }`}
        >
          Search
        </button>
      </div>
    </form>
  );
}
