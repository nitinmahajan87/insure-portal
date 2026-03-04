import axios, {
  type AxiosInstance,
  type AxiosError,
} from "axios";
import { useAuthStore } from "@/store/authStore";

// ── Error Shape ───────────────────────────────────────────────────────────────

export type ApiErrorKind = "HTTPError" | "SystemError";

export interface ApiError {
  kind: ApiErrorKind;
  status: number | null;
  message: string;
  detail?: unknown;
}

// ── Factory ───────────────────────────────────────────────────────────────────

function createApiClient(baseURL: string): AxiosInstance {
  const instance = axios.create({
    baseURL,
    timeout: 30_000,
    headers: { "Content-Type": "application/json" },
  });

  // Inject X-API-KEY + optional corporate_id on every request
  instance.interceptors.request.use((config) => {
    const { apiKey, corporateId } = useAuthStore.getState();

    if (apiKey) {
      config.headers["X-API-KEY"] = apiKey;
    }

    // Broker-admin keys must send corporate_id as query param for scoped endpoints
    if (corporateId) {
      config.params = { ...config.params, corporate_id: corporateId };
    }

    return config;
  });

  // Normalize all errors into ApiError before they reach query/mutation handlers
  instance.interceptors.response.use(
    (response) => response,
    (error: AxiosError) => Promise.reject(normalizeError(error))
  );

  return instance;
}

function normalizeError(error: AxiosError): ApiError {
  if (error.response) {
    const status = error.response.status;
    const data = error.response.data as Record<string, unknown> | undefined;
    const message =
      (data?.["detail"] as string | undefined) ??
      (data?.["message"] as string | undefined) ??
      `Request failed with status ${status}`;

    // CLAUDE.md: 4xx = HTTPError (retryable), 5xx = SystemError (contact admin)
    return {
      kind: status >= 500 ? "SystemError" : "HTTPError",
      status,
      message,
      detail: data,
    };
  }

  if (error.request) {
    return {
      kind: "SystemError",
      status: null,
      message: "Network error — server is unreachable. Please try again.",
    };
  }

  return {
    kind: "SystemError",
    status: null,
    message: error.message ?? "An unexpected error occurred.",
  };
}

// ── Singleton ─────────────────────────────────────────────────────────────────

// Use relative base so Vite's dev proxy forwards /api → backend.
// In production set VITE_API_BASE_URL to the absolute backend origin.
export const apiClient = createApiClient(
  import.meta.env["VITE_API_BASE_URL"] ?? ""
);
