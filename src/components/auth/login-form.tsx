"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState, type FormEvent } from "react";
import { useAuthActions } from "@convex-dev/auth/react";
import { ArrowRight, Lock, Mail } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Field, FormError } from "@/components/auth/auth-fields";
import { LoginSchema } from "@/lib/auth/schemas";
import { isDisposableEmail } from "@/lib/auth/disposable-emails";

export function LoginForm({ next = "/" }: { next?: string }) {
  const router = useRouter();
  const { signIn } = useAuthActions();
  const [pending, setPending] = useState(false);
  const [errors, setErrors] = useState<Record<string, string[]>>({});
  const [message, setMessage] = useState<string | null>(null);

  async function onSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setErrors({});
    setMessage(null);

    const fd = new FormData(e.currentTarget);
    const parsed = LoginSchema.safeParse({
      email: fd.get("email"),
      password: fd.get("password"),
    });
    if (!parsed.success) {
      const out: Record<string, string[]> = {};
      for (const issue of parsed.error.issues) {
        const key = issue.path[0]?.toString() ?? "_form";
        (out[key] ||= []).push(issue.message);
      }
      setErrors(out);
      return;
    }
    if (isDisposableEmail(parsed.data.email)) {
      setErrors({ email: ["Use a real email — disposable mailboxes aren't allowed."] });
      return;
    }

    setPending(true);
    try {
      await signIn("password", {
        email: parsed.data.email,
        password: parsed.data.password,
        flow: "signIn",
      });
      router.push(next || "/");
      router.refresh();
    } catch (err) {
      setMessage(
        err instanceof Error
          ? "Wrong email or password — please try again."
          : "Something went wrong. Try again in a moment.",
      );
    } finally {
      setPending(false);
    }
  }

  return (
    <form onSubmit={onSubmit} className="space-y-3">
      {message && <FormError message={message} />}
      <Field
        name="email"
        label="Email"
        type="email"
        icon={<Mail size={14} />}
        placeholder="you@example.com"
        autoComplete="email"
        required
        errors={errors.email}
      />
      <Field
        name="password"
        label="Password"
        type="password"
        icon={<Lock size={14} />}
        placeholder="••••••••"
        autoComplete="current-password"
        required
        errors={errors.password}
      />
      <div className="flex items-center justify-between text-[12.5px]">
        <label className="inline-flex items-center gap-2 text-fg-muted">
          <input
            type="checkbox"
            defaultChecked
            className="size-3.5 accent-iris-500"
          />{" "}
          Remember me
        </label>
        <Link href="/login/forgot" className="text-iris-200 hover:text-iris-100">
          Forgot password?
        </Link>
      </div>
      <Button size="lg" className="w-full" disabled={pending}>
        {pending ? "Signing in…" : "Sign in"} <ArrowRight size={16} />
      </Button>
    </form>
  );
}
