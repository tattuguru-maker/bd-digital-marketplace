import Link from "next/link";
import {
  CheckCircle2,
  Clock,
  Package,
  Receipt,
  RefreshCw,
  RotateCcw,
  Search,
  ShieldCheck,
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { ButtonLink } from "@/components/ui/button";
import { Breadcrumb } from "@/components/marketplace/breadcrumb";
import { ProductArt } from "@/components/marketplace/product-art";
import { products, sellers } from "@/lib/data";
import { formatBDT } from "@/lib/utils";

export const metadata = { title: "My Orders · Digibazar" };

type OrderStatus = "delivered" | "in-progress" | "refunded" | "replacement";

type BuyerOrder = {
  id: string;
  productId: string;
  sellerId: string;
  qty: number;
  total: number;
  status: OrderStatus;
  paidVia: string;
  placedAt: string;
};

const NOW = Date.now();
const days = (n: number) => new Date(NOW - n * 86_400_000).toISOString();

const orders: BuyerOrder[] = [
  { id: "BD-92141", productId: "p7",  sellerId: "s2", qty: 1, total: 290,  status: "delivered",   paidVia: "bKash",   placedAt: days(0) },
  { id: "BD-92140", productId: "p1",  sellerId: "s1", qty: 1, total: 220,  status: "delivered",   paidVia: "bKash",   placedAt: days(1) },
  { id: "BD-92095", productId: "p11", sellerId: "s3", qty: 1, total: 2890, status: "delivered",   paidVia: "Visa",    placedAt: days(3) },
  { id: "BD-92039", productId: "p2",  sellerId: "s1", qty: 1, total: 180,  status: "delivered",   paidVia: "Nagad",   placedAt: days(7) },
  { id: "BD-91999", productId: "p4",  sellerId: "s4", qty: 1, total: 1690, status: "in-progress", paidVia: "bKash",   placedAt: days(0) },
  { id: "BD-91870", productId: "p15", sellerId: "s6", qty: 1, total: 1090, status: "replacement", paidVia: "bKash",   placedAt: days(11) },
  { id: "BD-91720", productId: "p17", sellerId: "s5", qty: 1, total: 1890, status: "refunded",    paidVia: "Rocket",  placedAt: days(20) },
];

const STATUS: Record<OrderStatus, { label: string; tint: string; icon: React.ReactNode }> = {
  delivered:    { label: "Delivered",        tint: "bg-success/15 text-success",     icon: <CheckCircle2 size={13} /> },
  "in-progress":{ label: "Awaiting delivery",tint: "bg-iris-500/15 text-iris-300",   icon: <Clock size={13} /> },
  replacement:  { label: "Replacement issued",tint: "bg-cyan-400/15 text-cyan-300",  icon: <RefreshCw size={13} /> },
  refunded:     { label: "Refunded",          tint: "bg-fg-subtle/15 text-fg-muted", icon: <RotateCcw size={13} /> },
};

export default function OrdersPage() {
  const stats = {
    total: orders.length,
    spent: orders.reduce((s, o) => s + (o.status === "refunded" ? 0 : o.total), 0),
    inFlight: orders.filter((o) => o.status === "in-progress").length,
  };

  return (
    <div className="container-page py-8 md:py-10">
      <Breadcrumb items={[{ label: "Home", href: "/" }, { label: "My Orders" }]} />

      <div className="mt-5 flex flex-wrap items-end justify-between gap-3">
        <div>
          <Badge variant="brand">
            <Receipt size={11} /> Order history
          </Badge>
          <h1 className="mt-2 font-display text-3xl font-extrabold md:text-[40px] md:leading-tight">
            My Orders
          </h1>
          <p className="mt-1 text-[14px] text-fg-muted md:text-[15px]">
            Track delivery, request replacements, download invoices.
          </p>
        </div>
        <div className="flex items-center gap-2">
          <ButtonLink href="/buyer-protection" variant="secondary" size="md">
            <ShieldCheck size={15} /> Buyer protection
          </ButtonLink>
        </div>
      </div>

      {/* Quick stats */}
      <div className="mt-6 grid gap-3 md:grid-cols-3">
        <Stat label="Total orders" value={String(stats.total)} icon={<Receipt size={16} />} />
        <Stat label="Lifetime spend" value={formatBDT(stats.spent)} icon={<Package size={16} />} />
        <Stat label="In-flight" value={String(stats.inFlight)} icon={<Clock size={16} />} />
      </div>

      {/* Search + filters */}
      <div className="mt-6 flex flex-wrap items-center justify-between gap-3">
        <form action="/orders" className="relative w-full max-w-sm">
          <input
            name="q"
            placeholder="Search by order ID, product or seller..."
            className="h-11 w-full rounded-full border border-white/10 bg-white/[0.04] pl-11 pr-4 text-[14px] placeholder:text-fg-subtle focus:border-iris-400/50 focus:bg-white/[0.06] focus:outline-none"
          />
          <Search size={16} className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-fg-subtle" />
        </form>

        <div className="flex flex-wrap gap-2 text-[13px]">
          {["All", "Delivered", "In progress", "Replacement", "Refunded"].map((f, i) => (
            <button
              key={f}
              type="button"
              className={`glass-pill h-9 rounded-full px-4 transition ${
                i === 0 ? "border-iris-400/50 text-fg" : "text-fg-muted hover:text-fg"
              }`}
            >
              {f}
            </button>
          ))}
        </div>
      </div>

      {/* List */}
      <div className="mt-6 space-y-3">
        {orders.map((o) => {
          const product = products.find((p) => p.id === o.productId);
          const seller = sellers.find((s) => s.id === o.sellerId);
          if (!product || !seller) return null;
          const s = STATUS[o.status];
          return (
            <article key={o.id} className="surface-card p-4 md:p-5">
              <div className="flex flex-wrap items-center justify-between gap-3 border-b border-white/5 pb-3 text-[12.5px] text-fg-subtle">
                <div className="inline-flex items-center gap-2">
                  <span className="font-mono text-fg">#{o.id}</span>
                  <span>·</span>
                  <span>{new Date(o.placedAt).toLocaleDateString("en-GB", { day: "numeric", month: "short", year: "numeric" })}</span>
                  <span>·</span>
                  <span>Paid via {o.paidVia}</span>
                </div>
                <span className={`inline-flex items-center gap-1 rounded-full px-2.5 py-1 text-[11.5px] font-medium ${s.tint}`}>
                  {s.icon} {s.label}
                </span>
              </div>

              <div className="mt-3 flex flex-col gap-4 md:flex-row md:items-center">
                <Link
                  href={`/product/${product.slug}`}
                  className="block w-full shrink-0 md:w-[120px]"
                >
                  <ProductArt
                    brandColor={product.brandColor}
                    brandLabel={product.brandLabel}
                    className="aspect-[4/3] w-full md:aspect-square"
                    rounded="rounded-lg"
                  />
                </Link>

                <div className="min-w-0 flex-1">
                  <Link href={`/product/${product.slug}`} className="font-display text-[17px] font-semibold leading-snug hover:text-white">
                    {product.name}
                  </Link>
                  <div className="mt-1 text-[12.5px] text-fg-subtle">
                    Sold by{" "}
                    <Link href={`/seller/${seller.id}`} className="text-iris-200 hover:text-iris-100">
                      {seller.displayName}
                    </Link>{" "}
                    · qty {o.qty}
                  </div>
                  <div className="mt-2 inline-flex items-center gap-1.5 text-[12.5px] text-fg-muted">
                    <ShieldCheck size={13} className="text-success" />
                    Buyer protection active
                  </div>
                </div>

                <div className="flex flex-wrap items-center justify-between gap-3 md:flex-col md:items-end md:gap-2">
                  <div className="text-right">
                    <div className="text-[11px] uppercase tracking-wider text-fg-subtle">total</div>
                    <div className="font-display text-xl font-extrabold">{formatBDT(o.total)}</div>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    <ButtonLink
                      href={`/checkout/success?order=${o.id}`}
                      size="sm"
                      variant={o.status === "in-progress" ? "primary" : "secondary"}
                    >
                      {o.status === "in-progress" ? "Track delivery" : "View receipt"}
                    </ButtonLink>
                    {o.status === "delivered" && (
                      <ButtonLink href={`/seller/${seller.id}`} size="sm" variant="ghost">
                        Buy again
                      </ButtonLink>
                    )}
                    {o.status !== "refunded" && (
                      <ButtonLink href="/buyer-protection" size="sm" variant="ghost">
                        Report problem
                      </ButtonLink>
                    )}
                  </div>
                </div>
              </div>
            </article>
          );
        })}
      </div>
    </div>
  );
}

function Stat({ label, value, icon }: { label: string; value: string; icon: React.ReactNode }) {
  return (
    <div className="surface-card flex items-center gap-3 p-4">
      <div className="grid h-10 w-10 place-items-center rounded-lg bg-iris-500/15 text-iris-300">
        {icon}
      </div>
      <div className="min-w-0">
        <div className="text-[11px] font-semibold uppercase tracking-wider text-fg-subtle">{label}</div>
        <div className="font-display text-xl font-bold">{value}</div>
      </div>
    </div>
  );
}
