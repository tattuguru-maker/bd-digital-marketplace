import Link from "next/link";
import { ShieldCheck, Lock, ChevronRight } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { ButtonLink } from "@/components/ui/button";
import { ProductArt } from "@/components/marketplace/product-art";
import { Breadcrumb } from "@/app/browse/page";
import { sampleCart, getProduct } from "@/lib/data";
import { formatBDT } from "@/lib/utils";

export const metadata = { title: "Checkout · Digibazar" };

export default function CheckoutPage() {
  const lines = sampleCart.map((c) => {
    const p = getProduct(c.productId)!;
    const v = p.variants?.find((vv) => vv.id === c.variantId);
    return { p, v, qty: c.qty, unit: v?.price ?? p.price };
  });
  const subtotal = lines.reduce((s, l) => s + l.unit * l.qty, 0);
  const discount = Math.round(subtotal * 0.05);
  const total = subtotal - discount;

  return (
    <div className="container-page py-8">
      <Breadcrumb items={[{ label: "Home", href: "/" }, { label: "Cart", href: "/cart" }, { label: "Checkout" }]} />

      <div className="mt-3 flex flex-wrap items-end justify-between gap-3">
        <h1 className="font-display text-3xl font-bold md:text-4xl">Secure checkout</h1>
        <div className="inline-flex items-center gap-1.5 text-[12px] text-fg-muted">
          <Lock size={13} className="text-success" />
          256-bit SSL · escrow protected
        </div>
      </div>

      <div className="mt-6 grid gap-6 lg:grid-cols-12">
        <div className="lg:col-span-7 space-y-5">
          {/* 1. Account */}
          <Step number={1} title="Account & delivery email" status="completed">
            <div className="grid gap-3 md:grid-cols-2">
              <Field label="Email" placeholder="you@example.com" defaultValue="tanvir@dhakadev.bd" />
              <Field label="Phone (bKash / Nagad)" placeholder="01XXXXXXXXX" defaultValue="01711-234567" />
            </div>
            <p className="mt-3 text-[12px] text-fg-subtle">
              Your codes and accounts will be delivered to this email and your dashboard.
            </p>
          </Step>

          {/* 2. Game IDs (if applicable) */}
          <Step number={2} title="Game / account IDs" status="active">
            <div className="grid gap-3 md:grid-cols-2">
              <Field label="Free Fire — Player ID" placeholder="123456789" defaultValue="248120384" />
              <Field label="In-game name (optional)" placeholder="Your IGN" />
            </div>
            <p className="mt-3 text-[12px] text-fg-subtle">
              We never need your password. Top-ups are applied directly via the player ID.
            </p>
          </Step>

          {/* 3. Payment */}
          <Step number={3} title="Payment method" status="pending">
            <div className="grid gap-2 md:grid-cols-2">
              {payments.map((p, i) => (
                <label
                  key={p.name}
                  className={`flex cursor-pointer items-center gap-3 rounded-lg border p-3 transition ${
                    i === 0 ? "border-iris-400/60 bg-iris-500/10" : "border-white/10 hover:border-iris-400/40"
                  }`}
                >
                  <input type="radio" name="pay" defaultChecked={i === 0} className="size-4 accent-iris-500" />
                  <span className={`grid h-9 w-12 place-items-center rounded-md text-[11px] font-bold text-white ${p.bg}`}>
                    {p.short}
                  </span>
                  <div className="flex-1">
                    <div className="text-[13px] font-medium">{p.name}</div>
                    <div className="text-[11px] text-fg-subtle">{p.sub}</div>
                  </div>
                  {p.discount && <Badge variant="gold">{p.discount}</Badge>}
                </label>
              ))}
            </div>

            <div className="mt-5 grid gap-3 md:grid-cols-2">
              <Field label="bKash account number" placeholder="01XXXXXXXXX" defaultValue="01711-234567" />
              <Field label="Transaction PIN" type="password" placeholder="• • • •" />
            </div>
            <p className="mt-3 text-[12px] text-fg-subtle">
              You will receive a PIN prompt from bKash. Don&apos;t share it with anyone.
            </p>
          </Step>

          {/* 4. Review & place */}
          <div className="surface-card p-5">
            <label className="flex items-start gap-3 text-[12.5px] text-fg-muted">
              <input type="checkbox" defaultChecked className="mt-1 size-4 accent-iris-500" />
              I agree to Digibazar&apos;s{" "}
              <Link href="/terms" className="text-iris-200 hover:text-iris-100">Terms</Link>{" "}
              and acknowledge the{" "}
              <Link href="/refund" className="text-iris-200 hover:text-iris-100">refund policy</Link>.
              I understand my purchase is protected by 30-day buyer protection.
            </label>
            <ButtonLink href="/checkout/success" size="lg" className="mt-4 w-full">
              Pay {formatBDT(total)} securely <ChevronRight size={16} />
            </ButtonLink>
            <div className="mt-3 flex items-center justify-center gap-2 text-[11.5px] text-fg-subtle">
              <ShieldCheck size={13} className="text-success" />
              Your payment is held in escrow until your product is delivered and verified.
            </div>
          </div>
        </div>

        <aside className="lg:col-span-5">
          <div className="surface-card sticky top-32 p-5">
            <h2 className="font-display text-lg font-bold">Order summary</h2>

            <div className="mt-4 space-y-3">
              {lines.map((l) => (
                <div key={l.p.id + (l.v?.id ?? "")} className="flex items-center gap-3">
                  <ProductArt
                    brandColor={l.p.brandColor}
                    brandLabel={l.p.brandLabel}
                    className="h-12 w-12 shrink-0"
                    rounded="rounded-lg"
                    size="sm"
                  />
                  <div className="min-w-0 flex-1">
                    <div className="line-clamp-1 text-[13px] font-medium">{l.p.name}</div>
                    <div className="text-[11px] text-fg-subtle">
                      {l.v?.label ?? "1× package"} · qty {l.qty}
                    </div>
                  </div>
                  <div className="text-[13px] font-semibold">{formatBDT(l.unit * l.qty)}</div>
                </div>
              ))}
            </div>

            <div className="my-4 h-px bg-white/5" />

            <div className="space-y-2 text-sm">
              <Row label="Subtotal" value={formatBDT(subtotal)} />
              <Row label="Coupon WELCOME200" value={`- ${formatBDT(discount)}`} highlight />
              <Row label="bKash discount" value="Included" muted />
              <Row label="Service fee" value="৳0 (onboarding)" muted />
            </div>
            <div className="my-4 h-px bg-white/5" />
            <div className="flex items-center justify-between">
              <span className="text-fg-muted">Total</span>
              <span className="font-display text-2xl font-extrabold">{formatBDT(total)}</span>
            </div>

            <div className="mt-5 grid grid-cols-2 gap-2 text-[12px] text-fg-muted">
              <div className="rounded-lg border border-white/5 bg-white/[0.03] p-2">
                <div className="font-semibold text-fg">100%</div>
                buyer protected
              </div>
              <div className="rounded-lg border border-white/5 bg-white/[0.03] p-2">
                <div className="font-semibold text-fg">~ 5 min</div>
                avg. delivery
              </div>
            </div>
          </div>
        </aside>
      </div>
    </div>
  );
}

