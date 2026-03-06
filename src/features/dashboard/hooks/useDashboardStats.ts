import { useQueries } from "@tanstack/react-query";
import { logsApi } from "@/api/endpoints/logs";

const RECENT_SIZE = 5;
const REFRESH_INTERVAL = 30_000; // 30s — dashboard is a live pipeline monitor

/**
 * Composes two paginated queries into a unified dashboard stats object.
 * Both requests use page=1, size=5 — we only need totals + a handful of recent items.
 * Runs in parallel; each result is independent.
 */
export function useDashboardStats(corporateId?: string) {
  const [errorsQuery, transactionsQuery] = useQueries({
    queries: [
      {
        queryKey: ["dashboard", "errors", corporateId ?? "self"],
        queryFn: () => logsApi.getErrors(1, RECENT_SIZE, corporateId),
        refetchInterval: REFRESH_INTERVAL,
        staleTime: REFRESH_INTERVAL,
      },
      {
        queryKey: ["dashboard", "transactions", corporateId ?? "self"],
        queryFn: () => logsApi.getTransactions(1, RECENT_SIZE, corporateId),
        refetchInterval: REFRESH_INTERVAL,
        staleTime: REFRESH_INTERVAL,
      },
    ],
  });

  const failedCount = errorsQuery.data?.total ?? 0;
  const successCount = transactionsQuery.data?.total ?? 0;
  const total = failedCount + successCount;
  const healthPct = total > 0 ? Math.round((successCount / total) * 100) : null;

  return {
    // Loading / error states
    isLoading: errorsQuery.isLoading || transactionsQuery.isLoading,
    isError: errorsQuery.isError || transactionsQuery.isError,
    isFetching: errorsQuery.isFetching || transactionsQuery.isFetching,

    // KPI numbers
    failedCount,
    successCount,
    total,
    healthPct, // null until first load

    // Recent items
    recentErrors: errorsQuery.data?.items ?? [],
    recentTransactions: transactionsQuery.data?.items ?? [],

    // Chart data — Recharts PieChart consumable
    chartData: [
      { name: "Successful", value: successCount, color: "#22c55e" },
      { name: "Failed",     value: failedCount,  color: "#ef4444" },
    ],
  };
}
