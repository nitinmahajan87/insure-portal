import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { UserPlus, Pencil, Loader2, Info, CheckCircle2 } from "lucide-react";
import { PortalAddSchema } from "@/api/types/portal";
import type { PortalAddForm as TPortalAddForm } from "@/api/types/portal";
import { FormField } from "./FormField";
import { SubmitSuccess } from "./SubmitSuccess";
import { useAddEmployee } from "../hooks/useAddEmployee";
import { useEmployeeLookup } from "../hooks/useEmployeeLookup";
import { getErrorMessage } from "@/lib/errorParser";
import { cn } from "@/lib/utils";

export function AddEmployeeForm() {
  const { mutate, isPending, isSuccess, isError, error, data, reset: resetMutation } =
    useAddEmployee();
  const { state: lookupState, lookup, reset: resetLookup } = useEmployeeLookup();

  const {
    register,
    handleSubmit,
    reset: resetForm,
    setValue,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(PortalAddSchema),
    defaultValues: { gender: "Unknown" as TPortalAddForm["gender"] },
  });

  const { onBlur: empCodeRhfBlur, ...empCodeReg } = register("employee_code");

  async function handleEmployeeCodeBlur(e: React.FocusEvent<HTMLInputElement>) {
    const code = e.target.value.trim();
    if (!code) return;
    const emp = await lookup(code);
    if (emp) {
      // Pre-fill all fields with existing employee data
      setValue("first_name", emp.first_name ?? "");
      setValue("last_name", emp.last_name ?? "");
      setValue("email", emp.email ?? "");
      setValue("gender", (emp.gender as TPortalAddForm["gender"]) ?? "Unknown");
      setValue("date_of_birth", emp.date_of_birth ?? "");
      setValue("date_of_joining", emp.date_of_joining ?? "");
    }
  }

  function onSubmit(values: TPortalAddForm) {
    mutate({
      ...values,
      email: values.email || undefined,
      date_of_birth: values.date_of_birth || undefined,
    });
  }

  function handleReset() {
    resetMutation();
    resetLookup();
    resetForm();
  }

  // ── Success state ─────────────────────────────────────────────────────────
  if (isSuccess && data) {
    const variant =
      data.transaction_id === "DUPLICATE" ? "duplicate"
      : data.message.includes("updated and re-synced") ? "updated"
      : "add";
    return (
      <SubmitSuccess
        variant={variant}
        employeeName={data.message}
        transactionId={data.transaction_id}
        onReset={handleReset}
      />
    );
  }

  const apiError = isError ? getErrorMessage(error) : null;
  const isExisting = lookupState.status === "found";
  const isLooking = lookupState.status === "loading";

  // ── Form ──────────────────────────────────────────────────────────────────
  return (
    <form onSubmit={(e) => void handleSubmit(onSubmit)(e)} noValidate>
      <div className="space-y-4">

        {/* Existing employee banner */}
        {isExisting && (
          <div className="flex items-start gap-2.5 rounded-xl border border-blue-100 bg-blue-50 px-4 py-3">
            <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-blue-600" />
            <div>
              <p className="text-sm font-medium text-blue-800">Existing employee found</p>
              <p className="text-xs text-blue-600">
                Fields pre-filled with current data. Modify what changed and submit to update.
              </p>
            </div>
          </div>
        )}
        {lookupState.status === "not_found" && (
          <div className="flex items-start gap-2.5 rounded-xl border border-green-100 bg-green-50 px-4 py-3">
            <Info className="mt-0.5 h-4 w-4 shrink-0 text-green-600" />
            <p className="text-sm text-green-700">New employee — fill in the details below to enrol them.</p>
          </div>
        )}
        {/* error state: silent — don't alarm HR, form still works */}

        {/* Employee Code — auto-lookup on blur */}
        <div className="relative">
          <FormField
            label="Employee Code"
            required
            placeholder="EMP-001"
            hint="Unique ID in your HRMS — we'll check if this employee already exists"
            error={errors.employee_code?.message}
            disabled={isPending}
            {...empCodeReg}
            onBlur={async (e: React.FocusEvent<HTMLInputElement>) => {
              void empCodeRhfBlur(e);
              await handleEmployeeCodeBlur(e);
            }}
          />
          {isLooking && (
            <div className="absolute right-3 top-9 flex items-center gap-1 text-xs text-slate-400">
              <Loader2 className="h-3 w-3 animate-spin" /> Checking…
            </div>
          )}
        </div>

        {/* First Name + Last Name */}
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <FormField
            label="First Name"
            required
            placeholder="Rahul"
            error={errors.first_name?.message}
            disabled={isPending}
            {...register("first_name")}
          />
          <FormField
            label="Last Name"
            required
            placeholder="Sharma"
            error={errors.last_name?.message}
            disabled={isPending}
            {...register("last_name")}
          />
        </div>

        {/* Gender */}
        <div>
          <label className="mb-1.5 block text-sm font-medium text-slate-700">
            Gender <span className="text-xs font-normal text-slate-400">(optional)</span>
          </label>
          <select
            className={cn(
              "w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm text-slate-800",
              "focus-visible:border-blue-500 focus-visible:ring-2 focus-visible:ring-blue-100",
              "disabled:cursor-not-allowed disabled:opacity-50"
            )}
            disabled={isPending}
            {...register("gender")}
          >
            <option value="Unknown">Prefer not to say</option>
            <option value="Male">Male</option>
            <option value="Female">Female</option>
            <option value="Other">Other</option>
          </select>
        </div>

        {/* Email */}
        <FormField
          label="Work Email"
          type="email"
          hint="optional"
          placeholder="rahul.sharma@acme.com"
          error={errors.email?.message}
          disabled={isPending}
          {...register("email")}
        />

        {/* Dates */}
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <FormField
            label="Date of Birth"
            type="date"
            hint="optional"
            error={errors.date_of_birth?.message}
            disabled={isPending}
            {...register("date_of_birth")}
          />
          <FormField
            label="Date of Joining"
            type="date"
            required
            error={errors.date_of_joining?.message}
            disabled={isPending}
            {...register("date_of_joining")}
          />
        </div>

        {/* API error */}
        {apiError && (
          <div className="rounded-xl border border-red-100 bg-red-50 px-4 py-3">
            <p className="text-sm font-medium text-red-700">{apiError.title}</p>
            <p className="text-xs text-red-600">{apiError.description}</p>
          </div>
        )}

        <button
          type="submit"
          disabled={isPending}
          className="inline-flex w-full items-center justify-center gap-2 rounded-xl bg-blue-600 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-blue-700 active:bg-blue-800 disabled:cursor-not-allowed disabled:opacity-60"
        >
          {isPending ? (
            <>
              <Loader2 className="h-4 w-4 animate-spin" />
              Queuing…
            </>
          ) : isExisting ? (
            <>
              <Pencil className="h-4 w-4" />
              Update Coverage Details
            </>
          ) : (
            <>
              <UserPlus className="h-4 w-4" />
              Add to Coverage
            </>
          )}
        </button>
      </div>
    </form>
  );
}
