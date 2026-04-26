import { Search, Download } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { sellerOrders } from "@/lib/data";
import { formatBDT, timeAgo } from "@/lib/utils";

export const metadata = { title: "Orders · Digibazar" };

export default function OrdersPage() {
  return (
    <>
      <div className="flex flex-wrap items-end justify-between gap-3">
        <div>
          <h1 className="font-display text-3xl font-bold">Orders</h1>
          <p className="mt-1 text-sm text-fg-muted">{sellerOrders.length} orders · last 7 days</p>
        </div>
        <Button variant="secondary"><Download size={14} /> Export CSV</Button>
      </div>

      <div className="mt-5 grid gap-3 md:grid-cols-4">
        {[
          { l: "Today", v: "8" },
          { l: "Pending delivery", v: "2" },
          { l: "Refund requests", v: "0" },
          { l: "Disputes", v: "0" },
        ].map((s) => (
          <div key={s.l} className="surface-card p-4">
            <div className="text-[11px] uppercase tracking-wider text-fg-subtle">{s.l}</div>
            <div className="mt-1 font-display text-2xl font-bold">{s.v}</div>
          </div>
        ))}
      </div>

      <div className="mt-5 surface-card overflow-hidden">
        <div className="flex flex-wrap items-center gap-2 border-b border-white/5 p-3">
          <div className="relative flex-1 min-w-[240px]">
            <Search size={14} className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-fg-subtle" />
            <input
              placeholder="Search by order ID or buyer name..."
              className="h-9 w-full rounded-md border border-white/10 bg-white/5 pl-9 pr-3 text-[13px] placeholder:text-fg-subtle focus:border-iris-400/50 focus:bg-white/[0.06] focus:outline-none"
            />
          </div>
          {["All", "Delivered", "Processing", "Refunded"].map((s, i) => (
            <Badge key={s} variant={i === 0 ? "brand" : "outline"}>{s}</Badge>
          ))}
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-[13px]">
            <thead className="text-[11px] uppercase tracking-wider text-fg-subtle">
              <tr className="bg-white/[0.02]">
                <th className="py-3 pl-4 pr-3">Order ID</th>
                <th className="py-3 pr-3">When</th>
                <th className="py-3 pr-3">Buyer</th>
                <th className="py-3 pr-3">Product</th>
                <th className="py-3 pr-3">Status</th>
                <th className="py-3 pr-3 text-right">Amount</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5">
              {sellerOrders.map((o) => (
                <tr key={o.id} className="text-fg-muted hover:bg-white/[0.02]">
                  <td className="py-3 pl-4 pr-3 font-mono text-fg">{o.id}</td>
                  <td className="py-3 pr-3 text-[12px]">{timeAgo(o.createdAt)}</td>
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
    </>
  );
}
