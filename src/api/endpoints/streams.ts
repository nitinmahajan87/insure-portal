import { apiClient } from "@/api/client";
import type { AddEmployeeForm, RemoveEmployeeForm } from "@/api/types/employee";

export interface StreamResult {
  transaction_id: string;
  message: string;
}

export const streamsApi = {
  /** POST /api/v1/streams/add — Real-time single employee addition */
  addEmployee: async (payload: AddEmployeeForm): Promise<StreamResult> => {
    const res = await apiClient.post("/api/v1/streams/add", payload);
    return res.data as StreamResult;
  },

  /** POST /api/v1/stream/remove — Real-time single employee removal */
  removeEmployee: async (payload: RemoveEmployeeForm): Promise<StreamResult> => {
    const res = await apiClient.post("/api/v1/stream/remove", payload);
    return res.data as StreamResult;
  },
};
