import { cn } from "@/lib/utils";
import { POLICY_STATUS_CONFIG } from "@/lib/statusColors";
import type { PolicyStatus } from "@/api/types/employee";

interface PolicyStatusBadgeProps {
  status: PolicyStatus;
  className?: string;
}

export function PolicyStatusBadge({ status, className }: PolicyStatusBadgeProps) {
  const config = POLICY_STATUS_CONFIG[status];
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
