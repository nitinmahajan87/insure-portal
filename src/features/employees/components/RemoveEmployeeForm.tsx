import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { UserMinus, Loader2, Info } from "lucide-react";
import { RemoveEmployeeSchema, type RemoveEmployeeForm as TRemoveEmployeeForm } from "@/api/types/employee";
import { FormField } from "./FormField";
import { SubmitSuccess } from "./SubmitSuccess";
import { useRemoveEmployee } from "../hooks/useRemoveEmployee";
import { getErrorMessage } from "@/lib/errorParser";

export function RemoveEmployeeForm() {
  const { mutate, isPending, isSuccess, isError, error, data, reset: resetMutation } =
    useRemoveEmployee();

  const {
    register,
    handleSubmit,
    watch,
    reset: resetForm,
    formState: { errors },
  } = useForm<TRemoveEmployeeForm>({
    resolver: zodResolver(RemoveEmployeeSchema),
  });

  // Watch name so we can pass it to the success card
  const watchedName = watch("name", "");

  function onSubmit(values: TRemoveEmployeeForm) {
    const payload: TRemoveEmployeeForm = {
      ...values,
      effective_date: values.effective_date || undefined,
      reason: values.reason || undefined,
    };
    mutate(payload);
  }

  function handleReset() {
    resetMutation();
    resetForm();
  }

  // ── Success state ────────────────────────────────────────────────────────
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

  const apiError = isError ? getErrorMessage(error) : null;

  // ── Form ─────────────────────────────────────────────────────────────────
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

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <FormField
            label="Employee ID"
            required
            placeholder="EMP-001"
            error={errors.employee_id?.message}
            disabled={isPending}
            {...register("employee_id")}
          />
          <FormField
            label="Full Name"
            required
            placeholder="Jane Smith"
            error={errors.name?.message}
            disabled={isPending}
            {...register("name")}
          />
        </div>

        <FormField
          label="Effective Date"
          type="date"
          hint="optional — defaults to today"
          error={errors.effective_date?.message}
          disabled={isPending}
          {...register("effective_date")}
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
          className="inline-flex w-full items-center justify-center gap-2 rounded-xl bg-red-600 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-red-700 active:bg-red-800 disabled:cursor-not-allowed disabled:opacity-60"
        >
          {isPending ? (
            <>
              <Loader2 className="h-4 w-4 animate-spin" />
              Queuing Removal…
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
