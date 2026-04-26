import { CheckCircle2, ShoppingCart, Wallet, Zap, ShieldCheck } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { ButtonLink } from "@/components/ui/button";

export const metadata = { title: "How it works · Digibazar" };

export default function HowItWorks() {
  return (
    <div className="container-page py-12">
      <div className="text-center">
        <Badge variant="brand">How Digibazar works</Badge>
        <h1 className="mt-3 font-display text-4xl font-extrabold md:text-5xl">
          Buy digital products <span className="gradient-text">the safe way.</span>
        </h1>
        <p className="mx-auto mt-3 max-w-xl text-fg-muted">
          Built for Bangladesh — pay with bKash, get instant delivery, full buyer protection.
        </p>
      </div>

      <div className="mt-12 grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {steps.map((s, i) => {
          const Icon = s.icon;
          return (
            <div key={s.t} className="surface-card relative p-6">
              <span className="absolute right-5 top-5 font-display text-3xl font-black text-white/5">0{i + 1}</span>
              <div className="grid h-10 w-10 place-items-center rounded-lg bg-iris-500/15 text-iris-300">
                <Icon size={18} />
              </div>
              <h3 className="mt-3 font-display text-lg font-bold">{s.t}</h3>
              <p className="mt-1.5 text-[13.5px] text-fg-muted">{s.d}</p>
            </div>
          );
        })}
      </div>

      <div className="mt-16 grid gap-6 lg:grid-cols-2">
        <div className="surface-card p-6">
          <h3 className="font-display text-xl font-bold">Buyer protection</h3>
          <p className="mt-2 text-sm text-fg-muted">
            Every order is held in escrow until you confirm delivery, or until the protection
            window expires automatically. If anything goes wrong, we replace or refund.
          </p>
          <ul className="mt-4 space-y-2 text-sm text-fg-muted">
            {["Replacement guarantee for streaming accounts (up to 30 days)",
              "Top-up guarantee for in-game currencies (until applied)",
              "Activation guarantee for CD keys (up to 7 days)",
              "Mediated dispute resolution within 24 hours"].map((t) => (
              <li key={t} className="flex items-start gap-2"><CheckCircle2 size={15} className="mt-0.5 text-success" />{t}</li>
            ))}
          </ul>
        </div>
        <div className="surface-card p-6">
          <h3 className="font-display text-xl font-bold">Payment options</h3>
          <p className="mt-2 text-sm text-fg-muted">
            Pay how you want — Digibazar supports every major Bangladeshi payment method.
          </p>
          <ul className="mt-4 space-y-2 text-sm text-fg-muted">
            {["bKash · with 2% extra discount",
              "Nagad · cashback offers",
              "Rocket / DBBL · direct bank flow",
              "Upay · for Upay users",
              "Visa, Mastercard, Amex · 3D Secure",
              "Bank transfer · for orders ≥ ৳5,000"].map((t) => (
              <li key={t} className="flex items-start gap-2"><CheckCircle2 size={15} className="mt-0.5 text-success" />{t}</li>
            ))}
          </ul>
        </div>
      </div>

      <div className="mt-16 text-center">
        <h2 className="font-display text-2xl font-bold md:text-3xl">Ready to shop?</h2>
        <div className="mt-4 flex justify-center gap-3">
          <ButtonLink href="/browse" size="lg">Browse products</ButtonLink>
          <ButtonLink href="/sell" variant="gold" size="lg">Become a seller</ButtonLink>
        </div>
      </div>
    </div>
  );
}

const steps = [
  { icon: ShoppingCart, t: "1. Pick your product",  d: "Browse trusted sellers, compare ratings, find the best deal." },
  { icon: Wallet,       t: "2. Pay safely",         d: "Pay with bKash, Nagad, Rocket, Upay or your card. Funds held in escrow." },
  { icon: Zap,          t: "3. Get it instantly",   d: "Most digital products delivered in under 5 minutes." },
  { icon: ShieldCheck,  t: "4. Stay protected",     d: "Replacement or refund if anything goes wrong, no questions asked." },
];
