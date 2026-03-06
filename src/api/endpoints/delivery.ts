import { z } from "zod";
import { apiClient } from "@/api/client";
import { BatchFileSchema, DispatchResultSchema } from "@/api/types/delivery";

export const deliveryApi = {
  /**
   * GET /api/v1/delivery/preview-offline-report
   * Returns a fresh pre-signed URL for preview without dispatching.
   */
  previewReport: async (): Promise<string | null> => {
    const res = await apiClient.get("/api/v1/delivery/preview-offline-report");
    return (res.data as { download_url: string | null }).download_url;
  },

  /** POST /api/v1/delivery/generate-offline-report — Dispatch and mark COMPLETED */
  generateReport: async () => {
    const res = await apiClient.post("/api/v1/delivery/generate-offline-report");
    return DispatchResultSchema.parse(res.data);
  },

  /** GET /api/v1/delivery/history — Previously generated batch files */
  getHistory: async () => {
    const res = await apiClient.get("/api/v1/delivery/history");
    // Backend wraps the array in {"data": [...]}
    const raw = (res.data as { data: unknown[] }).data;
    return z.array(BatchFileSchema).parse(raw);
  },
};
