import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { UserMinus, Loader2, Info, CheckCircle2, ShieldAlert } from "lucide-react";
import { PortalRemoveSchema, type PortalRemoveForm as TPortalRemoveForm } from "@/api/types/portal";
import { FormField } from "./FormField";
import { SubmitSuccess } from "./SubmitSuccess";
import { useRemoveEmployee } from "../hooks/useRemoveEmployee";
import { useEmployeeLookup } from "../hooks/useEmployeeLookup";
import { getErrorMessage } from "@/lib/errorParser";
import type { ApiError } from "@/api/client";

export function RemoveEmployeeForm() {
  const { mutate, isPending, isSuccess, isError, error, data, reset: resetMutation } =
    useRemoveEmployee();
  const { state: lookupState, lookup, reset: resetLookup } = useEmployeeLookup();
  const [forceConfirmed, setForceConfirmed] = useState(false);

  const {
    register,
    handleSubmit,
    watch,
    reset: resetForm,
    setValue,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(PortalRemoveSchema),
    defaultValues: { force: false },
  });

  // Extract registrations ONCE — never inside JSX (causes re-registration on every render)
  const { onBlur: empCodeRhfBlur, ...empCodeReg } = register("employee_code");

  const watchedName = watch("name", "");

  // Detect "not enrolled" 422 as fallback when blur lookup didn't fire
  const apiError = isError ? getErrorMessage(error) : null;
  const isNotEnrolledError =
    isError &&
    (error as unknown as ApiError)?.status === 422 &&
    apiError?.description?.includes("not enrolled");

  // Show force UI when lookup found not_found OR when backend returned 422 not-enrolled
  const showForceUI = lookupState.status === "not_found" || isNotEnrolledError;
  const submitBlocked = showForceUI && !forceConfirmed;

  async function handleEmployeeCodeBlur(e: React.FocusEvent<HTMLInputElement>) {
    const code = e.target.value.trim();
    if (!code) return;
    const emp = await lookup(code);
    if (emp) {
      setValue("name", `${emp.first_name} ${emp.last_name}`);
    }
  }

  function onSubmit(values: TPortalRemoveForm) {
    mutate({
      ...values,
      reason: values.reason || undefined,
      force: forceConfirmed,
    });
  }

  function handleReset() {
    resetMutation();
    resetLookup();
    resetForm();
    setForceConfirmed(false);
  }

  // ── Success state ─────────────────────────────────────────────────────────
  if (isSuccess && data) {
    return (
      <SubmitSuccess
        variant="remove"
        employeeName={watchedName || "Employee"}
        transactionId={data.transaction_id}
        onReset={handleReset}
      />
    );
  }

  // ── Form ──────────────────────────────────────────────────────────────────
  return (
    <form onSubmit={(e) => void handleSubmit(onSubmit)(e)} noValidate>
      <div className="space-y-4">

        {/* Notice banner */}
        <div className="flex items-start gap-2 rounded-xl border border-amber-100 bg-amber-50 px-4 py-3">
          <Info className="mt-0.5 h-4 w-4 shrink-0 text-amber-600" />
          <p className="text-xs text-amber-800">
            Removing an employee queues a termination request. The insurer is notified
            on the next batch dispatch. Ensure the employee record matches your HRMS.
          </p>
        </div>

        {/* Lookup feedback */}
        {lookupState.status === "found" && (
          <div className="flex items-center gap-2 rounded-xl border border-green-100 bg-green-50 px-4 py-3">
            <CheckCircle2 className="h-4 w-4 shrink-0 text-green-600" />
            <p className="text-sm text-green-700">Employee found — name pre-filled for confirmation.</p>
          </div>
        )}

        {/* Force-removal UI — shown on lookup not_found OR 422 not-enrolled from API */}
        {showForceUI && (
          <div className="space-y-3 rounded-xl border border-red-100 bg-red-50 p-4">
            <div className="flex items-start gap-2">
              <ShieldAlert className="mt-0.5 h-4 w-4 shrink-0 text-red-600" />
              <div>
                <p className="text-sm font-medium text-red-700">Employee not found in our system</p>
                <p className="mt-0.5 text-xs text-red-600">
                  This employee has no active enrolment record. Proceeding will send a
                  termination signal to the insurer — only do this if they were enrolled
                  via HRMS webhook or batch upload outside this portal.
                </p>
              </div>
            </div>
            <label className="flex cursor-pointer items-start gap-3 rounded-lg border border-red-200 bg-white px-3 py-2.5">
              <input
                type="checkbox"
                className="mt-0.5 h-4 w-4 shrink-0 accent-red-600"
                checked={forceConfirmed}
                onChange={(e) => setForceConfirmed(e.target.checked)}
              />
              <span className="text-xs text-red-700">
                <strong>I understand the risk.</strong> Proceed with force-removal.
              </span>
            </label>
          </div>
        )}

        {/* Employee Code + Full Name */}
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <FormField
            label="Employee Code"
            required
            placeholder="EMP-001"
            error={errors.employee_code?.message}
            disabled={isPending}
            {...empCodeReg}
            onBlur={async (e: React.FocusEvent<HTMLInputElement>) => {
              void empCodeRhfBlur(e);
              await handleEmployeeCodeBlur(e);
            }}
          />
          <FormField
            label="Full Name"
            required
            placeholder="Rahul Sharma"
            hint="auto-filled · for confirmation only"
            error={errors.name?.message}
            disabled={isPending}
            {...register("name")}
          />
        </div>

        <FormField
          label="Date of Leaving"
          type="date"
          required
          error={errors.date_of_leaving?.message}
          disabled={isPending}
          {...register("date_of_leaving")}
        />

        <FormField
          as="textarea"
          label="Reason"
          hint="optional"
          placeholder="e.g. Resigned, Contract ended, Transferred to another policy…"
          error={errors.reason?.message}
          disabled={isPending}
          {...register("reason")}
        />

        {/* API error — hide the not-enrolled message since we show the force UI instead */}
        {apiError && !isNotEnrolledError && (
          <div className="rounded-xl border border-red-100 bg-red-50 px-4 py-3">
            <p className="text-sm font-medium text-red-700">{apiError.title}</p>
            <p className="text-xs text-red-600">{apiError.description}</p>
          </div>
        )}

        <button
          type="submit"
          disabled={isPending || submitBlocked}
          className="inline-flex w-full items-center justify-center gap-2 rounded-xl bg-red-600 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-red-700 active:bg-red-800 disabled:cursor-not-allowed disabled:opacity-60"
        >
          {isPending ? (
            <>
              <Loader2 className="h-4 w-4 animate-spin" />
              Queuing Removal…
            </>
          ) : forceConfirmed ? (
            <>
              <ShieldAlert className="h-4 w-4" />
              Force Remove from Coverage
            </>
          ) : (
            <>
              <UserMinus className="h-4 w-4" />
              Remove from Coverage
            </>
          )}
        </button>
      </div>
    </form>
  );
}
