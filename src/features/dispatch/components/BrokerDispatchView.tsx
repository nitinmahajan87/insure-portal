import { useState } from "react";
import * as Tabs from "@radix-ui/react-tabs";
import {
  ArrowLeft,
  Building2,
  Send,
  FolderOpen,
  Loader2,
  AlertTriangle,
  Clock,
  Wifi,
  WifiOff,
  FileOutput,
  FileCheck,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { useBrokerCorporates } from "../hooks/useBrokerCorporates";
import { PendingQueuePanel } from "./PendingQueuePanel";
import { FileHistoryTable } from "./FileHistoryTable";
import { InsurerResponseUpload } from "./InsurerResponseUpload";
import type { CorporateListItem } from "@/api/endpoints/broker";

type Tab = "queue" | "history" | "response";

// ── Delivery channel badge ────────────────────────────────────────────────────

function ChannelBadge({ channel }: { channel: CorporateListItem["delivery_channel"] }) {
  const map = {
    offline:  { label: "Offline",  cls: "bg-amber-50 text-amber-700",  Icon: WifiOff  },
    webhook:  { label: "Webhook",  cls: "bg-blue-50 text-blue-700",    Icon: Wifi     },
    both:     { label: "Both",     cls: "bg-purple-50 text-purple-700", Icon: Wifi     },
  } as const;
  const { label, cls, Icon } = map[channel];
  return (
    <span className={cn("inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-xs font-medium", cls)}>
      <Icon className="h-3 w-3" />
      {label}
    </span>
  );
}

// ── Corporate selector card ───────────────────────────────────────────────────

function CorporateCard({
  corp,
  onSelect,
}: {
  corp: CorporateListItem;
  onSelect: () => void;
}) {
  return (
    <div className="flex items-center justify-between rounded-2xl border border-slate-200 bg-white p-5 transition-shadow hover:shadow-sm">
      <div className="flex items-center gap-4">
        <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-amber-50">
          <Building2 className="h-5 w-5 text-amber-600" />
        </div>
        <div>
          <p className="font-semibold text-slate-800">{corp.name}</p>
          <div className="mt-1 flex items-center gap-2">
            <ChannelBadge channel={corp.delivery_channel} />
            <span className="text-xs text-slate-400">{corp.insurer_provider}</span>
          </div>
        </div>
      </div>

      <div className="flex items-center gap-4">
        {/* Pending syncs pill */}
        <div className="text-right">
          <p className="text-lg font-bold text-slate-800">{corp.pending_syncs}</p>
          <p className="text-xs text-slate-400">pending</p>
        </div>

        <button
          onClick={onSelect}
          disabled={corp.delivery_channel === "webhook"}
          className={cn(
            "inline-flex items-center gap-2 rounded-xl px-4 py-2 text-sm font-semibold transition-colors",
            corp.delivery_channel === "webhook"
              ? "cursor-not-allowed bg-slate-100 text-slate-400"
              : "bg-amber-500 text-white hover:bg-amber-600 active:bg-amber-700"
          )}
          title={
            corp.delivery_channel === "webhook"
              ? "Webhook-only corporate — no offline queue to dispatch"
              : undefined
          }
        >
          <FileOutput className="h-4 w-4" />
          Manage Queue
        </button>
      </div>
    </div>
  );
}

// ── Corporate list (selector) ─────────────────────────────────────────────────

function CorporateSelector({
  onSelect,
}: {
  onSelect: (corp: CorporateListItem) => void;
}) {
  const { data, isLoading, isError } = useBrokerCorporates();

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-20">
        <Loader2 className="h-6 w-6 animate-spin text-amber-500" />
      </div>
    );
  }

  if (isError) {
    return (
      <div className="flex flex-col items-center gap-3 py-16 text-center">
        <AlertTriangle className="h-8 w-8 text-red-400" />
        <p className="text-sm font-medium text-slate-700">Could not load corporates</p>
        <p className="text-xs text-slate-400">Check your broker API key and try again.</p>
      </div>
    );
  }

  const corporates = data ?? [];

  if (corporates.length === 0) {
    return (
      <div className="flex flex-col items-center gap-3 rounded-2xl border border-dashed border-slate-200 py-16">
        <Building2 className="h-8 w-8 text-slate-300" />
        <p className="text-sm font-medium text-slate-500">No corporates in your portfolio</p>
      </div>
    );
  }

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <p className="text-sm text-slate-500">
          Select a corporate to manage its dispatch queue.
        </p>
        <span className="inline-flex items-center gap-1.5 rounded-full bg-slate-100 px-3 py-1 text-xs font-semibold text-slate-600">
          <Clock className="h-3.5 w-3.5" />
          {corporates.reduce((s, c) => s + c.pending_syncs, 0).toLocaleString()} total pending
        </span>
      </div>

      {corporates.map((corp) => (
        <CorporateCard key={corp.id} corp={corp} onSelect={() => onSelect(corp)} />
      ))}
    </div>
  );
}

