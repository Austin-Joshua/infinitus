export default function GlobalLoading() {
  return (
    <div className="section min-h-[60vh] flex flex-col justify-center items-center py-20" aria-busy="true" aria-label="Loading content">
      <div className="h-8 w-8 rounded-full border-2 border-sunset-orange/30 border-t-sunset-orange animate-spin mb-4" />
      <span className="font-mono text-xs uppercase tracking-widest text-muted animate-pulse">
        Loading...
      </span>
    </div>
  );
}
