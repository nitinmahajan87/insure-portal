import { Link, useRouterState } from "@tanstack/react-router";
import {
  LayoutDashboard,
  Users,
  Upload,
  Send,
  ClipboardList,
  Shield,
  LogOut,
  Building2,
  FileCheck,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { useAuthStore } from "@/store/authStore";

// ── HR nav — all 5 modules ────────────────────────────────────────────────────
const HR_NAV = [
  { to: "/",           icon: LayoutDashboard, label: "Dashboard",   exact: true  },
  { to: "/employees",  icon: Users,           label: "Employees",   exact: false },
  { to: "/batch",      icon: Upload,          label: "Batch Center", exact: false },
  { to: "/dispatch",   icon: Send,            label: "Dispatch",    exact: false },
  { to: "/audit",      icon: ClipboardList,   label: "Audit Log",   exact: false },
] as const;

// ── Broker nav — dispatch + audit available now; portfolio & insurer response in Steps 4-5 ──
const BROKER_NAV_ACTIVE = [
  { to: "/",         icon: LayoutDashboard, label: "Dashboard",      exact: true  },
  { to: "/dispatch", icon: Send,            label: "Dispatch Center", exact: false },
  { to: "/audit",    icon: ClipboardList,   label: "Audit Log",      exact: false },
] as const;

const BROKER_NAV_SOON = [
  { icon: Building2, label: "My Portfolio" },
  { icon: FileCheck, label: "Insurer Response" },
] as const;


export function Sidebar() {
  const { tenantName, scope, clearCredentials } = useAuthStore();
  const pathname = useRouterState({ select: (s) => s.location.pathname });

  const isBroker = scope === "broker";
  const portalLabel = isBroker ? "Broker Portal" : "HR Portal";
  const activeNav = isBroker ? BROKER_NAV_ACTIVE : HR_NAV;

  return (
    <aside className="flex h-screen w-60 flex-col border-r border-slate-200 bg-white">

      {/* ── Logo / Brand ─────────────────────────────────────────────────────── */}
      <div className="flex h-16 items-center gap-3 border-b border-slate-200 px-5">
        <div
          className={cn(
            "flex h-8 w-8 items-center justify-center rounded-lg",
            isBroker ? "bg-amber-500" : "bg-blue-600"
          )}
        >
          <Shield className="h-4 w-4 text-white" />
        </div>
        <div className="min-w-0">
          <p className="truncate text-sm font-semibold text-slate-900">InsureTech</p>
          <p className={cn("text-xs", isBroker ? "text-amber-500" : "text-slate-400")}>
            {portalLabel}
          </p>
        </div>
      </div>

      {/* ── Tenant / Broker name ─────────────────────────────────────────────── */}
      {tenantName && (
        <div className="border-b border-slate-100 bg-slate-50 px-5 py-2.5">
          <p className="truncate text-xs font-medium text-slate-500">{tenantName}</p>
        </div>
      )}

      {/* ── Navigation ───────────────────────────────────────────────────────── */}
      <nav className="flex-1 space-y-0.5 overflow-y-auto px-3 py-4">

        {/* Active nav links */}
        {activeNav.map((item) => {
          const { to, icon: Icon, label, exact } = item;
          const isActive = exact ? pathname === to : pathname.startsWith(to) && to !== "/";
          const isHome   = to === "/" && pathname === "/";
          const active   = isActive || isHome;
          return (
            <Link
              key={to}
              to={to}
              className={cn(
                "flex items-center gap-3 rounded-lg px-3 py-2 text-sm transition-colors",
                active
                  ? isBroker
                    ? "bg-amber-50 font-medium text-amber-700"
                    : "bg-blue-50 font-medium text-blue-700"
                  : "text-slate-600 hover:bg-slate-100 hover:text-slate-900"
              )}
            >
              <Icon className="h-4 w-4 shrink-0" />
              {label}
            </Link>
          );
        })}

        {/* Coming-soon items — broker only, non-clickable */}
        {isBroker && BROKER_NAV_SOON.length > 0 && (
          <>
            <div className="px-3 pb-1 pt-4">
              <p className="text-[10px] font-semibold uppercase tracking-wider text-slate-400">
                Coming Soon
              </p>
            </div>
            {BROKER_NAV_SOON.map(({ icon: Icon, label }) => (
              <div
                key={label}
                className="flex items-center gap-3 rounded-lg px-3 py-2 text-sm text-slate-300 cursor-not-allowed select-none"
              >
                <Icon className="h-4 w-4 shrink-0" />
                <span>{label}</span>
                <span className="ml-auto rounded-full bg-slate-100 px-1.5 py-0.5 text-[10px] font-medium text-slate-400">
                  Soon
                </span>
              </div>
            ))}
          </>
        )}
      </nav>

      {/* ── Sign out ─────────────────────────────────────────────────────────── */}
      <div className="border-t border-slate-200 p-3">
        <button
          onClick={clearCredentials}
          className="flex w-full items-center gap-3 rounded-lg px-3 py-2 text-sm text-slate-500 transition-colors hover:bg-red-50 hover:text-red-600"
        >
          <LogOut className="h-4 w-4" />
          Sign out
        </button>
      </div>
    </aside>
  );
}
