import { useState } from "react";
import * as Tabs from "@radix-ui/react-tabs";
import { XCircle, CheckCircle2 } from "lucide-react";
import { TopBar } from "@/components/layout/TopBar";
import { cn } from "@/lib/utils";
import { ErrorsTable } from "./components/ErrorsTable";
import { TransactionsTable } from "./components/TransactionsTable";

type Tab = "errors" | "transactions";

const TABS: { id: Tab; label: string; Icon: React.ElementType; description: string }[] = [
  {
    id: "errors",
    label: "Errors",
    Icon: XCircle,
    description: "Failed syncs that need attention",
  },
  {
    id: "transactions",
    label: "Transactions",
    Icon: CheckCircle2,
    description: "Successfully processed syncs",
  },
];

export function AuditPage() {
  const [activeTab, setActiveTab] = useState<Tab>("errors");

  return (
    <div className="flex h-full flex-col">
      <TopBar
        title="Audit Log"
        subtitle="Full transparency on every sync event and state transition"
      />

      <div className="flex-1 overflow-y-auto p-6">
        <Tabs.Root
          value={activeTab}
          onValueChange={(v) => setActiveTab(v as Tab)}
          className="flex h-full flex-col"
        >
          {/* Tab list */}
          <Tabs.List className="mb-6 flex gap-1 rounded-xl border border-slate-200 bg-slate-50 p-1">
            {TABS.map(({ id, label, Icon, description }) => (
              <Tabs.Trigger
                key={id}
                value={id}
                className={cn(
                  "group flex flex-1 items-center gap-2 rounded-lg px-4 py-2.5 text-sm transition-all",
                  "data-[state=active]:bg-white data-[state=active]:shadow-sm",
                  "data-[state=inactive]:text-slate-500 data-[state=inactive]:hover:text-slate-700",
                  "data-[state=active]:text-slate-900"
                )}
              >
                <Icon
                  className={cn(
                    "h-4 w-4 shrink-0 transition-colors",
                    id === "errors"
                      ? "group-data-[state=active]:text-red-500"
                      : "group-data-[state=active]:text-green-500",
                    "group-data-[state=inactive]:text-slate-400"
                  )}
                />
                <div className="min-w-0 text-left">
                  <p className="font-medium leading-tight">{label}</p>
                  <p className="hidden truncate text-xs text-slate-400 sm:block">{description}</p>
                </div>
              </Tabs.Trigger>
            ))}
          </Tabs.List>

          {/* Tab content */}
          <Tabs.Content value="errors" className="flex-1">
            <ErrorsTable />
          </Tabs.Content>

          <Tabs.Content value="transactions" className="flex-1">
            <TransactionsTable />
          </Tabs.Content>
        </Tabs.Root>
      </div>
    </div>
  );
}
