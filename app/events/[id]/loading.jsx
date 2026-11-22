export default function EventDetailLoading() {
  return (
    <article className="pb-16 pt-20 sm:pt-28" aria-busy="true" aria-label="Loading event details">
      <div className="container-x">
        {/* Back Link Skeleton */}
        <div className="h-4 w-28 rounded bg-fg/10 animate-pulse" />

        <div className="mt-8 grid gap-12 lg:grid-cols-[minmax(0,0.9fr)_minmax(0,1.1fr)] lg:gap-20 xl:grid-cols-[minmax(0,0.75fr)_minmax(0,1.25fr)]">
          {/* Poster Skeleton */}
          <div className="lg:sticky lg:top-24 lg:self-start">
            <div className="relative aspect-[1/1.414] w-full max-w-md mx-auto rounded-lg border border-fg/15 bg-card/60 shadow-xl overflow-hidden animate-pulse">
              <div className="h-full w-full bg-fg/[0.06] flex items-center justify-center">
                <div className="h-10 w-10 rounded-full border-2 border-sunset-orange/40 border-t-sunset-orange animate-spin" />
              </div>
            </div>
          </div>

          {/* Details Skeleton */}
          <div className="lg:pt-4 space-y-6">
            {/* Badges */}
            <div className="flex gap-2">
              <div className="h-6 w-32 rounded-full bg-fg/10 animate-pulse" />
              <div className="h-6 w-24 rounded-full bg-fg/10 animate-pulse" />
            </div>

            {/* Title */}
            <div className="h-10 sm:h-12 w-4/5 rounded-lg bg-fg/10 animate-pulse" />

            {/* Date & Venue Box */}
            <div className="card rounded-xl p-4 sm:p-5 grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <div className="h-3 w-20 rounded bg-fg/10 animate-pulse mb-2" />
                <div className="h-6 w-36 rounded bg-fg/10 animate-pulse" />
              </div>
              <div>
                <div className="h-3 w-16 rounded bg-fg/10 animate-pulse mb-2" />
                <div className="h-6 w-32 rounded bg-fg/10 animate-pulse" />
              </div>
            </div>

            {/* Description */}
            <div className="space-y-2 pt-2">
              <div className="h-4 w-full rounded bg-fg/10 animate-pulse" />
              <div className="h-4 w-5/6 rounded bg-fg/10 animate-pulse" />
              <div className="h-4 w-2/3 rounded bg-fg/10 animate-pulse" />
            </div>

            {/* Action Buttons */}
            <div className="flex gap-3 pt-4">
              <div className="h-10 w-36 rounded-full bg-sunset-orange/20 animate-pulse" />
              <div className="h-10 w-36 rounded-full bg-fg/10 animate-pulse" />
            </div>
          </div>
        </div>
      </div>
    </article>
  );
}
