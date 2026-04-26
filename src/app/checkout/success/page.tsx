import Link from "next/link";
import { CheckCircle2, Copy, Mail, Download, ShieldCheck } from "lucide-react";
import { ButtonLink } from "@/components/ui/button";

export const metadata = { title: "Order placed · Digibazar" };

export default function SuccessPage() {
  return (
    <div className="container-page py-16">
      <div className="mx-auto max-w-2xl text-center">
        <div className="mx-auto grid h-16 w-16 place-items-center rounded-full brand-gradient brand-glow">
          <CheckCircle2 size={28} className="text-white" />
        </div>
        <h1 className="mt-5 font-display text-3xl font-extrabold md:text-4xl">Order placed!</h1>
        <p className="mt-2 text-fg-muted">
          Order <span className="font-mono text-fg">#BD-10248</span> · paid via bKash
        </p>
      </div>

      <div className="mx-auto mt-8 max-w-2xl space-y-4">
        <div className="surface-card p-5 text-left">
          <div className="text-[11px] font-semibold uppercase tracking-wider text-iris-200">
            Your delivery
          </div>
          <h2 className="mt-1 font-display text-lg font-bold">Netflix Premium · 1 month</h2>
          <p className="mt-1 text-[13px] text-fg-muted">Login credentials below. Replacement covered for 30 days.</p>

          <div className="mt-4 grid gap-2 md:grid-cols-2">
            <Field label="Email" value="netflix.bd.420@digimail.bd" />
            <Field label="Password" value="••••••••••" sensitive />
            <Field label="PIN" value="2480" />
            <Field label="Profile" value="Tanvir" />
          </div>

          <div className="mt-4 flex flex-wrap gap-2">
            <ButtonLink href="#" variant="secondary" size="sm"><Copy size={13} /> Copy login</ButtonLink>
            <ButtonLink href="#" variant="ghost" size="sm"><Mail size={13} /> Resend by email</ButtonLink>
            <ButtonLink href="#" variant="ghost" size="sm"><Download size={13} /> Invoice PDF</ButtonLink>
          </div>
        </div>

        <div className="surface-card flex items-start gap-3 p-4">
          <ShieldCheck size={18} className="mt-0.5 text-success" />
          <div className="text-[13px] text-fg-muted">
            <div className="font-semibold text-fg">Buyer protection active</div>
            <p>If anything goes wrong with this product within 30 days, contact the seller from your order page or open a dispute. Free replacement or full refund — no questions asked.</p>
          </div>
        </div>

        <div className="flex flex-wrap justify-center gap-3 pt-4">
          <ButtonLink href="/orders">Go to my orders</ButtonLink>
          <ButtonLink href="/browse" variant="secondary">Continue shopping</ButtonLink>
        </div>
        <p className="text-center text-[12px] text-fg-subtle">
          Loved this seller? <Link href="/seller/s1" className="text-iris-200 hover:text-iris-100">Leave a review</Link>
        </p>
      </div>
    </div>
  );
}

function Field({ label, value, sensitive }: { label: string; value: string; sensitive?: boolean }) {
  return (
    <div className="rounded-lg border border-white/10 bg-white/[0.03] p-3">
      <div className="text-[10px] font-semibold uppercase tracking-wider text-fg-subtle">{label}</div>
      <div className={`mt-1 font-mono text-[13px] ${sensitive ? "text-fg" : "text-fg"}`}>{value}</div>
    </div>
  );
}
