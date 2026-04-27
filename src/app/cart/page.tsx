import Link from "next/link";
import { Trash2, ShieldCheck, Tag, ArrowRight, Minus, Plus } from "lucide-react";
import { Button, ButtonLink } from "@/components/ui/button";
import { ProductArt } from "@/components/marketplace/product-art";
import { PaymentMethods } from "@/components/marketplace/payment-methods";
import { Breadcrumb } from "@/components/marketplace/breadcrumb";
import { Badge } from "@/components/ui/badge";
import { sampleCart, getProduct } from "@/lib/data";
import { formatBDT } from "@/lib/utils";

export const metadata = { title: "Cart · Digibazar" };

export default function CartPage() {
  const lines = sampleCart
    .map((c) => {
      const p = getProduct(c.productId);
      if (!p) return null;
      const variant = p.variants?.find((v) => v.id === c.variantId);
      const unit = variant?.price ?? p.price;
      return { ...c, product: p, variant, unit };
    })
    .filter(Boolean) as {
      productId: string; variantId?: string; qty: number;
      product: NonNullable<ReturnType<typeof getProduct>>;
      variant?: { id: string; label: string; price: number; originalPrice?: number };
      unit: number;
    }[];

  const subtotal = lines.reduce((s, l) => s + l.unit * l.qty, 0);
  const discount = Math.round(subtotal * 0.05);
  const protection = 0;
  const total = subtotal - discount + protection;

  return (
    <div className="container-page py-8">
      <Breadcrumb items={[{ label: "Home", href: "/" }, { label: "Cart" }]} />
      <h1 className="mt-3 font-display text-3xl font-bold md:text-4xl">Your cart</h1>
      <p className="mt-1 text-sm text-fg-muted">{lines.length} items · all eligible for buyer protection</p>

      <div className="mt-6 grid gap-6 lg:grid-cols-12">
        <div className="lg:col-span-8 space-y-3">
          {lines.map((l) => (
            <div key={l.productId + (l.variantId ?? "")} className="surface-card flex gap-4 p-4">
              <ProductArt
                brandColor={l.product.brandColor}
                brandLabel={l.product.brandLabel}
                className="h-24 w-24 shrink-0"
                rounded="rounded-lg"
                size="sm"
              />
              <div className="flex flex-1 flex-col">
                <div className="flex flex-wrap items-start justify-between gap-2">
                  <div>
                    <Link href={`/product/${l.product.slug}`} className="font-semibold hover:text-iris-200">
                      {l.product.name}
                    </Link>
                    {l.variant && (
                      <div className="mt-0.5 text-[12px] text-fg-muted">{l.variant.label}</div>
                    )}
                    <div className="mt-1 flex flex-wrap items-center gap-1.5 text-[11px]">
                      <Badge variant="brand">{l.product.platform}</Badge>
                      <Badge variant="success">Instant delivery</Badge>
                      <span className="text-fg-subtle">Sold by {l.product.sellerId}</span>
                    </div>
                  </div>
                  <button className="text-fg-subtle hover:text-danger" aria-label="Remove">
                    <Trash2 size={16} />
                  </button>
                </div>

                <div className="mt-auto flex flex-wrap items-center justify-between gap-3 pt-3">
                  <div className="inline-flex items-center rounded-md border border-white/10 bg-white/5">
                    <button className="grid h-8 w-8 place-items-center text-fg-muted hover:text-fg" aria-label="Decrease">
                      <Minus size={13} />
                    </button>
                    <span className="min-w-8 px-1 text-center text-[13px] font-medium">{l.qty}</span>
                    <button className="grid h-8 w-8 place-items-center text-fg-muted hover:text-fg" aria-label="Increase">
                      <Plus size={13} />
                    </button>
                  </div>
                  <div className="font-display text-lg font-bold">{formatBDT(l.unit * l.qty)}</div>
                </div>
              </div>
            </div>
          ))}

          {lines.length === 0 && (
            <div className="surface-card flex flex-col items-center gap-2 p-12 text-center">
              <div className="text-3xl">🛒</div>
              <h2 className="font-display text-lg font-bold">Your cart is empty</h2>
              <p className="text-sm text-fg-muted">Browse our top-rated sellers to get started.</p>
              <ButtonLink href="/browse" className="mt-3">Start shopping</ButtonLink>
            </div>
          )}

          <div className="surface-card mt-6 p-5">
            <div className="text-[11px] font-semibold uppercase tracking-wider text-fg-subtle">
              Have a coupon?
            </div>
            <div className="mt-2 flex gap-2">
              <input
                placeholder="WELCOME200"
                className="h-10 flex-1 rounded-md border border-white/10 bg-white/5 px-3 text-sm placeholder:text-fg-subtle focus:border-iris-400/50 focus:bg-white/[0.06] focus:outline-none"
              />
              <Button variant="secondary">Apply</Button>
            </div>
            <div className="mt-3 flex items-center gap-1.5 text-[12px] text-success">
              <Tag size={12} /> First-order coupon applied: ৳200 off via bKash
            </div>
          </div>
        </div>

        <aside className="lg:col-span-4">
          <div className="surface-card sticky top-32 p-5">
            <h2 className="font-display text-lg font-bold">Order summary</h2>
            <div className="mt-4 space-y-2 text-sm">
              <Row label="Subtotal" value={formatBDT(subtotal)} />
              <Row label="Coupon (WELCOME200)" value={`- ${formatBDT(discount)}`} highlight />
              <Row label="Buyer protection" value="Included" muted />
              <Row label="Delivery" value="Digital · instant" muted />
            </div>
            <div className="my-4 h-px bg-white/5" />
            <div className="flex items-center justify-between">
              <span className="text-sm text-fg-muted">Total</span>
              <span className="font-display text-2xl font-extrabold">{formatBDT(total)}</span>
            </div>
            <div className="mt-1 text-[11px] text-fg-subtle">Inc. all taxes · BDT</div>

            <ButtonLink href="/checkout" size="lg" className="mt-5 w-full">
              Continue to checkout <ArrowRight size={16} />
            </ButtonLink>

            <div className="mt-4 flex items-center gap-2 text-[12px] text-fg-muted">
              <ShieldCheck size={14} className="text-success" />
              30-day buyer protection on every order
            </div>

            <div className="mt-3">
              <div className="text-[11px] uppercase tracking-wider text-fg-subtle">We accept</div>
              <PaymentMethods className="mt-2" />
            </div>
          </div>
        </aside>
      </div>
    </div>
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
