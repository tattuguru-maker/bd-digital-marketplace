import Link from "next/link";

const tiers = [
  { label: "Under ৳100",  href: "/browse?max=100" },
  { label: "Under ৳200",  href: "/browse?max=200" },
  { label: "Under ৳500",  href: "/browse?max=500" },
  { label: "Under ৳1,000", href: "/browse?max=1000" },
  { label: "Under ৳2,000", href: "/browse?max=2000" },
  { label: "Under ৳5,000", href: "/browse?max=5000" },
];

export function PricePills() {
  return (
    <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 md:grid-cols-6">
      {tiers.map((t) => (
        <Link
          key={t.label}
          href={t.href}
          className="glass-pill flex items-center justify-center rounded-xl px-5 py-5 text-[15px] font-semibold text-fg transition hover:-translate-y-0.5 hover:bg-white/10"
        >
          {t.label}
        </Link>
      ))}
    </div>
  );
}
