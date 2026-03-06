import { useQuery } from "@tanstack/react-query";
import { deliveryApi } from "@/api/endpoints/delivery";

/**
 * corporateId: required for broker-scoped keys, omit for corporate-scoped keys.
 * Included in queryKey so each corporate gets its own isolated cache entry.
 */
export function useDeliveryHistory(corporateId?: string) {
  return useQuery({
    queryKey: ["dispatch", "history", corporateId ?? "self"],
    queryFn: () => deliveryApi.getHistory(corporateId),
    staleTime: 0,
  });
}
