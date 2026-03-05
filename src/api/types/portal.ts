import { z } from "zod";

// ── Add Employee (Portal) ─────────────────────────────────────────────────────

export const PortalAddSchema = z.object({
  employee_code: z.string().min(1, "Employee code is required"),
  first_name:    z.string().min(1, "First name is required"),
  last_name:     z.string().min(1, "Last name is required"),
  email:         z.string().email("Invalid email").optional().or(z.literal("")),
  date_of_birth: z.string().optional().refine(
    (v) => !v || new Date(v) <= new Date(),
    "Date of birth cannot be in the future"
  ),
  date_of_joining: z.string().min(1, "Date of joining is required").refine(
    (v) => !v || new Date(v) <= new Date(),
    "Date of joining cannot be in the future"
  ),
  gender:        z.enum(["Male", "Female", "Other", "Unknown"]).default("Unknown"),
});

export type PortalAddForm = z.infer<typeof PortalAddSchema>;

// ── Remove Employee (Portal) ──────────────────────────────────────────────────

export const PortalRemoveSchema = z.object({
  employee_code:   z.string().min(1, "Employee code is required"),
  // name is UI-only for success card display; also sent to backend for ghost record on force
  name:            z.string().min(1, "Name is required for confirmation"),
  date_of_leaving: z.string().min(1, "Date of leaving is required"),
  reason:          z.string().max(500).optional(),
  force:           z.boolean().default(false),
});

export type PortalRemoveForm = z.infer<typeof PortalRemoveSchema>;

// Backend payload — everything except the UI display name when not forced
export type PortalRemovePayload = Omit<PortalRemoveForm, "name"> & { name?: string };
