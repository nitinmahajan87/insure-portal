import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { UserPlus, Loader2 } from "lucide-react";
import { AddEmployeeSchema, type AddEmployeeForm as TAddEmployeeForm } from "@/api/types/employee";
import { FormField } from "./FormField";
import { SubmitSuccess } from "./SubmitSuccess";
import { useAddEmployee } from "../hooks/useAddEmployee";
import { getErrorMessage } from "@/lib/errorParser";

export function AddEmployeeForm() {
  const { mutate, isPending, isSuccess, isError, error, data, reset: resetMutation } =
    useAddEmployee();

  const {
    register,
    handleSubmit,
    reset: resetForm,
    formState: { errors },
  } = useForm<TAddEmployeeForm>({
    resolver: zodResolver(AddEmployeeSchema),
  });

  function onSubmit(values: TAddEmployeeForm) {
    // Strip empty optional strings before sending
    const payload: TAddEmployeeForm = {
      ...values,
      email: values.email || undefined,
      date_of_birth: values.date_of_birth || undefined,
    };
    mutate(payload);
  }

  function handleReset() {
    resetMutation();
    resetForm();
  }

  // ── Success state ────────────────────────────────────────────────────────
  if (isSuccess && data) {
    // Extract employee name from the last submitted form values via data message
    // (the server echoes it back or we use the form's last values)
    return (
      <SubmitSuccess
        variant="add"
        employeeName={data.message.includes("added") ? data.message : "Employee"}
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
          label="Email"
          type="email"
          hint="optional"
          placeholder="jane@company.com"
          error={errors.email?.message}
          disabled={isPending}
          {...register("email")}
        />

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
