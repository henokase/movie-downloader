import { DetailHeroSkeleton } from "@/components/skeletons";

// Shown while a movie's details load.
export default function MovieLoading() {
  return (
    <div className="pb-4 pt-2">
      <DetailHeroSkeleton />
    </div>
  );
}
