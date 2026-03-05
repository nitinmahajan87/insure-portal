import { useState, useCallback } from "react";
import { portalApi, type EmployeeLookupResult } from "@/api/endpoints/portal";
import type { ApiError } from "@/api/client";

type LookupState =
  | { status: "idle" }
  | { status: "loading" }
  | { status: "found"; employee: EmployeeLookupResult }
  | { status: "not_found" }
  | { status: "error" };

export function useEmployeeLookup() {
  const [state, setState] = useState<LookupState>({ status: "idle" });

  const lookup = useCallback(async (code: string) => {
    const trimmed = code.trim();
    if (!trimmed) {
      setState({ status: "idle" });
      return null;
    }

    setState({ status: "loading" });
    try {
      const employee = await portalApi.lookupEmployee(trimmed);
      setState({ status: "found", employee });
      return employee;
    } catch (err: unknown) {
      // Axios errors are normalized to ApiError by the client interceptor —
      // check .status directly, NOT .response?.status
      if ((err as ApiError).status === 404) {
        setState({ status: "not_found" });
      } else {
        setState({ status: "error" });
      }
      return null;
    }
  }, []);

  const reset = useCallback(() => setState({ status: "idle" }), []);

  return { state, lookup, reset };
}
