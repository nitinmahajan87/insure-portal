import { XCircle, CheckCircle2, Activity, RefreshCw } from "lucide-react";
import { TopBar } from "@/components/layout/TopBar";
import { StatsCard } from "./components/StatsCard";
import { SyncStatusChart } from "./components/SyncStatusChart";
import { RecentFailures } from "./components/RecentFailures";
import { RecentTransactions } from "./components/RecentTransactions";
import { useDashboardStats } from "./hooks/useDashboardStats";
import { useNavigate } from "@tanstack/react-router";

export function DashboardPage() {
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
  } = useDashboardStats();

  const loadedValue = (n: number) => (isLoading ? null : n);

  return (
    <div className="flex h-full flex-col">
      <TopBar
        title="Dashboard"
        subtitle="Live overview of your insurance sync pipeline"
      />

      <div className="flex-1 overflow-y-auto p-6">
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

        {/* ── KPI Cards row ─────────────────────────────────────────────── */}
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

        {/* ── Main content: chart + recent failures ─────────────────────── */}
        <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
          {/* Donut chart — 1 col */}
          <div className="lg:col-span-1">
            <SyncStatusChart
              data={chartData}
              total={isLoading ? null : total}
              healthPct={isLoading ? null : healthPct}
              isLoading={isLoading}
            />
          </div>

          {/* Recent failures — 2 cols */}
          <div className="lg:col-span-2">
            <RecentFailures items={recentErrors} isLoading={isLoading} />
          </div>
        </div>

        {/* ── Recent transactions ───────────────────────────────────────── */}
        <div className="mt-6">
          <RecentTransactions items={recentTransactions} isLoading={isLoading} />
        </div>
      </div>
    </div>
  );
}
