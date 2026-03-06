import { useQuery } from "@tanstack/react-query";
import { logsApi } from "@/api/endpoints/logs";

export function useLogHistory(logId: number | null, corporateId?: string) {
  return useQuery({
    queryKey: ["audit", "history", logId, corporateId ?? "self"],
    queryFn: () => logsApi.getHistory(logId!, corporateId),
    enabled: logId !== null,
    staleTime: 10_000,
  });
}
