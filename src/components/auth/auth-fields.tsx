"use client";

import { useId } from "react";

export function Field({
  name,
  icon,
  label,
  type = "text",
  placeholder,
  defaultValue,
  required,
  errors,
  autoComplete,
}: {
  name: string;
  icon?: React.ReactNode;
  label: string;
  type?: string;
  placeholder?: string;
  defaultValue?: string;
  required?: boolean;
  errors?: string[];
  autoComplete?: string;
}) {
  const id = useId();
  const invalid = errors && errors.length > 0;
  return (
    <label className="block" htmlFor={id}>
      <div className="mb-1 text-[11px] font-semibold uppercase tracking-wider text-fg-subtle">
        {label}
      </div>
      <div className="relative">
        {icon && (
          <span className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-fg-subtle">
            {icon}
          </span>
        )}
        <input
          id={id}
          name={name}
          type={type}
          required={required}
          autoComplete={autoComplete}
          placeholder={placeholder}
          defaultValue={defaultValue}
          aria-invalid={invalid || undefined}
          className={`h-11 w-full rounded-md border bg-white/5 ${
            icon ? "pl-9" : "pl-3"
          } pr-3 text-sm placeholder:text-fg-subtle focus:bg-white/[0.06] focus:outline-none ${
            invalid
              ? "border-danger/50 focus:border-danger"
              : "border-white/10 focus:border-iris-400/50"
          }`}
        />
      </div>
      {invalid && (
        <div className="mt-1 text-[11.5px] text-danger" role="alert">
          {errors[0]}
        </div>
      )}
    </label>
  );
}

export function FormError({ message }: { message?: string }) {
  if (!message) return null;
  return (
    <div
      role="alert"
      className="rounded-md border border-danger/30 bg-danger/10 px-3 py-2 text-[13px] text-danger"
    >
      {message}
    </div>
  );
}

export function FormSuccess({ message }: { message?: string }) {
  if (!message) return null;
  return (
    <div
      role="status"
      className="rounded-md border border-success/30 bg-success/10 px-3 py-2 text-[13px] text-success"
    >
      {message}
    </div>
  );
}
