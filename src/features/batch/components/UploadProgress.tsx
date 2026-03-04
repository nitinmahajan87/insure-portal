import { Loader2 } from "lucide-react";
import { cn } from "@/lib/utils";

interface UploadProgressProps {
  fileName: string;
  percent: number;
}

export function UploadProgress({ fileName, percent }: UploadProgressProps) {
  // Clamp to 0-100
  const pct = Math.min(100, Math.max(0, percent));
  const isProcessing = pct === 100;

  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-6">
      {/* Icon + status */}
      <div className="mb-4 flex items-center gap-3">
        <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-blue-50">
          <Loader2 className="h-5 w-5 animate-spin text-blue-600" />
        </div>
        <div className="min-w-0">
          <p className="text-sm font-semibold text-slate-800">
            {isProcessing ? "Processing on server…" : "Uploading…"}
          </p>
          <p className="truncate text-xs text-slate-400">{fileName}</p>
        </div>
      </div>

      {/* Progress bar */}
      <div className="overflow-hidden rounded-full bg-slate-100" style={{ height: 8 }}>
        <div
          className={cn(
            "h-full rounded-full transition-all duration-300 ease-out",
            isProcessing ? "animate-pulse bg-blue-400" : "bg-blue-600"
          )}
          style={{ width: `${pct}%` }}
          role="progressbar"
          aria-valuenow={pct}
          aria-valuemin={0}
          aria-valuemax={100}
          aria-label={`Upload progress: ${pct}%`}
        />
      </div>

      {/* Percent label */}
      <div className="mt-2 flex justify-between">
        <p className="text-xs text-slate-400">
          {isProcessing ? "Validating rows…" : `${pct}% transferred`}
        </p>
        <p className="text-xs font-medium text-slate-600">{pct}%</p>
      </div>
    </div>
  );
}
