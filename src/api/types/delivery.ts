import { z } from "zod";

export const BatchFileSchema = z.object({
  file_name: z.string(),
  file_path: z.string().nullable().optional(),
  record_count: z.number(),
  generated_at: z.string(),
  download_url: z.string().nullable(),
  dispatch_status: z.string().nullable().optional(),
  generated_by: z.string().nullable().optional(),
});
export type BatchFile = z.infer<typeof BatchFileSchema>;

export const DeliveryQueueItemSchema = z.object({
  id: z.number(),
  employee_name: z.string(),
  employee_id: z.string(),
  sync_status: z.string(),
  created_at: z.string().datetime({ offset: true }),
});
export type DeliveryQueueItem = z.infer<typeof DeliveryQueueItemSchema>;

export const DispatchResultSchema = z.object({
  message: z.string(),
  download_url: z.string().nullable(),
  record_count: z.number(),
});
export type DispatchResult = z.infer<typeof DispatchResultSchema>;
