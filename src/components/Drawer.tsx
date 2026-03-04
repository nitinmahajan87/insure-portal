/**
 * Drawer — a right-side slide-over panel built on @radix-ui/react-dialog.
 * Semantically accessible: focus trap, ESC to close, aria-labelledby.
 */
import * as Dialog from "@radix-ui/react-dialog";
import { X } from "lucide-react";
import { cn } from "@/lib/utils";

interface DrawerProps {
  open: boolean;
  onClose: () => void;
  title: string;
  description?: string;
  children: React.ReactNode;
  /** Width class — default is "max-w-md" */
  width?: string;
}

export function Drawer({
  open,
  onClose,
  title,
  description,
  children,
  width = "max-w-md",
}: DrawerProps) {
  return (
    <Dialog.Root open={open} onOpenChange={(o) => !o && onClose()}>
      <Dialog.Portal>
        {/* Overlay */}
        <Dialog.Overlay
          className={cn(
            "fixed inset-0 z-40 bg-black/30 backdrop-blur-[1px]",
            "data-[state=open]:animate-in data-[state=closed]:animate-out",
            "data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0"
          )}
        />

        {/* Panel */}
        <Dialog.Content
          className={cn(
            "fixed right-0 top-0 z-50 flex h-full w-full flex-col bg-white shadow-xl",
            width,
            "data-[state=open]:animate-in data-[state=closed]:animate-out",
            "data-[state=closed]:slide-out-to-right data-[state=open]:slide-in-from-right",
            "duration-300 ease-in-out"
          )}
        >
          {/* Header */}
          <div className="flex items-start justify-between border-b border-slate-200 px-6 py-5">
            <div className="mr-4 min-w-0">
              <Dialog.Title className="truncate text-base font-semibold text-slate-900">
                {title}
              </Dialog.Title>
              {description && (
                <Dialog.Description className="mt-0.5 text-xs text-slate-500">
                  {description}
                </Dialog.Description>
              )}
            </div>
            <Dialog.Close
              className="shrink-0 rounded-lg p-1.5 text-slate-400 transition-colors hover:bg-slate-100 hover:text-slate-600"
              aria-label="Close"
            >
              <X className="h-4 w-4" />
            </Dialog.Close>
          </div>

          {/* Body — scrollable */}
          <div className="flex-1 overflow-y-auto px-6 py-5">{children}</div>
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  );
}
