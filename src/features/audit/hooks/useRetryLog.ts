import { useMutation, useQueryClient } from "@tanstack/react-query";
import { logsApi } from "@/api/endpoints/logs";
import type { AuditPage } from "@/api/types/syncLog";

export function useRetryLog() {
  const qc = useQueryClient();

  return useMutation({
    mutationFn: (logId: number) => logsApi.retry(logId),

    onMutate: async (logId) => {
      await qc.cancelQueries({ queryKey: ["audit", "errors"] });

      const snapshots = qc.getQueriesData<AuditPage>({
        queryKey: ["audit", "errors"],
      });

      qc.setQueriesData<AuditPage>(
        { queryKey: ["audit", "errors"] },
        (old) => {
          if (!old) return old;
          return {
            ...old,
            items: old.items.map((log) =>
              log.id === logId ? { ...log, status: "MANUAL_RETRY" } : log
            ),
          };
        }
      );

      return { snapshots };
    },

    onError: (_err, _logId, context) => {
      if (context?.snapshots) {
        for (const [queryKey, data] of context.snapshots) {
          qc.setQueryData(queryKey, data);
        }
      }
    },

    onSettled: (_data, _err, logId) => {
      void qc.invalidateQueries({ queryKey: ["audit", "errors"] });
      void qc.invalidateQueries({ queryKey: ["audit", "history", logId] });
    },
  });
}
