import { useState } from "react";
import { Eye, Send, AlertTriangle, Clock, XCircle } from "lucide-react";
import { cn } from "@/lib/utils";
import { ConfirmDialog } from "@/components/ConfirmDialog";
import { DispatchResult } from "./DispatchResult";
import { usePreviewReport } from "../hooks/usePreviewReport";
import { useDispatch } from "../hooks/useDispatch";
import { getErrorMessage } from "@/lib/errorParser";
import { useDashboardStats } from "@/features/dashboard/hooks/useDashboardStats";

export function PendingQueuePanel() {
  const [confirmOpen, setConfirmOpen] = useState(false);

  const preview = usePreviewReport();
  const dispatch = useDispatch();

  // Reuse dashboard stats for the pending/failed counts — already cached, no extra request
  const { failedCount, total, isLoading: statsLoading } = useDashboardStats();

  // Pending = total records minus failed + successful (i.e. PENDING + PROVISIONING)
  // Since we only have failed/success totals from the current API, we surface what we can
  // and note that a /stats endpoint would enrich this further.
  const hasDispatchableRecords = total > 0;

  // ── After successful dispatch ──────────────────────────────────────────────
  if (dispatch.isSuccess && dispatch.data) {
    return (
      <DispatchResult
        result={dispatch.data}
        onReset={dispatch.reset}
      />
    );
  }

  // ── Dispatch error ─────────────────────────────────────────────────────────
  const dispatchError = dispatch.isError
    ? getErrorMessage(dispatch.error)
    : null;

  return (
    <>
      {/* ── Queue summary card ─────────────────────────────────────────────── */}
      <div className="rounded-2xl border border-slate-200 bg-white">
        {/* Header */}
        <div className="border-b border-slate-100 px-6 py-5">
          <div className="flex items-start justify-between">
            <div>
              <h2 className="text-base font-semibold text-slate-800">Pending Queue</h2>
              <p className="mt-0.5 text-sm text-slate-400">
                Records awaiting dispatch to the insurer
              </p>
            </div>
            <span
              className={cn(
                "inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-xs font-semibold",
                statsLoading
                  ? "bg-slate-100 text-slate-400"
                  : failedCount > 0
                  ? "bg-amber-50 text-amber-700"
                  : "bg-slate-100 text-slate-500"
              )}
            >
              <Clock className="h-3.5 w-3.5" />
              {statsLoading ? "Loading…" : `${total.toLocaleString()} total records`}
            </span>
          </div>
        </div>

        {/* ── How dispatch works ─────────────────────────────────────────────── */}
        <div className="grid grid-cols-1 divide-y divide-slate-50 sm:grid-cols-3 sm:divide-x sm:divide-y-0 px-0">
          <StepTile
            n="1"
            title="Preview Report"
            body="Download an Excel snapshot of all pending records without changing any status."
            safe
          />
          <StepTile
            n="2"
            title="Review"
            body="Verify the employee data in the preview file before sending to the insurer."
            safe
          />
          <StepTile
            n="3"
            title="Dispatch"
            body="Generate the final report and mark all pending records as COMPLETED. Irreversible."
            safe={false}
          />
        </div>

        {/* ── Warnings ────────────────────────────────────────────────────────── */}
        {failedCount > 0 && !statsLoading && (
          <div className="mx-5 mb-4 flex items-start gap-2 rounded-xl border border-amber-100 bg-amber-50 px-4 py-3">
            <AlertTriangle className="mt-0.5 h-4 w-4 shrink-0 text-amber-500" />
            <p className="text-sm text-amber-800">
              <strong>{failedCount}</strong> record
              {failedCount !== 1 ? "s" : ""} in the queue have failed syncs. Consider{" "}
              <strong>retrying</strong> them in the Audit Log before dispatching.
            </p>
          </div>
        )}

        {/* ── Dispatch error ────────────────────────────────────────────────── */}
        {dispatchError && (
          <div className="mx-5 mb-4 flex items-start gap-2 rounded-xl border border-red-100 bg-red-50 px-4 py-3">
            <XCircle className="mt-0.5 h-4 w-4 shrink-0 text-red-500" />
            <div>
              <p className="text-sm font-medium text-red-700">{dispatchError.title}</p>
              <p className="text-xs text-red-600">{dispatchError.description}</p>
            </div>
          </div>
        )}

        {/* ── Action buttons ─────────────────────────────────────────────────── */}
        <div className="flex flex-wrap items-center gap-3 border-t border-slate-100 px-6 py-5">
          {/* Preview — safe, no confirmation needed */}
          <button
            onClick={() => preview.mutate()}
            disabled={preview.isPending}
            className={cn(
              "inline-flex items-center gap-2 rounded-xl border border-slate-200 px-5 py-2.5 text-sm font-medium text-slate-700",
              "transition-colors hover:bg-slate-50 active:bg-slate-100",
              "disabled:cursor-not-allowed disabled:opacity-50"
            )}
          >
            {preview.isPending ? (
              <>
                <svg className="h-4 w-4 animate-spin" viewBox="0 0 24 24" fill="none">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z" />
                </svg>
                Generating preview…
              </>
            ) : (
              <>
                <Eye className="h-4 w-4" />
                Preview Report
              </>
            )}
          </button>

          {/* Dispatch — destructive, requires confirmation */}
          <button
            onClick={() => setConfirmOpen(true)}
            disabled={dispatch.isPending || !hasDispatchableRecords}
            className={cn(
              "inline-flex items-center gap-2 rounded-xl px-5 py-2.5 text-sm font-semibold text-white",
              "bg-blue-600 transition-colors hover:bg-blue-700 active:bg-blue-800",
              "disabled:cursor-not-allowed disabled:opacity-50"
            )}
          >
            <Send className="h-4 w-4" />
            Dispatch to Insurer
          </button>

          {!hasDispatchableRecords && !statsLoading && (
            <p className="text-xs text-slate-400">
              No records in the queue to dispatch.
            </p>
          )}
        </div>
      </div>

      {/* ── Confirmation dialog ──────────────────────────────────────────────── */}
      <ConfirmDialog
        open={confirmOpen}
        onClose={() => setConfirmOpen(false)}
        onConfirm={() => {
          setConfirmOpen(false);
          dispatch.mutate();
        }}
        title="Dispatch Pending Queue?"
        description="This will generate the final report and clear the pending queue."
        consequences={[
          "Generate an Excel report of all PENDING records",
          "Mark every pending record as COMPLETED",
          "This action cannot be undone — records leave the queue permanently",
        ]}
        confirmLabel="Yes, Dispatch Now"
        cancelLabel="Review First"
        variant="warning"
        isConfirming={dispatch.isPending}
      />
    </>
  );
}

// ── Step tile ──────────────────────────────────────────────────────────────

function StepTile({
  n,
  title,
  body,
  safe,
}: {
  n: string;
  title: string;
  body: string;
  safe: boolean;
}) {
  return (
    <div className="px-6 py-5">
      <div className="mb-2 flex items-center gap-2">
        <span
          className={cn(
            "flex h-6 w-6 items-center justify-center rounded-full text-xs font-bold",
            safe
              ? "bg-slate-100 text-slate-600"
              : "bg-red-50 text-red-600"
          )}
        >
          {n}
        </span>
        <p className="text-sm font-semibold text-slate-700">{title}</p>
        {!safe && (
          <span className="rounded-full bg-red-50 px-1.5 py-0.5 text-xs font-medium text-red-600">
            Irreversible
          </span>
        )}
      </div>
      <p className="text-xs leading-relaxed text-slate-500">{body}</p>
    </div>
  );
}
