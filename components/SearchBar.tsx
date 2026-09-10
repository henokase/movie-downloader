"use client";

import { useRouter } from "next/navigation";
import { useState, type FormEvent } from "react";

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
    <form onSubmit={submit} className="flex w-full gap-2">
      <input
        value={value}
        onChange={(e) => setValue(e.target.value)}
        autoFocus={autoFocus}
        placeholder="Search a movie or TV show…"
        minLength={2}
        className={`flex-1 rounded-lg border border-zinc-700 bg-zinc-900 px-4 text-white placeholder:text-zinc-500 focus:border-zinc-400 focus:outline-none ${
          big ? "py-3 text-lg" : "py-2 text-sm"
        }`}
      />
      <button
        type="submit"
        className="rounded-lg bg-white px-5 font-medium text-black hover:bg-zinc-200"
      >
        Search
      </button>
    </form>
  );
}
