import Link from "next/link";
import { ArrowUpRight, ShoppingBag, Wallet, Users, Star, TrendingUp, ChevronRight } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { ButtonLink } from "@/components/ui/button";
import { ProductArt } from "@/components/marketplace/product-art";
import { sellerOrders, products } from "@/lib/data";
import { formatBDT, formatNumber } from "@/lib/utils";

export const metadata = { title: "Seller dashboard · Digibazar" };

export default function DashboardPage() {
  const totalRevenue = sellerOrders
    .filter((o) => o.status !== "refunded")
    .reduce((s, o) => s + o.total, 0);
  const orders = sellerOrders.length;
  const avgRating = 4.96;
  const newCustomers = 14;

  const topProducts = products.slice(0, 4);

  return (
    <>
      <h1 className="font-display text-3xl font-bold">Welcome back, Dhaka Digital 👋</h1>
      <p className="mt-1 text-sm text-fg-muted">
        Here&apos;s how your store is performing today.
      </p>

      {/* KPIs */}
      <div className="mt-6 grid gap-3 md:grid-cols-2 lg:grid-cols-4">
        <Kpi
          label="Revenue (today)"
          value={formatBDT(totalRevenue)}
          delta="+18.4%"
          icon={<Wallet size={16} />}
          accent="from-iris-500/30 to-iris-700/10"
        />
        <Kpi
          label="Orders (today)"
          value={String(orders)}
          delta="+6.2%"
          icon={<ShoppingBag size={16} />}
          accent="from-cyan-500/30 to-iris-700/10"
        />
        <Kpi
          label="New customers"
          value={String(newCustomers)}
          delta="+22%"
          icon={<Users size={16} />}
          accent="from-emerald-500/30 to-iris-700/10"
        />
        <Kpi
          label="Avg. rating"
          value={avgRating.toFixed(2)}
          delta="+0.04"
          icon={<Star size={16} />}
          accent="from-gold-400/30 to-iris-700/10"
        />
      </div>

      {/* Sales chart placeholder */}
      <div className="mt-6 grid gap-5 lg:grid-cols-3">
        <div className="surface-card p-5 lg:col-span-2">
          <div className="flex flex-wrap items-center justify-between gap-2">
            <div>
              <div className="text-[11px] font-semibold uppercase tracking-wider text-fg-subtle">
                Sales last 14 days
              </div>
              <div className="mt-1 font-display text-2xl font-bold">{formatBDT(184_290)}</div>
            </div>
            <Badge variant="brand"><TrendingUp size={11} /> +24% vs prev. period</Badge>
          </div>
          <SalesChart />
          <div className="mt-3 grid grid-cols-7 gap-1 text-center text-[10px] text-fg-subtle">
            {["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"].map((d) => (
              <span key={d}>{d}</span>
            ))}
          </div>
        </div>

        <div className="surface-card p-5">
          <div className="text-[11px] font-semibold uppercase tracking-wider text-fg-subtle">
            Today&apos;s payouts
          </div>
          <div className="mt-1 font-display text-2xl font-bold">{formatBDT(9_860)}</div>
          <p className="mt-1 text-[12px] text-fg-subtle">Auto-transfer to bKash · 11:59 PM</p>
          <div className="mt-4 space-y-2 text-[13px]">
            <PayoutLine label="Gross sales" value={formatBDT(10_590)} />
            <PayoutLine label="Refunds" value={`- ${formatBDT(290)}`} muted />
            <PayoutLine label="Replacements" value={`- ${formatBDT(440)}`} muted />
            <PayoutLine label="Service fee" value="৳0 (onboarding)" highlight />
          </div>
          <div className="my-3 h-px bg-white/5" />
          <div className="flex items-center justify-between">
            <span className="text-fg-muted text-[13px]">Net payout</span>
            <span className="font-display text-lg font-extrabold">{formatBDT(9_860)}</span>
          </div>
          <ButtonLink href="/dashboard/payouts" variant="secondary" size="sm" className="mt-4 w-full">
            Payout history <ChevronRight size={14} />
          </ButtonLink>
        </div>
      </div>

      {/* Recent orders + top products */}
      <div className="mt-6 grid gap-5 lg:grid-cols-3">
        <div className="surface-card p-5 lg:col-span-2">
          <div className="flex items-center justify-between">
            <h2 className="font-display text-lg font-bold">Recent orders</h2>
            <Link href="/dashboard/orders" className="text-[12px] text-iris-200 hover:text-iris-100">View all →</Link>
          </div>
          <div className="mt-4 overflow-x-auto">
            <table className="w-full text-left text-[13px]">
              <thead className="text-[11px] uppercase tracking-wider text-fg-subtle">
                <tr>
                  <th className="py-2 pr-3">Order</th>
                  <th className="py-2 pr-3">Buyer</th>
                  <th className="py-2 pr-3">Product</th>
                  <th className="py-2 pr-3">Status</th>
                  <th className="py-2 pr-3 text-right">Amount</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5">
                {sellerOrders.slice(0, 6).map((o) => (
                  <tr key={o.id} className="text-fg-muted">
                    <td className="py-3 pr-3 font-mono text-[12px]">{o.id}</td>
                    <td className="py-3 pr-3 text-fg">{o.buyer}</td>
                    <td className="py-3 pr-3 line-clamp-1">{o.product}</td>
                    <td className="py-3 pr-3">
                      {o.status === "delivered" && <Badge variant="success">Delivered</Badge>}
                      {o.status === "processing" && <Badge variant="brand">Processing</Badge>}
                      {o.status === "refunded" && <Badge variant="danger">Refunded</Badge>}
                    </td>
                    <td className="py-3 pr-3 text-right font-medium text-fg">{formatBDT(o.total)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        <div className="surface-card p-5">
          <div className="flex items-center justify-between">
            <h2 className="font-display text-lg font-bold">Top products</h2>
            <Link href="/dashboard/listings" className="text-[12px] text-iris-200 hover:text-iris-100">All →</Link>
          </div>
          <div className="mt-4 space-y-3">
            {topProducts.map((p) => (
              <Link key={p.id} href={`/product/${p.slug}`} className="flex items-center gap-3 rounded-lg p-2 hover:bg-white/5">
                <ProductArt
                  brandColor={p.brandColor}
                  brandLabel={p.brandLabel}
                  className="h-10 w-10"
                  rounded="rounded-md"
                  size="sm"
                />
                <div className="min-w-0 flex-1">
                  <div className="line-clamp-1 text-[13px] font-medium">{p.name}</div>
                  <div className="text-[11px] text-fg-subtle">
                    {formatNumber(p.sold)} sold · this week
                  </div>
                </div>
                <ArrowUpRight size={14} className="text-fg-subtle" />
              </Link>
            ))}
          </div>
        </div>
      </div>
    </>
  );
}

function Kpi({
  label, value, delta, icon, accent,
}: {
  label: string; value: string; delta: string; icon: React.ReactNode; accent: string;
}) {
  return (
    <div className={`relative overflow-hidden rounded-xl border border-white/8 bg-gradient-to-br ${accent} p-5`}>
      <div className="absolute inset-0 bg-bg-elev/65" />
      <div className="relative">
        <div className="flex items-center justify-between text-[11px] uppercase tracking-wider text-fg-subtle">
          <span>{label}</span>
          <span className="text-iris-300">{icon}</span>
        </div>
        <div className="mt-2 font-display text-2xl font-extrabold">{value}</div>
        <div className="mt-1 text-[11.5px] text-success">{delta}</div>
      </div>
    </div>
  );
}

function PayoutLine({ label, value, muted, highlight }: { label: string; value: string; muted?: boolean; highlight?: boolean }) {
  return (
    <div className="flex items-center justify-between">
      <span className={muted ? "text-fg-subtle" : "text-fg-muted"}>{label}</span>
      <span className={highlight ? "font-medium text-success" : "font-medium"}>{value}</span>
    </div>
  );
}

function SalesChart() {
  const points = [22, 38, 28, 64, 48, 72, 56, 60, 80, 72, 90, 84, 98, 110];
  const max = Math.max(...points);
  const w = 600, h = 140;
  const step = w / (points.length - 1);
  const path = points
    .map((y, i) => `${i === 0 ? "M" : "L"} ${i * step} ${h - (y / max) * h}`)
    .join(" ");
  const area = `${path} L ${w} ${h} L 0 ${h} Z`;

  return (
    <div className="mt-4">
      <svg viewBox={`0 0 ${w} ${h}`} className="h-32 w-full">
        <defs>
          <linearGradient id="lg" x1="0" x2="0" y1="0" y2="1">
            <stop offset="0%"   stopColor="#7a64ff" stopOpacity="0.4" />
            <stop offset="100%" stopColor="#7a64ff" stopOpacity="0" />
          </linearGradient>
        </defs>
        <path d={area} fill="url(#lg)" />
        <path d={path} fill="none" stroke="#9b8dff" strokeWidth="2" />
        {points.map((y, i) => (
          <circle key={i} cx={i * step} cy={h - (y / max) * h} r="2.5" fill="#c1b8ff" />
        ))}
      </svg>
    </div>
  );
}
