"use client";

import Link from "next/link";
import { useActionState, useState } from "react";
import { ArrowRight, Lock, Mail, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import { login, sendMagicLink } from "@/app/actions/auth";
import { Field, FormError, FormSuccess } from "@/components/auth/auth-fields";
import type { AuthFormState } from "@/lib/auth/schemas";

type Mode = "password" | "magic";

export function LoginForm({ next = "/" }: { next?: string }) {
  const [mode, setMode] = useState<Mode>("password");
  const [pwState, pwAction, pwPending] = useActionState<AuthFormState, FormData>(
    login,
    undefined,
  );
  const [magicState, magicAction, magicPending] = useActionState<
    AuthFormState,
    FormData
  >(sendMagicLink, undefined);

  return (
    <div className="space-y-3">
      <div className="grid grid-cols-2 gap-1 rounded-lg bg-white/[0.04] p-1">
        <ModeTab active={mode === "password"} onClick={() => setMode("password")}>
          <Lock size={13} /> Password
        </ModeTab>
        <ModeTab active={mode === "magic"} onClick={() => setMode("magic")}>
          <Sparkles size={13} /> Magic link
        </ModeTab>
      </div>

      {mode === "password" ? (
        <form action={pwAction} className="space-y-3">
          <input type="hidden" name="next" value={next} />
          {pwState && "ok" in pwState && pwState.ok === false && pwState.message && (
            <FormError message={pwState.message} />
          )}
          <Field
            name="email"
            label="Email"
            type="email"
            icon={<Mail size={14} />}
            placeholder="you@example.com"
            autoComplete="email"
            required
            errors={pwState && !pwState.ok ? pwState.errors?.email : undefined}
          />
          <Field
            name="password"
            label="Password"
            type="password"
            icon={<Lock size={14} />}
            placeholder="••••••••"
            autoComplete="current-password"
            required
            errors={pwState && !pwState.ok ? pwState.errors?.password : undefined}
          />
          <div className="flex items-center justify-between text-[12.5px]">
            <label className="inline-flex items-center gap-2 text-fg-muted">
              <input type="checkbox" defaultChecked className="size-3.5 accent-iris-500" />{" "}
              Remember me
            </label>
            <Link href="/login/forgot" className="text-iris-200 hover:text-iris-100">
              Forgot password?
            </Link>
          </div>
          <Button size="lg" className="w-full" disabled={pwPending}>
            {pwPending ? "Signing in…" : "Sign in"} <ArrowRight size={16} />
          </Button>
        </form>
      ) : (
        <form action={magicAction} className="space-y-3">
          <input type="hidden" name="next" value={next} />
          {magicState && "ok" in magicState && magicState.ok === true && (
            <FormSuccess message={magicState.message} />
          )}
          {magicState && "ok" in magicState && magicState.ok === false && magicState.message && (
            <FormError message={magicState.message} />
          )}
          <Field
            name="email"
            label="Email"
            type="email"
            icon={<Mail size={14} />}
            placeholder="you@example.com"
            autoComplete="email"
            required
            errors={
              magicState && !magicState.ok ? magicState.errors?.email : undefined
            }
          />
          <p className="text-[12px] text-fg-subtle">
            We&apos;ll email you a one-click sign-in link. No password needed.
          </p>
          <Button size="lg" className="w-full" disabled={magicPending}>
            {magicPending ? "Sending…" : "Send me a sign-in link"} <ArrowRight size={16} />
          </Button>
        </form>
      )}
    </div>
  );
}

function ModeTab({
  active,
  onClick,
  children,
}: {
  active: boolean;
  onClick: () => void;
  children: React.ReactNode;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`inline-flex h-9 items-center justify-center gap-1.5 rounded-md text-[12.5px] font-medium transition ${
        active
          ? "bg-white/[0.08] text-fg"
          : "text-fg-muted hover:text-fg"
      }`}
    >
      {children}
    </button>
  );
}
