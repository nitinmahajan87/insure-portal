import { cn } from "@/lib/utils";
import { SYNC_STATUS_CONFIG } from "@/lib/statusColors";
import type { SyncStatus } from "@/api/types/syncLog";

interface StatusBadgeProps {
  status: SyncStatus | string;
  className?: string;
}

const FALLBACK_CONFIG = {
  label: "Unknown",
  classes: "bg-slate-100 text-slate-600 border border-slate-200",
  dotClass: "bg-slate-400",
};

export function StatusBadge({ status, className }: StatusBadgeProps) {
  const config = SYNC_STATUS_CONFIG[status] ?? FALLBACK_CONFIG;
  return (
    <span
      className={cn(
        "inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium",
        config.classes,
        className
      )}
    >
      <span className={cn("mr-1.5 h-1.5 w-1.5 rounded-full", config.dotClass)} />
      {config.label}
    </span>
  );
}
