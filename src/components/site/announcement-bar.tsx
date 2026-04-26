import { Megaphone, Sparkles } from "lucide-react";

export function AnnouncementBar() {
  const items = [
    { icon: Sparkles, text: "Onboarding offer: 0% transaction fees for sellers — limited time" },
    { icon: Megaphone, text: "৳200 cashback on first order via bKash · code WELCOME200" },
    { icon: Sparkles, text: "Verified sellers · Instant delivery · Buyer protection on every order" },
    { icon: Megaphone, text: "Bring your Facebook page customers — keep your reputation, grow your sales" },
  ];
  const loop = [...items, ...items];
  return (
    <div className="relative overflow-hidden border-b border-white/5 bg-iris-700/40">
      <div className="absolute inset-0 bg-[linear-gradient(90deg,transparent,rgba(91,61,255,0.45),transparent)]" />
      <div className="relative">
        <div className="flex w-max animate-marquee gap-10 px-6 py-2 text-[12px] text-iris-100/90 whitespace-nowrap">
          {loop.map((item, i) => {
            const Icon = item.icon;
            return (
              <span key={i} className="inline-flex items-center gap-2">
                <Icon size={13} className="text-gold-300" />
                <span>{item.text}</span>
              </span>
            );
          })}
        </div>
      </div>
    </div>
  );
}
