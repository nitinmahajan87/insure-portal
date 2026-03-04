import { useState, useCallback } from "react";
import { BookOpen, UserPlus, UserMinus } from "lucide-react";
import { TopBar } from "@/components/layout/TopBar";
import { cn } from "@/lib/utils";
import { FileDropzone } from "./components/FileDropzone";
import { UploadProgress } from "./components/UploadProgress";
import { UploadResult } from "./components/UploadResult";
import { useBatchUpload, type BatchMode } from "./hooks/useBatchUpload";

/**
 * Upload state machine (same for both modes):
 *
 *  idle ──[file chosen]──► selected ──[upload clicked]──► uploading ──► done
 *   ▲                           │                                         │
 *   └───────────────────────────┴──────── [reset] ────────────────────────┘
 */
export function BatchPage() {
  const [mode, setMode] = useState<BatchMode>("additions");
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [dropError, setDropError] = useState<string | null>(null);

  const { upload, isPending, isSuccess, isError, data, error, reset } =
    useBatchUpload(mode);

  const handleUpload = useCallback(() => {
    if (!selectedFile) return;
    setUploadProgress(0);
    upload(selectedFile, setUploadProgress);
  }, [selectedFile, upload]);

  const handleReset = useCallback(() => {
    reset();
    setSelectedFile(null);
    setUploadProgress(0);
    setDropError(null);
  }, [reset]);

  const handleFileRemove = useCallback(() => {
    setSelectedFile(null);
    setDropError(null);
  }, []);

  // Switching mode resets all upload state so previous result doesn't bleed through
  function handleModeChange(next: BatchMode) {
    if (next === mode) return;
    reset();
    setSelectedFile(null);
    setUploadProgress(0);
    setDropError(null);
    setMode(next);
  }

  const stage: "idle" | "selected" | "uploading" | "done" =
    isPending
      ? "uploading"
      : isSuccess || isError
      ? "done"
      : selectedFile
      ? "selected"
      : "idle";

  const isAdditions = mode === "additions";

  return (
    <div className="flex h-full flex-col">
      <TopBar
        title="Batch Center"
        subtitle={
          isAdditions
            ? "Upload a file to enrol multiple employees into coverage"
            : "Upload a file to remove multiple employees from coverage"
        }
      />

      <div className="flex-1 overflow-y-auto p-6">
        <div className="mx-auto max-w-2xl space-y-5">
          {/* ── Mode toggle ──────────────────────────────────────────────── */}
          <div className="flex rounded-xl border border-slate-200 bg-slate-50 p-1">
            <ModeTab
              active={isAdditions}
              onClick={() => handleModeChange("additions")}
              icon={UserPlus}
              label="Add Employees"
              description="Enrol employees into coverage"
              activeClasses="text-blue-700"
              iconActiveClass="text-blue-600"
            />
            <ModeTab
              active={!isAdditions}
              onClick={() => handleModeChange("deletions")}
              icon={UserMinus}
              label="Remove Employees"
              description="Terminate employee coverage"
              activeClasses="text-red-700"
              iconActiveClass="text-red-500"
            />
          </div>

          {/* ── Instructions ─────────────────────────────────────────────── */}
          {stage === "idle" && (
            <HowItWorksCard mode={mode} />
          )}

          {/* ── Dropzone ─────────────────────────────────────────────────── */}
          {(stage === "idle" || stage === "selected") && (
            <FileDropzone
              file={selectedFile}
              onFileSelect={setSelectedFile}
              onFileRemove={handleFileRemove}
              onUpload={handleUpload}
              disabled={isPending}
              dropError={dropError}
              onDropError={setDropError}
              uploadLabel={
                isAdditions
                  ? "Upload & Queue Additions"
                  : "Upload & Queue Removals"
              }
            />
          )}

          {/* ── Progress ─────────────────────────────────────────────────── */}
          {stage === "uploading" && selectedFile && (
            <UploadProgress fileName={selectedFile.name} percent={uploadProgress} />
          )}

          {/* ── Result ───────────────────────────────────────────────────── */}
          {stage === "done" && (
            <UploadResult
              fileName={selectedFile?.name ?? ""}
              mode={mode}
              result={data}
              error={isError ? error : undefined}
              onReset={handleReset}
            />
          )}
        </div>
      </div>
    </div>
  );
}

// ── Mode tab button ────────────────────────────────────────────────────────

