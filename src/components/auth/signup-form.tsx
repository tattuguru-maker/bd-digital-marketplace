"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState, type FormEvent } from "react";
import { useAuthActions } from "@convex-dev/auth/react";
import { ArrowRight, Lock, Mail, Phone, User } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Field, FormError, FormSuccess } from "@/components/auth/auth-fields";
import { SignupSchema } from "@/lib/auth/schemas";
import { isDisposableEmail } from "@/lib/auth/disposable-emails";

export function SignupForm({ next = "/" }: { next?: string }) {
  const router = useRouter();
  const { signIn } = useAuthActions();
  const [pending, setPending] = useState(false);
  const [errors, setErrors] = useState<Record<string, string[]>>({});
  const [message, setMessage] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  async function onSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setErrors({});
    setMessage(null);
    setSuccess(null);

    const fd = new FormData(e.currentTarget);
    const parsed = SignupSchema.safeParse({
      fullName: fd.get("fullName"),
      email: fd.get("email"),
      phone: fd.get("phone"),
      password: fd.get("password"),
      agree: fd.get("agree") ?? "",
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
      setErrors({
        email: ["Use a real email — disposable mailboxes aren't allowed."],
      });
      return;
    }

    setPending(true);
    try {
      await signIn("password", {
        email: parsed.data.email,
        password: parsed.data.password,
        fullName: parsed.data.fullName,
        flow: "signUp",
      });
      setSuccess(
        `Welcome to Digibazar, ${parsed.data.fullName.split(" ")[0]}! You're signed in.`,
      );
      router.push(next || "/");
      router.refresh();
    } catch (err) {
      setMessage(
        err instanceof Error && err.message.toLowerCase().includes("already")
          ? "An account with that email already exists. Try signing in instead."
          : "Could not create your account. Try again in a moment.",
      );
    } finally {
      setPending(false);
    }
  }

  if (success) {
    return (
      <div className="space-y-3">
        <FormSuccess message={success} />
        <Link
          href="/"
          className="text-[13px] font-medium text-iris-200 hover:text-iris-100"
        >
          Continue browsing →
        </Link>
      </div>
    );
  }

  return (
    <form onSubmit={onSubmit} className="space-y-3">
      {message && <FormError message={message} />}
      <div className="grid gap-3 md:grid-cols-2">
        <Field
          name="fullName"
          label="Full name"
          icon={<User size={14} />}
          placeholder="Your name"
          autoComplete="name"
          required
          errors={errors.fullName}
        />
        <Field
          name="phone"
          label="Phone (bKash) — optional"
          icon={<Phone size={14} />}
          placeholder="01XXXXXXXXX"
          autoComplete="tel"
          errors={errors.phone}
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
        errors={errors.email}
      />
      <Field
        name="password"
        label="Password"
        type="password"
        icon={<Lock size={14} />}
        placeholder="At least 8 characters"
        autoComplete="new-password"
        required
        errors={errors.password}
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
      {errors.agree && (
        <div className="text-[11.5px] text-danger">{errors.agree[0]}</div>
      )}

      <Button size="lg" className="w-full" disabled={pending}>
        {pending ? "Creating account…" : "Create account"} <ArrowRight size={16} />
      </Button>
    </form>
  );
}
