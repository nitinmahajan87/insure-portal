import { cn } from "@/lib/utils";

interface TableSkeletonProps {
  rows?: number;
  cols?: number;
  className?: string;
}

export function TableSkeleton({ rows = 8, cols = 6, className }: TableSkeletonProps) {
  return (
    <div className={cn("w-full overflow-hidden", className)}>
      {/* Header */}
      <div className="flex gap-4 border-b border-slate-100 bg-slate-50 px-4 py-3">
        {Array.from({ length: cols }).map((_, i) => (
          <div key={i} className="h-3 flex-1 animate-pulse rounded-md bg-slate-200" />
        ))}
      </div>
      {/* Rows */}
      {Array.from({ length: rows }).map((_, row) => (
        <div
          key={row}
          className="flex items-center gap-4 border-b border-slate-100 px-4 py-3.5"
        >
          {Array.from({ length: cols }).map((_, col) => (
            <div
              key={col}
              className={cn(
                "h-3 animate-pulse rounded-md bg-slate-100",
                col === 0 ? "w-32 flex-none" : "flex-1",
                // Vary width slightly so it looks natural
                col % 3 === 0 && "max-w-[120px]",
                col % 3 === 1 && "max-w-[160px]",
              )}
              style={{ animationDelay: `${row * 50 + col * 20}ms` }}
            />
          ))}
        </div>
      ))}
    </div>
  );
}

/** Single-line shimmer, e.g. for stat cards */
export function Shimmer({ className }: { className?: string }) {
  return (
    <div className={cn("animate-pulse rounded-md bg-slate-200", className)} />
  );
}
