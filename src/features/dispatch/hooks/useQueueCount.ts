import { useQuery } from "@tanstack/react-query";
import { deliveryApi } from "@/api/endpoints/delivery";

/**
 * Returns the dispatchable queue count for the PendingQueuePanel.
 * - pending_count:        PENDING_OFFLINE / PENDING_BOTH — ready to generate report
 * - review_pending_count: BROKER_REVIEW_PENDING — report generated, broker must Confirm Sent
 *
 * corporateId is required for broker-scoped keys; omit for corporate-scoped keys.
 */
export function useQueueCount(corporateId?: string) {
  return useQuery({
    queryKey: ["dispatch", "queue-count", corporateId ?? "self"],
    queryFn: () => deliveryApi.getQueueCount(corporateId),
    refetchInterval: 10_000,
    staleTime: 0,
  });
}
