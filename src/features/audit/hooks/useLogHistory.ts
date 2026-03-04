import { useQuery } from "@tanstack/react-query";
import { logsApi } from "@/api/endpoints/logs";

export function useLogHistory(logId: number | null) {
  return useQuery({
    queryKey: ["audit", "history", logId],
    queryFn: () => logsApi.getHistory(logId!),
    enabled: logId !== null,
    staleTime: 10_000,
  });
}
