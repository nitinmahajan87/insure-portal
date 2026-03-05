import { CheckCircle2, ArrowRight, RotateCcw, Copy, Check, Info } from "lucide-react";
import { Link } from "@tanstack/react-router";
import { useState } from "react";
import { cn } from "@/lib/utils";

interface SubmitSuccessProps {
  variant: "add" | "remove" | "duplicate" | "updated";
  employeeName: string;
  transactionId: string;
  onReset: () => void;
}

const CONFIG = {
  add: {
    title: "Employee Enrolled",
    body: (name: string) =>
      `${name} has been queued for insurance sync. Track the status in the Audit Log.`,
    resetLabel: "Add Another Employee",
    iconBg: "bg-green-50",
    iconColor: "text-green-600",
    border: "border-green-100",
    Icon: CheckCircle2,
  },
  updated: {
    title: "Employee Updated",
    body: (name: string) =>
      `${name}'s details have been updated and re-synced to the insurer.`,
    resetLabel: "Add Another Employee",
    iconBg: "bg-blue-50",
    iconColor: "text-blue-600",
    border: "border-blue-100",
    Icon: CheckCircle2,
  },
  duplicate: {
    title: "Already Enrolled",
    body: (name: string) =>
      `${name} is already enrolled with the same details. No changes were made.`,
    resetLabel: "Add Another Employee",
    iconBg: "bg-slate-100",
    iconColor: "text-slate-500",
    border: "border-slate-200",
    Icon: Info,
  },
  remove: {
    title: "Removal Queued",
    body: (name: string) =>
      `${name}'s removal has been queued for processing. Track the status in the Audit Log.`,
    resetLabel: "Remove Another",
    iconBg: "bg-amber-50",
    iconColor: "text-amber-600",
    border: "border-amber-100",
    Icon: CheckCircle2,
  },
};

export function SubmitSuccess({
  variant,
  employeeName,
  transactionId,
  onReset,
}: SubmitSuccessProps) {
  const cfg = CONFIG[variant];
  const Icon = cfg.Icon;
  const isDuplicate = variant === "duplicate";
  const [copied, setCopied] = useState(false);

  async function handleCopy() {
    await navigator.clipboard.writeText(transactionId);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  }

  return (
    <div
      className={cn(
        "flex flex-col gap-5 rounded-2xl border bg-white p-6",
        cfg.border
      )}
    >
      {/* Header */}
      <div className="flex items-start gap-3">
        <div
          className={cn(
            "flex h-10 w-10 shrink-0 items-center justify-center rounded-xl",
            cfg.iconBg
          )}
        >
          <Icon className={cn("h-5 w-5", cfg.iconColor)} />
        </div>
        <div>
          <p className="font-semibold text-slate-800">{cfg.title}</p>
          <p className="mt-0.5 text-sm text-slate-500">{cfg.body(employeeName)}</p>
        </div>
      </div>

      {/* Transaction ID — hidden for duplicates (no new transaction was created) */}
      {!isDuplicate && <div className="rounded-xl border border-slate-200 bg-slate-50 p-4">
        <p className="mb-2 text-xs font-semibold uppercase tracking-wide text-slate-400">
          Transaction ID
        </p>
        <div className="flex items-center justify-between gap-3">
          <code className="min-w-0 flex-1 truncate font-mono text-sm text-slate-700">
            {transactionId}
          </code>
          <button
            onClick={() => void handleCopy()}
            className={cn(
              "shrink-0 rounded-lg border px-2.5 py-1.5 text-xs font-medium transition-all",
              copied
                ? "border-green-200 bg-green-50 text-green-700"
                : "border-slate-200 bg-white text-slate-600 hover:bg-slate-50"
            )}
            aria-label="Copy transaction ID"
          >
            {copied ? (
              <span className="flex items-center gap-1">
                <Check className="h-3 w-3" /> Copied
              </span>
            ) : (
              <span className="flex items-center gap-1">
                <Copy className="h-3 w-3" /> Copy
              </span>
            )}
          </button>
        </div>
        <p className="mt-2 text-xs text-slate-400">
          Use this ID to look up the record in the Audit Log.
        </p>
      </div>}

      {/* Actions */}
      <div className="flex flex-wrap items-center gap-3">
        <button
          onClick={onReset}
          className="inline-flex items-center gap-2 rounded-xl border border-slate-200 px-4 py-2 text-sm font-medium text-slate-700 transition-colors hover:bg-slate-50"
        >
          <RotateCcw className="h-4 w-4" />
          {cfg.resetLabel}
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
