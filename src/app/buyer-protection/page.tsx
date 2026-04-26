import { ShieldCheck, CheckCircle2 } from "lucide-react";
import { Badge } from "@/components/ui/badge";

export const metadata = { title: "Buyer protection · Digibazar" };

export default function BuyerProtectionPage() {
  return (
    <div className="container-page py-12">
      <div className="text-center">
        <Badge variant="success"><ShieldCheck size={11} /> 100% Buyer protected</Badge>
        <h1 className="mt-3 font-display text-4xl font-extrabold md:text-5xl">
          You shop. <span className="gradient-text">We protect.</span>
        </h1>
        <p className="mx-auto mt-3 max-w-xl text-fg-muted">
          Every order on Digibazar is covered by buyer protection — automatically, for free.
        </p>
      </div>

      <div className="mt-12 grid gap-3 md:grid-cols-2 lg:grid-cols-3">
        {pillars.map((p) => (
          <div key={p.t} className="surface-card p-6">
            <div className="grid h-10 w-10 place-items-center rounded-lg bg-success/15 text-success">
              <ShieldCheck size={18} />
            </div>
            <h3 className="mt-3 font-display text-lg font-bold">{p.t}</h3>
            <p className="mt-1.5 text-[13.5px] text-fg-muted">{p.d}</p>
          </div>
        ))}
      </div>

      <div className="mt-12 surface-card p-6">
        <h2 className="font-display text-2xl font-bold">What&apos;s covered</h2>
        <ul className="mt-4 grid gap-2.5 md:grid-cols-2">
          {covered.map((c) => (
            <li key={c} className="flex items-start gap-2 text-[13.5px] text-fg-muted">
              <CheckCircle2 size={15} className="mt-0.5 text-success" />
              {c}
            </li>
          ))}
        </ul>
      </div>

      <div className="mt-8 surface-card p-6">
        <h2 className="font-display text-2xl font-bold">How to open a dispute</h2>
        <ol className="mt-3 space-y-2 text-sm text-fg-muted">
          <li><strong className="text-fg">1.</strong> Open your order in <em>My Orders</em>.</li>
          <li><strong className="text-fg">2.</strong> Click &ldquo;Report a problem&rdquo;. Choose your reason and add a screenshot.</li>
          <li><strong className="text-fg">3.</strong> Seller has 12 hours to reply. If unresolved, our team steps in within 24 hours.</li>
          <li><strong className="text-fg">4.</strong> Outcome: free replacement or full refund. Your funds remain in escrow.</li>
        </ol>
      </div>
    </div>
  );
}

const pillars = [
  { t: "Money in escrow", d: "Your payment stays with Digibazar until your product is delivered and confirmed working." },
  { t: "Free replacements", d: "If your account, key or top-up fails within the warranty period, we replace it for free." },
  { t: "Full refunds", d: "If a replacement isn't possible, we issue a 100% refund to your original payment method." },
  { t: "BD-based mediation", d: "Bangladeshi support team. Bangla & English. Disputes resolved within 24 hours." },
  { t: "Verified sellers only", d: "Every seller is KYC-verified. Bad actors are removed quickly and permanently." },
  { t: "Secure checkout", d: "256-bit SSL, PCI-compliant payment routing, no card details stored on our servers." },
];

const covered = [
  "Streaming accounts that don't log in or stop working within warranty",
  "Game top-ups that fail to land on the player ID",
  "CD keys that don't activate or are region-locked when not advertised",
  "Gift cards that are already used / invalid on arrival",
  "Software licenses that fail genuine validation",
  "Subscriptions cancelled by the seller before warranty expires",
  "Items received but materially different from listing description",
  "Items not delivered within the seller's stated delivery window",
];
