import { z } from "zod";
import { apiClient } from "@/api/client";
import { BatchFileSchema, DispatchResultSchema } from "@/api/types/delivery";

export const deliveryApi = {
  /**
   * GET /api/v1/delivery/preview-offline-report
   * Returns a fresh pre-signed URL for preview without dispatching.
   * Broker keys must pass corporateId to scope the call to one corporate.
   */
  previewReport: async (corporateId?: string): Promise<string | null> => {
    const params = corporateId ? { corporate_id: corporateId } : {};
    const res = await apiClient.get("/api/v1/delivery/preview-offline-report", { params });
    return (res.data as { download_url: string | null }).download_url;
  },

  /**
   * POST /api/v1/delivery/generate-offline-report — Dispatch and mark COMPLETED.
   * Broker keys must pass corporateId to scope the call to one corporate.
   */
  generateReport: async (corporateId?: string) => {
    const params = corporateId ? { corporate_id: corporateId } : {};
    const res = await apiClient.post("/api/v1/delivery/generate-offline-report", null, { params });
    return DispatchResultSchema.parse(res.data);
  },

  /**
   * GET /api/v1/delivery/queue-count
   * Returns pending_count (dispatchable) and review_pending_count (awaiting Confirm Sent).
   */
  getQueueCount: async (corporateId?: string) => {
    const params = corporateId ? { corporate_id: corporateId } : {};
    const res = await apiClient.get("/api/v1/delivery/queue-count", { params });
    return res.data as { pending_count: number; review_pending_count: number };
  },

  /**
   * GET /api/v1/delivery/history — Previously generated batch files.
   * Broker keys must pass corporateId to scope the call to one corporate.
   */
  getHistory: async (corporateId?: string) => {
    const params = corporateId ? { corporate_id: corporateId } : {};
    const res = await apiClient.get("/api/v1/delivery/history", { params });
    // Backend wraps the array in {"data": [...]}
    const raw = (res.data as { data: unknown[] }).data;
    return z.array(BatchFileSchema).parse(raw);
  },

  /**
   * POST /api/v1/delivery/confirm-dispatch — Broker confirms file was sent to insurer.
   * Transitions BROKER_REVIEW_PENDING → COMPLETED_OFFLINE + sets policy_status = PENDING_ISSUANCE.
   * Pass filePath to scope to one report; omit to confirm all pending records.
   */
  confirmDispatch: async (corporateId: string, filePath?: string) => {
    const res = await apiClient.post(
      "/api/v1/delivery/confirm-dispatch",
      { file_path: filePath ?? null },
      { params: { corporate_id: corporateId } }
    );
    return res.data as { message: string; confirmed_count: number };
  },
};
