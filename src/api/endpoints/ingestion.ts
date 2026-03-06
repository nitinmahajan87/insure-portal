import { apiClient } from "@/api/client";

export interface IngestionResult {
  filename: string;
  message: string;
  accepted: number;
  rejected: number;
  errors: Array<{ row: number; reason: string }>;
  /** Pre-signed S3 URL — present only for OFFLINE / BOTH channels. Expires in 15 min.
   *  Use getDownloadUrl(filename) to get a fresh URL at any time. */
  file_download_url?: string | null;
}

// Raw shape from the backend (field names match the Pydantic model exactly)
interface BackendIngestionResponse {
  filename: string;
  accepted_count: number;
  rejected_count: number;
  message: string;
  file_download_url: string;
  report?: {
    rejected_rows?: Array<{
      row_index: number;
      errors: string[];
    }>;
  };
}

function mapIngestionResponse(raw: BackendIngestionResponse): IngestionResult {
  return {
    filename: raw.filename,
    message: raw.message,
    accepted: raw.accepted_count,
    rejected: raw.rejected_count,
    file_download_url: raw.file_download_url || null,
    errors: raw.report?.rejected_rows?.map((r) => ({
      row: r.row_index,
      reason: r.errors.join(", "),
    })) ?? [],
  };
}

export const ingestionApi = {
  /** POST /api/v1/ingestion/additions — Bulk XLSX/CSV upload */
  uploadAdditions: async (
    file: File,
    onUploadProgress?: (percent: number) => void
  ): Promise<IngestionResult> => {
    const formData = new FormData();
    formData.append("file", file);

    const res = await apiClient.post("/api/v1/ingestion/additions", formData, {
      headers: { "Content-Type": "multipart/form-data" },
      onUploadProgress: onUploadProgress
        ? (evt) => {
            if (evt.total) {
              onUploadProgress(Math.round((evt.loaded / evt.total) * 100));
            }
          }
        : undefined,
    });

    return mapIngestionResponse(res.data as BackendIngestionResponse);
  },

  /** POST /api/v1/ingestion/deletions — Bulk XLSX/CSV upload for removals */
  uploadDeletions: async (
    file: File,
    onUploadProgress?: (percent: number) => void
  ): Promise<IngestionResult> => {
    const formData = new FormData();
    formData.append("file", file);

    const res = await apiClient.post("/api/v1/ingestion/deletions", formData, {
      headers: { "Content-Type": "multipart/form-data" },
      onUploadProgress: onUploadProgress
        ? (evt) => {
            if (evt.total) {
              onUploadProgress(Math.round((evt.loaded / evt.total) * 100));
            }
          }
        : undefined,
    });

    return mapIngestionResponse(res.data as BackendIngestionResponse);
  },

  /**
   * GET /api/v1/ingestion/download/{filename}
   * Always returns a fresh pre-signed S3 URL — call this whenever the
   * stored file_download_url may have expired (TTL = 15 min by default).
   */
  getDownloadUrl: async (filename: string): Promise<string> => {
    const res = await apiClient.get(`/api/v1/ingestion/download/${filename}`);
    return (res.data as { download_url: string }).download_url;
  },
};
