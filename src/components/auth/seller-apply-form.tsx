"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState, type FormEvent } from "react";
import { useMutation, useQuery } from "convex/react";
import {
  ArrowRight,
  Upload,
  MapPin,
  Store,
  Hash,
  IdCard,
  ShieldCheck,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Field, FormError, FormSuccess } from "@/components/auth/auth-fields";
import { SellerApplySchema } from "@/lib/auth/schemas";
import { api } from "@/lib/convex/api";

const ALLOWED_MIME = new Set([
  "image/jpeg",
  "image/png",
  "image/webp",
  "application/pdf",
]);
const MAX_BYTES = 10 * 1024 * 1024; // 10 MB

type DocKind = "nid_front" | "nid_back" | "selfie";

async function uploadFile(uploadUrl: string, file: File) {
  const res = await fetch(uploadUrl, {
    method: "POST",
    headers: { "Content-Type": file.type },
    body: file,
  });
  if (!res.ok) throw new Error(`Upload failed (${res.status})`);
  const { storageId } = (await res.json()) as { storageId: string };
  return storageId;
}

type SellerStatus = "pending_review" | "verified" | "rejected" | "suspended";
type SellerRow = {
  status: SellerStatus;
  displayName: string;
  handle: string;
  rejectionReason?: string | null;
  submittedAt: number;
  reviewedAt?: number | null;
};

