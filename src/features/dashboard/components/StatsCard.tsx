import { type LucideIcon } from "lucide-react";
import { cn } from "@/lib/utils";
import { Shimmer } from "@/components/TableSkeleton";

interface StatsCardProps {
  label: string;
  value: number | null;
  icon: LucideIcon;
  /** Shown as small subtext below the number */
  hint?: string;
  variant?: "default" | "danger" | "success" | "warning";
  /** Optional click handler to navigate to the relevant section */
  onClick?: () => void;
}

const VARIANTS = {
  default: {
    iconBg:    "bg-slate-100",
    iconColor: "text-slate-500",
    valueCls:  "text-slate-900",
    ring:      "hover:ring-slate-200",
  },
  danger: {
    iconBg:    "bg-red-50",
    iconColor: "text-red-500",
    valueCls:  "text-red-600",
    ring:      "hover:ring-red-200",
  },
  success: {
    iconBg:    "bg-green-50",
    iconColor: "text-green-600",
    valueCls:  "text-green-700",
    ring:      "hover:ring-green-200",
  },
  warning: {
    iconBg:    "bg-amber-50",
    iconColor: "text-amber-500",
    valueCls:  "text-amber-700",
    ring:      "hover:ring-amber-200",
  },
};

export function StatsCard({
  label,
  value,
  icon: Icon,
  hint,
  variant = "default",
  onClick,
}: StatsCardProps) {
  const v = VARIANTS[variant];

  return (
    <div
      onClick={onClick}
      className={cn(
        "rounded-2xl border border-slate-200 bg-white p-5 transition-all",
        onClick && "cursor-pointer hover:shadow-md hover:ring-2",
        onClick && v.ring,
        !onClick && "hover:shadow-sm"
      )}
    >
      <div className="flex items-start justify-between">
        <div className={cn("rounded-xl p-2.5", v.iconBg)}>
          <Icon className={cn("h-5 w-5", v.iconColor)} />
        </div>
      </div>

      <div className="mt-4">
        {value === null ? (
          <>
            <Shimmer className="mb-2 h-8 w-20" />
            <Shimmer className="h-3 w-28" />
          </>
        ) : (
          <>
            <p className={cn("text-3xl font-bold tabular-nums", v.valueCls)}>
              {value.toLocaleString()}
            </p>
            <p className="mt-1 text-sm font-medium text-slate-500">{label}</p>
            {hint && <p className="mt-0.5 text-xs text-slate-400">{hint}</p>}
          </>
        )}
      </div>
    </div>
  );
}
