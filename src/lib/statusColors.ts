// SyncStatus used as string index for runtime lookups — no import needed
import type { PolicyStatus } from "@/api/types/employee";

// ── SyncStatus UI config ─────────────────────────────────────────────────────

export interface StatusConfig {
  label: string;
  /** Tailwind classes for badge background, text, and border */
  classes: string;
  /** Dot color for timeline steps */
  dotClass: string;
}

export const SYNC_STATUS_CONFIG: Record<string, StatusConfig> = {
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
  COMPLETED_OFFLINE: {
    label: "Dispatched to Insurer",
    classes: "bg-teal-50 text-teal-700 border border-teal-200",
    dotClass: "bg-teal-500",
  },
  COMPLETED_BOTH: {
    label: "Completed (Both)",
    classes: "bg-emerald-50 text-emerald-700 border border-emerald-200",
    dotClass: "bg-emerald-500",
  },
  PENDING_OFFLINE: {
    label: "Pending (Offline)",
    classes: "bg-yellow-50 text-yellow-700 border border-yellow-200",
    dotClass: "bg-yellow-400",
  },
  PENDING_BOTH: {
    label: "Pending (Both)",
    classes: "bg-amber-50 text-amber-700 border border-amber-200",
    dotClass: "bg-amber-400",
  },
  BROKER_REVIEW_PENDING: {
    label: "Awaiting Broker Send",
    classes: "bg-violet-50 text-violet-700 border border-violet-200",
    dotClass: "bg-violet-500",
  },
};

// ── PolicyStatus UI config ────────────────────────────────────────────────────

export const POLICY_STATUS_CONFIG: Record<PolicyStatus, StatusConfig> = {
  PENDING_DISPATCH: {
    label: "In Queue",           // HR-friendly: waiting for broker to send dispatch file
    classes: "bg-slate-50 text-slate-600 border border-slate-200",
    dotClass: "bg-slate-400",
  },
  PENDING_ISSUANCE: {
    label: "Sent to Insurer",    // HR-friendly: dispatched, waiting for policy number
    classes: "bg-yellow-50 text-yellow-700 border border-yellow-200",
    dotClass: "bg-yellow-400",
  },
  ISSUED: {
    label: "Covered",            // HR-friendly: insurer confirmed, employee is insured
    classes: "bg-green-50 text-green-700 border border-green-200",
    dotClass: "bg-green-500",
  },
  SOFT_REJECTED: {
    label: "Needs Review",       // HR-friendly: business rule failure, HR can fix & retry
    classes: "bg-orange-50 text-orange-700 border border-orange-200",
    dotClass: "bg-orange-400",
  },
  LAPSED: {
    label: "Lapsed",             // Coverage period ended (e.g. annual renewal missed)
    classes: "bg-slate-100 text-slate-600 border border-slate-200",
    dotClass: "bg-slate-400",
  },
  CANCELLED: {
    label: "Cancelled",          // Manually cancelled by HR or insurer
    classes: "bg-red-50 text-red-700 border border-red-200",
    dotClass: "bg-red-500",
  },
};
