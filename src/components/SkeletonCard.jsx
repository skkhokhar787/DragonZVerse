export default function SkeletonCard({ count = 1 }) {
  return (
    <>
      {Array.from({ length: count }).map((_, i) => (
        <div key={i} className="glass-card rounded-xl overflow-hidden animate-pulse">
          <div className="h-64 bg-surface-container-high/30" />
          <div className="p-5 space-y-3">
            <div className="h-6 bg-surface-container-high/30 rounded w-3/4" />
            <div className="h-4 bg-surface-container-high/20 rounded w-1/2" />
            <div className="mt-4 space-y-2">
              <div className="flex justify-between">
                <div className="h-3 bg-surface-container-high/20 rounded w-16" />
                <div className="h-3 bg-surface-container-high/20 rounded w-20" />
              </div>
              <div className="h-2 bg-surface-container-high/20 rounded-full w-full" />
            </div>
          </div>
        </div>
      ))}
    </>
  );
}
