import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";

export type PromoBanner = {
  title: string;
  subtitle: string;
  href: string;
  art: string; // gradient
  artLabel: string;
  badge?: string;
  badgeVariant?: "brand" | "gold" | "danger" | "success";
};

export function PromoBannerCard({ banner }: { banner: PromoBanner }) {
  return (
    <Link
      href={banner.href}
      className="glass-card group relative block overflow-hidden p-6 transition hover:border-white/20"
    >
      <div className={cn("absolute inset-0 bg-gradient-to-br opacity-90", banner.art)} />
      <div className="absolute inset-0 bg-[radial-gradient(120%_60%_at_85%_-10%,rgba(255,255,255,0.22),transparent_60%)]" />
      <div className="absolute inset-0 bg-[linear-gradient(180deg,transparent_25%,rgba(7,7,11,0.55))]" />
      {/* Big watermark text */}
      <div className="pointer-events-none absolute -right-2 bottom-0 select-none text-right font-display text-[80px] font-black uppercase leading-none tracking-tight text-white/10 md:text-[104px]">
        {banner.artLabel}
      </div>
      <div className="relative flex min-h-[170px] flex-col justify-between gap-3">
        <div className="flex items-start justify-between">
          {banner.badge ? (
            <Badge variant={banner.badgeVariant ?? "gold"}>{banner.badge}</Badge>
          ) : (
            <span />
          )}
          <ArrowUpRight
            size={18}
            className="text-white/70 transition group-hover:-translate-y-0.5 group-hover:translate-x-0.5 group-hover:text-white"
          />
        </div>
        <div>
          <div className="font-display text-xl font-bold leading-tight text-white md:text-2xl">
            {banner.title}
          </div>
          <div className="mt-1.5 text-[14px] text-white/75">{banner.subtitle}</div>
        </div>
      </div>
    </Link>
  );
}
