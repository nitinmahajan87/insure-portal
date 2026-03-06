import { useMutation, useQueryClient } from "@tanstack/react-query";
import { insurerApi } from "@/api/endpoints/insurer";

/**
 * Uploads the insurer's response file and applies the policy decisions in bulk.
 * On success: invalidates audit and dashboard caches so updated statuses are reflected.
 */
export function useInsurerResponseUpload(corporateId: string) {
  const qc = useQueryClient();

  return useMutation({
    mutationFn: ({ file, onProgress }: { file: File; onProgress?: (p: number) => void }) =>
      insurerApi.uploadResponseFile(file, corporateId, onProgress),

    onSettled: () => {
      // Audit log: policy_status changes are visible immediately
      void qc.invalidateQueries({ queryKey: ["audit"] });
      // Dashboard KPIs: issued / rejected counts update
      void qc.invalidateQueries({ queryKey: ["dashboard"] });
      // Broker corporate list: pending_syncs count may decrease
      void qc.invalidateQueries({ queryKey: ["broker", "corporates"] });
    },
  });
}
