import { PosterGridSkeleton, Skeleton } from "@/components/skeletons";

// Shown while a person's profile and credits load.
export default function PersonLoading() {
  return (
    <div className="flex flex-col gap-10 pb-4 pt-6">
      <div className="flex flex-col gap-6 sm:flex-row sm:gap-8">
        <Skeleton className="aspect-[2/3] w-40 shrink-0 !rounded-2xl sm:w-56" />
        <div className="flex flex-1 flex-col justify-center gap-3">
          <Skeleton className="h-4 w-28" />
          <Skeleton className="h-10 w-3/4 !rounded-xl" />
          <Skeleton className="h-4 w-1/2" />
          <Skeleton className="h-4 w-1/3" />
          <Skeleton className="h-20 w-full max-w-3xl !rounded-xl" />
        </div>
      </div>
      <div className="flex flex-col gap-4">
        <Skeleton className="h-6 w-40 !rounded-lg" />
        <Skeleton className="h-12 w-72 !rounded-2xl" />
        <PosterGridSkeleton count={12} />
      </div>
    </div>
  );
}
