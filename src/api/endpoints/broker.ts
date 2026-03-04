import { z } from "zod";
import { apiClient } from "@/api/client";

const CorporateSchema = z.object({
  id: z.number(),
  name: z.string(),
  email: z.string().nullable(),
  active: z.boolean(),
});

const CorporateSummarySchema = CorporateSchema.extend({
  pending_count: z.number(),
  failed_count: z.number(),
  active_count: z.number(),
});

export const brokerApi = {
  /** GET /api/v1/broker/me */
  getMe: async () => {
    const res = await apiClient.get("/api/v1/broker/me");
    return res.data as { broker_id: number; name: string; scope: string };
  },

  /** GET /api/v1/broker/corporates */
  getCorporates: async () => {
    const res = await apiClient.get("/api/v1/broker/corporates");
    return z.array(CorporateSchema).parse(res.data);
  },

  /** GET /api/v1/broker/corporates/{id}/summary */
  getCorporateSummary: async (corporateId: number) => {
    const res = await apiClient.get(
      `/api/v1/broker/corporates/${corporateId}/summary`
    );
    return CorporateSummarySchema.parse(res.data);
  },
};
