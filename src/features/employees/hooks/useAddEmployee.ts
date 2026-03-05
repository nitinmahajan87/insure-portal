import { useMutation, useQueryClient } from "@tanstack/react-query";
import { portalApi } from "@/api/endpoints/portal";
import type { PortalAddForm } from "@/api/types/portal";

export function useAddEmployee() {
  const qc = useQueryClient();

  return useMutation({
    mutationFn: (payload: PortalAddForm) => portalApi.addEmployee(payload),
    onSuccess: () => {
      void qc.invalidateQueries({ queryKey: ["dashboard"] });
      void qc.invalidateQueries({ queryKey: ["audit"] });
    },
  });
}
