import { DetailHeroSkeleton, EpisodeListSkeleton, Skeleton } from "@/components/skeletons";

// Shown while a show's details load.
export default function TvLoading() {
  return (
    <div className="flex flex-col gap-10 pb-4 pt-2">
      <DetailHeroSkeleton />
      <div className="flex flex-col gap-4">
        <Skeleton className="h-6 w-40 !rounded-lg" />
        <EpisodeListSkeleton count={4} />
      </div>
    </div>
  );
}
