import { useMutation, useQueryClient } from "@tanstack/react-query";
import { deliveryApi } from "@/api/endpoints/delivery";

/**
 * Dispatches the pending queue and marks all records COMPLETED.
 * On settle: invalidates history, dashboard stats, and audit caches.
 */
export function useDispatch() {
  const qc = useQueryClient();

  return useMutation({
    mutationFn: () => deliveryApi.generateReport(),

    onSettled: () => {
      // History tab should show the new file immediately
      void qc.invalidateQueries({ queryKey: ["dispatch", "history"] });
      // Dashboard KPI cards refresh (completed count changes)
      void qc.invalidateQueries({ queryKey: ["dashboard"] });
      // Audit log shows updated COMPLETED statuses
      void qc.invalidateQueries({ queryKey: ["audit"] });
    },
  });
}
