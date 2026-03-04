import type { ApiError } from "@/api/client";

/**
 * Returns a user-facing message based on CLAUDE.md error distinction:
 *   HTTPError  → Retryable (user-initiated mistake, 4xx)
 *   SystemError → Contact Admin (network/5xx)
 */
export function getErrorMessage(error: unknown): {
  title: string;
  description: string;
  retryable: boolean;
} {
  const apiError = error as ApiError;

  if (apiError?.kind === "HTTPError") {
    return {
      title: "Request Failed",
      description: apiError.message,
      retryable: true,
    };
  }

  if (apiError?.kind === "SystemError") {
    // Network errors (no response) are retryable — backend may just not be reachable yet
    const isNetworkError = apiError.status === null;
    return {
      title: isNetworkError ? "Backend Unreachable" : "System Error",
      description: isNetworkError
        ? "Cannot connect to the server. Check that the backend is running."
        : (apiError.message ?? "An unexpected error occurred. Please contact your administrator."),
      retryable: isNetworkError,
    };
  }

  // Fallback for unknown error shapes
  return {
    title: "Unexpected Error",
    description: String(error),
    retryable: false,
  };
}
