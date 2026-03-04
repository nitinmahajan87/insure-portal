import { z } from "zod";

// ── Enums ─────────────────────────────────────────────────────────────────────

export const PolicyStatus = z.enum([
  "PENDING_COVERAGE",
  "ACTIVE",
  "SOFT_REJECTED",
  "HARD_REJECTED",
  "TERMINATED",
]);
export type PolicyStatus = z.infer<typeof PolicyStatus>;

export const DeliveryStatus = z.enum([
  "NOT_SENT",
  "SENT",
  "ACKNOWLEDGED",
  "FAILED",
]);
export type DeliveryStatus = z.infer<typeof DeliveryStatus>;

// ── Employee ──────────────────────────────────────────────────────────────────

export const EmployeeSchema = z.object({
  id: z.number(),
  employee_id: z.string(),
  name: z.string(),
  email: z.string().email().nullable(),
  date_of_birth: z.string().nullable(),
  date_of_joining: z.string().nullable(),
  corporate_id: z.number(),
  policy_status: PolicyStatus,
  delivery_status: DeliveryStatus,
  policy_effective_date: z.string().nullable(),
  insurer_reference_id: z.string().nullable(),
  rejection_reason: z.string().nullable(),
  created_at: z.string().datetime({ offset: true }),
  updated_at: z.string().datetime({ offset: true }),
});
export type Employee = z.infer<typeof EmployeeSchema>;

// ── Add Employee Form ─────────────────────────────────────────────────────────

export const AddEmployeeSchema = z.object({
  employee_id: z.string().min(1, "Employee ID is required"),
  name: z.string().min(2, "Name must be at least 2 characters"),
  email: z.string().email("Invalid email").optional().or(z.literal("")),
  date_of_birth: z.string().optional(),
  date_of_joining: z.string().min(1, "Date of joining is required"),
});
export type AddEmployeeForm = z.infer<typeof AddEmployeeSchema>;

// ── Remove Employee Form ──────────────────────────────────────────────────────

export const RemoveEmployeeSchema = z.object({
  employee_id: z.string().min(1, "Employee ID is required"),
  name: z.string().min(2, "Name must be at least 2 characters"),
  effective_date: z.string().optional(),
  reason: z.string().max(500, "Reason must be under 500 characters").optional(),
});
export type RemoveEmployeeForm = z.infer<typeof RemoveEmployeeSchema>;
