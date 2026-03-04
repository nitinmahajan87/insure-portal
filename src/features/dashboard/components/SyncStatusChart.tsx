import {
  PieChart,
  Pie,
  Cell,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import { Shimmer } from "@/components/TableSkeleton";

interface ChartEntry {
  name: string;
  value: number;
  color: string;
}

interface SyncStatusChartProps {
  data: ChartEntry[];
  total: number | null;
  healthPct: number | null;
  isLoading: boolean;
}

export function SyncStatusChart({
  data,
  total,
  healthPct,
  isLoading,
}: SyncStatusChartProps) {
  const hasData = total !== null && total > 0;

  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-5">
      <div className="mb-1 flex items-center justify-between">
        <h3 className="text-sm font-semibold text-slate-700">Pipeline Health</h3>
        {healthPct !== null && (
          <span
            className={
              healthPct >= 90
                ? "text-xs font-semibold text-green-600"
                : healthPct >= 70
                ? "text-xs font-semibold text-amber-600"
                : "text-xs font-semibold text-red-600"
            }
          >
            {healthPct}% success rate
          </span>
        )}
      </div>
      <p className="mb-4 text-xs text-slate-400">
        Distribution of sync outcomes across all records
      </p>

      {isLoading ? (
        <div className="flex items-center justify-center py-8">
          <Shimmer className="h-40 w-40 rounded-full" />
        </div>
      ) : !hasData ? (
        <div className="flex flex-col items-center justify-center py-10 text-center">
          <p className="text-sm text-slate-400">No sync data yet</p>
          <p className="text-xs text-slate-300">
            Start syncing employees to see pipeline health.
          </p>
        </div>
      ) : (
        <div className="relative">
          <ResponsiveContainer width="100%" height={220}>
            <PieChart>
              <Pie
                data={data}
                cx="50%"
                cy="50%"
                innerRadius={65}
                outerRadius={90}
                paddingAngle={3}
                dataKey="value"
                startAngle={90}
                endAngle={-270}
                strokeWidth={0}
              >
                {data.map((entry) => (
                  <Cell key={entry.name} fill={entry.color} />
                ))}
              </Pie>
              <Tooltip content={<CustomTooltip total={total!} />} />
            </PieChart>
          </ResponsiveContainer>

          {/* Center overlay — health % */}
          <div className="pointer-events-none absolute inset-0 flex flex-col items-center justify-center">
            <p className="text-2xl font-bold text-slate-900">{healthPct}%</p>
            <p className="text-xs text-slate-400">healthy</p>
          </div>
        </div>
      )}

      {/* Legend */}
      {hasData && (
        <div className="mt-3 flex justify-center gap-5">
          {data.map((entry) => (
            <div key={entry.name} className="flex items-center gap-1.5">
              <span
                className="inline-block h-2.5 w-2.5 rounded-full"
                style={{ backgroundColor: entry.color }}
              />
              <span className="text-xs text-slate-500">
                {entry.name} ({entry.value.toLocaleString()})
              </span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

interface TooltipEntry {
  name: string;
  value: number;
  payload: { color: string };
}

function CustomTooltip({
  active,
  payload,
  total,
}: {
  active?: boolean;
  payload?: TooltipEntry[];
  total: number;
}) {
  if (!active || !payload?.length) return null;
  const entry = payload[0];
  const pct = total > 0 ? Math.round((entry.value / total) * 100) : 0;

  return (
    <div className="rounded-xl border border-slate-200 bg-white px-3 py-2 shadow-lg">
      <div className="flex items-center gap-2">
        <span
          className="h-2.5 w-2.5 rounded-full"
          style={{ backgroundColor: entry.payload.color }}
        />
        <span className="text-xs font-medium text-slate-700">{entry.name}</span>
      </div>
      <p className="mt-0.5 text-sm font-bold text-slate-900">
        {entry.value.toLocaleString()}
        <span className="ml-1 text-xs font-normal text-slate-400">({pct}%)</span>
      </p>
    </div>
  );
}
