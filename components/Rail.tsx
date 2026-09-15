"use client";

import { useRef, type ReactNode } from "react";
import { ChevronLeftIcon, ChevronRightIcon } from "@/components/icons";

// Horizontal snap carousel with edge-fade and scroll buttons.
export default function Rail({
  title,
  action,
  children,
}: {
  title: string;
  action?: ReactNode;
  children: ReactNode;
}) {
  const ref = useRef<HTMLDivElement>(null);

  const scroll = (dir: 1 | -1) => {
    const el = ref.current;
    if (!el) return;
    el.scrollBy({ left: dir * el.clientWidth * 0.8, behavior: "smooth" });
  };

  return (
    <section>
      <div className="mb-4 flex items-end justify-between gap-4">
        <h2 className="text-xl font-bold tracking-tight text-zinc-100 sm:text-2xl">
          {title}
        </h2>
        <div className="flex items-center gap-2">
          {action}
          <button
            onClick={() => scroll(-1)}
            aria-label="Scroll left"
            className="rounded-full border border-zinc-800 bg-zinc-900/70 p-2 text-zinc-400 transition-colors hover:border-zinc-600 hover:text-white"
          >
            <ChevronLeftIcon className="h-4 w-4" />
          </button>
          <button
            onClick={() => scroll(1)}
            aria-label="Scroll right"
            className="rounded-full border border-zinc-800 bg-zinc-900/70 p-2 text-zinc-400 transition-colors hover:border-zinc-600 hover:text-white"
          >
            <ChevronRightIcon className="h-4 w-4" />
          </button>
        </div>
      </div>
      <div
        ref={ref}
        className="no-scrollbar flex gap-3 overflow-x-auto sm:gap-4"
      >
        {children}
      </div>
    </section>
  );
}
