import { apiClient } from "@/api/client";
import type { PortalAddForm, PortalRemovePayload } from "@/api/types/portal";

export interface PortalResponse {
  transaction_id: string;
  message: string;
}

export interface EmployeeLookupResult {
  employee_code: string;
  first_name: string;
  last_name: string;
  email: string | null;
  gender: string | null;
  date_of_birth: string | null;
  date_of_joining: string | null;
  policy_status: string | null;
  delivery_status: string | null;
}

export const portalApi = {
  /** POST /api/v1/portal/employees/add — HR Portal employee enrolment */
  addEmployee: async (payload: PortalAddForm): Promise<PortalResponse> => {
    const res = await apiClient.post("/api/v1/portal/employees/add", payload);
    return res.data as PortalResponse;
  },

  /** POST /api/v1/portal/employees/remove — HR Portal employee termination */
  removeEmployee: async (payload: PortalRemovePayload): Promise<PortalResponse> => {
    const res = await apiClient.post("/api/v1/portal/employees/remove", payload);
    return res.data as PortalResponse;
  },

  /** GET /api/v1/portal/employees/{code} — look up existing active employee */
  lookupEmployee: async (code: string): Promise<EmployeeLookupResult> => {
    const res = await apiClient.get(`/api/v1/portal/employees/${encodeURIComponent(code)}`);
    return res.data as EmployeeLookupResult;
  },
};
