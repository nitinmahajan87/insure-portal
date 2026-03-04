import { z } from "zod";

/** Generic paginated wrapper matching FastAPI's pagination response shape */
export function PaginatedResponse<T extends z.ZodTypeAny>(itemSchema: T) {
  return z.object({
    items: z.array(itemSchema),
    total: z.number(),
    page: z.number(),
    size: z.number(),
    pages: z.number().optional(),
  });
}

export type PaginatedResult<T> = {
  items: T[];
  total: number;
  page: number;
  size: number;
  pages?: number;
};

/** Standard query params for paginated endpoints */
export interface PaginationParams {
  page: number;
  size: number;
}
