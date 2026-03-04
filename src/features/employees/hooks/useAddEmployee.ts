import { useMutation, useQueryClient } from "@tanstack/react-query";
import { streamsApi } from "@/api/endpoints/streams";
import type { AddEmployeeForm } from "@/api/types/employee";

export function useAddEmployee() {
  const qc = useQueryClient();

  return useMutation({
    mutationFn: (payload: AddEmployeeForm) => streamsApi.addEmployee(payload),

    onSuccess: () => {
      // New employee is now pending — refresh dashboard KPIs and audit log
      void qc.invalidateQueries({ queryKey: ["dashboard"] });
      void qc.invalidateQueries({ queryKey: ["audit"] });
    },
  });
}