// ── Per-corporate dispatch view ───────────────────────────────────────────────

function CorporateDispatchPanel({
  corp,
  onBack,
}: {
  corp: CorporateListItem;
  onBack: () => void;
}) {
  const [activeTab, setActiveTab] = useState<Tab>("queue");

  return (
    <div className="space-y-5">
      {/* Header with back nav */}
      <div className="flex items-center gap-3">
        <button
          onClick={onBack}
          className="inline-flex items-center gap-1.5 rounded-lg border border-slate-200 px-3 py-1.5 text-sm text-slate-600 transition-colors hover:bg-slate-50"
        >
          <ArrowLeft className="h-3.5 w-3.5" />
          All Corporates
        </button>
        <div className="flex items-center gap-2">
          <Building2 className="h-4 w-4 text-amber-500" />
          <p className="font-semibold text-slate-800">{corp.name}</p>
          <ChannelBadge channel={corp.delivery_channel} />
        </div>
      </div>

      {/* Tabs: Queue | History | Upload Response */}
      <Tabs.Root
        value={activeTab}
        onValueChange={(v) => setActiveTab(v as Tab)}
        className="flex flex-col gap-5"
      >
        <Tabs.List className="flex gap-1 rounded-xl border border-slate-200 bg-slate-50 p-1">
          {[
            { id: "queue"    as const, label: "Pending Queue",   Icon: Send,      activeColor: "text-amber-500"   },
            { id: "history"  as const, label: "File History",    Icon: FolderOpen, activeColor: "text-slate-600"  },
            { id: "response" as const, label: "Upload Response", Icon: FileCheck,  activeColor: "text-emerald-600" },
          ].map(({ id, label, Icon, activeColor }) => (
            <Tabs.Trigger
              key={id}
              value={id}
              className={cn(
                "group flex flex-1 items-center gap-2 rounded-lg px-4 py-2.5 text-sm transition-all",
                "data-[state=active]:bg-white data-[state=active]:shadow-sm data-[state=active]:text-slate-900",
                "data-[state=inactive]:text-slate-500 data-[state=inactive]:hover:text-slate-700"
              )}
            >
              <Icon className={cn(
                "h-4 w-4 shrink-0",
                `group-data-[state=active]:${activeColor}`,
                "group-data-[state=inactive]:text-slate-400"
              )} />
              {label}
            </Tabs.Trigger>
          ))}
        </Tabs.List>

        <Tabs.Content value="queue">
          <PendingQueuePanel corporateId={corp.id} />
        </Tabs.Content>

        <Tabs.Content value="history">
          <FileHistoryTable corporateId={corp.id} />
        </Tabs.Content>

        <Tabs.Content value="response">
          <div className="rounded-2xl border border-slate-200 bg-white p-6">
            <div className="mb-5 border-b border-slate-100 pb-4">
              <h3 className="text-base font-semibold text-slate-800">
                Upload Insurer Response
              </h3>
              <p className="mt-0.5 text-sm text-slate-400">
                Apply the policy decisions from the file the insurer sent back to you.
              </p>
            </div>
            <InsurerResponseUpload corporateId={corp.id} />
          </div>
        </Tabs.Content>
      </Tabs.Root>
    </div>
  );
}

// ── Public export: top-level broker dispatch view ────────────────────────────

export function BrokerDispatchView() {
  const [selectedCorp, setSelectedCorp] = useState<CorporateListItem | null>(null);

  if (selectedCorp) {
    return (
      <CorporateDispatchPanel
        corp={selectedCorp}
        onBack={() => setSelectedCorp(null)}
      />
    );
  }

  return <CorporateSelector onSelect={setSelectedCorp} />;
}
