import { useMutation, useQueryClient } from "@tanstack/react-query";
import { streamsApi } from "@/api/endpoints/streams";
import type { RemoveEmployeeForm } from "@/api/types/employee";

export function useRemoveEmployee() {
  const qc = useQueryClient();

  return useMutation({
    mutationFn: (payload: RemoveEmployeeForm) => streamsApi.removeEmployee(payload),

    onSuccess: () => {
      void qc.invalidateQueries({ queryKey: ["dashboard"] });
      void qc.invalidateQueries({ queryKey: ["audit"] });
    },
  });
}
