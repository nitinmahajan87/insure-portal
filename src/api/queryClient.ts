import { QueryClient } from "@tanstack/react-query";
import type { ApiError } from "@/api/client";

export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 30_000, // 30s — aligned with backend Redis TTL strategy
      gcTime: 5 * 60_000, // 5 min garbage collection
      refetchOnWindowFocus: true,
      retry: (failureCount, error) => {
        const apiError = error as unknown as ApiError;
        // Never auto-retry SystemErrors (5xx) — surface them immediately
        if (apiError?.kind === "SystemError") return false;
        // Retry HTTPErrors (4xx) up to 2 times
        return failureCount < 2;
      },
    },
    mutations: {
      // Mutations are fire-once — no auto-retry to preserve idempotency
      retry: false,
    },
  },
});
