import { BarChart3, TrendingUp, Star, Eye, ShoppingBag } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { products } from "@/lib/data";
import { formatBDT, formatNumber } from "@/lib/utils";

export const metadata = { title: "Analytics · Seller dashboard · Digibazar" };

export default function AnalyticsPage() {
  const top = products.slice(0, 5);
  const days = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];
  const series = [12, 18, 22, 14, 26, 31, 24];
  const max = Math.max(...series);

  return (
    <>
      <div className="flex flex-wrap items-end justify-between gap-3">
        <div>
          <Badge variant="brand">
            <BarChart3 size={11} /> Analytics
          </Badge>
          <h1 className="mt-2 font-display text-2xl font-bold md:text-3xl">Store analytics</h1>
          <p className="mt-1 text-[14px] text-fg-muted">
            Last 30 days · compared with previous period
          </p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" size="md">7d</Button>
          <Button variant="primary" size="md">30d</Button>
          <Button variant="outline" size="md">90d</Button>
        </div>
      </div>

      <div className="mt-6 grid gap-3 md:grid-cols-2 lg:grid-cols-4">
        <Kpi label="Revenue" value={formatBDT(184_290)} delta="+24.1%" icon={<TrendingUp size={16} />} />
        <Kpi label="Orders" value="412" delta="+18.4%" icon={<ShoppingBag size={16} />} />
        <Kpi label="Storefront views" value="14.2k" delta="+9.8%" icon={<Eye size={16} />} />
        <Kpi label="Average rating" value="4.96" delta="+0.04" icon={<Star size={16} />} />
      </div>

      <div className="mt-6 grid gap-5 lg:grid-cols-3">
        <div className="surface-card p-5 lg:col-span-2">
          <div className="flex items-center justify-between">
            <h2 className="font-display text-lg font-bold">Daily orders</h2>
            <Badge variant="brand"><TrendingUp size={11} /> +18.4% vs prev</Badge>
          </div>
          <div className="mt-5 flex h-44 items-end gap-3">
            {series.map((v, i) => (
              <div key={i} className="flex flex-1 flex-col items-center gap-2">
                <div
                  className="w-full rounded-t-md bg-gradient-to-t from-iris-600/40 to-iris-400/80"
                  style={{ height: `${(v / max) * 100}%` }}
                  aria-label={`${days[i]}: ${v} orders`}
                />
                <span className="text-[11px] text-fg-subtle">{days[i]}</span>
              </div>
            ))}
          </div>
        </div>

        <div className="surface-card p-5">
          <h2 className="font-display text-lg font-bold">Conversion funnel</h2>
          <div className="mt-4 space-y-3">
            <FunnelRow label="Visited storefront" value={14_200} pct={100} />
            <FunnelRow label="Viewed a product"   value={9_840}  pct={69} />
            <FunnelRow label="Added to cart"      value={1_690}  pct={12} />
            <FunnelRow label="Completed purchase" value={412}    pct={3} />
          </div>
        </div>
      </div>

      <div className="mt-6 surface-card p-5">
        <div className="flex items-center justify-between">
          <h2 className="font-display text-lg font-bold">Best-selling products</h2>
          <Button variant="ghost" size="sm">View all</Button>
        </div>
        <div className="mt-4 space-y-3">
          {top.map((p, i) => (
            <div key={p.id} className="flex items-center gap-3">
              <span className="grid h-8 w-8 shrink-0 place-items-center rounded-md bg-white/5 font-mono text-[12px] text-fg-muted">
                {String(i + 1).padStart(2, "0")}
              </span>
              <div className="min-w-0 flex-1">
                <div className="truncate text-[13.5px] font-medium text-fg">{p.name}</div>
                <div className="text-[11.5px] text-fg-subtle">
                  {formatNumber(p.sold)} sold · {p.rating.toFixed(2)} ★
                </div>
              </div>
              <div className="font-display text-sm font-bold">{formatBDT(p.price * p.sold)}</div>
            </div>
          ))}
        </div>
      </div>
    </>
  );
}

function Kpi({ label, value, delta, icon }: { label: string; value: string; delta: string; icon: React.ReactNode }) {
  return (
    <div className="surface-card p-4">
      <div className="flex items-center justify-between">
        <div className="grid h-9 w-9 place-items-center rounded-lg bg-iris-500/15 text-iris-300">
          {icon}
        </div>
        <span className="text-[11.5px] font-semibold text-success">{delta}</span>
      </div>
      <div className="mt-3 text-[11px] font-semibold uppercase tracking-wider text-fg-subtle">{label}</div>
      <div className="mt-0.5 font-display text-2xl font-extrabold">{value}</div>
    </div>
  );
}

function FunnelRow({ label, value, pct }: { label: string; value: number; pct: number }) {
  return (
    <div>
      <div className="flex items-center justify-between text-[12.5px]">
        <span className="text-fg-muted">{label}</span>
        <span className="text-fg">{formatNumber(value)} <span className="text-fg-subtle">({pct}%)</span></span>
      </div>
      <div className="mt-1.5 h-1.5 w-full overflow-hidden rounded-full bg-white/5">
        <div
          className="h-full rounded-full bg-gradient-to-r from-iris-500 to-iris-400"
          style={{ width: `${pct}%` }}
        />
      </div>
    </div>
  );
}
