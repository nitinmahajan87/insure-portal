import { type InputHTMLAttributes, type TextareaHTMLAttributes } from "react";
import { cn } from "@/lib/utils";

interface BaseProps {
  label: string;
  error?: string;
  required?: boolean;
  hint?: string;
  className?: string;
}

type InputProps = BaseProps &
  InputHTMLAttributes<HTMLInputElement> & { as?: "input" };

type TextareaProps = BaseProps &
  TextareaHTMLAttributes<HTMLTextAreaElement> & { as: "textarea" };

type FormFieldProps = InputProps | TextareaProps;

const INPUT_BASE =
  "w-full rounded-xl border bg-white px-3.5 py-2.5 text-sm text-slate-900 placeholder-slate-400 " +
  "transition-colors focus:outline-none focus:ring-2 focus:ring-blue-100 " +
  "disabled:cursor-not-allowed disabled:bg-slate-50 disabled:text-slate-400";

export function FormField(props: FormFieldProps) {
  const { label, error, required, hint, className, as = "input", ...rest } = props;

  const inputCls = cn(
    INPUT_BASE,
    error
      ? "border-red-300 focus:border-red-400 focus:ring-red-100"
      : "border-slate-200 focus:border-blue-400"
  );

  return (
    <div className={cn("flex flex-col gap-1.5", className)}>
      {/* Label */}
      <label className="text-sm font-medium text-slate-700">
        {label}
        {required && (
          <span className="ml-0.5 text-red-500" aria-hidden>
            *
          </span>
        )}
        {hint && (
          <span className="ml-1.5 text-xs font-normal text-slate-400">
            ({hint})
          </span>
        )}
      </label>

      {/* Input or textarea */}
      {as === "textarea" ? (
        <textarea
          className={cn(inputCls, "min-h-[90px] resize-y")}
          aria-invalid={!!error}
          {...(rest as TextareaHTMLAttributes<HTMLTextAreaElement>)}
        />
      ) : (
        <input
          className={inputCls}
          aria-invalid={!!error}
          required={required}
          {...(rest as InputHTMLAttributes<HTMLInputElement>)}
        />
      )}

      {/* Error message */}
      {error && (
        <p className="flex items-center gap-1 text-xs text-red-500" role="alert">
          <span aria-hidden>⚠</span> {error}
        </p>
      )}
    </div>
  );
}
