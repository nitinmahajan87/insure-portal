import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { logsApi } from "@/api/endpoints/logs";

const PAGE_SIZE = 20;

export function useAuditErrors(corporateId?: string) {
  const [page, setPage] = useState(1);

  const query = useQuery({
    queryKey: ["audit", "errors", page, corporateId ?? "self"],
    queryFn: () => logsApi.getErrors(page, PAGE_SIZE, corporateId),
    placeholderData: (prev) => prev,
  });

  return { ...query, page, pageSize: PAGE_SIZE, setPage };
}
