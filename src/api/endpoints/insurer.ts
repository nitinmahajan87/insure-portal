import { z } from "zod";
import { apiClient } from "@/api/client";

// ── Response schemas (mirror InsurerResponseReport in schemas.py) ─────────────

const ParseErrorSchema = z.object({
  row_index: z.number(),
  raw_data: z.record(z.string()),
  errors: z.array(z.string()),
});

export const InsurerResponseReportSchema = z.object({
  total_rows:          z.number(),
  issued_count:        z.number(),
  soft_rejected_count: z.number(),
  unmatched_count:     z.number(),
  parse_error_count:   z.number(),
  message:             z.string(),
  parse_errors:        z.array(ParseErrorSchema),
});

export type InsurerResponseReport = z.infer<typeof InsurerResponseReportSchema>;

// ── API ───────────────────────────────────────────────────────────────────────

export const insurerApi = {
  /**
   * POST /api/v1/insurer/process-response-file
   * Broker uploads the insurer's response Excel/CSV.
   * corporateId is mandatory — scopes the update to one corporate.
   */
  uploadResponseFile: async (
    file: File,
    corporateId: string,
    onUploadProgress?: (percent: number) => void,
  ): Promise<InsurerResponseReport> => {
    const formData = new FormData();
    formData.append("file", file);

    const res = await apiClient.post(
      "/api/v1/insurer/process-response-file",
      formData,
      {
        params: { corporate_id: corporateId },
        headers: { "Content-Type": "multipart/form-data" },
        onUploadProgress: onUploadProgress
          ? (evt) => {
              if (evt.total) {
                onUploadProgress(Math.round((evt.loaded / evt.total) * 100));
              }
            }
          : undefined,
      },
    );

    return InsurerResponseReportSchema.parse(res.data);
  },
};
