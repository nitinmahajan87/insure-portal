import { apiClient } from "@/api/client";
import type { AddEmployeeForm, RemoveEmployeeForm } from "@/api/types/employee";

export interface StreamResult {
  transaction_id: string;
  message: string;
}

export const streamsApi = {
  /** POST /api/v1/stream/add — Real-time single employee addition */
  addEmployee: async (payload: AddEmployeeForm): Promise<StreamResult> => {
    const res = await apiClient.post("/api/v1/stream/add", payload);
    const d = res.data as { tracking_id?: number; transaction_id?: string; message: string };
    return {
      transaction_id: d.transaction_id ?? String(d.tracking_id ?? ""),
      message: d.message,
    };
  },

  /** POST /api/v1/stream/remove — Real-time single employee removal */
  removeEmployee: async (payload: RemoveEmployeeForm): Promise<StreamResult> => {
    const res = await apiClient.post("/api/v1/stream/remove", payload);
    const d = res.data as { tracking_id?: number; transaction_id?: string; message: string };
    return {
      transaction_id: d.transaction_id ?? String(d.tracking_id ?? ""),
      message: d.message,
    };
  },
};
