import { apiClient } from "@/api/client";
import type {
  AuditLog,
  AuditPage,
  LogHistory,
  EmployeeHistory,
  BackendErrorsResponse,
  BackendTransactionsResponse,
} from "@/api/types/syncLog";

export const logsApi = {
  /** GET /api/v1/logs/errors — Failed syncs (limit/offset pagination) */
  getErrors: async (page: number, pageSize: number): Promise<AuditPage> => {
    const res = await apiClient.get("/api/v1/logs/errors", {
      params: { limit: pageSize, offset: (page - 1) * pageSize },
    });
    const body = res.data as BackendErrorsResponse;
    const items: AuditLog[] = body.data.map((item) => ({
      id: item.id,
      employee_code: item.employee_code,
      source: item.source,
      status: "FAILED",
      timestamp: item.timestamp,
      transaction_type: item.transaction_type,
      error_message: item.error_message,
      retry_count: item.retry_count,
    }));
    return { items, total: body.pagination.total, page, size: pageSize };
  },

  /** GET /api/v1/logs/transactions — Successful syncs (limit/offset pagination) */
  getTransactions: async (page: number, pageSize: number): Promise<AuditPage> => {
    const res = await apiClient.get("/api/v1/logs/transactions", {
      params: { limit: pageSize, offset: (page - 1) * pageSize },
    });
    const body = res.data as BackendTransactionsResponse;
    const items: AuditLog[] = body.data.map((item) => ({
      id: item.id,
      employee_code: item.employee_code,
      source: item.source,
      status: item.status,
      policy_status: item.policy_status,
      timestamp: item.timestamp,
      transaction_type: item.transaction_type,
      insurer_reference_id: item.insurer_reference_id,
      rejection_reason: item.rejection_reason,
      callback_received_at: item.callback_received_at,
    }));
    return { items, total: body.pagination.total, page, size: pageSize };
  },

  /** GET /api/v1/logs/{log_id}/history — Full event timeline */
  getHistory: async (logId: number): Promise<LogHistory> => {
    const res = await apiClient.get(`/api/v1/logs/${logId}/history`);
    return res.data as LogHistory;
  },

  /** POST /api/v1/logs/{log_id}/retry — Reset FAILED → PENDING */
  retry: async (logId: number): Promise<{ message: string }> => {
    const res = await apiClient.post(`/api/v1/logs/${logId}/retry`);
    return res.data as { message: string };
  },

  /** GET /api/v1/logs/employee/{code}/history — Full 360° employee history */
  getEmployeeHistory: async (employeeCode: string): Promise<EmployeeHistory> => {
    const res = await apiClient.get(
      `/api/v1/logs/employee/${encodeURIComponent(employeeCode)}/history`
    );
    return res.data as EmployeeHistory;
  },
};
