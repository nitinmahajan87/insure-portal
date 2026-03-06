import { useState } from "react";
import * as Tabs from "@radix-ui/react-tabs";
import { XCircle, CheckCircle2, ArrowLeft, Building2, Loader2, AlertTriangle } from "lucide-react";
import { TopBar } from "@/components/layout/TopBar";
import { cn } from "@/lib/utils";
import { useAuthStore } from "@/store/authStore";
import { useBrokerCorporates } from "@/features/dispatch/hooks/useBrokerCorporates";
import { ErrorsTable } from "./components/ErrorsTable";
import { TransactionsTable } from "./components/TransactionsTable";
import type { CorporateListItem } from "@/api/endpoints/broker";

type Tab = "errors" | "transactions";

const TABS: { id: Tab; label: string; Icon: React.ElementType; description: string }[] = [
  {
    id: "errors",
    label: "Errors",
    Icon: XCircle,
    description: "Failed syncs that need attention",
  },
  {
    id: "transactions",
    label: "Transactions",
    Icon: CheckCircle2,
    description: "Successfully processed syncs",
  },
];

// ── Shared audit tabs — used for both HR and broker (with corporateId) ────────

function AuditTabs({ corporateId }: { corporateId?: string }) {
  const [activeTab, setActiveTab] = useState<Tab>("errors");

  return (
    <Tabs.Root
      value={activeTab}
      onValueChange={(v) => setActiveTab(v as Tab)}
      className="flex h-full flex-col"
    >
      <Tabs.List className="mb-6 flex gap-1 rounded-xl border border-slate-200 bg-slate-50 p-1">
        {TABS.map(({ id, label, Icon, description }) => (
          <Tabs.Trigger
            key={id}
            value={id}
            className={cn(
              "group flex flex-1 items-center gap-2 rounded-lg px-4 py-2.5 text-sm transition-all",
              "data-[state=active]:bg-white data-[state=active]:shadow-sm",
              "data-[state=inactive]:text-slate-500 data-[state=inactive]:hover:text-slate-700",
              "data-[state=active]:text-slate-900"
            )}
          >
            <Icon
              className={cn(
                "h-4 w-4 shrink-0 transition-colors",
                id === "errors"
                  ? "group-data-[state=active]:text-red-500"
                  : "group-data-[state=active]:text-green-500",
                "group-data-[state=inactive]:text-slate-400"
              )}
            />
            <div className="min-w-0 text-left">
              <p className="font-medium leading-tight">{label}</p>
              <p className="hidden truncate text-xs text-slate-400 sm:block">{description}</p>
            </div>
          </Tabs.Trigger>
        ))}
      </Tabs.List>

      <Tabs.Content value="errors" className="flex-1">
        <ErrorsTable corporateId={corporateId} />
      </Tabs.Content>

      <Tabs.Content value="transactions" className="flex-1">
        <TransactionsTable corporateId={corporateId} />
      </Tabs.Content>
    </Tabs.Root>
  );
}

// ── Broker audit view — corporate selector then scoped audit tabs ─────────────

function BrokerAuditView() {
  const [selectedCorp, setSelectedCorp] = useState<CorporateListItem | null>(null);
  const { data, isLoading, isError } = useBrokerCorporates();

  if (selectedCorp) {
    return (
      <div className="space-y-5">
        <div className="flex items-center gap-3">
          <button
            onClick={() => setSelectedCorp(null)}
            className="inline-flex items-center gap-1.5 rounded-lg border border-slate-200 px-3 py-1.5 text-sm text-slate-600 transition-colors hover:bg-slate-50"
          >
            <ArrowLeft className="h-3.5 w-3.5" />
            All Corporates
          </button>
          <div className="flex items-center gap-2">
            <Building2 className="h-4 w-4 text-amber-500" />
            <p className="font-semibold text-slate-800">{selectedCorp.name}</p>
          </div>
        </div>
        <AuditTabs corporateId={selectedCorp.id} />
      </div>
    );
  }

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
      <p className="text-sm text-slate-500">Select a corporate to view its audit log.</p>
      {corporates.map((corp) => (
        <div
          key={corp.id}
          className="flex items-center justify-between rounded-2xl border border-slate-200 bg-white p-5 transition-shadow hover:shadow-sm"
        >
          <div className="flex items-center gap-4">
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-amber-50">
              <Building2 className="h-5 w-5 text-amber-600" />
            </div>
            <div>
              <p className="font-semibold text-slate-800">{corp.name}</p>
              <p className="mt-0.5 text-xs text-slate-400">{corp.insurer_provider}</p>
            </div>
          </div>
          <button
            onClick={() => setSelectedCorp(corp)}
            className="inline-flex items-center gap-2 rounded-xl bg-amber-500 px-4 py-2 text-sm font-semibold text-white transition-colors hover:bg-amber-600"
          >
            View Audit Log
          </button>
        </div>
      ))}
    </div>
  );
}

// ── Main page ─────────────────────────────────────────────────────────────────

export function AuditPage() {
  const { scope } = useAuthStore();
  const isBroker = scope === "broker";

  return (
    <div className="flex h-full flex-col">
      <TopBar
        title="Audit Log"
        subtitle="Full transparency on every sync event and state transition"
      />

      <div className="flex-1 overflow-y-auto p-6">
        {isBroker ? <BrokerAuditView /> : <AuditTabs />}
      </div>
    </div>
  );
}
