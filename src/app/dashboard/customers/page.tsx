import { Search, Users, TrendingUp, Repeat } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { formatBDT, formatNumber } from "@/lib/utils";

export const metadata = { title: "Customers · Seller dashboard · Digibazar" };

type Tier = "VIP" | "Regular" | "New";

type Customer = {
  id: string;
  name: string;
  initials: string;
  color: string;
  city: string;
  orders: number;
  spent: number;
  lastOrder: string;
  tier: Tier;
};

const customers: Customer[] = [
  { id: "c1",  name: "Tanvir Hossain",   initials: "TH", color: "from-iris-400 to-iris-700",     city: "Dhaka",     orders: 28, spent: 18420, lastOrder: "today",      tier: "VIP" },
  { id: "c2",  name: "Sumaiya Rahman",   initials: "SR", color: "from-pink-400 to-fuchsia-600",  city: "Chattogram",orders: 19, spent: 11200, lastOrder: "yesterday",  tier: "VIP" },
  { id: "c3",  name: "Ariful Islam",     initials: "AI", color: "from-emerald-400 to-cyan-600",  city: "Dhaka",     orders: 14, spent: 9120,  lastOrder: "2 days ago", tier: "VIP" },
  { id: "c4",  name: "Nusrat Jahan",     initials: "NJ", color: "from-amber-400 to-pink-500",    city: "Sylhet",    orders: 9,  spent: 5640,  lastOrder: "3 days ago", tier: "Regular" },
  { id: "c5",  name: "Rifat Chowdhury",  initials: "RC", color: "from-cyan-400 to-iris-500",     city: "Khulna",    orders: 6,  spent: 4170,  lastOrder: "5 days ago", tier: "Regular" },
  { id: "c6",  name: "Sabrina Akter",    initials: "SA", color: "from-fuchsia-400 to-iris-500",  city: "Dhaka",     orders: 4,  spent: 2390,  lastOrder: "1 week ago", tier: "Regular" },
  { id: "c7",  name: "Mahmudul Hasan",   initials: "MH", color: "from-sky-400 to-iris-500",      city: "Rajshahi",  orders: 2,  spent: 1180,  lastOrder: "1 week ago", tier: "New" },
  { id: "c8",  name: "Tasnia Rahim",     initials: "TR", color: "from-rose-400 to-pink-600",     city: "Dhaka",     orders: 1,  spent: 290,   lastOrder: "2 weeks ago", tier: "New" },
];

const TIER_TINT: Record<Tier, string> = {
  VIP:     "bg-gold-400/15 text-gold-300 border border-gold-400/30",
  Regular: "bg-iris-500/15 text-iris-200",
  New:     "bg-white/5 text-fg-muted",
};

export default function CustomersPage() {
  const total = customers.length;
  const lifetimeRevenue = customers.reduce((s, c) => s + c.spent, 0);
  const repeatRate = Math.round(
    (customers.filter((c) => c.orders >= 2).length / total) * 100,
  );

  return (
    <>
      <div className="flex flex-wrap items-end justify-between gap-3">
        <div>
          <Badge variant="brand">
            <Users size={11} /> Customers
          </Badge>
          <h1 className="mt-2 font-display text-2xl font-bold md:text-3xl">Your customer base</h1>
          <p className="mt-1 text-[14px] text-fg-muted">
            {total} buyers across Bangladesh · grouped by lifetime spend.
          </p>
        </div>
        <Button variant="secondary" size="md">Export segment</Button>
      </div>

      <div className="mt-6 grid gap-3 md:grid-cols-3">
        <Kpi label="Total customers" value={String(total)} icon={<Users size={16} />} />
        <Kpi label="Lifetime revenue" value={formatBDT(lifetimeRevenue)} icon={<TrendingUp size={16} />} />
        <Kpi label="Repeat-buyer rate" value={`${repeatRate}%`} icon={<Repeat size={16} />} />
      </div>

      <div className="mt-6 surface-card overflow-hidden">
        <div className="flex flex-wrap items-center justify-between gap-3 border-b border-white/5 p-4 md:p-5">
          <h2 className="font-display text-lg font-bold">All customers</h2>
          <div className="relative w-full max-w-xs">
            <input
              placeholder="Search by name or city..."
              className="h-9 w-full rounded-md border border-white/10 bg-white/5 pl-9 pr-3 text-[13px] placeholder:text-fg-subtle focus:border-iris-400/50 focus:bg-white/[0.06] focus:outline-none"
            />
            <Search size={14} className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-fg-subtle" />
          </div>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full min-w-[640px] text-left text-[13px]">
            <thead className="text-[11px] uppercase tracking-wider text-fg-subtle">
              <tr className="border-b border-white/5">
                <th className="px-5 py-3">Customer</th>
                <th className="px-5 py-3">City</th>
                <th className="px-5 py-3 text-right">Orders</th>
                <th className="px-5 py-3 text-right">Spent</th>
                <th className="px-5 py-3">Last order</th>
                <th className="px-5 py-3">Tier</th>
              </tr>
            </thead>
            <tbody>
              {customers.map((c) => (
                <tr key={c.id} className="border-b border-white/[0.03] last:border-0 hover:bg-white/[0.02]">
                  <td className="px-5 py-3">
                    <div className="flex items-center gap-3">
                      <div className={`grid h-9 w-9 place-items-center rounded-full bg-gradient-to-br ${c.color} font-display text-xs font-bold text-white`}>
                        {c.initials}
                      </div>
                      <div className="font-medium text-fg">{c.name}</div>
                    </div>
                  </td>
                  <td className="px-5 py-3 text-fg-muted">{c.city}</td>
                  <td className="px-5 py-3 text-right">{formatNumber(c.orders)}</td>
                  <td className="px-5 py-3 text-right font-semibold">{formatBDT(c.spent)}</td>
                  <td className="px-5 py-3 text-fg-muted">{c.lastOrder}</td>
                  <td className="px-5 py-3">
                    <span className={`inline-flex rounded-full px-2 py-0.5 text-[11px] font-medium ${TIER_TINT[c.tier]}`}>
                      {c.tier}
                    </span>
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
