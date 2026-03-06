import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { logsApi } from "@/api/endpoints/logs";

const PAGE_SIZE = 20;

export function useAuditTransactions(corporateId?: string) {
  const [page, setPage] = useState(1);

  const query = useQuery({
    queryKey: ["audit", "transactions", page, corporateId ?? "self"],
    queryFn: () => logsApi.getTransactions(page, PAGE_SIZE, corporateId),
    placeholderData: (prev) => prev,
  });

  return { ...query, page, pageSize: PAGE_SIZE, setPage };
}
