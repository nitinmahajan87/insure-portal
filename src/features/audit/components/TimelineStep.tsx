import { format } from "date-fns";
import { User, Cpu, Building2, RefreshCw, HelpCircle } from "lucide-react";
import { cn } from "@/lib/utils";
import { SYNC_STATUS_CONFIG } from "@/lib/statusColors";
import type { TimelineEvent } from "@/api/types/syncLog";

interface TimelineStepProps {
  event: TimelineEvent;
  isLast: boolean;
}

const ACTOR_CONFIG: Record<string, { label: string; Icon: React.ElementType; classes: string }> = {
  HR_USER:             { label: "HR User",       Icon: User,        classes: "bg-slate-100 text-slate-600" },
  HR_USER_MANUAL_RETRY:{ label: "HR User",       Icon: User,        classes: "bg-slate-100 text-slate-600" },
  CELERY_WORKER:       { label: "System",         Icon: Cpu,         classes: "bg-blue-50 text-blue-600" },
  INSURER_CALLBACK:    { label: "Insurer",        Icon: Building2,   classes: "bg-emerald-50 text-emerald-700" },
  RECONCILIATION_TASK: { label: "Reconciliation", Icon: RefreshCw,   classes: "bg-purple-50 text-purple-700" },
};

function getActorConfig(actor: string) {
  return (
    ACTOR_CONFIG[actor] ?? { label: actor, Icon: HelpCircle, classes: "bg-slate-100 text-slate-500" }
  );
}

export function TimelineStep({ event, isLast }: TimelineStepProps) {
  const statusConfig = SYNC_STATUS_CONFIG[event.status] ?? {
    label: event.status,
    classes: "bg-slate-100 text-slate-600",
    dotClass: "bg-slate-400",
  };
  const actor = getActorConfig(event.actor);
  const ActorIcon = actor.Icon;

  // Extract error message from details if present
  const detailsError =
    event.details &&
    typeof event.details["error"] === "string"
      ? event.details["error"]
      : typeof event.details?.["note"] === "string"
      ? undefined // notes are not errors
      : undefined;

  return (
    <div className="relative flex gap-4">
      {!isLast && (
        <div
          className="absolute left-[13px] top-7 h-[calc(100%-4px)] w-px bg-slate-200"
          aria-hidden
        />
      )}

      <div className="relative z-10 mt-1 flex h-7 w-7 shrink-0 items-center justify-center rounded-full border-2 border-white bg-white shadow-sm ring-1 ring-slate-200">
        <span className={cn("h-3 w-3 rounded-full", statusConfig.dotClass)} />
      </div>

      <div className="mb-5 min-w-0 flex-1">
        <div className="flex flex-wrap items-center gap-2">
          <span className={cn("rounded-full px-2 py-0.5 text-xs font-medium", statusConfig.classes)}>
            {statusConfig.label}
          </span>
          <time className="text-xs text-slate-400" dateTime={event.timestamp}>
            {format(new Date(event.timestamp), "MMM d, yyyy · h:mm:ss a")}
          </time>
        </div>

        <div className={cn("mt-1.5 inline-flex items-center gap-1 rounded-md px-2 py-0.5 text-xs", actor.classes)}>
          <ActorIcon className="h-3 w-3" />
          {actor.label}
        </div>

        {detailsError && (
          <div className="mt-2 flex items-start gap-1.5 rounded-lg border border-red-100 bg-red-50 px-3 py-2">
            <span className="mt-0.5 h-1.5 w-1.5 shrink-0 rounded-full bg-red-400" aria-hidden />
            <p className="break-words text-xs text-red-700">{detailsError}</p>
          </div>
        )}
      </div>
    </div>
  );
}
