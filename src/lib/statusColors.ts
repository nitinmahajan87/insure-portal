import type { SyncStatus } from "@/api/types/syncLog";
import type { PolicyStatus } from "@/api/types/employee";

// ── SyncStatus UI config ─────────────────────────────────────────────────────

export interface StatusConfig {
  label: string;
  /** Tailwind classes for badge background, text, and border */
  classes: string;
  /** Dot color for timeline steps */
  dotClass: string;
}

export const SYNC_STATUS_CONFIG: Record<SyncStatus, StatusConfig> = {
  PENDING: {
    label: "Pending",
    classes: "bg-yellow-50 text-yellow-700 border border-yellow-200",
    dotClass: "bg-yellow-400",
  },
  PROVISIONING: {
    label: "Provisioning",
    classes: "bg-blue-50 text-blue-700 border border-blue-200",
    dotClass: "bg-blue-400",
  },
  ACTIVE: {
    label: "Active",
    classes: "bg-green-50 text-green-700 border border-green-200",
    dotClass: "bg-green-500",
  },
  FAILED: {
    label: "Failed",
    classes: "bg-red-50 text-red-700 border border-red-200",
    dotClass: "bg-red-500",
  },
  COMPLETED: {
    label: "Completed",
    classes: "bg-emerald-50 text-emerald-700 border border-emerald-200",
    dotClass: "bg-emerald-500",
  },
  MANUAL_RETRY: {
    label: "Manual Retry",
    classes: "bg-amber-50 text-amber-700 border border-amber-200",
    dotClass: "bg-amber-400",
  },
  SOFT_REJECTED: {
    label: "Soft Rejected",
    classes: "bg-orange-50 text-orange-700 border border-orange-200",
    dotClass: "bg-orange-400",
  },
  RECONCILIATION_PENDING: {
    label: "Reconciling",
    classes: "bg-purple-50 text-purple-700 border border-purple-200",
    dotClass: "bg-purple-400",
  },
};

// ── PolicyStatus UI config ────────────────────────────────────────────────────

export const POLICY_STATUS_CONFIG: Record<PolicyStatus, StatusConfig> = {
  PENDING_COVERAGE: {
    label: "Pending Coverage",
    classes: "bg-yellow-50 text-yellow-700 border border-yellow-200",
    dotClass: "bg-yellow-400",
  },
  ACTIVE: {
    label: "Covered",
    classes: "bg-green-50 text-green-700 border border-green-200",
    dotClass: "bg-green-500",
  },
  SOFT_REJECTED: {
    label: "Soft Rejected",
    classes: "bg-orange-50 text-orange-700 border border-orange-200",
    dotClass: "bg-orange-400",
  },
  HARD_REJECTED: {
    label: "Rejected",
    classes: "bg-red-50 text-red-700 border border-red-200",
    dotClass: "bg-red-500",
  },
  TERMINATED: {
    label: "Terminated",
    classes: "bg-slate-100 text-slate-600 border border-slate-200",
    dotClass: "bg-slate-400",
  },
};
