import { z } from "zod";
import { apiClient } from "@/api/client";
import { BatchFileSchema, DispatchResultSchema } from "@/api/types/delivery";

export const deliveryApi = {
  /** GET /api/v1/delivery/preview-offline-report — Download preview without dispatching */
  previewReport: async (): Promise<Blob> => {
    const res = await apiClient.get("/api/v1/delivery/preview-offline-report", {
      responseType: "blob",
    });
    return res.data as Blob;
  },

  /** POST /api/v1/delivery/generate-offline-report — Dispatch and mark COMPLETED */
  generateReport: async () => {
    const res = await apiClient.post("/api/v1/delivery/generate-offline-report");
    return DispatchResultSchema.parse(res.data);
  },

  /** GET /api/v1/delivery/history — Previously generated batch files */
  getHistory: async () => {
    const res = await apiClient.get("/api/v1/delivery/history");
    return z.array(BatchFileSchema).parse(res.data);
  },
};
