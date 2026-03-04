import { create } from "zustand";
import { persist } from "zustand/middleware";

export type ApiKeyScope = "corporate" | "broker";

interface AuthState {
  apiKey: string | null;
  corporateId: string | null;
  tenantName: string | null;
  scope: ApiKeyScope | null;

  setCredentials: (params: {
    apiKey: string;
    corporateId?: string;
    tenantName?: string;
    scope: ApiKeyScope;
  }) => void;
  clearCredentials: () => void;

  isAuthenticated: () => boolean;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set, get) => ({
      apiKey: null,
      corporateId: null,
      tenantName: null,
      scope: null,

      setCredentials: ({ apiKey, corporateId, tenantName, scope }) =>
        set({
          apiKey,
          corporateId: corporateId ?? null,
          tenantName: tenantName ?? null,
          scope,
        }),

      clearCredentials: () =>
        set({ apiKey: null, corporateId: null, tenantName: null, scope: null }),

      isAuthenticated: () => get().apiKey !== null,
    }),
    { name: "insuretech-auth", version: 1 }
  )
);
