import { useQuery } from "@tanstack/react-query";
import { deliveryApi } from "@/api/endpoints/delivery";

export function useDeliveryHistory() {
  return useQuery({
    queryKey: ["dispatch", "history"],
    queryFn: () => deliveryApi.getHistory(),
    staleTime: 30_000,
  });
}
