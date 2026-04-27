import { BadgePercent, Plus, Calendar, Tag } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { formatBDT, formatNumber } from "@/lib/utils";

export const metadata = { title: "Promotions · Seller dashboard · Digibazar" };

type Promo = {
  code: string;
  description: string;
  type: "percent" | "amount" | "free-replacement";
  value: string;
  uses: number;
  cap: number | null;
  revenue: number;
  endsAt: string;
  active: boolean;
};

const promos: Promo[] = [
  { code: "WELCOME200", description: "First-time buyers · ৳200 off",     type: "amount",  value: "৳200", uses: 318, cap: null, revenue: 91040, endsAt: "30 Jun 2026", active: true },
  { code: "BKASH2",     description: "Pay with bKash · 2% extra off",   type: "percent", value: "2%",   uses: 1812, cap: null, revenue: 412900, endsAt: "Always on",  active: true },
  { code: "EID25",      description: "Eid sale · 25% off CD keys",      type: "percent", value: "25%",  uses: 84,  cap: 200,  revenue: 21340, endsAt: "10 May 2026", active: true },
  { code: "FREEREPL",   description: "Free 60-day replacement",         type: "free-replacement", value: "60d", uses: 27, cap: 100, revenue: 0, endsAt: "31 Dec 2026", active: true },
  { code: "FLASH10",    description: "Flash sale · 10% off everything", type: "percent", value: "10%",  uses: 514, cap: 500,  revenue: 78640, endsAt: "Ended",       active: false },
];

export default function PromosPage() {
  const totalUses = promos.reduce((s, p) => s + p.uses, 0);
  const totalRevenue = promos.reduce((s, p) => s + p.revenue, 0);

  return (
    <>
      <div className="flex flex-wrap items-end justify-between gap-3">
        <div>
          <Badge variant="brand">
            <BadgePercent size={11} /> Promotions
          </Badge>
          <h1 className="mt-2 font-display text-2xl font-bold md:text-3xl">Discount codes</h1>
          <p className="mt-1 text-[14px] text-fg-muted">
            Run flash sales, target VIP customers, attract new buyers.
          </p>
        </div>
        <Button size="md">
          <Plus size={14} /> New promo code
        </Button>
      </div>

      <div className="mt-6 grid gap-3 md:grid-cols-3">
        <Kpi label="Active codes"      value={String(promos.filter((p) => p.active).length)} icon={<Tag size={16} />} />
        <Kpi label="Total redemptions" value={formatNumber(totalUses)}                       icon={<BadgePercent size={16} />} />
        <Kpi label="Promo revenue"     value={formatBDT(totalRevenue)}                       icon={<Calendar size={16} />} />
      </div>

      <div className="mt-6 surface-card overflow-hidden">
        <div className="border-b border-white/5 p-4 md:p-5">
          <h2 className="font-display text-lg font-bold">All promo codes</h2>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full min-w-[720px] text-left text-[13px]">
            <thead className="text-[11px] uppercase tracking-wider text-fg-subtle">
              <tr className="border-b border-white/5">
                <th className="px-5 py-3">Code</th>
                <th className="px-5 py-3">Discount</th>
                <th className="px-5 py-3 text-right">Uses</th>
                <th className="px-5 py-3 text-right">Revenue</th>
                <th className="px-5 py-3">Ends</th>
                <th className="px-5 py-3">Status</th>
                <th className="px-5 py-3"></th>
              </tr>
            </thead>
            <tbody>
              {promos.map((p) => (
                <tr key={p.code} className="border-b border-white/[0.03] last:border-0 hover:bg-white/[0.02]">
                  <td className="px-5 py-3">
                    <div className="font-mono font-semibold text-fg">{p.code}</div>
                    <div className="text-[11.5px] text-fg-subtle">{p.description}</div>
                  </td>
                  <td className="px-5 py-3 text-fg-muted">{p.value}</td>
                  <td className="px-5 py-3 text-right">
                    {formatNumber(p.uses)}
                    {p.cap && <span className="text-fg-subtle"> / {formatNumber(p.cap)}</span>}
                  </td>
                  <td className="px-5 py-3 text-right font-semibold">{formatBDT(p.revenue)}</td>
                  <td className="px-5 py-3 text-fg-muted">{p.endsAt}</td>
                  <td className="px-5 py-3">
                    <span
                      className={`inline-flex rounded-full px-2 py-0.5 text-[11px] font-medium ${
                        p.active
                          ? "bg-success/15 text-success"
                          : "bg-white/5 text-fg-muted"
                      }`}
                    >
                      {p.active ? "Active" : "Ended"}
                    </span>
                  </td>
                  <td className="px-5 py-3 text-right">
                    <Button variant="ghost" size="sm">Edit</Button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </>
  );
}

function Kpi({ label, value, icon }: { label: string; value: string; icon: React.ReactNode }) {
  return (
    <div className="surface-card flex items-center gap-3 p-4">
      <div className="grid h-10 w-10 place-items-center rounded-lg bg-iris-500/15 text-iris-300">
        {icon}
      </div>
      <div>
        <div className="text-[11px] font-semibold uppercase tracking-wider text-fg-subtle">{label}</div>
        <div className="font-display text-xl font-bold">{value}</div>
      </div>
    </div>
  );
}
