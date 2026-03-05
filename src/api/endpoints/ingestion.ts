import { apiClient } from "@/api/client";

export interface IngestionResult {
  message: string;
  accepted: number;
  rejected: number;
  errors: Array<{ row: number; reason: string }>;
}

export const ingestionApi = {
  /** POST /api/v1/additions — Bulk XLSX/CSV upload */
  uploadAdditions: async (
    file: File,
    onUploadProgress?: (percent: number) => void
  ): Promise<IngestionResult> => {
    const formData = new FormData();
    formData.append("file", file);

    const res = await apiClient.post("/api/v1/additions", formData, {
      headers: { "Content-Type": "multipart/form-data" },
      onUploadProgress: onUploadProgress
        ? (evt) => {
            if (evt.total) {
              onUploadProgress(Math.round((evt.loaded / evt.total) * 100));
            }
          }
        : undefined,
    });

    return res.data as IngestionResult;
  },

  /** POST /api/v1/deletions — Bulk XLSX/CSV upload for employee removals */
  uploadDeletions: async (
    file: File,
    onUploadProgress?: (percent: number) => void
  ): Promise<IngestionResult> => {
    const formData = new FormData();
    formData.append("file", file);

    const res = await apiClient.post("/api/v1/deletions", formData, {
      headers: { "Content-Type": "multipart/form-data" },
      onUploadProgress: onUploadProgress
        ? (evt) => {
            if (evt.total) {
              onUploadProgress(Math.round((evt.loaded / evt.total) * 100));
            }
          }
        : undefined,
    });

    return res.data as IngestionResult;
  },
};
