import { format } from "date-fns";
import { ArrowRight } from "lucide-react";
import { Link } from "@tanstack/react-router";
import { cn } from "@/lib/utils";
import { StatusBadge } from "@/components/StatusBadge";
import type { AuditLog } from "@/api/types/syncLog";

interface RecentTransactionsProps {
  items: AuditLog[];
  isLoading: boolean;
}

const SOURCE_DOT: Record<string, string> = {
  ONLINE: "bg-sky-400",
  BATCH:  "bg-violet-400",
};

export function RecentTransactions({ items, isLoading }: RecentTransactionsProps) {
  return (
    <div className="rounded-2xl border border-slate-200 bg-white">
      <div className="flex items-center justify-between border-b border-slate-100 px-5 py-4">
        <div>
          <h3 className="text-sm font-semibold text-slate-700">Recent Successes</h3>
          <p className="text-xs text-slate-400">Latest confirmed syncs</p>
        </div>
        <Link
          to="/audit"
          className="flex items-center gap-1 text-xs font-medium text-blue-600 hover:text-blue-700"
        >
          View all <ArrowRight className="h-3 w-3" />
        </Link>
      </div>

      <div className="divide-y divide-slate-50">
        {isLoading ? (
          Array.from({ length: 4 }).map((_, i) => (
            <div key={i} className="flex items-center gap-3 px-5 py-4">
              <div className="h-8 w-8 animate-pulse rounded-full bg-slate-100" />
              <div className="flex-1 space-y-1.5">
                <div className="h-3 w-32 animate-pulse rounded bg-slate-200" />
                <div className="h-2.5 w-20 animate-pulse rounded bg-slate-100" />
              </div>
              <div className="h-5 w-16 animate-pulse rounded-full bg-slate-100" />
            </div>
          ))
        ) : items.length === 0 ? (
          <div className="flex flex-col items-center gap-2 py-10">
            <p className="text-sm text-slate-400">No transactions yet.</p>
          </div>
        ) : (
          items.map((log) => {
            const initials = (log.employee_code ?? "??").slice(0, 2).toUpperCase();
            return (
              <div
                key={log.id}
                className="flex items-center gap-3 px-5 py-3.5 transition-colors hover:bg-slate-50"
              >
                <div className="relative shrink-0">
                  <div className="flex h-9 w-9 items-center justify-center rounded-full bg-green-50 text-xs font-semibold uppercase text-green-700">
                    {initials}
                  </div>
                  <span
                    className={cn(
                      "absolute -bottom-0.5 -right-0.5 h-3 w-3 rounded-full border-2 border-white",
                      SOURCE_DOT[log.source] ?? "bg-slate-400"
                    )}
                  />
                </div>

                <div className="min-w-0 flex-1">
                  <p className="truncate text-sm font-medium text-slate-800">
                    {log.employee_code ?? "—"}
                  </p>
                  <p className="truncate text-xs text-slate-400">
                    {log.insurer_reference_id
                      ? `Ref: ${log.insurer_reference_id}`
                      : format(new Date(log.timestamp), "MMM d · h:mm a")}
                  </p>
                </div>

                <div className="flex shrink-0 flex-col items-end gap-1">
                  <StatusBadge status={log.status} />
                  <span className="text-xs text-slate-400">
                    {format(new Date(log.timestamp), "h:mm a")}
                  </span>
                </div>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
}
