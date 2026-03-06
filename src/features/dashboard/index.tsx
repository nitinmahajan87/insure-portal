import { useState } from "react";
import { XCircle, CheckCircle2, Activity, RefreshCw, ArrowLeft, Building2, Loader2, AlertTriangle } from "lucide-react";
import { TopBar } from "@/components/layout/TopBar";
import { StatsCard } from "./components/StatsCard";
import { SyncStatusChart } from "./components/SyncStatusChart";
import { RecentFailures } from "./components/RecentFailures";
import { RecentTransactions } from "./components/RecentTransactions";
import { useDashboardStats } from "./hooks/useDashboardStats";
import { useAuthStore } from "@/store/authStore";
import { useBrokerCorporates } from "@/features/dispatch/hooks/useBrokerCorporates";
import { useNavigate } from "@tanstack/react-router";
import type { CorporateListItem } from "@/api/endpoints/broker";

// -- Dashboard content (shared by HR and broker-with-selected-corporate) ------

function DashboardContent({ corporateId }: { corporateId?: string }) {
  const navigate = useNavigate();
  const {
    isLoading,
    isFetching,
    failedCount,
    successCount,
    total,
    healthPct,
    recentErrors,
    recentTransactions,
    chartData,
  } = useDashboardStats(corporateId);

  const loadedValue = (n: number) => (isLoading ? null : n);

  return (
    <>
      {/* Live indicator */}
      <div className="mb-5 flex items-center gap-2">
        {isFetching ? (
          <>
            <RefreshCw className="h-3.5 w-3.5 animate-spin text-slate-400" />
            <span className="text-xs text-slate-400">Refreshing…</span>
          </>
        ) : (
          <>
            <span className="relative flex h-2 w-2">
              <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-green-400 opacity-75" />
              <span className="relative inline-flex h-2 w-2 rounded-full bg-green-500" />
            </span>
            <span className="text-xs text-slate-400">Live · updates every 30s</span>
          </>
        )}
      </div>

      {/* KPI Cards row */}
      <div className="mb-6 grid grid-cols-2 gap-4 lg:grid-cols-4">
        <StatsCard
          label="Failed Syncs"
          value={loadedValue(failedCount)}
          icon={XCircle}
          hint="Need immediate attention"
          variant={failedCount > 0 ? "danger" : "success"}
          onClick={() => void navigate({ to: "/audit" })}
        />
        <StatsCard
          label="Successful Syncs"
          value={loadedValue(successCount)}
          icon={CheckCircle2}
          hint="Confirmed coverage"
          variant="success"
          onClick={() => void navigate({ to: "/audit" })}
        />
        <StatsCard
          label="Total Processed"
          value={loadedValue(total)}
          icon={Activity}
          hint="All-time sync records"
          variant="default"
        />
        <StatsCard
          label="Success Rate"
          value={isLoading ? null : healthPct ?? 0}
          icon={Activity}
          hint={
            healthPct !== null
              ? healthPct >= 90
                ? "Pipeline healthy"
                : healthPct >= 70
                ? "Needs monitoring"
                : "Action required"
              : undefined
          }
          variant={
            healthPct === null
              ? "default"
              : healthPct >= 90
              ? "success"
              : healthPct >= 70
              ? "warning"
              : "danger"
          }
        />
      </div>

      {/* Main content: chart + recent failures */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        <div className="lg:col-span-1">
          <SyncStatusChart
            data={chartData}
            total={isLoading ? null : total}
            healthPct={isLoading ? null : healthPct}
            isLoading={isLoading}
          />
        </div>
        <div className="lg:col-span-2">
          <RecentFailures items={recentErrors} isLoading={isLoading} />
        </div>
      </div>

      {/* Recent transactions */}
      <div className="mt-6">
        <RecentTransactions items={recentTransactions} isLoading={isLoading} />
      </div>
    </>
  );
}

// -- Broker dashboard: corporate selector then scoped dashboard ---------------

function BrokerDashboardView() {
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
            <Building2 className="h-4 w-4 text-blue-500" />
            <p className="font-semibold text-slate-800">{selectedCorp.name}</p>
          </div>
        </div>
        <DashboardContent corporateId={selectedCorp.id} />
      </div>
    );
  }

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-20">
        <Loader2 className="h-6 w-6 animate-spin text-blue-500" />
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
      <p className="text-sm text-slate-500">Select a corporate to view its dashboard.</p>
      {corporates.map((corp) => (
        <div
          key={corp.id}
          className="flex items-center justify-between rounded-2xl border border-slate-200 bg-white p-5 transition-shadow hover:shadow-sm"
        >
          <div className="flex items-center gap-4">
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-blue-50">
              <Building2 className="h-5 w-5 text-blue-600" />
            </div>
            <div>
              <p className="font-semibold text-slate-800">{corp.name}</p>
              <div className="mt-0.5 flex items-center gap-3 text-xs text-slate-400">
                <span>{corp.insurer_provider}</span>
                <span>{corp.employee_count} employees</span>
                {corp.pending_syncs > 0 && (
                  <span className="font-medium text-amber-600">{corp.pending_syncs} pending</span>
                )}
              </div>
            </div>
          </div>
          <button
            onClick={() => setSelectedCorp(corp)}
            className="inline-flex items-center gap-2 rounded-xl bg-blue-600 px-4 py-2 text-sm font-semibold text-white transition-colors hover:bg-blue-700"
          >
            View Dashboard
          </button>
        </div>
      ))}
    </div>
  );
}

// -- Main page ----------------------------------------------------------------

export function DashboardPage() {
  const { scope } = useAuthStore();
  const isBroker = scope === "broker";

  return (
    <div className="flex h-full flex-col">
      <TopBar
        title="Dashboard"
        subtitle="Live overview of your insurance sync pipeline"
      />

      <div className="flex-1 overflow-y-auto p-6">
        {isBroker ? <BrokerDashboardView /> : <DashboardContent />}
      </div>
    </div>
  );
}
