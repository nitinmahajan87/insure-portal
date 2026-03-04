import { useMutation } from "@tanstack/react-query";
import { deliveryApi } from "@/api/endpoints/delivery";
import { downloadBlob } from "@/lib/downloadBlob";
import { format } from "date-fns";

/**
 * Fetches the preview report Blob and immediately triggers a browser download.
 * This is a mutation (not a query) because it is user-initiated and should not
 * run automatically or be cached.
 */
export function usePreviewReport() {
  return useMutation({
    mutationFn: () => deliveryApi.previewReport(),
    onSuccess: (blob) => {
      const datestamp = format(new Date(), "yyyy-MM-dd");
      downloadBlob(blob, `preview_report_${datestamp}.xlsx`);
    },
  });
}
