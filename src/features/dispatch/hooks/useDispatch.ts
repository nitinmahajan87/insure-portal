import { useMutation, useQueryClient } from "@tanstack/react-query";
import { deliveryApi } from "@/api/endpoints/delivery";

/**
 * Dispatches the pending queue and marks all records COMPLETED.
 * On settle: invalidates history, dashboard stats, and audit caches.
 * corporateId: required for broker-scoped keys, omit for corporate-scoped keys.
 */
export function useDispatch(corporateId?: string) {
  const qc = useQueryClient();

  return useMutation({
    mutationFn: () => deliveryApi.generateReport(corporateId),

    onSettled: () => {
      void qc.invalidateQueries({ queryKey: ["dispatch"] });
      void qc.invalidateQueries({ queryKey: ["dashboard"] });
      void qc.invalidateQueries({ queryKey: ["audit"] });
      void qc.invalidateQueries({ queryKey: ["broker", "corporates"] });
    },
  });
}
