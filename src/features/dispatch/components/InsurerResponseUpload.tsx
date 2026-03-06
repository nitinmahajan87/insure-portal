import { useRef, useState } from "react";
import {
  UploadCloud,
  CheckCircle2,
  XCircle,
  AlertTriangle,
  FileSpreadsheet,
  RotateCcw,
  ChevronDown,
  ChevronUp,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { useInsurerResponseUpload } from "../hooks/useInsurerResponseUpload";
import { getErrorMessage } from "@/lib/errorParser";
import type { InsurerResponseReport } from "@/api/endpoints/insurer";

// ── Result summary ────────────────────────────────────────────────────────────

function ResultSummary({
  report,
  onReset,
}: {
  report: InsurerResponseReport;
  onReset: () => void;
}) {
  const [showErrors, setShowErrors] = useState(false);
  const hasErrors = report.parse_errors.length > 0;

  return (
    <div className="space-y-4">
      {/* Summary cards */}
      <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
        <StatCard label="Issued"        value={report.issued_count}        color="emerald" />
        <StatCard label="Soft Rejected" value={report.soft_rejected_count} color="red"     />
        <StatCard label="Unmatched"     value={report.unmatched_count}     color="amber"   />
        <StatCard label="Parse Errors"  value={report.parse_error_count}   color="slate"   />
      </div>

      <p className="text-sm text-slate-600">{report.message}</p>

      {/* Unmatched explanation */}
      {report.unmatched_count > 0 && (
        <div className="flex items-start gap-2 rounded-xl border border-amber-100 bg-amber-50 px-4 py-3">
          <AlertTriangle className="mt-0.5 h-4 w-4 shrink-0 text-amber-500" />
          <p className="text-sm text-amber-800">
            <strong>{report.unmatched_count}</strong> row(s) had no matching open SyncLog.
            These employees may have already been processed, or their employee codes do not
            match our records.
          </p>
        </div>
      )}

      {/* Parse errors accordion */}
      {hasErrors && (
        <div className="rounded-xl border border-red-100 bg-red-50">
          <button
            onClick={() => setShowErrors((v) => !v)}
            className="flex w-full items-center justify-between px-4 py-3 text-sm font-medium text-red-700"
          >
            <span className="flex items-center gap-2">
              <XCircle className="h-4 w-4" />
              {report.parse_error_count} row(s) could not be parsed
            </span>
            {showErrors ? (
              <ChevronUp className="h-4 w-4" />
            ) : (
              <ChevronDown className="h-4 w-4" />
            )}
          </button>

          {showErrors && (
            <div className="divide-y divide-red-100 border-t border-red-100">
              {report.parse_errors.map((err) => (
                <div key={err.row_index} className="px-4 py-3">
                  <p className="text-xs font-semibold text-red-700">Row {err.row_index}</p>
                  <ul className="mt-1 list-disc pl-4">
                    {err.errors.map((e, i) => (
                      <li key={i} className="text-xs text-red-600">{e}</li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      <button
        onClick={onReset}
        className="inline-flex items-center gap-2 rounded-xl border border-slate-200 px-4 py-2 text-sm font-medium text-slate-600 transition-colors hover:bg-slate-50"
      >
        <RotateCcw className="h-4 w-4" />
        Upload Another File
      </button>
    </div>
  );
}

function StatCard({
  label,
  value,
  color,
}: {
  label: string;
  value: number;
  color: "emerald" | "red" | "amber" | "slate";
}) {
  const colorMap = {
    emerald: "bg-emerald-50 text-emerald-700",
    red:     "bg-red-50 text-red-700",
    amber:   "bg-amber-50 text-amber-700",
    slate:   "bg-slate-100 text-slate-600",
  };
  return (
    <div className={cn("rounded-xl p-4 text-center", colorMap[color])}>
      <p className="text-2xl font-bold">{value}</p>
      <p className="mt-0.5 text-xs font-medium">{label}</p>
    </div>
  );
}

// ── Main upload component ─────────────────────────────────────────────────────

interface InsurerResponseUploadProps {
  corporateId: string;
}

export function InsurerResponseUpload({ corporateId }: InsurerResponseUploadProps) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [progress, setProgress] = useState(0);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);

  const upload = useInsurerResponseUpload(corporateId);

  function handleFileChange(e: React.ChangeEvent<HTMLInputElement>) {
    const f = e.target.files?.[0];
    if (!f) return;

    const ext = f.name.split(".").pop()?.toLowerCase();
    if (!ext || !["csv", "xlsx", "xls"].includes(ext)) {
      alert("Only CSV and Excel files (.csv, .xlsx, .xls) are accepted.");
      return;
    }

    setSelectedFile(f);
    setProgress(0);
    upload.reset();
  }

  function handleUpload() {
    if (!selectedFile) return;
    upload.mutate({
      file: selectedFile,
      onProgress: setProgress,
    });
  }

  // ── Success state ──────────────────────────────────────────────────────────
  if (upload.isSuccess && upload.data) {
    return (
      <ResultSummary
        report={upload.data}
        onReset={() => {
          upload.reset();
          setSelectedFile(null);
          setProgress(0);
          if (inputRef.current) inputRef.current.value = "";
        }}
      />
    );
  }

  const uploadError = upload.isError ? getErrorMessage(upload.error) : null;

  return (
    <div className="space-y-5">
      {/* Explainer */}
      <div className="rounded-xl border border-blue-100 bg-blue-50 px-4 py-3 text-sm text-blue-800">
        Upload the response file you received from the insurer. The system will automatically
        update each employee's <strong>policy_status</strong> to{" "}
        <strong>ISSUED</strong> or <strong>SOFT_REJECTED</strong> based on the insurer's decision.
      </div>

      {/* Dropzone */}
      <div
        onClick={() => inputRef.current?.click()}
        className={cn(
          "flex cursor-pointer flex-col items-center gap-3 rounded-2xl border-2 border-dashed p-10 text-center transition-colors",
          selectedFile
            ? "border-amber-300 bg-amber-50"
            : "border-slate-200 bg-slate-50 hover:border-amber-300 hover:bg-amber-50"
        )}
      >
        <input
          ref={inputRef}
          type="file"
          accept=".csv,.xlsx,.xls"
          className="hidden"
          onChange={handleFileChange}
        />

        {selectedFile ? (
          <>
            <FileSpreadsheet className="h-10 w-10 text-amber-500" />
            <div>
              <p className="font-semibold text-slate-800">{selectedFile.name}</p>
              <p className="text-xs text-slate-400">
                {(selectedFile.size / 1024).toFixed(1)} KB — click to change
              </p>
            </div>
          </>
        ) : (
          <>
            <UploadCloud className="h-10 w-10 text-slate-300" />
            <div>
              <p className="font-semibold text-slate-600">Click to select insurer response file</p>
              <p className="text-xs text-slate-400">CSV, XLSX or XLS · Max 10 MB</p>
            </div>
          </>
        )}
      </div>

      {/* Upload progress */}
      {upload.isPending && (
        <div className="space-y-1.5">
          <div className="flex justify-between text-xs text-slate-500">
            <span>Uploading and processing…</span>
            <span>{progress}%</span>
          </div>
          <div className="h-2 w-full overflow-hidden rounded-full bg-slate-100">
            <div
              className="h-full rounded-full bg-amber-500 transition-all duration-200"
              style={{ width: `${progress}%` }}
            />
          </div>
        </div>
      )}

      {/* Error */}
      {uploadError && (
        <div className="flex items-start gap-2 rounded-xl border border-red-100 bg-red-50 px-4 py-3">
          <XCircle className="mt-0.5 h-4 w-4 shrink-0 text-red-500" />
          <div>
            <p className="text-sm font-medium text-red-700">{uploadError.title}</p>
            <p className="text-xs text-red-600">{uploadError.description}</p>
          </div>
        </div>
      )}

      {/* Upload button */}
      <button
        onClick={handleUpload}
        disabled={!selectedFile || upload.isPending}
        className={cn(
          "inline-flex items-center gap-2 rounded-xl px-6 py-2.5 text-sm font-semibold text-white transition-colors",
          "bg-amber-500 hover:bg-amber-600 active:bg-amber-700",
          "disabled:cursor-not-allowed disabled:opacity-50"
        )}
      >
        <CheckCircle2 className="h-4 w-4" />
        {upload.isPending ? "Processing…" : "Apply Insurer Response"}
      </button>

      {/* Supported column names hint */}
      <details className="text-xs text-slate-400">
        <summary className="cursor-pointer hover:text-slate-600">
          Supported column names in the insurer's file
        </summary>
        <div className="mt-2 grid grid-cols-2 gap-x-6 gap-y-1 rounded-lg border border-slate-100 bg-slate-50 p-3 sm:grid-cols-3">
          {[
            ["Employee Code", "employee_code, emp_id, member_id, empno"],
            ["Decision",      "status, outcome, decision, result"],
            ["Policy No.",    "policy_number, policy_no, gmc_policy_no"],
            ["Effective Date","effective_date, commencement_date, start_date"],
            ["Certificate",   "certificate_number, cert_no, e_card_no"],
            ["Rejection",     "rejection_reason, remarks, reason"],
          ].map(([field, aliases]) => (
            <div key={field}>
              <p className="font-medium text-slate-600">{field}</p>
              <p className="text-slate-400">{aliases}</p>
            </div>
          ))}
        </div>
      </details>
    </div>
  );
}
