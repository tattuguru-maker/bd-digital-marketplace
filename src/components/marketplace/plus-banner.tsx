import Link from "next/link";
import { CheckCircle2, Sparkles } from "lucide-react";

export function PlusBanner() {
  return (
    <div className="glass-card relative overflow-hidden p-7 md:p-10">
      <div className="absolute inset-0 bg-gradient-to-r from-iris-700/40 via-iris-500/20 to-cyan-500/30" />
      <div className="absolute inset-0 bg-[radial-gradient(60%_80%_at_85%_-10%,rgba(255,255,255,0.22),transparent_55%)]" />
      <div className="absolute -right-10 top-1/2 hidden h-64 w-64 -translate-y-1/2 rounded-full bg-iris-500/30 blur-3xl md:block" />

      <div className="relative grid gap-6 md:grid-cols-12 md:items-center">
        <div className="md:col-span-7">
          <div className="inline-flex items-center gap-1.5 rounded-full border border-white/15 bg-white/10 px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.2em] text-white">
            <Sparkles size={12} className="text-gold-300" />
            Digibazar Plus
          </div>
          <h2 className="mt-3.5 font-display text-3xl font-extrabold leading-tight text-white md:text-[34px]">
            Get extra discounts with{" "}
            <span className="gradient-text">Digibazar Plus</span>
          </h2>
          <p className="mt-3 max-w-md text-[15px] text-white/80">
            Save up to 10% extra on subscriptions, gift cards, and game top-ups.
            Priority delivery and dedicated support — for one low monthly fee.
          </p>

          <div className="mt-6 flex flex-wrap gap-3">
            <Link
              href="/sell"
              className="brand-gradient brand-glow inline-flex h-12 items-center rounded-lg border border-white/15 px-6 text-[15px] font-semibold text-white transition hover:brightness-110"
            >
              Join Plus
            </Link>
            <Link
              href="/how-it-works"
              className="glass-pill inline-flex h-12 items-center rounded-lg px-6 text-[15px] font-medium text-white/90 transition hover:bg-white/15"
            >
              Learn more
            </Link>
          </div>
        </div>

        <div className="md:col-span-5">
          <ul className="grid gap-3">
            {[
              "Up to 10% off on subscriptions, gift cards & top-ups",
              "Early access to flash sales and exclusive bundles",
              "Priority delivery — orders fast-tracked under 2 minutes",
              "Dedicated 24/7 BD support in Bangla & English",
            ].map((perk) => (
              <li
                key={perk}
                className="glass-pill flex items-center gap-3 rounded-xl px-4 py-3 text-[14px] text-white/90"
              >
                <CheckCircle2 size={17} className="shrink-0 text-emerald-300" />
                {perk}
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
}
