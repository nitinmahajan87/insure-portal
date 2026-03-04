import { CheckCircle2, Download, ArrowRight, RotateCcw } from "lucide-react";
import { Link } from "@tanstack/react-router";
import { format } from "date-fns";
import { downloadBlob } from "@/lib/downloadBlob";
import { filenameFromUrl } from "@/lib/downloadBlob";
import type { DispatchResult as TDispatchResult } from "@/api/types/delivery";

interface DispatchResultProps {
  result: TDispatchResult;
  onReset: () => void;
}

export function DispatchResult({ result, onReset }: DispatchResultProps) {
  const filename = filenameFromUrl(
    result.file_url,
    `dispatch_${format(new Date(), "yyyy-MM-dd")}.xlsx`
  );

  async function handleDownload() {
    if (!result.file_url) return;
    // If the URL is a presigned S3/CDN link, fetch it as a blob first
    const res = await fetch(result.file_url);
    const blob = await res.blob();
    downloadBlob(blob, filename);
  }

  return (
    <div className="rounded-2xl border border-emerald-100 bg-white p-6">
      {/* Header */}
      <div className="flex items-start gap-3">
        <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-emerald-50">
          <CheckCircle2 className="h-5 w-5 text-emerald-600" />
        </div>
        <div>
          <p className="font-semibold text-slate-800">Dispatch Complete</p>
          <p className="mt-0.5 text-sm text-slate-500">
            {result.record_count.toLocaleString()} record
            {result.record_count !== 1 ? "s" : ""} sent to insurer and marked{" "}
            <span className="font-medium text-emerald-700">COMPLETED</span>.
          </p>
        </div>
      </div>

      {/* File info card */}
      {result.file_url && (
        <div className="mt-5 flex items-center justify-between rounded-xl border border-slate-200 bg-slate-50 px-4 py-3">
          <div className="min-w-0">
            <p className="truncate text-sm font-medium text-slate-700">{filename}</p>
            <p className="text-xs text-slate-400">
              Generated {format(new Date(), "MMM d, yyyy · h:mm a")}
            </p>
          </div>
          <button
            onClick={() => void handleDownload()}
            className="ml-4 inline-flex shrink-0 items-center gap-1.5 rounded-lg bg-white px-3 py-1.5 text-xs font-medium text-slate-700 shadow-sm ring-1 ring-slate-200 transition-colors hover:bg-slate-50"
          >
            <Download className="h-3.5 w-3.5" />
            Download
          </button>
        </div>
      )}

      {/* Stat chips */}
      <div className="mt-4 flex flex-wrap gap-2">
        <span className="rounded-full bg-emerald-50 px-3 py-1 text-xs font-semibold text-emerald-700">
          {result.record_count.toLocaleString()} dispatched
        </span>
        <span className="rounded-full bg-slate-100 px-3 py-1 text-xs font-medium text-slate-600">
          Queue cleared
        </span>
      </div>

      {/* Actions */}
      <div className="mt-5 flex flex-wrap items-center gap-3 border-t border-slate-100 pt-5">
        <button
          onClick={onReset}
          className="inline-flex items-center gap-2 rounded-xl border border-slate-200 px-4 py-2 text-sm font-medium text-slate-700 transition-colors hover:bg-slate-50"
        >
          <RotateCcw className="h-4 w-4" />
          Back to queue
        </button>

        <Link
          to="/audit"
          className="inline-flex items-center gap-2 rounded-xl bg-blue-600 px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-blue-700"
        >
          View in Audit Log
          <ArrowRight className="h-4 w-4" />
        </Link>
      </div>
    </div>
  );
}
