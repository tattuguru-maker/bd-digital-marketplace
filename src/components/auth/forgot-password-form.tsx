"use client";

import { useActionState } from "react";
import { ArrowRight, Mail } from "lucide-react";
import { Button } from "@/components/ui/button";
import { sendPasswordReset } from "@/app/actions/auth";
import { Field, FormError, FormSuccess } from "@/components/auth/auth-fields";
import type { AuthFormState } from "@/lib/auth/schemas";

export function ForgotPasswordForm() {
  const [state, action, pending] = useActionState<AuthFormState, FormData>(
    sendPasswordReset,
    undefined,
  );

  return (
    <form action={action} className="space-y-3">
      {state && "ok" in state && state.ok === true && (
        <FormSuccess message={state.message} />
      )}
      {state && "ok" in state && state.ok === false && state.message && (
        <FormError message={state.message} />
      )}
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
      <Button size="lg" className="w-full" disabled={pending}>
        {pending ? "Sending…" : "Send reset link"} <ArrowRight size={16} />
      </Button>
    </form>
  );
}