const payments = [
  { name: "bKash",  short: "bK",   bg: "bg-pink-600",   sub: "Pay with bKash · 2% extra discount", discount: "+2% off" },
  { name: "Nagad",  short: "Ng",   bg: "bg-orange-500", sub: "Pay with Nagad · cashback offer", discount: undefined },
  { name: "Rocket", short: "Rk",   bg: "bg-purple-600", sub: "Pay with DBBL Rocket", discount: undefined },
  { name: "Card",   short: "VISA", bg: "bg-blue-600",   sub: "Visa, Mastercard, Amex", discount: undefined },
];

function Step({
  number, title, status, children,
}: {
  number: number; title: string; status: "completed" | "active" | "pending"; children: React.ReactNode;
}) {
  return (
    <div className="surface-card p-5">
      <div className="flex items-center gap-3">
        <span
          className={`grid h-7 w-7 place-items-center rounded-full text-[12px] font-bold ${
            status === "completed"
              ? "bg-success/20 text-success border border-success/40"
              : status === "active"
              ? "bg-iris-500/20 text-iris-200 border border-iris-400/40 animate-pulse-ring"
              : "bg-white/5 text-fg-subtle border border-white/10"
          }`}
        >
          {status === "completed" ? "✓" : number}
        </span>
        <h3 className="font-display text-base font-bold">{title}</h3>
      </div>
      <div className="mt-4">{children}</div>
    </div>
  );
}

function Field({
  label, placeholder, type = "text", defaultValue,
}: {
  label: string; placeholder?: string; type?: string; defaultValue?: string;
}) {
  return (
    <label className="block">
      <div className="mb-1 text-[11px] font-semibold uppercase tracking-wider text-fg-subtle">
        {label}
      </div>
      <input
        type={type}
        defaultValue={defaultValue}
        placeholder={placeholder}
        className="h-10 w-full rounded-md border border-white/10 bg-white/5 px-3 text-sm placeholder:text-fg-subtle focus:border-iris-400/50 focus:bg-white/[0.06] focus:outline-none"
      />
    </label>
  );
}

function Row({ label, value, muted, highlight }: { label: string; value: string; muted?: boolean; highlight?: boolean }) {
  return (
    <div className="flex items-center justify-between">
      <span className={muted ? "text-fg-subtle" : "text-fg-muted"}>{label}</span>
      <span className={highlight ? "font-medium text-success" : "font-medium"}>{value}</span>
    </div>
  );
}