interface ModeTabProps {
  active: boolean;
  onClick: () => void;
  icon: React.ElementType;
  label: string;
  description: string;
  activeClasses: string;
  iconActiveClass: string;
}

function ModeTab({
  active,
  onClick,
  icon: Icon,
  label,
  description,
  activeClasses,
  iconActiveClass,
}: ModeTabProps) {
  return (
    <button
      onClick={onClick}
      className={cn(
        "flex flex-1 items-center gap-2.5 rounded-lg px-4 py-2.5 text-left transition-all",
        active
          ? "bg-white shadow-sm"
          : "text-slate-500 hover:text-slate-700"
      )}
    >
      <Icon
        className={cn(
          "h-4 w-4 shrink-0",
          active ? iconActiveClass : "text-slate-400"
        )}
      />
      <div className="min-w-0">
        <p
          className={cn(
            "text-sm font-semibold leading-tight",
            active ? activeClasses : "text-slate-600"
          )}
        >
          {label}
        </p>
        <p className="hidden truncate text-xs text-slate-400 sm:block">
          {description}
        </p>
      </div>
    </button>
  );
}

// ── How it works card (mode-aware) ─────────────────────────────────────────

const STEPS: Record<BatchMode, Array<{ n: string; title: string; body: string }>> = {
  additions: [
    {
      n: "1",
      title: "Prepare your file",
      body: "Export from your HRMS with columns: employee_id, name, email (optional), date_of_birth (optional), date_of_joining.",
    },
    {
      n: "2",
      title: "Upload here",
      body: "Drag & drop or browse for your .xlsx or .csv file. Each valid row is queued for insurance enrolment.",
    },
    {
      n: "3",
      title: "Review results",
      body: "Accepted rows enter the sync queue immediately. Row-level errors show the row number and reason.",
    },
    {
      n: "4",
      title: "Track in Audit Log",
      body: "Each queued employee gets a real-time status entry once the background worker processes them.",
    },
  ],
  deletions: [
    {
      n: "1",
      title: "Prepare your file",
      body: "Export from your HRMS with columns: employee_id, name, effective_date (optional), reason (optional).",
    },
    {
      n: "2",
      title: "Upload here",
      body: "Drag & drop or browse for your .xlsx or .csv file. Each valid row queues a coverage termination.",
    },
    {
      n: "3",
      title: "Review results",
      body: "Accepted rows are queued for removal. Row-level errors show the row number and reason.",
    },
    {
      n: "4",
      title: "Dispatch to insurer",
      body: "Removals are included in the next batch dispatch from the Dispatch Center.",
    },
  ],
};

function HowItWorksCard({ mode }: { mode: BatchMode }) {
  const steps = STEPS[mode];
  const isAdditions = mode === "additions";

  return (
    <div
      className={cn(
        "rounded-2xl border p-5",
        isAdditions
          ? "border-blue-100 bg-blue-50/50"
          : "border-red-100 bg-red-50/40"
      )}
    >
      <div className="mb-4 flex items-center gap-2">
        <div
          className={cn(
            "flex h-7 w-7 items-center justify-center rounded-lg",
            isAdditions ? "bg-blue-100" : "bg-red-100"
          )}
        >
          <BookOpen
            className={cn(
              "h-4 w-4",
              isAdditions ? "text-blue-600" : "text-red-500"
            )}
          />
        </div>
        <p
          className={cn(
            "text-sm font-semibold",
            isAdditions ? "text-blue-800" : "text-red-800"
          )}
        >
          How it works
        </p>
      </div>

      <ol className="space-y-3">
        {steps.map((step) => (
          <li key={step.n} className="flex gap-3">
            <span
              className={cn(
                "flex h-5 w-5 shrink-0 items-center justify-center rounded-full text-xs font-bold",
                isAdditions
                  ? "bg-blue-200 text-blue-700"
                  : "bg-red-200 text-red-700"
              )}
            >
              {step.n}
            </span>
            <div>
              <p
                className={cn(
                  "text-sm font-medium",
                  isAdditions ? "text-blue-900" : "text-red-900"
                )}
              >
                {step.title}
              </p>
              <p
                className={cn(
                  "text-xs",
                  isAdditions ? "text-blue-600" : "text-red-600"
                )}
              >
                {step.body}
              </p>
            </div>
          </li>
        ))}
      </ol>
    </div>
  );
}