export function SellerApplyForm() {
  const router = useRouter();
  const generateUploadUrl = useMutation(api.files.generateUploadUrl);
  const apply = useMutation(api.sellers.apply);
  const existing = useQuery(api.sellers.myApplication) as
    | SellerRow
    | null
    | undefined;

  const [pending, setPending] = useState(false);
  const [errors, setErrors] = useState<Record<string, string[]>>({});
  const [message, setMessage] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  if (existing) {
    return <ApplicationStatus existing={existing} />;
  }

  async function onSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setErrors({});
    setMessage(null);

    const fd = new FormData(e.currentTarget);
    const fields = {
      displayName: String(fd.get("displayName") ?? ""),
      handle: String(fd.get("handle") ?? ""),
      location: String(fd.get("location") ?? ""),
      bio: String(fd.get("bio") ?? ""),
      nidNumber: String(fd.get("nidNumber") ?? ""),
      agreePolicies: fd.get("agreePolicies") ?? "",
    };

    const parsed = SellerApplySchema.safeParse(fields);
    if (!parsed.success) {
      const out: Record<string, string[]> = {};
      for (const issue of parsed.error.issues) {
        const key = issue.path[0]?.toString() ?? "_form";
        (out[key] ||= []).push(issue.message);
      }
      setErrors(out);
      return;
    }

    const fileEntries: { kind: DocKind; field: string; file: File | null }[] = [
      { kind: "nid_front", field: "nidFront", file: fd.get("nidFront") as File },
      { kind: "nid_back", field: "nidBack", file: fd.get("nidBack") as File },
      { kind: "selfie", field: "selfie", file: fd.get("selfie") as File },
    ];

    const fileErrors: Record<string, string[]> = {};
    for (const { field, file } of fileEntries) {
      if (!file || !(file instanceof File) || file.size === 0) {
        fileErrors[field] = ["Required"];
        continue;
      }
      if (!ALLOWED_MIME.has(file.type)) {
        fileErrors[field] = ["Only JPG / PNG / WEBP / PDF allowed"];
        continue;
      }
      if (file.size > MAX_BYTES) {
        fileErrors[field] = ["File must be 10 MB or smaller"];
      }
    }
    if (Object.keys(fileErrors).length > 0) {
      setErrors(fileErrors);
      return;
    }

    setPending(true);
    try {
      const documents = await Promise.all(
        fileEntries.map(async ({ kind, file }) => {
          const f = file as File;
          const url = (await generateUploadUrl({})) as string;
          const storageId = await uploadFile(url, f);
          return {
            kind,
            storageId,
            mime: f.type,
            sizeBytes: f.size,
          };
        }),
      );

      await apply({
        displayName: parsed.data.displayName,
        handle: parsed.data.handle,
        location: parsed.data.location,
        bio: parsed.data.bio || undefined,
        nidNumber: parsed.data.nidNumber,
        documents,
      });

      setSuccess(
        "Application submitted. We'll review your documents within 24 hours.",
      );
      router.refresh();
    } catch (err) {
      setMessage(
        err instanceof Error
          ? err.message
          : "Could not submit your application. Try again in a moment.",
      );
    } finally {
      setPending(false);
    }
  }

  if (success) {
    return (
      <div className="space-y-4">
        <FormSuccess message={success} />
        <p className="text-[14px] text-fg-muted">
          You&apos;ll receive an email at the address on your account once a
          reviewer checks your documents. While you wait, you can still browse
          and buy on Digibazar normally.
        </p>
        <Link
          href="/"
          className="text-[13.5px] font-medium text-iris-200 hover:text-iris-100"
        >
          Back to home →
        </Link>
      </div>
    );
  }

  return (
    <form onSubmit={onSubmit} className="space-y-5">
      {message && <FormError message={message} />}

      <Section
        title="Store profile"
        subtitle="What buyers will see on your storefront."
      >
        <div className="grid gap-3 md:grid-cols-2">
          <Field
            name="displayName"
            label="Display name"
            icon={<Store size={14} />}
            placeholder="e.g. Dhaka Digital"
            required
            errors={errors.displayName}
          />
          <Field
            name="handle"
            label="Store handle"
            icon={<Hash size={14} />}
            placeholder="dhakadigital"
            required
            errors={errors.handle}
          />
        </div>
        <Field
          name="location"
          label="Location"
          icon={<MapPin size={14} />}
          placeholder="Dhaka, Bangladesh"
          required
          errors={errors.location}
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
          {errors.bio && (
            <div className="mt-1 text-[11.5px] text-danger">{errors.bio[0]}</div>
          )}
        </label>
      </Section>

      <Section
        title="Verification (KYC)"
        subtitle="Required to prevent fraud. Only our review team will see these documents."
      >
        <Field
          name="nidNumber"
          label="National ID (NID) number"
          icon={<IdCard size={14} />}
          placeholder="10–17 digits"
          required
          errors={errors.nidNumber}
        />
        <FileField
          name="nidFront"
          label="NID — front side"
          hint="JPG / PNG / PDF · max 10 MB"
          errors={errors.nidFront}
        />
        <FileField
          name="nidBack"
          label="NID — back side"
          hint="JPG / PNG / PDF · max 10 MB"
          errors={errors.nidBack}
        />
        <FileField
          name="selfie"
          label="Selfie holding your NID"
          hint="A clear photo of you holding the front of your NID next to your face."
          errors={errors.selfie}
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
      {errors.agreePolicies && (
        <div className="text-[11.5px] text-danger">
          {errors.agreePolicies[0]}
        </div>
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

function ApplicationStatus({ existing }: { existing: SellerRow }) {
  if (existing.status === "verified") {
    return (
      <div className="surface-card p-6">
        <Badge variant="success">
          <ShieldCheck size={11} /> Verified seller
        </Badge>
        <h2 className="mt-3 font-display text-2xl font-bold">
          {existing.displayName}{" "}
          <span className="text-fg-subtle">@{existing.handle}</span>
        </h2>
        <p className="mt-2 text-[14px] text-fg-muted">
          You&apos;re all set. Head to your seller dashboard to start listing.
        </p>
        <Link
          href="/dashboard"
          className="mt-4 inline-flex h-11 items-center justify-center rounded-lg border border-white/10 bg-white/[0.06] px-4 text-[14px] font-medium hover:bg-white/[0.10]"
        >
          Open seller dashboard →
        </Link>
      </div>
    );
  }
  if (existing.status === "rejected") {
    return (
      <div className="surface-card p-6">
        <Badge variant="danger">Rejected</Badge>
        <h2 className="mt-3 font-display text-2xl font-bold">
          {existing.displayName}
        </h2>
        <p className="mt-2 text-[14px] text-fg-muted">
          Unfortunately your application could not be approved.
        </p>
        {existing.rejectionReason && (
          <div className="mt-3 rounded-md border border-danger/30 bg-danger/10 p-3 text-[13px] text-danger">
            <strong>Reason:</strong> {existing.rejectionReason}
          </div>
        )}
        <p className="mt-3 text-[12.5px] text-fg-subtle">
          You can re-apply once the issue is fixed by emailing{" "}
          <a className="text-iris-200" href="mailto:sellers@digibazar.bd">
            sellers@digibazar.bd
          </a>
          .
        </p>
      </div>
    );
  }
  return (
    <div className="surface-card p-6">
      <Badge variant="brand">Under review</Badge>
      <h2 className="mt-3 font-display text-2xl font-bold">
        Hi {existing.displayName} 👋
      </h2>
      <p className="mt-2 text-[14px] text-fg-muted">
        We&apos;ve received your application and our team is reviewing your
        documents. You&apos;ll get an email at the address on your account once
        a decision is made — usually within 24 hours.
      </p>
      <div className="mt-4 grid gap-2 text-[13px] text-fg-muted">
        <div>
          Submitted:{" "}
          <span className="text-fg">
            {new Date(existing.submittedAt).toLocaleString("en-GB")}
          </span>
        </div>
        <div>
          Status:{" "}
          <span className="text-fg">
            {existing.status.replace("_", " ")}
          </span>
        </div>
      </div>
    </div>
  );
}
