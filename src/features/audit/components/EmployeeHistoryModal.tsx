import { format } from "date-fns";
import { X, AlertCircle, ShieldAlert } from "lucide-react";
import { cn } from "@/lib/utils";
import { StatusBadge } from "@/components/StatusBadge";
import { PolicyStatusBadge } from "@/components/PolicyStatusBadge";
import type { PolicyStatus } from "@/api/types/employee";
import { TimelineStep } from "./TimelineStep";
import { useEmployeeHistory } from "../hooks/useEmployeeHistory";

interface EmployeeHistoryModalProps {
  employeeCode: string | null;
  onClose: () => void;
  corporateId?: string;
}

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

export function EmployeeHistoryModal({ employeeCode, onClose, corporateId }: EmployeeHistoryModalProps) {
  const { data, isLoading, isError } = useEmployeeHistory(employeeCode, corporateId);

  if (!employeeCode) return null;

  return (
    <div className="fixed inset-0 z-[200] flex items-center justify-center p-4">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/40 backdrop-blur-sm"
        onClick={onClose}
        aria-hidden
      />

      {/* Panel */}
      <div className="relative z-10 flex max-h-[85vh] w-full max-w-2xl flex-col overflow-hidden rounded-2xl bg-white shadow-2xl">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-slate-100 px-6 py-4">
          <div>
            <p className="font-semibold text-slate-800">Employee Journey</p>
            <p className="text-xs text-slate-400">
              Full insurance history for <span className="font-mono font-medium text-slate-600">{employeeCode}</span>
            </p>
          </div>
          <button
            onClick={onClose}
            className="rounded-lg p-1.5 text-slate-400 transition-colors hover:bg-slate-100 hover:text-slate-700"
          >
            <X className="h-4 w-4" />
          </button>
        </div>

        {/* Body */}
        <div className="overflow-y-auto p-6">
          {isLoading && (
            <div className="space-y-6">
              {[1, 2, 3].map((i) => (
                <div key={i} className="h-24 animate-pulse rounded-xl bg-slate-100" />
              ))}
            </div>
          )}

          {isError && (
            <div className="flex flex-col items-center gap-3 py-12 text-center">
              <AlertCircle className="h-8 w-8 text-red-400" />
              <p className="text-sm text-slate-600">Could not load employee history.</p>
            </div>
          )}

          {data && (
            <div className="space-y-6">
              <p className="text-xs text-slate-400">
                {data.total_transactions} transaction{data.total_transactions !== 1 ? "s" : ""} — oldest first
              </p>

              {data.transactions.map((txn, txnIdx) => (
                <div
                  key={txn.log_id}
                  className="rounded-xl border border-slate-200 bg-slate-50"
                >
                  {/* Transaction header */}
                  <div className="flex flex-wrap items-center gap-3 border-b border-slate-200 px-4 py-3">
                    <span className="text-xs font-semibold text-slate-400">
                      #{txnIdx + 1}
                    </span>
                    {txn.transaction_type && (
                      <span className={cn(
                        "rounded-full border px-2 py-0.5 text-xs font-medium",
                        TYPE_BADGE[txn.transaction_type] ?? "bg-slate-100 text-slate-600 border-slate-200"
                      )}>
                        {TYPE_LABEL[txn.transaction_type] ?? txn.transaction_type}
                      </span>
                    )}
                    <StatusBadge status={txn.status} />
                    {txn.policy_status && (
                      <PolicyStatusBadge status={txn.policy_status as PolicyStatus} />
                    )}
                    {txn.is_force && (
                      <span
                        title="Force-removed: employee had no prior enrolment record"
                        className="flex items-center gap-0.5 rounded-full border border-red-200 bg-red-50 px-1.5 py-0.5 text-xs font-medium text-red-700"
                      >
                        <ShieldAlert className="h-3 w-3" />
                        Force
                      </span>
                    )}
                    <span className="ml-auto text-xs text-slate-400">
                      {format(new Date(txn.timestamp), "MMM d, yyyy · h:mm a")}
                    </span>
                  </div>

                  {/* Events timeline */}
                  <div className="px-4 py-4">
                    {txn.events.length === 0 ? (
                      <p className="text-xs text-slate-400">No events recorded.</p>
                    ) : (
                      txn.events.map((event, evtIdx) => (
                        <TimelineStep
                          key={evtIdx}
                          event={event}
                          isLast={evtIdx === txn.events.length - 1}
                        />
                      ))
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
