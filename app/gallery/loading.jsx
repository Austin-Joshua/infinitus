export default function GalleryLoading() {
  return (
    <div className="pb-28 sm:pb-36" aria-busy="true" aria-label="Loading gallery photos">
      {/* Header Skeleton */}
      <div className="section !pb-4 sm:!pb-6 !pt-20 sm:!pt-24 border-b border-fg/10 bg-bg/40">
        <div className="container-x">
          <div className="h-4 w-20 rounded bg-fg/10 animate-pulse mb-3" />
          <div className="h-9 sm:h-12 w-64 max-w-full rounded-lg bg-fg/10 animate-pulse" />
        </div>
      </div>

      {/* Photo Grid Skeleton */}
      <div className="container-x section !pt-6 sm:!pt-8">
        <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3 sm:gap-6 lg:gap-7">
          {[1, 2, 3, 4, 5, 6].map((idx) => (
            <div
              key={idx}
              className="card relative flex aspect-[4/3] w-full flex-col overflow-hidden rounded-xl bg-card border border-fg/10 animate-pulse"
            >
              <div className="h-full w-full bg-fg/[0.06]" />
              <div className="absolute inset-x-0 bottom-0 p-3.5 bg-gradient-to-t from-black/40 to-transparent">
                <div className="h-3.5 w-3/4 rounded bg-white/20" />
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
