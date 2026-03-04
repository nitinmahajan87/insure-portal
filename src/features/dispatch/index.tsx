import { useState } from "react";
import * as Tabs from "@radix-ui/react-tabs";
import { Send, FolderOpen } from "lucide-react";
import { TopBar } from "@/components/layout/TopBar";
import { cn } from "@/lib/utils";
import { PendingQueuePanel } from "./components/PendingQueuePanel";
import { FileHistoryTable } from "./components/FileHistoryTable";

type Tab = "queue" | "history";

const TABS: { id: Tab; label: string; Icon: React.ElementType; description: string }[] = [
  {
    id: "queue",
    label: "Pending Queue",
    Icon: Send,
    description: "Preview and dispatch records to the insurer",
  },
  {
    id: "history",
    label: "File History",
    Icon: FolderOpen,
    description: "Previously generated batch reports",
  },
];

export function DispatchPage() {
  const [activeTab, setActiveTab] = useState<Tab>("queue");

  return (
    <div className="flex h-full flex-col">
      <TopBar
        title="Dispatch Center"
        subtitle="Batch-send pending employees to the insurer and track report history"
      />

      <div className="flex-1 overflow-y-auto p-6">
        <Tabs.Root
          value={activeTab}
          onValueChange={(v) => setActiveTab(v as Tab)}
          className="flex flex-col gap-6"
        >
          {/* Tab list */}
          <Tabs.List className="flex gap-1 rounded-xl border border-slate-200 bg-slate-50 p-1">
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
                    id === "queue"
                      ? "group-data-[state=active]:text-blue-600"
                      : "group-data-[state=active]:text-slate-600",
                    "group-data-[state=inactive]:text-slate-400"
                  )}
                />
                <div className="min-w-0 text-left">
                  <p className="font-medium leading-tight">{label}</p>
                  <p className="hidden truncate text-xs text-slate-400 sm:block">
                    {description}
                  </p>
                </div>
              </Tabs.Trigger>
            ))}
          </Tabs.List>

          <Tabs.Content value="queue">
            <PendingQueuePanel />
          </Tabs.Content>

          <Tabs.Content value="history">
            <FileHistoryTable />
          </Tabs.Content>
        </Tabs.Root>
      </div>
    </div>
  );
}
