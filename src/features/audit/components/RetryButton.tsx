import { RefreshCw } from "lucide-react";
import { cn } from "@/lib/utils";
import { useRetryLog } from "../hooks/useRetryLog";
import { getErrorMessage } from "@/lib/errorParser";

interface RetryButtonProps {
  logId: number;
  /** Called after a successful retry so the drawer can close */
  onSuccess?: () => void;
  className?: string;
}

export function RetryButton({ logId, onSuccess, className }: RetryButtonProps) {
  const { mutate, isPending, isError, error, reset } = useRetryLog();

  function handleClick() {
    mutate(logId, {
      onSuccess: () => {
        onSuccess?.();
      },
    });
  }

  const { description } = isError ? getErrorMessage(error) : { description: "" };

  return (
    <div className={cn("flex flex-col items-start gap-1", className)}>
      <button
        onClick={handleClick}
        disabled={isPending}
        onMouseEnter={isError ? reset : undefined}
        className={cn(
          "inline-flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-xs font-medium transition-colors",
          "bg-amber-500 text-white hover:bg-amber-600 active:bg-amber-700",
          "disabled:cursor-not-allowed disabled:opacity-60",
          isError && "bg-red-500 hover:bg-red-600"
        )}
        aria-busy={isPending}
        aria-label={isPending ? "Retrying…" : "Retry this sync"}
      >
        <RefreshCw className={cn("h-3.5 w-3.5", isPending && "animate-spin")} />
        {isPending ? "Retrying…" : isError ? "Failed — hover to reset" : "Retry"}
      </button>

      {isError && (
        <p className="max-w-[200px] text-xs text-red-600">{description}</p>
      )}
    </div>
  );
}
