import { useState } from "react";
import { format } from "date-fns";
import { AlertCircle, History, ShieldAlert } from "lucide-react";
import { Drawer } from "@/components/Drawer";
import { StatusBadge } from "@/components/StatusBadge";
import { TimelineStep } from "./TimelineStep";
import { RetryButton } from "./RetryButton";
import { EmployeeHistoryModal } from "./EmployeeHistoryModal";
import { useLogHistory } from "../hooks/useLogHistory";
import { cn } from "@/lib/utils";
import type { AuditLog } from "@/api/types/syncLog";

interface TimelineDrawerProps {
  log: AuditLog | null;
  onClose: () => void;
  corporateId?: string;
}

const SOURCE_LABEL: Record<string, string> = {
  ONLINE: "Real-time",
  BATCH: "Batch upload",
};

const TYPE_BADGE: Record<string, string> = {
  ADDITION: "bg-green-50 text-green-700 border-green-200",
  UPDATE:   "bg-blue-50 text-blue-700 border-blue-200",
  DELETION: "bg-red-50 text-red-700 border-red-200",
};
const TYPE_LABEL: Record<string, string> = {
  ADDITION: "Add",
  UPDATE:   "Update",
  DELETION: "Remove",
};

export function TimelineDrawer({ log, onClose, corporateId }: TimelineDrawerProps) {
  const { data: history, isLoading, isError } = useLogHistory(log?.id ?? null, corporateId);
  const [empHistoryCode, setEmpHistoryCode] = useState<string | null>(null);

  const isRetryable = log?.status === "FAILED" || log?.status === "SOFT_REJECTED";

  return (
    <>
    <Drawer
      open={log !== null}
      onClose={onClose}
      title={log?.employee_code ?? "Event History"}
      description={
        log ? `${SOURCE_LABEL[log.source] ?? log.source} · ${log.transaction_type ?? "sync"}` : undefined
      }
      width="max-w-lg"
    >
      {log && (
        <>
          {/* Metadata strip */}
          <div className="mb-5 grid grid-cols-2 gap-3 rounded-xl border border-slate-100 bg-slate-50 p-4 text-xs">
            {log.transaction_type && (
              <MetaField label="Transaction Type" className="col-span-2">
                <span className={cn(
                  "rounded-full border px-2 py-0.5 text-xs font-medium",
                  TYPE_BADGE[log.transaction_type] ?? "bg-slate-100 text-slate-600 border-slate-200"
                )}>
                  {TYPE_LABEL[log.transaction_type] ?? log.transaction_type}
                </span>
              </MetaField>
            )}
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

          {/* Force-removal warning */}
          {log.is_force && (
            <div className="mb-5 flex items-start gap-2.5 rounded-xl border border-red-200 bg-red-50 px-4 py-3">
              <ShieldAlert className="mt-0.5 h-4 w-4 shrink-0 text-red-600" />
              <div>
                <p className="text-sm font-medium text-red-700">Force-removal</p>
                <p className="mt-0.5 text-xs text-red-600">
                  This employee had no prior enrolment record in our system. HR confirmed
                  the force-removal — a termination signal was sent to the insurer.
                </p>
              </div>
            </div>
          )}

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

          {/* Full employee history CTA */}
          {log.employee_code && (
            <button
              onClick={() => setEmpHistoryCode(log.employee_code)}
              className="mt-2 inline-flex w-full items-center justify-center gap-2 rounded-xl border border-slate-200 py-2.5 text-sm font-medium text-slate-600 transition-colors hover:bg-slate-50"
            >
              <History className="h-4 w-4" />
              View Full Employee Journey
            </button>
          )}
        </>
      )}
    </Drawer>

    <EmployeeHistoryModal
      employeeCode={empHistoryCode}
      onClose={() => setEmpHistoryCode(null)}
      corporateId={corporateId}
    />
    </>
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
