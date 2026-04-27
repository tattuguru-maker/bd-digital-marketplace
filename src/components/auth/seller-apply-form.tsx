"use client";

import Link from "next/link";
import { useActionState } from "react";
import { ArrowRight, Upload, MapPin, Store, Hash, IdCard } from "lucide-react";
import { Button } from "@/components/ui/button";
import { applyAsSeller } from "@/app/actions/seller";
import { Field, FormError, FormSuccess } from "@/components/auth/auth-fields";
import type { AuthFormState } from "@/lib/auth/schemas";

export function SellerApplyForm() {
  const [state, action, pending] = useActionState<AuthFormState, FormData>(
    applyAsSeller,
    undefined,
  );

  if (state && "ok" in state && state.ok === true) {
    return (
      <div className="space-y-4">
        <FormSuccess message={state.message} />
        <p className="text-[14px] text-fg-muted">
          You&apos;ll receive an email at the address on your account once a reviewer
          checks your documents. While you wait, you can still browse and buy on
          Digibazar normally.
        </p>
        <Link href="/" className="text-[13.5px] font-medium text-iris-200 hover:text-iris-100">
          Back to home →
        </Link>
      </div>
    );
  }

  return (
    <form action={action} className="space-y-5" encType="multipart/form-data">
      {state && !state.ok && state.message && <FormError message={state.message} />}

      <Section title="Store profile" subtitle="What buyers will see on your storefront.">
        <div className="grid gap-3 md:grid-cols-2">
          <Field
            name="displayName"
            label="Display name"
            icon={<Store size={14} />}
            placeholder="e.g. Dhaka Digital"
            required
            errors={state && !state.ok ? state.errors?.displayName : undefined}
          />
          <Field
            name="handle"
            label="Store handle"
            icon={<Hash size={14} />}
            placeholder="dhakadigital"
            required
            errors={state && !state.ok ? state.errors?.handle : undefined}
          />
        </div>
        <Field
          name="location"
          label="Location"
          icon={<MapPin size={14} />}
          placeholder="Dhaka, Bangladesh"
          required
          errors={state && !state.ok ? state.errors?.location : undefined}
        />
        <label className="block">
          <div className="mb-1 text-[11px] font-semibold uppercase tracking-wider text-fg-subtle">
            Public bio
          </div>
          <textarea
            name="bio"
            rows={3}
            placeholder="Tell buyers what you sell, how fast you deliver, etc."
            className="w-full rounded-md border border-white/10 bg-white/5 px-3 py-2 text-sm placeholder:text-fg-subtle focus:border-iris-400/50 focus:bg-white/[0.06] focus:outline-none"
          />
          {state && !state.ok && state.errors?.bio && (
            <div className="mt-1 text-[11.5px] text-danger">{state.errors.bio[0]}</div>
          )}
        </label>
      </Section>

      <Section title="Verification (KYC)" subtitle="Required to prevent fraud. Only our review team will see these documents.">
        <Field
          name="nidNumber"
          label="National ID (NID) number"
          icon={<IdCard size={14} />}
          placeholder="10–17 digits"
          required
          errors={state && !state.ok ? state.errors?.nidNumber : undefined}
        />
        <FileField
          name="nidFront"
          label="NID — front side"
          hint="JPG / PNG / PDF · max 10 MB"
          errors={state && !state.ok ? state.errors?.nidFront : undefined}
        />
        <FileField
          name="nidBack"
          label="NID — back side"
          hint="JPG / PNG / PDF · max 10 MB"
          errors={state && !state.ok ? state.errors?.nidBack : undefined}
        />
        <FileField
          name="selfie"
          label="Selfie holding your NID"
          hint="A clear photo of you holding the front of your NID next to your face."
          errors={state && !state.ok ? state.errors?.selfie : undefined}
        />
      </Section>

      <label className="flex items-start gap-2 text-[12.5px] text-fg-muted">
        <input
          name="agreePolicies"
          type="checkbox"
          defaultChecked
          className="mt-1 size-3.5 accent-iris-500"
        />
        <span>
          I have read and agree to the{" "}
          <Link href="/policies" className="text-iris-200 hover:text-iris-100">
            seller policies
          </Link>
          , including KYC, payout, listing standards and prohibited items rules.
        </span>
      </label>
      {state && !state.ok && state.errors?.agreePolicies && (
        <div className="text-[11.5px] text-danger">{state.errors.agreePolicies[0]}</div>
      )}

      <Button size="lg" className="w-full" disabled={pending}>
        {pending ? "Submitting…" : "Submit for review"} <ArrowRight size={16} />
      </Button>
    </form>
  );
}

function Section({
  title,
  subtitle,
  children,
}: {
  title: string;
  subtitle: string;
  children: React.ReactNode;
}) {
  return (
    <div className="surface-card p-5">
      <div>
        <h2 className="font-display text-lg font-bold">{title}</h2>
        <p className="mt-0.5 text-[13px] text-fg-muted">{subtitle}</p>
      </div>
      <div className="mt-4 space-y-3">{children}</div>
    </div>
  );
}

function FileField({
  name,
  label,
  hint,
  errors,
}: {
  name: string;
  label: string;
  hint?: string;
  errors?: string[];
}) {
  return (
    <label className="block">
      <div className="mb-1 text-[11px] font-semibold uppercase tracking-wider text-fg-subtle">
        {label}
      </div>
      <div className="relative flex items-center gap-3 rounded-md border border-dashed border-white/10 bg-white/[0.02] px-3 py-3 hover:border-white/20">
        <Upload size={16} className="text-iris-300" />
        <div className="flex-1">
          <input
            name={name}
            type="file"
            required
            accept="image/jpeg,image/png,image/webp,application/pdf"
            className="block w-full text-[12.5px] text-fg-muted file:mr-3 file:rounded file:border-0 file:bg-white/[0.08] file:px-3 file:py-1.5 file:text-[12.5px] file:font-medium file:text-fg hover:file:bg-white/[0.12]"
          />
          {hint && <div className="mt-1 text-[11px] text-fg-subtle">{hint}</div>}
        </div>
      </div>
      {errors && errors.length > 0 && (
        <div className="mt-1 text-[11.5px] text-danger" role="alert">
          {errors[0]}
        </div>
      )}
    </label>
  );
}
