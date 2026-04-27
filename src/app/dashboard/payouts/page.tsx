import {
  Wallet,
  TrendingUp,
  Download,
  ArrowDownToLine,
  CheckCircle2,
  Clock,
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button, ButtonLink } from "@/components/ui/button";
import { formatBDT } from "@/lib/utils";

export const metadata = { title: "Payouts · Seller dashboard · Digibazar" };

type PayoutStatus = "settled" | "processing" | "scheduled";

type Payout = {
  id: string;
  date: string;
  gross: number;
  refunds: number;
  processorFee: number; // bKash / card processor fee — NOT a Digibazar fee
  net: number;
  method: string;
  status: PayoutStatus;
};

const payouts: Payout[] = [
  { id: "PO-04231", date: "2026-04-26", gross: 10590, refunds: 290, processorFee: 159, net: 10141, method: "bKash · 01711-234567", status: "scheduled" },
  { id: "PO-04230", date: "2026-04-25", gross: 18420, refunds: 0,   processorFee: 276, net: 18144, method: "bKash · 01711-234567", status: "processing" },
  { id: "PO-04229", date: "2026-04-24", gross: 14370, refunds: 540, processorFee: 215, net: 13615, method: "bKash · 01711-234567", status: "settled" },
  { id: "PO-04228", date: "2026-04-23", gross: 22910, refunds: 290, processorFee: 343, net: 22277, method: "bKash · 01711-234567", status: "settled" },
  { id: "PO-04227", date: "2026-04-22", gross: 9120,  refunds: 0,   processorFee: 137, net: 8983,  method: "Bank · DBBL ****4421",  status: "settled" },
  { id: "PO-04226", date: "2026-04-21", gross: 16480, refunds: 200, processorFee: 247, net: 16033, method: "bKash · 01711-234567", status: "settled" },
];

const STATUS: Record<PayoutStatus, { label: string; tint: string; icon: React.ReactNode }> = {
  scheduled:  { label: "Scheduled today", tint: "bg-iris-500/15 text-iris-300",  icon: <Clock size={12} /> },
  processing: { label: "Processing",      tint: "bg-cyan-400/15 text-cyan-300",  icon: <Clock size={12} /> },
  settled:    { label: "Settled",         tint: "bg-success/15 text-success",    icon: <CheckCircle2 size={12} /> },
};

export default function PayoutsPage() {
  const lifetimeNet = payouts.reduce((s, p) => s + p.net, 0);
  const pendingNet = payouts
    .filter((p) => p.status !== "settled")
    .reduce((s, p) => s + p.net, 0);

  return (
    <>
      <div className="flex flex-wrap items-end justify-between gap-3">
        <div>
          <Badge variant="brand">
            <Wallet size={11} /> Payouts
          </Badge>
          <h1 className="mt-2 font-display text-2xl font-bold md:text-3xl">
            Earnings &amp; payouts
          </h1>
          <p className="mt-1 text-[14px] text-fg-muted">
            Daily auto-payouts to bKash, Nagad, Rocket or your bank.
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline" size="md">
            <Download size={14} /> Export CSV
          </Button>
          <ButtonLink href="/dashboard/settings" size="md">
            <ArrowDownToLine size={14} /> Payout settings
          </ButtonLink>
        </div>
      </div>

      {/* KPIs */}
      <div className="mt-6 grid gap-3 md:grid-cols-4">
        <Kpi
          label="Available balance"
          value={formatBDT(pendingNet)}
          hint="Auto-transfers tonight at 11:59 PM"
          accent="from-iris-500/30 to-iris-700/10"
        />
        <Kpi
          label="Lifetime payouts"
          value={formatBDT(lifetimeNet)}
          hint="Across all platforms"
          accent="from-cyan-500/30 to-iris-700/10"
        />
        <Kpi
          label="Platform fee"
          value="৳0"
          hint="Onboarding plan · 0%"
          accent="from-emerald-500/30 to-iris-700/10"
        />
        <Kpi
          label="Avg. processor fee"
          value="1.5%"
          hint="bKash / card · charged by processor"
          accent="from-amber-400/30 to-iris-700/10"
        />
      </div>

      {/* Notice */}
      <div className="mt-6 surface-card flex items-start gap-3 p-4">
        <div className="grid h-9 w-9 shrink-0 place-items-center rounded-lg bg-iris-500/15 text-iris-300">
          <TrendingUp size={16} />
        </div>
        <div className="text-[13px] text-fg-muted">
          <div className="font-semibold text-fg">
            You&apos;re on the Onboarding plan — 0% Digibazar platform fees.
          </div>
          <p className="mt-0.5">
            Standard processor fees from bKash, Nagad, Rocket and card networks
            are still deducted (these are charged by the processors, not by
            us). They&apos;re itemised on every payout below.
          </p>
        </div>
      </div>

      {/* Table */}
      <div className="mt-6 surface-card overflow-hidden">
        <div className="flex items-center justify-between border-b border-white/5 p-4 md:p-5">
          <h2 className="font-display text-lg font-bold">Payout history</h2>
          <span className="text-[12px] text-fg-subtle">Last 7 payouts</span>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full min-w-[760px] text-left text-[13px]">
            <thead className="text-[11px] uppercase tracking-wider text-fg-subtle">
              <tr className="border-b border-white/5">
                <th className="px-5 py-3">Payout</th>
                <th className="px-5 py-3">Date</th>
                <th className="px-5 py-3 text-right">Gross</th>
                <th className="px-5 py-3 text-right">Refunds</th>
                <th className="px-5 py-3 text-right">Processor fee</th>
                <th className="px-5 py-3 text-right">Net</th>
                <th className="px-5 py-3">Method</th>
                <th className="px-5 py-3">Status</th>
              </tr>
            </thead>
            <tbody>
              {payouts.map((p) => {
                const s = STATUS[p.status];
                return (
                  <tr key={p.id} className="border-b border-white/[0.03] last:border-0 hover:bg-white/[0.02]">
                    <td className="px-5 py-3 font-mono text-fg">{p.id}</td>
                    <td className="px-5 py-3 text-fg-muted">{p.date}</td>
                    <td className="px-5 py-3 text-right">{formatBDT(p.gross)}</td>
                    <td className="px-5 py-3 text-right text-fg-subtle">- {formatBDT(p.refunds)}</td>
                    <td className="px-5 py-3 text-right text-fg-subtle">- {formatBDT(p.processorFee)}</td>
                    <td className="px-5 py-3 text-right font-semibold">{formatBDT(p.net)}</td>
                    <td className="px-5 py-3 text-fg-muted">{p.method}</td>
                    <td className="px-5 py-3">
                      <span className={`inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-[11px] font-medium ${s.tint}`}>
                        {s.icon} {s.label}
                      </span>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </>
  );
}

function Kpi({ label, value, hint, accent }: { label: string; value: string; hint: string; accent: string }) {
  return (
    <div className={`surface-card relative overflow-hidden p-4`}>
      <div className={`absolute -right-10 -top-10 h-32 w-32 rounded-full bg-gradient-to-br ${accent} opacity-50 blur-2xl`} />
      <div className="relative">
        <div className="text-[11px] font-semibold uppercase tracking-wider text-fg-subtle">{label}</div>
        <div className="mt-1 font-display text-2xl font-extrabold">{value}</div>
        <div className="mt-1 text-[11.5px] text-fg-subtle">{hint}</div>
      </div>
    </div>
  );
}
