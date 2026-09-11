// Skeleton placeholders used across pages and the download modal.
// Shapes mirror the real layouts so loading never jumps the page around.

export function Skeleton({ className = "" }: { className?: string }) {
  return <div className={`skeleton rounded-md ${className}`} aria-hidden="true" />;
}

export function PosterCardSkeleton() {
  return (
    <div className="overflow-hidden rounded-xl border border-zinc-800/80 bg-zinc-900/60">
      <Skeleton className="aspect-[2/3] w-full !rounded-none" />
      <div className="flex flex-col gap-2 p-3">
        <Skeleton className="h-3.5 w-4/5" />
        <Skeleton className="h-3 w-2/5" />
      </div>
    </div>
  );
}

export function PosterGridSkeleton({ count = 10 }: { count?: number }) {
  return (
    <div
      className="grid grid-cols-3 gap-3 sm:grid-cols-4 sm:gap-4 lg:grid-cols-5"
      aria-label="Loading"
      role="status"
    >
      {Array.from({ length: count }).map((_, i) => (
        <PosterCardSkeleton key={i} />
      ))}
    </div>
  );
}

export function RailSkeleton({ count = 6 }: { count?: number }) {
  return (
    <div className="flex gap-3 overflow-hidden" aria-label="Loading" role="status">
      {Array.from({ length: count }).map((_, i) => (
        <div key={i} className="w-32 shrink-0 sm:w-40">
          <PosterCardSkeleton />
        </div>
      ))}
    </div>
  );
}

export function DetailHeroSkeleton() {
  return (
    <div aria-label="Loading" role="status">
      <Skeleton className="h-52 w-full !rounded-2xl sm:h-80" />
      <div className="-mt-20 flex flex-col gap-5 px-1 sm:-mt-24 sm:flex-row sm:items-end sm:gap-8 sm:px-4">
        <Skeleton className="aspect-[2/3] w-36 shrink-0 !rounded-xl sm:w-52" />
        <div className="flex flex-1 flex-col gap-3 pb-1">
          <Skeleton className="h-8 w-3/4 !rounded-lg" />
          <Skeleton className="h-4 w-1/2" />
          <Skeleton className="h-4 w-2/3" />
          <Skeleton className="h-4 w-1/3" />
          <Skeleton className="h-11 w-44 !rounded-xl" />
        </div>
      </div>
    </div>
  );
}

export function EpisodeRowSkeleton() {
  return (
    <div className="flex items-center gap-4 rounded-2xl border border-zinc-800/80 bg-zinc-900/60 p-3">
      <Skeleton className="h-16 w-28 shrink-0 !rounded-lg sm:h-[72px] sm:w-32" />
      <div className="flex min-w-0 flex-1 flex-col gap-2">
        <Skeleton className="h-4 w-1/2" />
        <Skeleton className="h-3 w-3/4" />
      </div>
      <Skeleton className="h-9 w-24 shrink-0 !rounded-xl" />
    </div>
  );
}

export function EpisodeListSkeleton({ count = 5 }: { count?: number }) {
  return (
    <div className="flex flex-col gap-3" aria-label="Loading episodes" role="status">
      {Array.from({ length: count }).map((_, i) => (
        <EpisodeRowSkeleton key={i} />
      ))}
    </div>
  );
}

export function ModalLinksSkeleton() {
  return (
    <div className="flex flex-col gap-5" aria-label="Loading links" role="status">
      <div className="flex flex-col gap-2">
        <Skeleton className="h-4 w-24" />
        {[0, 1, 2].map((i) => (
          <div
            key={i}
            className="flex items-center justify-between gap-2 rounded-xl bg-zinc-800/50 px-4 py-3"
          >
            <Skeleton className="h-4 w-32" />
            <Skeleton className="h-8 w-24 !rounded-lg" />
          </div>
        ))}
      </div>
      <div className="flex flex-col gap-2">
        <Skeleton className="h-4 w-24" />
        {[0, 1].map((i) => (
          <div
            key={i}
            className="flex items-center justify-between gap-2 rounded-xl bg-zinc-800/50 px-4 py-3"
          >
            <Skeleton className="h-4 w-32" />
            <Skeleton className="h-8 w-24 !rounded-lg" />
          </div>
        ))}
      </div>
    </div>
  );
}
