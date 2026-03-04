import { useMutation, useQueryClient } from "@tanstack/react-query";
import { ingestionApi } from "@/api/endpoints/ingestion";

export type BatchMode = "additions" | "deletions";

interface UploadVariables {
  file: File;
  onProgress: (pct: number) => void;
}

/**
 * Wraps ingestion uploads as a TanStack mutation.
 * `mode` selects which endpoint is called:
 *   additions → POST /api/v1/ingestion/additions
 *   deletions → POST /api/v1/deletions
 */
export function useBatchUpload(mode: BatchMode) {
  const qc = useQueryClient();

  const mutation = useMutation({
    mutationFn: ({ file, onProgress }: UploadVariables) =>
      mode === "additions"
        ? ingestionApi.uploadAdditions(file, onProgress)
        : ingestionApi.uploadDeletions(file, onProgress),

    onSettled: () => {
      void qc.invalidateQueries({ queryKey: ["dashboard"] });
      void qc.invalidateQueries({ queryKey: ["audit"] });
    },
  });

  return {
    upload: (file: File, onProgress: (pct: number) => void) =>
      mutation.mutate({ file, onProgress }),
    isPending: mutation.isPending,
    isSuccess: mutation.isSuccess,
    isError: mutation.isError,
    data: mutation.data,
    error: mutation.error,
    reset: mutation.reset,
  };
}
