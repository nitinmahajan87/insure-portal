import { Bell } from "lucide-react";
import { useAuthStore } from "@/store/authStore";
import { cn } from "@/lib/utils";

interface TopBarProps {
  title: string;
  subtitle?: string;
}

const SCOPE_BADGE: Record<string, string> = {
  corporate: "bg-blue-100 text-blue-700",
  broker: "bg-purple-100 text-purple-700",
};

export function TopBar({ title, subtitle }: TopBarProps) {
  const { tenantName, scope } = useAuthStore();

  return (
    <header className="flex h-16 shrink-0 items-center justify-between border-b border-slate-200 bg-white px-6">
      {/* Page title */}
      <div>
        <h1 className="text-base font-semibold text-slate-900">{title}</h1>
        {subtitle && <p className="text-xs text-slate-400">{subtitle}</p>}
      </div>

      {/* Right side */}
      <div className="flex items-center gap-3">
        {scope && (
          <span
            className={cn(
              "rounded-full px-2.5 py-0.5 text-xs font-medium capitalize",
              SCOPE_BADGE[scope] ?? "bg-slate-100 text-slate-600"
            )}
          >
            {scope}
          </span>
        )}
        {tenantName && (
          <span className="text-sm text-slate-500">{tenantName}</span>
        )}
        <button className="rounded-lg p-2 text-slate-400 transition-colors hover:bg-slate-100 hover:text-slate-600">
          <Bell className="h-4 w-4" />
        </button>
      </div>
    </header>
  );
}
