import { useCallback } from "react";
import { useDropzone, type FileRejection } from "react-dropzone";
import { UploadCloud, FileSpreadsheet, X, AlertCircle } from "lucide-react";
import { cn } from "@/lib/utils";

const ACCEPTED_TYPES = {
  "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet": [".xlsx"],
  "application/vnd.ms-excel": [".xls"],
  "text/csv": [".csv"],
};

const MAX_SIZE = 10 * 1024 * 1024; // 10 MB

interface FileDropzoneProps {
  file: File | null;
  onFileSelect: (file: File) => void;
  onFileRemove: () => void;
  onUpload: () => void;
  /** Prevents new selection while an upload is in flight */
  disabled?: boolean;
  /** Validation errors from react-dropzone */
  dropError: string | null;
  onDropError: (err: string | null) => void;
  /** Label for the upload button — defaults to "Upload & Queue Employees" */
  uploadLabel?: string;
}

function formatSize(bytes: number): string {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
}

function fileTypeLabel(file: File): string {
  if (file.name.endsWith(".xlsx") || file.name.endsWith(".xls")) return "Excel Spreadsheet";
  if (file.name.endsWith(".csv")) return "CSV File";
  return file.type || "Unknown";
}

export function FileDropzone({
  file,
  onFileSelect,
  onFileRemove,
  onUpload,
  disabled = false,
  dropError,
  onDropError,
  uploadLabel = "Upload & Queue Employees",
}: FileDropzoneProps) {
  const onDrop = useCallback(
    (accepted: File[], rejections: FileRejection[]) => {
      onDropError(null);

      if (rejections.length > 0) {
        const reason = rejections[0]?.errors[0];
        if (reason?.code === "file-too-large") {
          onDropError(`File is too large. Maximum size is 10 MB.`);
        } else if (reason?.code === "file-invalid-type") {
          onDropError(`Invalid file type. Please upload an .xlsx or .csv file.`);
        } else {
          onDropError(reason?.message ?? "Invalid file.");
        }
        return;
      }

      if (accepted[0]) {
        onFileSelect(accepted[0]);
      }
    },
    [onFileSelect, onDropError]
  );

  const { getRootProps, getInputProps, isDragActive, isDragReject } = useDropzone({
    onDrop,
    accept: ACCEPTED_TYPES,
    maxSize: MAX_SIZE,
    multiple: false,
    disabled,
  });

  // ── File selected state ────────────────────────────────────────────────────
  if (file) {
    return (
      <div className="rounded-2xl border border-slate-200 bg-white p-6">
        <div className="flex items-start gap-4">
          {/* File icon */}
          <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-emerald-50">
            <FileSpreadsheet className="h-6 w-6 text-emerald-600" />
          </div>

          {/* File info */}
          <div className="min-w-0 flex-1">
            <p className="truncate font-medium text-slate-800">{file.name}</p>
            <p className="mt-0.5 text-sm text-slate-400">
              {formatSize(file.size)} · {fileTypeLabel(file)}
            </p>
          </div>

          {/* Remove */}
          <button
            onClick={onFileRemove}
            disabled={disabled}
            className="shrink-0 rounded-lg p-1.5 text-slate-400 transition-colors hover:bg-slate-100 hover:text-slate-600 disabled:opacity-40"
            aria-label="Remove file"
          >
            <X className="h-4 w-4" />
          </button>
        </div>

        {/* Upload CTA */}
        <div className="mt-5 flex items-center gap-3">
          <button
            onClick={onUpload}
            disabled={disabled}
            className="inline-flex items-center gap-2 rounded-xl bg-blue-600 px-5 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-blue-700 active:bg-blue-800 disabled:cursor-not-allowed disabled:opacity-50"
          >
            <UploadCloud className="h-4 w-4" />
            {uploadLabel}
          </button>
          <p className="text-xs text-slate-400">
            Each valid row will be queued for insurance sync.
          </p>
        </div>
      </div>
    );
  }

  // ── Drop area (idle) ───────────────────────────────────────────────────────
  return (
    <div>
      <div
        {...getRootProps()}
        className={cn(
          "relative flex cursor-pointer flex-col items-center justify-center rounded-2xl border-2 border-dashed p-12 text-center transition-all duration-200",
          isDragActive && !isDragReject
            ? "border-blue-400 bg-blue-50"
            : isDragReject
            ? "border-red-400 bg-red-50"
            : dropError
            ? "border-red-300 bg-red-50"
            : "border-slate-200 bg-slate-50 hover:border-blue-300 hover:bg-blue-50/50",
          disabled && "cursor-not-allowed opacity-60"
        )}
      >
        <input {...getInputProps()} />

        {/* Icon */}
        <div
          className={cn(
            "mb-4 flex h-14 w-14 items-center justify-center rounded-2xl transition-colors",
            isDragActive && !isDragReject
              ? "bg-blue-100"
              : isDragReject || dropError
              ? "bg-red-100"
              : "bg-white shadow-sm"
          )}
        >
          <UploadCloud
            className={cn(
              "h-7 w-7 transition-colors",
              isDragActive && !isDragReject
                ? "text-blue-500"
                : isDragReject || dropError
                ? "text-red-500"
                : "text-slate-400"
            )}
          />
        </div>

        {/* Copy */}
        {isDragActive && !isDragReject ? (
          <p className="text-base font-semibold text-blue-600">Drop it here</p>
        ) : isDragReject ? (
          <p className="text-base font-semibold text-red-600">Invalid file type</p>
        ) : (
          <>
            <p className="text-base font-semibold text-slate-700">
              Drag &amp; drop your file here
            </p>
            <p className="mt-1 text-sm text-slate-400">
              or{" "}
              <span className="font-medium text-blue-600 underline-offset-2 hover:underline">
                click to browse
              </span>
            </p>
          </>
        )}

        {/* Format + size hint */}
        <div className="mt-4 flex items-center gap-2">
          {[".xlsx", ".xls", ".csv"].map((ext) => (
            <span
              key={ext}
              className="rounded-md bg-white px-2 py-0.5 text-xs font-medium text-slate-500 shadow-sm ring-1 ring-slate-200"
            >
              {ext}
            </span>
          ))}
          <span className="text-xs text-slate-400">· max 10 MB</span>
        </div>
      </div>

      {/* Validation error */}
      {dropError && (
        <div className="mt-3 flex items-start gap-2 rounded-lg border border-red-100 bg-red-50 px-4 py-3">
          <AlertCircle className="mt-0.5 h-4 w-4 shrink-0 text-red-500" />
          <p className="text-sm text-red-700">{dropError}</p>
        </div>
      )}
    </div>
  );
}
