import { Skeleton } from "@/components/skeletons";

// Shown while the trailer key resolves.
export default function TrailerLoading() {
  return (
    <div className="mx-auto flex w-full max-w-5xl flex-col gap-5 pt-6">
      <div className="flex items-center gap-3">
        <Skeleton className="h-10 w-10 !rounded-xl" />
        <div className="flex flex-1 flex-col gap-2">
          <Skeleton className="h-6 w-1/3 !rounded-lg" />
          <Skeleton className="h-3 w-24" />
        </div>
      </div>
      <Skeleton className="aspect-video w-full !rounded-2xl" />
      <div className="flex gap-2.5">
        <Skeleton className="h-11 w-44 !rounded-xl" />
        <Skeleton className="h-11 w-44 !rounded-xl" />
      </div>
    </div>
  );
}
