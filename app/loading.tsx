import { RailSkeleton, Skeleton } from "@/components/skeletons";

// Shown while trending data loads on first visit.
export default function HomeLoading() {
  return (
    <div className="flex flex-col gap-12">
      <section className="flex flex-col items-start gap-5 pb-6 pt-16 sm:items-center sm:pt-24">
        <Skeleton className="h-7 w-56 !rounded-full" />
        <Skeleton className="h-12 w-3/4 !rounded-xl sm:h-16 sm:w-1/2" />
        <Skeleton className="h-5 w-2/3 sm:w-1/3" />
        <Skeleton className="h-[68px] w-full max-w-xl !rounded-2xl" />
      </section>
      <section className="flex flex-col gap-4">
        <Skeleton className="h-7 w-48 !rounded-lg" />
        <RailSkeleton />
      </section>
      <section className="flex flex-col gap-4">
        <Skeleton className="h-7 w-48 !rounded-lg" />
        <RailSkeleton />
      </section>
    </div>
  );
}
