import { useQuery } from "@tanstack/react-query";
import { logsApi } from "@/api/endpoints/logs";

export function useEmployeeHistory(employeeCode: string | null) {
  return useQuery({
    queryKey: ["employeeHistory", employeeCode],
    queryFn: () => logsApi.getEmployeeHistory(employeeCode!),
    enabled: !!employeeCode,
    staleTime: 30_000,
  });
}
