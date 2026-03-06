import { useQuery } from "@tanstack/react-query";
import { logsApi } from "@/api/endpoints/logs";

export function useEmployeeHistory(employeeCode: string | null, corporateId?: string) {
  return useQuery({
    queryKey: ["employeeHistory", employeeCode, corporateId ?? "self"],
    queryFn: () => logsApi.getEmployeeHistory(employeeCode!, corporateId),
    enabled: !!employeeCode,
    staleTime: 30_000,
  });
}
