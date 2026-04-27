import { Zap, ShieldCheck, Wallet, Headphones } from "lucide-react";

const items = [
  { icon: Zap,         title: "Instant delivery", sub: "Most orders under 5 minutes" },
  { icon: ShieldCheck, title: "Buyer protection", sub: "Refund or replace if it fails" },
  { icon: Wallet,      title: "bKash · Nagad · Rocket", sub: "Pay with what you have" },
  { icon: Headphones,  title: "24/7 BD support",  sub: "Bangla & English, real humans" },
];

export function TrustStrip() {
  return (
    <div className="glass-card grid grid-cols-2 gap-5 p-6 md:grid-cols-4 md:p-7">
      {items.map(({ icon: Icon, title, sub }) => (
        <div key={title} className="flex items-center gap-3.5">
          <div className="grid h-12 w-12 shrink-0 place-items-center rounded-xl bg-iris-500/15 text-iris-300">
            <Icon size={22} />
          </div>
          <div>
            <div className="text-[15px] font-semibold text-fg">{title}</div>
            <div className="text-[12.5px] text-fg-subtle">{sub}</div>
          </div>
        </div>
      ))}
    </div>
  );
}
