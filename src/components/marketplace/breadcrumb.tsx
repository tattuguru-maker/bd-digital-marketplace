import Link from "next/link";
import { ChevronRight } from "lucide-react";

export function Breadcrumb({
  items,
  className,
}: {
  items: { label: string; href?: string }[];
  className?: string;
}) {
  return (
    <nav
      aria-label="Breadcrumb"
      className={`flex items-center gap-1 text-[12px] text-fg-subtle ${className ?? ""}`}
    >
      {items.map((it, i) => (
        <span key={i} className="inline-flex items-center gap-1">
          {it.href ? (
            <Link href={it.href} className="hover:text-fg">
              {it.label}
            </Link>
          ) : (
            <span className="text-fg-muted">{it.label}</span>
          )}
          {i < items.length - 1 && (
            <ChevronRight size={12} className="text-fg-subtle" />
          )}
        </span>
      ))}
    </nav>
  );
}
