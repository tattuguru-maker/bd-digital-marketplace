import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import { cn } from "@/lib/utils";
import type { Category } from "@/lib/data";

export function CategoryCard({ category, className }: { category: Category; className?: string }) {
  return (
    <Link
      href={`/category/${category.slug}`}
      className={cn(
        "group relative overflow-hidden rounded-xl border border-white/8 transition-all duration-300",
        "bg-gradient-to-br p-5 hover:border-iris-400/40",
        "hover:-translate-y-0.5",
        category.accent,
        className
      )}
    >
      <div className="absolute inset-0 bg-[radial-gradient(120%_60%_at_20%_-10%,rgba(255,255,255,0.16),transparent_55%)] mix-blend-overlay" />
      <div className="absolute inset-0 bg-bg-elev/55 backdrop-blur-[2px]" />
      <div className="relative flex items-start justify-between">
        <div className="text-3xl">{category.emoji}</div>
        <ArrowUpRight
          size={18}
          className="text-fg-subtle transition group-hover:-translate-y-0.5 group-hover:translate-x-0.5 group-hover:text-fg"
        />
      </div>
      <div className="relative mt-6">
        <div className="text-sm font-semibold text-fg">{category.name}</div>
        <div className="text-[11px] text-fg-subtle">{category.bn}</div>
        <div className="mt-1 line-clamp-1 text-[12px] text-fg-muted">
          {category.tagline}
        </div>
        <div className="mt-3 text-[11px] font-medium text-iris-200">
          {category.count} listings
        </div>
      </div>
    </Link>
  );
}
