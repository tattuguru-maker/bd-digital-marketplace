import Link from "next/link";
import { categories } from "@/lib/data";

export function CategoryPills() {
  return (
    <div className="flex flex-wrap gap-2.5">
      {categories.map((c) => (
        <Link
          key={c.slug}
          href={`/category/${c.slug}`}
          className="glass-pill group inline-flex items-center gap-2.5 rounded-full px-5 py-2.5 text-[14px] font-medium text-fg-muted transition hover:text-fg hover:bg-white/10"
        >
          <span className="text-lg leading-none">{c.emoji}</span>
          <span>{c.name}</span>
          <span className="hidden text-[12px] text-fg-subtle group-hover:text-iris-200 sm:inline">
            {c.count}
          </span>
        </Link>
      ))}
    </div>
  );
}
