import { useMutation, useQueryClient } from "@tanstack/react-query";
import { portalApi } from "@/api/endpoints/portal";
import type { PortalRemoveForm, PortalRemovePayload } from "@/api/types/portal";

export function useRemoveEmployee() {
  const qc = useQueryClient();

  return useMutation({
    mutationFn: (payload: PortalRemoveForm) => {
      const { name, ...rest } = payload;
      // Send name to backend only on force-remove (used to build ghost record)
      const backendPayload: PortalRemovePayload = payload.force
        ? { ...rest, name }
        : rest;
      return portalApi.removeEmployee(backendPayload);
    },
    onSuccess: () => {
      void qc.invalidateQueries({ queryKey: ["dashboard"] });
      void qc.invalidateQueries({ queryKey: ["audit"] });
    },
  });
}
