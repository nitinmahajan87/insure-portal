import { useMutation } from "@tanstack/react-query";
import { deliveryApi } from "@/api/endpoints/delivery";

/**
 * Fetches a fresh pre-signed URL for the preview report and opens it in a
 * new tab so the browser handles the download natively.
 * Mutation (not a query) — user-initiated, not auto-fetched or cached.
 */
export function usePreviewReport() {
  return useMutation({
    mutationFn: () => deliveryApi.previewReport(),
    onSuccess: (url) => {
      if (url) window.open(url, "_blank", "noopener,noreferrer");
    },
  });
}
