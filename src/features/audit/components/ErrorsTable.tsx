import { useState } from "react";
import { format } from "date-fns";
import { History, RefreshCw, AlertTriangle } from "lucide-react";
import { cn } from "@/lib/utils";
import { StatusBadge } from "@/components/StatusBadge";
import { TableSkeleton } from "@/components/TableSkeleton";
import { Pagination } from "@/components/Pagination";
import { TimelineDrawer } from "./TimelineDrawer";
import { RetryButton } from "./RetryButton";
import { useAuditErrors } from "../hooks/useAuditErrors";
import { getErrorMessage } from "@/lib/errorParser";
import type { AuditLog } from "@/api/types/syncLog";

const SOURCE_BADGE: Record<string, string> = {
  ONLINE: "bg-sky-50 text-sky-700 border-sky-200",
  BATCH:  "bg-violet-50 text-violet-700 border-violet-200",
};

export function ErrorsTable() {
  const { data, isLoading, isError, error, isFetching, page, pageSize, setPage } =
    useAuditErrors();
  const [selectedLog, setSelectedLog] = useState<AuditLog | null>(null);

  if (isLoading) return <TableSkeleton rows={10} cols={6} />;

  if (isError) {
    const { title, description, retryable } = getErrorMessage(error);
    return (
      <div className="flex flex-col items-center gap-3 py-16 text-center">
        <AlertTriangle className="h-8 w-8 text-red-400" />
        <div>
          <p className="text-sm font-medium text-slate-800">{title}</p>
          <p className="text-xs text-slate-500">{description}</p>
        </div>
        {retryable && (
          <button
            onClick={() => window.location.reload()}
            className="flex items-center gap-1.5 rounded-lg border border-slate-200 px-3 py-1.5 text-xs text-slate-600 hover:bg-slate-100"
          >
            <RefreshCw className="h-3.5 w-3.5" /> Try again
          </button>
        )}
      </div>
    );
  }

  const items = data?.items ?? [];

  return (
    <>
      <div className={cn("relative transition-opacity", isFetching && "opacity-60")}>
        {isFetching && (
          <div className="absolute right-0 top-0 flex items-center gap-1.5 text-xs text-slate-400">
            <RefreshCw className="h-3 w-3 animate-spin" />
            Refreshing…
          </div>
        )}

        {items.length === 0 ? (
          <div className="flex flex-col items-center gap-2 py-16">
            <div className="flex h-12 w-12 items-center justify-center rounded-full bg-green-50">
              <span className="text-xl">🎉</span>
            </div>
            <p className="text-sm font-medium text-slate-700">No failed syncs</p>
            <p className="text-xs text-slate-400">Everything is running smoothly.</p>
          </div>
        ) : (
          <div className="overflow-x-auto rounded-xl border border-slate-200">
            <table className="min-w-full divide-y divide-slate-100 text-sm">
              <thead className="bg-slate-50">
                <tr>
                  {["Employee", "Source", "Type", "Status", "Error", "Date", "Actions"].map((h) => (
                    <th
                      key={h}
                      className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider text-slate-500"
                    >
                      {h}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 bg-white">
                {items.map((log) => (
                  <tr key={log.id} className="group transition-colors hover:bg-slate-50">
                    {/* Employee */}
                    <td className="whitespace-nowrap px-4 py-3.5">
                      <p className="font-medium text-slate-900">{log.employee_code ?? "—"}</p>
                    </td>

                    {/* Source */}
                    <td className="whitespace-nowrap px-4 py-3.5">
                      <span
                        className={cn(
                          "rounded-full border px-2 py-0.5 text-xs font-medium",
                          SOURCE_BADGE[log.source] ?? "bg-slate-100 text-slate-600 border-slate-200"
                        )}
                      >
                        {log.source === "ONLINE" ? "Real-time" : "Batch"}
                      </span>
                    </td>

                    {/* Transaction type */}
                    <td className="whitespace-nowrap px-4 py-3.5 text-xs text-slate-500">
                      {log.transaction_type ?? "—"}
                    </td>

                    {/* Status */}
                    <td className="whitespace-nowrap px-4 py-3.5">
                      <StatusBadge status={log.status} />
                    </td>

                    {/* Error message */}
                    <td className="max-w-[200px] px-4 py-3.5">
                      {log.error_message ? (
                        <p className="truncate text-xs text-red-600" title={log.error_message}>
                          {log.error_message}
                        </p>
                      ) : (
                        <span className="text-xs text-slate-300">—</span>
                      )}
                    </td>

                    {/* Date */}
                    <td className="whitespace-nowrap px-4 py-3.5 text-xs text-slate-500">
                      <p>{format(new Date(log.timestamp), "MMM d, yyyy")}</p>
                      <p className="text-slate-400">{format(new Date(log.timestamp), "h:mm a")}</p>
                    </td>

                    {/* Actions */}
                    <td className="whitespace-nowrap px-4 py-3.5">
                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => setSelectedLog(log)}
                          className="flex items-center gap-1 rounded-md border border-slate-200 px-2.5 py-1.5 text-xs text-slate-600 transition-colors hover:border-blue-300 hover:bg-blue-50 hover:text-blue-700"
                        >
                          <History className="h-3.5 w-3.5" />
                          History
                        </button>
                        {(log.status === "FAILED" || log.status === "SOFT_REJECTED") && (
                          <RetryButton logId={log.id} />
                        )}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {data && data.total > pageSize && (
          <Pagination
            page={page}
            total={data.total}
            size={pageSize}
            onChange={setPage}
            className="mt-4"
          />
        )}
      </div>

      <TimelineDrawer log={selectedLog} onClose={() => setSelectedLog(null)} />
    </>
  );
}
