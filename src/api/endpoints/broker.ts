import { z } from "zod";
import { apiClient } from "@/api/client";

// ── Schemas (mirror broker_admin.py response shapes exactly) ─────────────────

const BrokerSchema = z.object({
  id: z.string(),
  name: z.string(),
  allowed_formats: z.array(z.string()),
});

const PortfolioSchema = z.object({
  total_corporates: z.number(),
  total_employees: z.number(),
  pending_syncs: z.number(),
});

const BrokerMeSchema = z.object({
  broker: BrokerSchema,
  portfolio: PortfolioSchema,
});

const CorporateListItemSchema = z.object({
  id: z.string(),
  name: z.string(),
  hrms_provider: z.string(),
  insurer_provider: z.string(),
  delivery_channel: z.enum(["webhook", "offline", "both"]),
  employee_count: z.number(),
  pending_syncs: z.number(),
});

const CorporateListSchema = z.object({
  corporates: z.array(CorporateListItemSchema),
});

const CorporateDetailSchema = z.object({
  id: z.string(),
  name: z.string(),
  hrms_provider: z.string(),
  insurer_provider: z.string(),
  insurer_format: z.string(),
  delivery_channel: z.enum(["webhook", "offline", "both"]),
  webhook_url: z.string().nullable(),
});

const CorporateSummarySchema = z.object({
  corporate: CorporateDetailSchema,
  stats: z.object({
    employee_count: z.number(),
    sync_status_breakdown: z.record(z.string(), z.number()),
  }),
});

// ── Exported types ────────────────────────────────────────────────────────────

export type BrokerMe = z.infer<typeof BrokerMeSchema>;
export type CorporateListItem = z.infer<typeof CorporateListItemSchema>;
export type CorporateSummary = z.infer<typeof CorporateSummarySchema>;

// ── API methods ───────────────────────────────────────────────────────────────

export const brokerApi = {
  /** GET /api/v1/broker/me — broker profile + portfolio aggregate stats */
  getMe: async (): Promise<BrokerMe> => {
    const res = await apiClient.get("/api/v1/broker/me");
    return BrokerMeSchema.parse(res.data);
  },

  /** GET /api/v1/broker/corporates — all corporates under this broker */
  getCorporates: async (): Promise<CorporateListItem[]> => {
    const res = await apiClient.get("/api/v1/broker/corporates");
    return CorporateListSchema.parse(res.data).corporates;
  },

  /** GET /api/v1/broker/corporates/{id}/summary — detail view of one corporate */
  getCorporateSummary: async (corporateId: string): Promise<CorporateSummary> => {
    const res = await apiClient.get(
      `/api/v1/broker/corporates/${corporateId}/summary`
    );
    return CorporateSummarySchema.parse(res.data);
  },
};
