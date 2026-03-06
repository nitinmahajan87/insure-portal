import { CheckCircle2, AlertTriangle, XCircle, RotateCcw, ArrowRight, Download } from "lucide-react";
import { Link } from "@tanstack/react-router";
import { cn } from "@/lib/utils";
import type { IngestionResult } from "@/api/endpoints/ingestion";
import { getErrorMessage } from "@/lib/errorParser";
import type { BatchMode } from "../hooks/useBatchUpload";

interface UploadResultProps {
  fileName: string;
  mode: BatchMode;
  result?: IngestionResult;
  error?: unknown;
  onReset: () => void;
}

export function UploadResult({ fileName, mode, result, error, onReset }: UploadResultProps) {
  const rowLabel = mode === "additions" ? "employee" : "removal";
  // ── Error state ────────────────────────────────────────────────────────────
  if (error) {
    const { title, description, retryable } = getErrorMessage(error);
    return (
      <div className="rounded-2xl border border-red-100 bg-white p-6">
        {/* Header */}
        <div className="flex items-start gap-3">
          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-red-50">
            <XCircle className="h-5 w-5 text-red-500" />
          </div>
          <div>
            <p className="font-semibold text-slate-800">{title}</p>
            <p className="mt-0.5 text-sm text-slate-500">{description}</p>
            {!retryable && (
              <p className="mt-1 text-xs text-red-500">
                This is a system error. Please contact your administrator.
              </p>
            )}
          </div>
        </div>

        <div className="mt-5">
          <button
            onClick={onReset}
            className="inline-flex items-center gap-2 rounded-xl border border-slate-200 px-4 py-2 text-sm font-medium text-slate-700 transition-colors hover:bg-slate-50"
          >
            <RotateCcw className="h-4 w-4" />
            {retryable ? "Try again" : "Upload a different file"}
          </button>
        </div>
      </div>
    );
  }

  if (!result) return null;

  const allAccepted = result.rejected === 0;
  const allRejected = result.accepted === 0 && result.rejected > 0;

  // ── Summary card config ────────────────────────────────────────────────────
  const headerConfig = allRejected
    ? {
        icon: XCircle,
        iconBg: "bg-red-50",
        iconColor: "text-red-500",
        borderColor: "border-red-100",
        title: "Upload Failed",
        subtitle: `All ${result.rejected} rows were rejected.`,
      }
    : allAccepted
    ? {
        icon: CheckCircle2,
        iconBg: "bg-green-50",
        iconColor: "text-green-600",
        borderColor: "border-green-100",
        title: "Upload Complete",
        subtitle: `${result.accepted} ${rowLabel}${result.accepted !== 1 ? "s" : ""} queued for processing.`,
      }
    : {
        icon: AlertTriangle,
        iconBg: "bg-amber-50",
        iconColor: "text-amber-500",
        borderColor: "border-amber-100",
        title: "Partial Upload",
        subtitle: `${result.accepted} accepted · ${result.rejected} rejected`,
      };

  const Icon = headerConfig.icon;

  return (
    <div className={cn("rounded-2xl border bg-white p-6", headerConfig.borderColor)}>
      {/* Header */}
      <div className="flex items-start gap-3">
        <div className={cn("flex h-10 w-10 shrink-0 items-center justify-center rounded-xl", headerConfig.iconBg)}>
          <Icon className={cn("h-5 w-5", headerConfig.iconColor)} />
        </div>
        <div>
          <p className="font-semibold text-slate-800">{headerConfig.title}</p>
          <p className="mt-0.5 text-sm text-slate-500">{headerConfig.subtitle}</p>
          <p className="mt-0.5 text-xs text-slate-400 truncate">{fileName}</p>
        </div>
      </div>

      {/* Stat chips */}
      <div className="mt-4 flex flex-wrap gap-2">
        {result.accepted > 0 && (
          <StatChip
            value={result.accepted}
            label="accepted"
            className="bg-green-50 text-green-700"
          />
        )}
        {result.rejected > 0 && (
          <StatChip
            value={result.rejected}
            label="rejected"
            className="bg-red-50 text-red-700"
          />
        )}
        <StatChip
          value={result.accepted + result.rejected}
          label="total rows"
          className="bg-slate-100 text-slate-600"
        />
      </div>

      {/* Error rows table */}
      {result.errors.length > 0 && (
        <div className="mt-5">
          <div className="mb-2 flex items-center gap-2">
            <AlertTriangle className="h-3.5 w-3.5 text-amber-500" />
            <p className="text-xs font-semibold text-slate-600">
              Row-level issues ({result.errors.length})
            </p>
          </div>

          <div className="overflow-hidden rounded-xl border border-slate-200">
            {/* Column headers */}
            <div className="grid grid-cols-[80px_1fr] gap-3 border-b border-slate-100 bg-slate-50 px-4 py-2.5">
              <span className="text-xs font-semibold uppercase tracking-wide text-slate-400">Row</span>
              <span className="text-xs font-semibold uppercase tracking-wide text-slate-400">Reason</span>
            </div>

            {/* Error rows — scrollable if many */}
            <div className="max-h-52 overflow-y-auto divide-y divide-slate-50">
              {result.errors.map((err, idx) => (
                <div
                  key={idx}
                  className="grid grid-cols-[80px_1fr] gap-3 px-4 py-2.5 hover:bg-slate-50"
                >
                  <span className="font-mono text-xs font-medium text-slate-500">
                    #{err.row}
                  </span>
                  <span className="text-xs text-red-600">{err.reason}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Actions */}
      <div className="mt-5 flex flex-wrap items-center gap-3">
        <button
          onClick={onReset}
          className="inline-flex items-center gap-2 rounded-xl border border-slate-200 px-4 py-2 text-sm font-medium text-slate-700 transition-colors hover:bg-slate-50"
        >
          <RotateCcw className="h-4 w-4" />
          Upload another file
        </button>

        {/* Download insurer report — only present for OFFLINE / BOTH channels.
            Always fetches a fresh pre-signed URL so the button works even after
            the initial 15-min window has passed. */}
        {result.file_download_url && (
          <ReportDownloadButton downloadUrl={result.file_download_url} />
        )}

        {result.accepted > 0 && (
          <Link
            to="/audit"
            className="inline-flex items-center gap-2 rounded-xl bg-blue-600 px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-blue-700"
          >
            View in Audit Log
            <ArrowRight className="h-4 w-4" />
          </Link>
        )}
      </div>
    </div>
  );
}

function StatChip({
  value,
  label,
  className,
}: {
  value: number;
  label: string;
  className: string;
}) {
  return (
    <span className={cn("rounded-full px-3 py-1 text-xs font-semibold", className)}>
      {value.toLocaleString()} {label}
    </span>
  );
}

// ── Report download — always fetches a fresh pre-signed URL ──────────────────

function ReportDownloadButton({ downloadUrl }: { downloadUrl: string }) {
  return (
    <a
      href={downloadUrl}
      target="_blank"
      rel="noopener noreferrer"
      className="inline-flex items-center gap-2 rounded-xl bg-emerald-600 px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-emerald-700"
    >
      <Download className="h-4 w-4" />
      Download Insurer Report
    </a>
  );
}
