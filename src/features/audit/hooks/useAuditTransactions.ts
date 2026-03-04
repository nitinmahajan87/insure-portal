import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { logsApi } from "@/api/endpoints/logs";

const PAGE_SIZE = 20;

export function useAuditTransactions() {
  const [page, setPage] = useState(1);

  const query = useQuery({
    queryKey: ["audit", "transactions", page],
    queryFn: () => logsApi.getTransactions(page, PAGE_SIZE),
    placeholderData: (prev) => prev,
  });

  return { ...query, page, pageSize: PAGE_SIZE, setPage };
}
