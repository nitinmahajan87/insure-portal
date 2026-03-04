import { UserPlus, UserMinus, Zap } from "lucide-react";
import { TopBar } from "@/components/layout/TopBar";
import { AddEmployeeForm } from "./components/AddEmployeeForm";
import { RemoveEmployeeForm } from "./components/RemoveEmployeeForm";

export function EmployeesPage() {
  return (
    <div className="flex h-full flex-col">
      <TopBar
        title="Employee Directory"
        subtitle="Add or remove employees from insurance coverage in real-time"
      />

      <div className="flex-1 overflow-y-auto p-6">
        <div className="mx-auto max-w-5xl space-y-6">
          {/* Real-time sync notice */}
          <div className="flex items-center gap-2 rounded-xl border border-blue-100 bg-blue-50/60 px-4 py-3">
            <Zap className="h-4 w-4 shrink-0 text-blue-500" />
            <p className="text-sm text-blue-700">
              Changes are processed{" "}
              <strong>in real-time</strong> — each submission triggers an
              immediate background sync to the insurer.
            </p>
          </div>

          {/* Two-column form layout */}
          <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
            {/* ── Add Employee ────────────────────────────────────────── */}
            <FormCard
              title="Add Employee"
              description="Enrol a new employee into insurance coverage"
              icon={UserPlus}
              iconBg="bg-blue-50"
              iconColor="text-blue-600"
              accentBorder="border-t-blue-500"
            >
              <AddEmployeeForm />
            </FormCard>

            {/* ── Remove Employee ─────────────────────────────────────── */}
            <FormCard
              title="Remove Employee"
              description="Terminate an employee's insurance coverage"
              icon={UserMinus}
              iconBg="bg-red-50"
              iconColor="text-red-600"
              accentBorder="border-t-red-400"
            >
              <RemoveEmployeeForm />
            </FormCard>
          </div>

          {/* Field guide */}
          <FieldGuide />
        </div>
      </div>
    </div>
  );
}

// ── Form card wrapper ──────────────────────────────────────────────────────

interface FormCardProps {
  title: string;
  description: string;
  icon: React.ElementType;
  iconBg: string;
  iconColor: string;
  accentBorder: string;
  children: React.ReactNode;
}

function FormCard({
  title,
  description,
  icon: Icon,
  iconBg,
  iconColor,
  accentBorder,
  children,
}: FormCardProps) {
  return (
    <div
      className={`overflow-hidden rounded-2xl border border-slate-200 bg-white border-t-4 ${accentBorder}`}
    >
      {/* Header */}
      <div className="border-b border-slate-100 px-6 py-5">
        <div className="flex items-center gap-3">
          <div className={`flex h-9 w-9 items-center justify-center rounded-xl ${iconBg}`}>
            <Icon className={`h-4.5 w-4.5 ${iconColor}`} />
          </div>
          <div>
            <h2 className="text-base font-semibold text-slate-800">{title}</h2>
            <p className="text-xs text-slate-400">{description}</p>
          </div>
        </div>
      </div>

      {/* Form body */}
      <div className="px-6 py-5">{children}</div>
    </div>
  );
}

// ── Field reference guide ──────────────────────────────────────────────────

function FieldGuide() {
  const fields = [
    { name: "Employee ID", required: true,  desc: "Unique identifier from your HRMS (e.g. EMP-001). Used for deduplication." },
    { name: "Full Name",   required: true,  desc: "Employee's legal name as it appears on official documents." },
    { name: "Email",       required: false, desc: "Corporate email. Used for policy notifications by the insurer." },
    { name: "Date of Birth", required: false, desc: "Required by some insurers for premium calculation." },
    { name: "Date of Joining", required: true, desc: "Policy coverage start date defaults to this value." },
    { name: "Effective Date (Remove)", required: false, desc: "Coverage termination date. Defaults to the dispatch date if omitted." },
    { name: "Reason (Remove)", required: false, desc: "Stored for internal audit trail. Not sent to the insurer." },
  ];

  return (
    <div className="rounded-2xl border border-slate-200 bg-white">
      <div className="border-b border-slate-100 px-6 py-4">
        <h3 className="text-sm font-semibold text-slate-700">Field Reference</h3>
        <p className="text-xs text-slate-400">
          What each field means and where it's used
        </p>
      </div>
      <div className="divide-y divide-slate-50">
        {fields.map((f) => (
          <div key={f.name} className="grid grid-cols-[160px_1fr_60px] gap-4 px-6 py-3.5">
            <p className="text-sm font-medium text-slate-700">{f.name}</p>
            <p className="text-xs text-slate-500">{f.desc}</p>
            <span
              className={
                f.required
                  ? "self-start rounded-full bg-red-50 px-2 py-0.5 text-xs font-medium text-red-600"
                  : "self-start rounded-full bg-slate-100 px-2 py-0.5 text-xs font-medium text-slate-500"
              }
            >
              {f.required ? "Required" : "Optional"}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}
