import { useQuery } from "@tanstack/react-query";
import { brokerApi } from "@/api/endpoints/broker";

/**
 * Fetches all corporates under the broker's portfolio.
 * Only called when scope === "broker" — corporate-scoped keys would get 403.
 */
export function useBrokerCorporates() {
  return useQuery({
    queryKey: ["broker", "corporates"],
    queryFn: () => brokerApi.getCorporates(),
    staleTime: 0,
  });
}
