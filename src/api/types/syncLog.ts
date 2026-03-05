// ── Enums ─────────────────────────────────────────────────────────────────────

export type SyncStatus =
  | "PENDING"
  | "PROVISIONING"
  | "ACTIVE"
  | "FAILED"
  | "COMPLETED"
  | "MANUAL_RETRY"
  | "SOFT_REJECTED"
  | "RECONCILIATION_PENDING"
  | "COMPLETED_BOTH"
  | "COMPLETED_OFFLINE"
  | "PENDING_BOTH"
  | "PENDING_OFFLINE";

export type SyncSource = "ONLINE" | "BATCH";

export type SyncLogEventActor =
  | "HR_USER"
  | "HR_USER_MANUAL_RETRY"
  | "CELERY_WORKER"
  | "INSURER_CALLBACK"
  | "RECONCILIATION_TASK"
  | (string & {});

// ── Backend raw response types ────────────────────────────────────────────────

interface BackendPagination {
  total: number;
  limit: number;
  offset: number;
}

export interface BackendErrorItem {
  id: number;
  transaction_type: string | null;
  source: SyncSource;
  employee_code: string | null;
  error_message: string | null;
  retry_count: number;
  timestamp: string;
  payload?: Record<string, unknown> | null;
}

export interface BackendTransactionItem {
  id: number;
  transaction_type: string | null;
  source: SyncSource;
  employee_code: string | null;
  status: string;
  policy_status: string | null;
  insurer_reference_id: string | null;
  rejection_reason: string | null;
  callback_received_at: string | null;
  timestamp: string;
  raw_response?: Record<string, unknown> | null;
  is_force?: boolean;
}

export interface BackendErrorsResponse {
  data: BackendErrorItem[];
  pagination: BackendPagination;
}

export interface BackendTransactionsResponse {
  data: BackendTransactionItem[];
  pagination: BackendPagination;
}

// ── Timeline / History ────────────────────────────────────────────────────────

export interface TimelineEvent {
  status: string;
  actor: string;
  timestamp: string;
  details?: Record<string, unknown> | null;
  policy_status?: string | null;
}

export interface LogHistory {
  transaction_id: string;
  employee_code: string | null;
  current_status: string;
  timeline: TimelineEvent[];
}

// ── Normalized AuditLog — used by all UI components ──────────────────────────

export interface AuditLog {
  id: number;
  employee_code: string | null;
  source: SyncSource;
  status: string;           // delivery pipeline status (sync_status)
  policy_status?: string | null;  // insurance coverage status (from employees table)
  timestamp: string;
  transaction_type: string | null;
  is_force?: boolean;       // true = HR bypassed "not enrolled" guard
  // errors
  error_message?: string | null;
  retry_count?: number;
  // transactions
  insurer_reference_id?: string | null;
  rejection_reason?: string | null;
  callback_received_at?: string | null;
}

export interface AuditPage {
  items: AuditLog[];
  total: number;
  page: number;
  size: number;
}

// Alias so existing imports of SyncLog keep working
export type SyncLog = AuditLog;

// ── Employee 360° History ─────────────────────────────────────────────────────

export interface EmployeeTransaction {
  log_id: number;
  transaction_id: string | null;
  transaction_type: string | null;
  source: SyncSource;
  status: string;
  policy_status: string | null;
  is_force?: boolean;
  timestamp: string;
  events: TimelineEvent[];
}

export interface EmployeeHistory {
  employee_code: string;
  total_transactions: number;
  transactions: EmployeeTransaction[];
}
