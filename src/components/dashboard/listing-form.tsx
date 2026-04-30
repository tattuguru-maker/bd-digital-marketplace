"use client";

import { useRouter } from "next/navigation";
import { useState, type FormEvent } from "react";
import { useMutation } from "convex/react";
import { Loader2, Upload, X, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { FormError, FormSuccess } from "@/components/auth/auth-fields";
import { api } from "@/lib/convex/api";

const ALLOWED_MIME = new Set(["image/jpeg", "image/png", "image/webp"]);
const MAX_BYTES = 10 * 1024 * 1024;
const MAX_IMAGES = 6;

export const CATEGORY_OPTIONS = [
  { value: "streaming", label: "Streaming" },
  { value: "ai-tools", label: "AI & Productivity" },
  { value: "game-topup", label: "Game Top-ups" },
  { value: "cd-keys", label: "CD Keys" },
  { value: "gift-cards", label: "Gift Cards" },
  { value: "software", label: "Software" },
  { value: "vpn", label: "VPN & Security" },
  { value: "education", label: "Education" },
  { value: "social", label: "Social" },
] as const;

const DELIVERY_OPTIONS = [
  { value: "instant", label: "Instant (automated email + dashboard)" },
  { value: "manual-15m", label: "Manual — within 15 minutes" },
  { value: "manual-1h", label: "Manual — within 1 hour" },
  { value: "manual-24h", label: "Manual — within 24 hours" },
] as const;

const REGION_OPTIONS = [
  { value: "global", label: "Global" },
  { value: "bd", label: "Bangladesh only" },
  { value: "in", label: "India" },
  { value: "asia", label: "Asia" },
  { value: "eu", label: "Europe" },
  { value: "us", label: "United States" },
] as const;

export type ListingFormInitial = {
  id?: string;
  title?: string;
  category?: string;
  shortDesc?: string;
  longDesc?: string;
  priceTaka?: number;
  originalPriceTaka?: number | null;
  stock?: number;
  delivery?: string;
  region?: string;
  platform?: string | null;
  warranty?: string | null;
  images?: { id: string; url: string }[];
  status?: string;
};

type UploadedImage = { id: string; url: string };

async function uploadFile(uploadUrl: string, file: File) {
  const res = await fetch(uploadUrl, {
    method: "POST",
    headers: { "Content-Type": file.type },
    body: file,
  });
  if (!res.ok) throw new Error(`Image upload failed (${res.status})`);
  const { storageId } = (await res.json()) as { storageId: string };
  return storageId as string;
}

export function ListingForm({
  initial,
  mode,
}: {
  initial?: ListingFormInitial;
  mode: "create" | "edit";
}) {
  const router = useRouter();
  const generateUploadUrl = useMutation(api.files.generateUploadUrl);
  const createListing = useMutation(api.listings.create);
  const updateListing = useMutation(api.listings.update);

  const [pending, setPending] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [topError, setTopError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [images, setImages] = useState<UploadedImage[]>(initial?.images ?? []);
  const [uploading, setUploading] = useState(false);

  async function handleFiles(files: FileList | null) {
    if (!files || files.length === 0) return;
    const remaining = MAX_IMAGES - images.length;
    if (remaining <= 0) {
      setTopError(`At most ${MAX_IMAGES} images per listing.`);
      return;
    }
    const incoming = Array.from(files).slice(0, remaining);
    for (const file of incoming) {
      if (!ALLOWED_MIME.has(file.type)) {
        setTopError("Only JPG, PNG or WEBP images allowed.");
        return;
      }
      if (file.size > MAX_BYTES) {
        setTopError("Each image must be 10 MB or smaller.");
        return;
      }
    }

    setUploading(true);
    setTopError(null);
    try {
      const uploaded: UploadedImage[] = [];
      for (const file of incoming) {
        const url = (await generateUploadUrl({})) as string;
        const storageId = await uploadFile(url, file);
        uploaded.push({ id: storageId, url: URL.createObjectURL(file) });
      }
      setImages((prev) => [...prev, ...uploaded]);
    } catch (err) {
      setTopError(err instanceof Error ? err.message : "Image upload failed.");
    } finally {
      setUploading(false);
    }
  }

  function removeImage(id: string) {
    setImages((prev) => prev.filter((i) => i.id !== id));
  }

  async function onSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setErrors({});
    setTopError(null);

    const fd = new FormData(e.currentTarget);
    const title = String(fd.get("title") ?? "").trim();
    const category = String(fd.get("category") ?? "");
    const shortDesc = String(fd.get("shortDesc") ?? "").trim();
    const longDesc = String(fd.get("longDesc") ?? "").trim();
    const priceTaka = Number(fd.get("priceTaka"));
    const originalPriceRaw = String(fd.get("originalPriceTaka") ?? "").trim();
    const originalPriceTaka = originalPriceRaw === "" ? undefined : Number(originalPriceRaw);
    const stock = Number(fd.get("stock"));
    const delivery = String(fd.get("delivery") ?? "");
    const region = String(fd.get("region") ?? "");
    const platform = String(fd.get("platform") ?? "").trim() || undefined;
    const warranty = String(fd.get("warranty") ?? "").trim() || undefined;
    const status = String(fd.get("status") ?? "draft");

    const next: Record<string, string> = {};
    if (title.length < 5 || title.length > 120) next.title = "5–120 characters.";
    if (!CATEGORY_OPTIONS.some((c) => c.value === category)) next.category = "Pick a category.";
    if (shortDesc.length < 20 || shortDesc.length > 240) next.shortDesc = "20–240 characters.";
    if (longDesc.length < 60 || longDesc.length > 5000) next.longDesc = "60–5000 characters.";
    if (!Number.isFinite(priceTaka) || priceTaka < 1 || priceTaka > 1_000_000) {
      next.priceTaka = "Between ৳1 and ৳1,000,000.";
    }
    if (
      originalPriceTaka != null &&
      (Number.isNaN(originalPriceTaka) ||
        originalPriceTaka < priceTaka ||
        originalPriceTaka > 1_000_000)
    ) {
      next.originalPriceTaka = "Must be greater than the sale price.";
    }
    if (!Number.isInteger(stock) || stock < 0 || stock > 100_000) {
      next.stock = "Whole number between 0 and 100,000.";
    }
    if (!DELIVERY_OPTIONS.some((d) => d.value === delivery)) next.delivery = "Pick a delivery time.";
    if (!REGION_OPTIONS.some((r) => r.value === region)) next.region = "Pick a region.";
    if (images.length === 0) next.images = "Add at least one image.";
    if (Object.keys(next).length > 0) {
      setErrors(next);
      return;
    }

    const payload = {
      title,
      category: category as (typeof CATEGORY_OPTIONS)[number]["value"],
      shortDesc,
      longDesc,
      priceTaka,
      originalPriceTaka,
      stock,
      delivery: delivery as (typeof DELIVERY_OPTIONS)[number]["value"],
      region: region as (typeof REGION_OPTIONS)[number]["value"],
      platform,
      warranty,
      images: images.map((i) => i.id),
      status: (status === "active" ? "active" : "draft") as "active" | "draft",
    };

    setPending(true);
    try {
      if (mode === "edit" && initial?.id) {
        await updateListing({ id: initial.id, ...payload });
        setSuccess("Listing saved.");
        router.refresh();
      } else {
        await createListing(payload);
        setSuccess("Listing created.");
        router.push("/dashboard/listings");
        router.refresh();
      }
    } catch (err) {
      setTopError(err instanceof Error ? err.message : "Could not save listing.");
    } finally {
      setPending(false);
    }
  }

  return (
    <form onSubmit={onSubmit} className="space-y-6">
      {topError && <FormError message={topError} />}
      {success && <FormSuccess message={success} />}

      <Section title="Basics" desc="What buyers see at the top of your listing.">
        <Input
          name="title"
          label="Listing title"
          placeholder="e.g. Netflix Premium — 1 Month (Replacement guarantee)"
          defaultValue={initial?.title}
          error={errors.title}
        />
        <Select
          name="category"
          label="Category"
          options={CATEGORY_OPTIONS}
          defaultValue={initial?.category ?? "streaming"}
          error={errors.category}
        />
        <Textarea
          name="shortDesc"
          label="Short description"
          rows={2}
          placeholder="One-line tagline shown on browse cards (20–240 chars)."
          defaultValue={initial?.shortDesc}
          error={errors.shortDesc}
        />
        <Textarea
          name="longDesc"
          label="Long description"
          rows={6}
          placeholder="Explain what's included, how it's delivered, what your warranty covers, etc."
          defaultValue={initial?.longDesc}
          error={errors.longDesc}
        />
      </Section>

      <Section title="Pricing & inventory">
        <div className="grid gap-4 sm:grid-cols-3">
          <Input
            name="priceTaka"
            label="Sale price (৳)"
            type="number"
            inputMode="decimal"
            min="1"
            step="1"
            defaultValue={initial?.priceTaka?.toString()}
            error={errors.priceTaka}
          />
          <Input
            name="originalPriceTaka"
            label="Compare-at price (৳)"
            type="number"
            inputMode="decimal"
            min="1"
            step="1"
            placeholder="Optional — shown struck-through"
            defaultValue={initial?.originalPriceTaka?.toString() ?? ""}
            error={errors.originalPriceTaka}
          />
          <Input
            name="stock"
            label="Stock"
            type="number"
            inputMode="numeric"
            min="0"
            step="1"
            defaultValue={(initial?.stock ?? 0).toString()}
            error={errors.stock}
          />
        </div>
      </Section>

      <Section title="Delivery & region">
        <div className="grid gap-4 md:grid-cols-2">
          <Select
            name="delivery"
            label="Delivery time"
            options={DELIVERY_OPTIONS}
            defaultValue={initial?.delivery ?? "instant"}
            error={errors.delivery}
          />
          <Select
            name="region"
            label="Region"
            options={REGION_OPTIONS}
            defaultValue={initial?.region ?? "global"}
            error={errors.region}
          />
          <Input
            name="platform"
            label="Platform (optional)"
            placeholder="e.g. Steam, PSN, Netflix, Free Fire"
            defaultValue={initial?.platform ?? ""}
            error={errors.platform}
          />
          <Input
            name="warranty"
            label="Warranty (optional)"
            placeholder="e.g. 30-day replacement"
            defaultValue={initial?.warranty ?? ""}
            error={errors.warranty}
          />
        </div>
      </Section>

      <Section
        title="Images"
        desc={`At least 1, up to ${MAX_IMAGES}. JPG / PNG / WEBP, max 10 MB each.`}
      >
        <div className="flex flex-wrap gap-3">
          {images.map((img) => (
            <div
              key={img.id}
              className="relative h-28 w-28 overflow-hidden rounded-md border border-white/10 bg-white/5"
            >
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={img.url}
                alt=""
                className="h-full w-full object-cover"
              />
              <button
                type="button"
                onClick={() => removeImage(img.id)}
                className="absolute right-1 top-1 rounded-full bg-black/70 p-1 text-white hover:bg-black"
                aria-label="Remove image"
              >
                <X size={14} />
              </button>
            </div>
          ))}
          {images.length < MAX_IMAGES && (
            <label className="flex h-28 w-28 cursor-pointer flex-col items-center justify-center gap-1 rounded-md border border-dashed border-white/15 bg-white/5 text-[11px] text-fg-subtle hover:border-iris-400/50 hover:bg-white/10">
              {uploading ? (
                <Loader2 size={18} className="animate-spin" />
              ) : (
                <Upload size={18} />
              )}
              <span>Add image</span>
              <input
                type="file"
                accept="image/jpeg,image/png,image/webp"
                multiple
                className="sr-only"
                onChange={(e) => handleFiles(e.target.files)}
              />
            </label>
          )}
        </div>
        {errors.images && (
          <div className="mt-2 text-[11.5px] text-danger">{errors.images}</div>
        )}
      </Section>

      <Section title="Visibility">
        <fieldset className="grid gap-3 sm:grid-cols-2">
          <Radio
            name="status"
            value="draft"
            label="Save as draft"
            desc="Only visible to you. Buyers won't see it yet."
            defaultChecked={initial?.status !== "active"}
          />
          <Radio
            name="status"
            value="active"
            label="Publish now"
            desc="Listing goes live immediately on browse and category pages."
            defaultChecked={initial?.status === "active"}
          />
        </fieldset>
      </Section>

      <div className="flex flex-wrap items-center justify-end gap-3 border-t border-white/5 pt-4">
        <Button
          type="button"
          variant="ghost"
          onClick={() => router.push("/dashboard/listings")}
        >
          Cancel
        </Button>
        <Button type="submit" disabled={pending || uploading}>
          {pending ? (
            <Loader2 size={14} className="animate-spin" />
          ) : (
            <ArrowRight size={14} />
          )}
          {mode === "edit" ? "Save listing" : "Create listing"}
        </Button>
      </div>
    </form>
  );
}

function Section({
  title,
  desc,
  children,
}: {
  title: string;
  desc?: string;
  children: React.ReactNode;
}) {
  return (
    <section className="surface-card p-5">
      <header className="mb-4">
        <h2 className="font-display text-lg font-semibold">{title}</h2>
        {desc && <p className="mt-1 text-[12.5px] text-fg-muted">{desc}</p>}
      </header>
      <div className="space-y-4">{children}</div>
    </section>
  );
}

function Input({
  name,
  label,
  type = "text",
  placeholder,
  defaultValue,
  inputMode,
  min,
  step,
  error,
}: {
  name: string;
  label: string;
  type?: string;
  placeholder?: string;
  defaultValue?: string;
  inputMode?: "decimal" | "numeric" | "text";
  min?: string;
  step?: string;
  error?: string;
}) {
  return (
    <label className="block">
      <div className="mb-1 text-[11px] font-semibold uppercase tracking-wider text-fg-subtle">
        {label}
      </div>
      <input
        name={name}
        type={type}
        placeholder={placeholder}
        defaultValue={defaultValue}
        inputMode={inputMode}
        min={min}
        step={step}
        aria-invalid={error ? true : undefined}
        className={`h-11 w-full rounded-md border bg-white/5 px-3 text-sm placeholder:text-fg-subtle focus:bg-white/[0.06] focus:outline-none ${
          error
            ? "border-danger/50 focus:border-danger"
            : "border-white/10 focus:border-iris-400/50"
        }`}
      />
      {error && <div className="mt-1 text-[11.5px] text-danger">{error}</div>}
    </label>
  );
}

function Textarea({
  name,
  label,
  placeholder,
  defaultValue,
  rows = 3,
  error,
}: {
  name: string;
  label: string;
  placeholder?: string;
  defaultValue?: string;
  rows?: number;
  error?: string;
}) {
  return (
    <label className="block">
      <div className="mb-1 text-[11px] font-semibold uppercase tracking-wider text-fg-subtle">
        {label}
      </div>
      <textarea
        name={name}
        rows={rows}
        placeholder={placeholder}
        defaultValue={defaultValue}
        aria-invalid={error ? true : undefined}
        className={`w-full rounded-md border bg-white/5 px-3 py-2.5 text-sm placeholder:text-fg-subtle focus:bg-white/[0.06] focus:outline-none ${
          error
            ? "border-danger/50 focus:border-danger"
            : "border-white/10 focus:border-iris-400/50"
        }`}
      />
      {error && <div className="mt-1 text-[11.5px] text-danger">{error}</div>}
    </label>
  );
}

function Select({
  name,
  label,
  options,
  defaultValue,
  error,
}: {
  name: string;
  label: string;
  options: readonly { value: string; label: string }[];
  defaultValue?: string;
  error?: string;
}) {
  return (
    <label className="block">
      <div className="mb-1 text-[11px] font-semibold uppercase tracking-wider text-fg-subtle">
        {label}
      </div>
      <select
        name={name}
        defaultValue={defaultValue}
        aria-invalid={error ? true : undefined}
        className={`h-11 w-full rounded-md border bg-white/5 px-3 text-sm focus:bg-white/[0.06] focus:outline-none ${
          error
            ? "border-danger/50 focus:border-danger"
            : "border-white/10 focus:border-iris-400/50"
        }`}
      >
        {options.map((o) => (
          <option key={o.value} value={o.value}>
            {o.label}
          </option>
        ))}
      </select>
      {error && <div className="mt-1 text-[11.5px] text-danger">{error}</div>}
    </label>
  );
}

function Radio({
  name,
  value,
  label,
  desc,
  defaultChecked,
}: {
  name: string;
  value: string;
  label: string;
  desc: string;
  defaultChecked?: boolean;
}) {
  return (
    <label className="flex cursor-pointer items-start gap-3 rounded-md border border-white/10 bg-white/5 p-3 has-[:checked]:border-iris-400/60 has-[:checked]:bg-iris-500/10">
      <input
        type="radio"
        name={name}
        value={value}
        defaultChecked={defaultChecked}
        className="mt-0.5"
      />
      <span>
        <span className="block text-[13px] font-semibold">{label}</span>
        <span className="mt-0.5 block text-[12px] text-fg-muted">{desc}</span>
      </span>
    </label>
  );
}


