import { PosterGridSkeleton, Skeleton } from "@/components/skeletons";

// Shown while a search query resolves.
export default function SearchLoading() {
  return (
    <div className="flex flex-col gap-6 pt-4">
      <Skeleton className="h-[52px] w-full !rounded-2xl" />
      <Skeleton className="h-8 w-64 !rounded-lg" />
      <Skeleton className="h-12 w-72 !rounded-2xl" />
      <PosterGridSkeleton count={12} />
    </div>
  );
}
