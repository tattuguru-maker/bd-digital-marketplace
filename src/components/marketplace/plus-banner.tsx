import Link from "next/link";
import { CheckCircle2, Sparkles } from "lucide-react";

export function PlusBanner() {
  return (
    <div className="glass-card relative overflow-hidden p-6 md:p-8">
      <div className="absolute inset-0 bg-gradient-to-r from-iris-700/40 via-iris-500/20 to-cyan-500/30" />
      <div className="absolute inset-0 bg-[radial-gradient(60%_80%_at_85%_-10%,rgba(255,255,255,0.22),transparent_55%)]" />
      <div className="absolute -right-10 top-1/2 hidden h-64 w-64 -translate-y-1/2 rounded-full bg-iris-500/30 blur-3xl md:block" />

      <div className="relative grid gap-6 md:grid-cols-12 md:items-center">
        <div className="md:col-span-7">
          <div className="inline-flex items-center gap-1.5 rounded-full border border-white/15 bg-white/10 px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.2em] text-white">
            <Sparkles size={12} className="text-gold-300" />
            Digibazar Plus
          </div>
          <h2 className="mt-3 font-display text-2xl font-extrabold leading-tight text-white md:text-3xl">
            Get extra discounts with{" "}
            <span className="gradient-text">Digibazar Plus</span>
          </h2>
          <p className="mt-2 max-w-md text-sm text-white/80">
            Save up to 10% extra on subscriptions, gift cards, and game top-ups.
            Priority delivery and dedicated support — for one low monthly fee.
          </p>

          <div className="mt-5 flex flex-wrap gap-3">
            <Link
              href="/sell"
              className="brand-gradient brand-glow inline-flex h-11 items-center rounded-lg border border-white/15 px-5 text-sm font-semibold text-white transition hover:brightness-110"
            >
              Join Plus
            </Link>
            <Link
              href="/how-it-works"
              className="glass-pill inline-flex h-11 items-center rounded-lg px-5 text-sm font-medium text-white/90 transition hover:bg-white/15"
            >
              Learn more
            </Link>
          </div>
        </div>

        <div className="md:col-span-5">
          <ul className="grid gap-2.5">
            {[
              "Up to 10% off on subscriptions, gift cards & top-ups",
              "Early access to flash sales and exclusive bundles",
              "Priority delivery — orders fast-tracked under 2 minutes",
              "Dedicated 24/7 BD support in Bangla & English",
            ].map((perk) => (
              <li
                key={perk}
                className="glass-pill flex items-center gap-2.5 rounded-xl px-3.5 py-2.5 text-[13px] text-white/90"
              >
                <CheckCircle2 size={15} className="shrink-0 text-emerald-300" />
                {perk}
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
}
