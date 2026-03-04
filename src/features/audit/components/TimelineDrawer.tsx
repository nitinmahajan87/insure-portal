import { format } from "date-fns";
import { AlertCircle } from "lucide-react";
import { Drawer } from "@/components/Drawer";
import { StatusBadge } from "@/components/StatusBadge";
import { TimelineStep } from "./TimelineStep";
import { RetryButton } from "./RetryButton";
import { useLogHistory } from "../hooks/useLogHistory";
import type { AuditLog } from "@/api/types/syncLog";

interface TimelineDrawerProps {
  log: AuditLog | null;
  onClose: () => void;
}

const SOURCE_LABEL: Record<string, string> = {
  ONLINE: "Real-time",
  BATCH: "Batch upload",
};

export function TimelineDrawer({ log, onClose }: TimelineDrawerProps) {
  const { data: history, isLoading, isError } = useLogHistory(log?.id ?? null);

  const isRetryable = log?.status === "FAILED" || log?.status === "SOFT_REJECTED";

  return (
    <Drawer
      open={log !== null}
      onClose={onClose}
      title={log?.employee_code ?? "Event History"}
      description={
        log
          ? `${SOURCE_LABEL[log.source] ?? log.source} · ${log.transaction_type ?? "sync"}`
          : undefined
      }
      width="max-w-lg"
    >
      {log && (
        <>
          {/* Metadata strip */}
          <div className="mb-5 grid grid-cols-2 gap-3 rounded-xl border border-slate-100 bg-slate-50 p-4 text-xs">
            <MetaField label="Current Status">
              <StatusBadge status={log.status} />
            </MetaField>

            <MetaField label="Source">
              <span className="font-medium text-slate-700">
                {SOURCE_LABEL[log.source] ?? log.source}
              </span>
            </MetaField>

            {history?.transaction_id && (
              <MetaField label="Transaction ID">
                <code className="rounded bg-slate-200 px-1.5 py-0.5 font-mono text-slate-600">
                  {history.transaction_id.slice(0, 8)}…
                </code>
              </MetaField>
            )}

            <MetaField label="Date">
              <span className="text-slate-600">
                {format(new Date(log.timestamp), "MMM d, yyyy")}
              </span>
            </MetaField>

            {log.insurer_reference_id && (
              <MetaField label="Insurer Ref" className="col-span-2">
                <code className="rounded bg-slate-200 px-1.5 py-0.5 font-mono text-slate-600">
                  {log.insurer_reference_id}
                </code>
              </MetaField>
            )}

            {log.rejection_reason && (
              <MetaField label="Rejection Reason" className="col-span-2">
                <span className="text-orange-700">{log.rejection_reason}</span>
              </MetaField>
            )}
          </div>

          {/* Retry action */}
          {isRetryable && (
            <div className="mb-5 flex items-center justify-between rounded-xl border border-amber-100 bg-amber-50 px-4 py-3">
              <div className="flex items-start gap-2">
                <AlertCircle className="mt-0.5 h-4 w-4 shrink-0 text-amber-600" />
                <p className="text-sm text-amber-800">
                  This sync can be retried. It will reset to{" "}
                  <strong>PENDING</strong> and requeue.
                </p>
              </div>
              <RetryButton logId={log.id} onSuccess={onClose} className="ml-4 shrink-0" />
            </div>
          )}

          <p className="mb-4 text-xs font-semibold uppercase tracking-wider text-slate-400">
            Event History
          </p>

          {isLoading && (
            <div className="space-y-4">
              {[1, 2, 3].map((i) => (
                <div key={i} className="flex gap-4">
                  <div className="mt-1 h-7 w-7 shrink-0 animate-pulse rounded-full bg-slate-200" />
                  <div className="flex-1 space-y-2 pt-1">
                    <div className="h-4 w-24 animate-pulse rounded bg-slate-200" />
                    <div className="h-3 w-36 animate-pulse rounded bg-slate-100" />
                  </div>
                </div>
              ))}
            </div>
          )}

          {isError && (
            <div className="rounded-lg border border-red-100 bg-red-50 px-4 py-3 text-sm text-red-700">
              Failed to load event history. Please try again.
            </div>
          )}

          {history && history.timeline.length === 0 && (
            <p className="text-sm text-slate-400">No events recorded yet.</p>
          )}

          {history && history.timeline.length > 0 && (
            <div>
              {history.timeline.map((event, idx) => (
                <TimelineStep
                  key={idx}
                  event={event}
                  isLast={idx === history.timeline.length - 1}
                />
              ))}
            </div>
          )}
        </>
      )}
    </Drawer>
  );
}

interface MetaFieldProps {
  label: string;
  children: React.ReactNode;
  className?: string;
}

function MetaField({ label, children, className }: MetaFieldProps) {
  return (
    <div className={className}>
      <p className="mb-0.5 text-slate-400">{label}</p>
      <div>{children}</div>
    </div>
  );
}
