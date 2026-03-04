import { useState } from "react";
import { Shield } from "lucide-react";
import { useAuthStore } from "@/store/authStore";
import type { ApiKeyScope } from "@/store/authStore";
import { cn } from "@/lib/utils";

export function LoginPage() {
  const setCredentials = useAuthStore((s) => s.setCredentials);
  const [apiKey, setApiKey] = useState("");
  const [tenantName, setTenantName] = useState("");
  const [scope, setScope] = useState<ApiKeyScope>("corporate");
  const [corporateId, setCorporateId] = useState("");
  const [error, setError] = useState("");

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!apiKey.trim()) {
      setError("API key is required.");
      return;
    }
    setCredentials({
      apiKey: apiKey.trim(),
      tenantName: tenantName.trim() || undefined,
      scope,
      corporateId: scope === "broker" && corporateId ? corporateId : undefined,
    });
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-slate-50 p-4">
      <div className="w-full max-w-sm">
        {/* Logo */}
        <div className="mb-8 flex flex-col items-center gap-3">
          <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-blue-600 shadow-lg">
            <Shield className="h-6 w-6 text-white" />
          </div>
          <div className="text-center">
            <h1 className="text-xl font-bold text-slate-900">InsureTech Portal</h1>
            <p className="text-sm text-slate-500">HR Insurance Management</p>
          </div>
        </div>

        {/* Card */}
        <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
          <h2 className="mb-5 text-base font-semibold text-slate-800">Sign in with API Key</h2>

          <form onSubmit={handleSubmit} className="space-y-4">
            {/* API Key */}
            <div>
              <label className="mb-1.5 block text-sm font-medium text-slate-700">
                API Key
              </label>
              <input
                type="password"
                value={apiKey}
                onChange={(e) => setApiKey(e.target.value)}
                placeholder="ins_••••••••••••••••"
                className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm placeholder-slate-400 focus-visible:border-blue-500 focus-visible:ring-2 focus-visible:ring-blue-100"
              />
            </div>

            {/* Tenant Name (optional) */}
            <div>
              <label className="mb-1.5 block text-sm font-medium text-slate-700">
                Tenant Name <span className="text-slate-400">(optional)</span>
              </label>
              <input
                type="text"
                value={tenantName}
                onChange={(e) => setTenantName(e.target.value)}
                placeholder="Acme Corp"
                className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm placeholder-slate-400 focus-visible:border-blue-500 focus-visible:ring-2 focus-visible:ring-blue-100"
              />
            </div>

            {/* Scope toggle */}
            <div>
              <label className="mb-1.5 block text-sm font-medium text-slate-700">Scope</label>
              <div className="flex rounded-lg border border-slate-300 p-0.5">
                {(["corporate", "broker"] as const).map((s) => (
                  <button
                    key={s}
                    type="button"
                    onClick={() => setScope(s)}
                    className={cn(
                      "flex-1 rounded-md px-3 py-1.5 text-xs font-medium transition-colors capitalize",
                      scope === s
                        ? "bg-blue-600 text-white shadow-sm"
                        : "text-slate-500 hover:text-slate-700"
                    )}
                  >
                    {s}
                  </button>
                ))}
              </div>
            </div>

            {/* Corporate ID for broker scope */}
            {scope === "broker" && (
              <div>
                <label className="mb-1.5 block text-sm font-medium text-slate-700">
                  Corporate ID <span className="text-slate-400">(optional)</span>
                </label>
                <input
                  type="text"
                  value={corporateId}
                  onChange={(e) => setCorporateId(e.target.value)}
                  placeholder="123"
                  className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm placeholder-slate-400 focus-visible:border-blue-500 focus-visible:ring-2 focus-visible:ring-blue-100"
                />
              </div>
            )}

            {error && (
              <p className="rounded-lg bg-red-50 px-3 py-2 text-xs text-red-600">{error}</p>
            )}

            <button
              type="submit"
              className="w-full rounded-lg bg-blue-600 px-4 py-2.5 text-sm font-medium text-white transition-colors hover:bg-blue-700 active:bg-blue-800"
            >
              Continue
            </button>
          </form>
        </div>

        <p className="mt-4 text-center text-xs text-slate-400">
          Contact your administrator to get an API key.
        </p>
      </div>
    </div>
  );
}
