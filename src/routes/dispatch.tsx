import { createFileRoute } from "@tanstack/react-router";
import { DispatchPage } from "@/features/dispatch";

export const Route = createFileRoute("/dispatch")({
  component: DispatchPage,
});
