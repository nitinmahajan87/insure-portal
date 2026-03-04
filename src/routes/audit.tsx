import { createFileRoute } from "@tanstack/react-router";
import { AuditPage } from "@/features/audit";

export const Route = createFileRoute("/audit")({
  component: AuditPage,
});
