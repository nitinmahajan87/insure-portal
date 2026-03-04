import { createFileRoute } from "@tanstack/react-router";
import { BatchPage } from "@/features/batch";

export const Route = createFileRoute("/batch")({
  component: BatchPage,
});
