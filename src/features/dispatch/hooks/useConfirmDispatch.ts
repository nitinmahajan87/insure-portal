import { useMutation, useQueryClient } from "@tanstack/react-query";
import { deliveryApi } from "@/api/endpoints/delivery";

/**
 * Broker confirms that a generated report file has been physically sent to the insurer.
 * Transitions BROKER_REVIEW_PENDING → COMPLETED_OFFLINE and sets policy_status = PENDING_ISSUANCE.
 *
 * corporateId: the corporate whose records are being confirmed.
 * Pass filePath (the S3 key) to scope confirmation to one file; omit to confirm all pending.
 */
export function useConfirmDispatch(corporateId: string) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (filePath?: string) => deliveryApi.confirmDispatch(corporateId, filePath),
    onSettled: () => {
      void queryClient.invalidateQueries({ queryKey: ["dispatch", "history"] });
      void queryClient.invalidateQueries({ queryKey: ["broker", "corporates"] });
      void queryClient.invalidateQueries({ queryKey: ["audit"] });
    },
  });
}
