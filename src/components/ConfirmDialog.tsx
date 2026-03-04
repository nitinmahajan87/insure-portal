/**
 * ConfirmDialog — centered modal for destructive/irreversible actions.
 * Built on @radix-ui/react-dialog so it has proper focus trap + ESC handling.
 */
import * as Dialog from "@radix-ui/react-dialog";
import { AlertTriangle, X } from "lucide-react";
import { cn } from "@/lib/utils";

interface ConfirmDialogProps {
  open: boolean;
  onClose: () => void;
  onConfirm: () => void;
  title: string;
  description: string;
  /** Bullet points listing what the action will do */
  consequences?: string[];
  confirmLabel?: string;
  cancelLabel?: string;
  /** Defaults to "danger" (red). Use "warning" for amber. */
  variant?: "danger" | "warning";
  isConfirming?: boolean;
}

export function ConfirmDialog({
  open,
  onClose,
  onConfirm,
  title,
  description,
  consequences = [],
  confirmLabel = "Confirm",
  cancelLabel = "Cancel",
  variant = "danger",
  isConfirming = false,
}: ConfirmDialogProps) {
  const isDanger = variant === "danger";

  return (
    <Dialog.Root open={open} onOpenChange={(o) => !o && onClose()}>
      <Dialog.Portal>
        {/* Overlay */}
        <Dialog.Overlay
          className={cn(
            "fixed inset-0 z-40 bg-black/40 backdrop-blur-[2px]",
            "data-[state=open]:animate-in data-[state=closed]:animate-out",
            "data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0",
            "duration-200"
          )}
        />

        {/* Panel */}
        <Dialog.Content
          className={cn(
            "fixed left-1/2 top-1/2 z-50 w-full max-w-md -translate-x-1/2 -translate-y-1/2",
            "rounded-2xl border border-slate-200 bg-white shadow-xl",
            "data-[state=open]:animate-in data-[state=closed]:animate-out",
            "data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0",
            "data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95",
            "duration-200"
          )}
        >
          {/* Header */}
          <div className="flex items-start justify-between p-6 pb-4">
            <div className="flex items-start gap-3">
              <div
                className={cn(
                  "flex h-9 w-9 shrink-0 items-center justify-center rounded-full",
                  isDanger ? "bg-red-50" : "bg-amber-50"
                )}
              >
                <AlertTriangle
                  className={cn(
                    "h-5 w-5",
                    isDanger ? "text-red-500" : "text-amber-500"
                  )}
                />
              </div>
              <div>
                <Dialog.Title className="text-base font-semibold text-slate-900">
                  {title}
                </Dialog.Title>
                <Dialog.Description className="mt-1 text-sm text-slate-500">
                  {description}
                </Dialog.Description>
              </div>
            </div>
            <Dialog.Close
              className="shrink-0 rounded-lg p-1.5 text-slate-400 transition-colors hover:bg-slate-100 hover:text-slate-600"
              aria-label="Close"
            >
              <X className="h-4 w-4" />
            </Dialog.Close>
          </div>

          {/* Consequences list */}
          {consequences.length > 0 && (
            <div
              className={cn(
                "mx-6 mb-5 rounded-xl border p-4",
                isDanger
                  ? "border-red-100 bg-red-50"
                  : "border-amber-100 bg-amber-50"
              )}
            >
              <p className="mb-2 text-xs font-semibold uppercase tracking-wide text-slate-500">
                This action will
              </p>
              <ul className="space-y-1.5">
                {consequences.map((c, i) => (
                  <li key={i} className="flex items-start gap-2">
                    <span
                      className={cn(
                        "mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full",
                        isDanger ? "bg-red-400" : "bg-amber-400"
                      )}
                    />
                    <span className="text-sm text-slate-700">{c}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}

          {/* Actions */}
          <div className="flex items-center justify-end gap-3 border-t border-slate-100 px-6 py-4">
            <Dialog.Close asChild>
              <button
                disabled={isConfirming}
                className="rounded-xl border border-slate-200 px-4 py-2 text-sm font-medium text-slate-700 transition-colors hover:bg-slate-50 disabled:opacity-50"
              >
                {cancelLabel}
              </button>
            </Dialog.Close>

            <button
              onClick={onConfirm}
              disabled={isConfirming}
              className={cn(
                "inline-flex items-center gap-2 rounded-xl px-4 py-2 text-sm font-semibold text-white transition-colors",
                "disabled:cursor-not-allowed disabled:opacity-60",
                isDanger
                  ? "bg-red-600 hover:bg-red-700 active:bg-red-800"
                  : "bg-amber-500 hover:bg-amber-600 active:bg-amber-700"
              )}
            >
              {isConfirming ? (
                <>
                  <svg
                    className="h-4 w-4 animate-spin"
                    viewBox="0 0 24 24"
                    fill="none"
                  >
                    <circle
                      className="opacity-25"
                      cx="12"
                      cy="12"
                      r="10"
                      stroke="currentColor"
                      strokeWidth="4"
                    />
                    <path
                      className="opacity-75"
                      fill="currentColor"
                      d="M4 12a8 8 0 018-8v8z"
                    />
                  </svg>
                  Processing…
                </>
              ) : (
                confirmLabel
              )}
            </button>
          </div>
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  );
}
