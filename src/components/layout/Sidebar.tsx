import { Link, useRouterState } from "@tanstack/react-router";
import {
  LayoutDashboard,
  Users,
  Upload,
  Send,
  ClipboardList,
  Shield,
  LogOut,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { useAuthStore } from "@/store/authStore";

const NAV_ITEMS = [
  { to: "/", icon: LayoutDashboard, label: "Dashboard", exact: true },
  { to: "/employees", icon: Users, label: "Employees" },
  { to: "/batch", icon: Upload, label: "Batch Center" },
  { to: "/dispatch", icon: Send, label: "Dispatch" },
  { to: "/audit", icon: ClipboardList, label: "Audit Log" },
] as const;

export function Sidebar() {
  const { tenantName, scope, clearCredentials } = useAuthStore();
  const pathname = useRouterState({ select: (s) => s.location.pathname });

  return (
    <aside className="flex h-screen w-60 flex-col border-r border-slate-200 bg-white">
      {/* Logo / Brand */}
      <div className="flex h-16 items-center gap-3 border-b border-slate-200 px-5">
        <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-blue-600">
          <Shield className="h-4 w-4 text-white" />
        </div>
        <div className="min-w-0">
          <p className="truncate text-sm font-semibold text-slate-900">InsureTech</p>
          <p className="text-xs text-slate-400 capitalize">{scope ?? "HR Portal"}</p>
        </div>
      </div>

      {/* Tenant name */}
      {tenantName && (
        <div className="border-b border-slate-100 bg-slate-50 px-5 py-2.5">
          <p className="truncate text-xs font-medium text-slate-500">{tenantName}</p>
        </div>
      )}

      {/* Navigation */}
      <nav className="flex-1 space-y-0.5 overflow-y-auto px-3 py-4">
        {NAV_ITEMS.map((item) => {
          const { to, icon: Icon, label } = item;
          const exact = "exact" in item ? item.exact : false;
          const isActive = exact ? pathname === to : pathname.startsWith(to) && to !== "/";
          const isHome = to === "/" && pathname === "/";
          const active = isActive || isHome;
          return (
            <Link
              key={to}
              to={to}
              className={cn(
                "flex items-center gap-3 rounded-lg px-3 py-2 text-sm transition-colors",
                active
                  ? "bg-blue-50 font-medium text-blue-700"
                  : "text-slate-600 hover:bg-slate-100 hover:text-slate-900"
              )}
            >
              <Icon className="h-4 w-4 shrink-0" />
              {label}
            </Link>
          );
        })}
      </nav>

      {/* Logout */}
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
