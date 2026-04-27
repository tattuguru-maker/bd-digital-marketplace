"use client";

import Link from "next/link";
import { useActionState } from "react";
import { ArrowRight, Lock, Mail, Phone, User } from "lucide-react";
import { Button } from "@/components/ui/button";
import { signup } from "@/app/actions/auth";
import { Field, FormError, FormSuccess } from "@/components/auth/auth-fields";
import type { AuthFormState } from "@/lib/auth/schemas";

export function SignupForm() {
  const [state, action, pending] = useActionState<AuthFormState, FormData>(
    signup,
    undefined,
  );

  if (state && "ok" in state && state.ok === true) {
    return (
      <div className="space-y-3">
        <FormSuccess message={state.message ?? "Check your email to finish signing up."} />
        <p className="text-[13px] text-fg-muted">
          We sent you a confirmation link. Open it on this device and you&apos;ll be
          logged in automatically.
        </p>
        <Link
          href="/login"
          className="text-[13px] font-medium text-iris-200 hover:text-iris-100"
        >
          Back to sign in →
        </Link>
      </div>
    );
  }

  return (
    <form action={action} className="space-y-3">
      {state && "ok" in state && state.ok === false && state.message && (
        <FormError message={state.message} />
      )}
      <div className="grid gap-3 md:grid-cols-2">
        <Field
          name="fullName"
          label="Full name"
          icon={<User size={14} />}
          placeholder="Your name"
          autoComplete="name"
          required
          errors={state && !state.ok ? state.errors?.fullName : undefined}
        />
        <Field
          name="phone"
          label="Phone (bKash) — optional"
          icon={<Phone size={14} />}
          placeholder="01XXXXXXXXX"
          autoComplete="tel"
          errors={state && !state.ok ? state.errors?.phone : undefined}
        />
      </div>
      <Field
        name="email"
        label="Email"
        type="email"
        icon={<Mail size={14} />}
        placeholder="you@example.com"
        autoComplete="email"
        required
        errors={state && !state.ok ? state.errors?.email : undefined}
      />
      <Field
        name="password"
        label="Password"
        type="password"
        icon={<Lock size={14} />}
        placeholder="At least 8 characters"
        autoComplete="new-password"
        required
        errors={state && !state.ok ? state.errors?.password : undefined}
      />

      <label className="flex items-start gap-2 text-[12px] text-fg-muted">
        <input
          name="agree"
          type="checkbox"
          defaultChecked
          className="mt-1 size-3.5 accent-iris-500"
        />
        <span>
          I agree to the{" "}
          <Link href="/terms" className="text-iris-200 hover:text-iris-100">
            Terms
          </Link>{" "}
          and{" "}
          <Link href="/privacy" className="text-iris-200 hover:text-iris-100">
            Privacy Policy
          </Link>
          .
        </span>
      </label>
      {state && !state.ok && state.errors?.agree && (
        <div className="text-[11.5px] text-danger">{state.errors.agree[0]}</div>
      )}

      <Button size="lg" className="w-full" disabled={pending}>
        {pending ? "Creating account…" : "Create account"} <ArrowRight size={16} />
      </Button>
    </form>
  );
}
