export default function EventsLoading() {
  return (
    <div className="pb-16" aria-busy="true" aria-label="Loading events">
      {/* Header Skeleton */}
      <div className="section !pb-4 sm:!pb-6 !pt-20 sm:!pt-24 border-b border-fg/10 bg-bg/40">
        <div className="container-x">
          <div className="h-4 w-20 rounded bg-fg/10 animate-pulse mb-3" />
          <div className="h-9 sm:h-12 w-64 max-w-full rounded-lg bg-fg/10 animate-pulse" />
        </div>
      </div>

      {/* Featured / Events Grid Skeleton */}
      <div className="container-x section !pt-6 sm:!pt-8">
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-2 lg:grid-cols-3 2xl:grid-cols-4 sm:gap-5">
          {[1, 2, 3, 4, 5, 6, 7, 8].map((idx) => (
            <div
              key={idx}
              className="card relative flex aspect-[4/5] w-full flex-col overflow-hidden rounded-2xl bg-card border border-fg/10 animate-pulse"
            >
              <div className="h-3/5 w-full bg-fg/[0.06]" />
              <div className="p-3 sm:p-4.5 space-y-2 flex-1 flex flex-col justify-between">
                <div className="h-3 w-1/2 rounded bg-fg/10" />
                <div className="h-4 w-3/4 rounded bg-fg/10" />
                <div className="h-3 w-1/3 rounded bg-fg/10 mt-auto" />
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
