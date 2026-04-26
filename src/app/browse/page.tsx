import Link from "next/link";
import { ChevronRight, SlidersHorizontal } from "lucide-react";
import { ProductCard } from "@/components/marketplace/product-card";
import { FiltersSidebar } from "@/components/marketplace/filters-sidebar";
import { Badge } from "@/components/ui/badge";
import { products } from "@/lib/data";

export const metadata = {
  title: "Browse digital products · Digibazar",
};

export default function BrowsePage() {
  return (
    <div className="container-page py-8">
      <Breadcrumb items={[{ label: "Home", href: "/" }, { label: "Browse" }]} />

      <div className="mt-4 flex flex-wrap items-end justify-between gap-3">
        <div>
          <h1 className="font-display text-3xl font-bold md:text-4xl">All digital products</h1>
          <p className="mt-1 text-sm text-fg-muted">
            {products.length} products from {new Set(products.map((p) => p.sellerId)).size} verified sellers
          </p>
        </div>
        <SortBar />
      </div>

      <div className="mt-6 flex gap-6">
        <FiltersSidebar />

        <div className="min-w-0 flex-1">
          <div className="mb-3 flex flex-wrap items-center gap-2">
            {["Streaming", "Game Top-ups", "CD Keys", "Under ৳500", "Instant", "Top rated"].map((c) => (
              <Badge key={c} variant="outline" className="cursor-pointer hover:!border-iris-400/40">
                {c} ✕
              </Badge>
            ))}
          </div>

          <div className="grid grid-cols-2 gap-3 md:grid-cols-3 xl:grid-cols-4">
            {products.map((p) => (
              <ProductCard key={p.id} product={p} />
            ))}
          </div>

          <div className="mt-10 flex justify-center">
            <button className="rounded-full border border-white/10 bg-white/5 px-5 py-2 text-sm text-fg-muted hover:bg-white/10 hover:text-fg">
              Load more
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export function Breadcrumb({ items, className }: { items: { label: string; href?: string }[]; className?: string }) {
  return (
    <nav aria-label="Breadcrumb" className={`flex items-center gap-1 text-[12px] text-fg-subtle ${className ?? ""}`}>
      {items.map((it, i) => (
        <span key={i} className="inline-flex items-center gap-1">
          {it.href ? (
            <Link href={it.href} className="hover:text-fg">{it.label}</Link>
          ) : (
            <span className="text-fg-muted">{it.label}</span>
          )}
          {i < items.length - 1 && <ChevronRight size={12} className="text-fg-subtle" />}
        </span>
      ))}
    </nav>
  );
}

function SortBar() {
  return (
    <div className="flex flex-wrap items-center gap-2">
      <button className="inline-flex items-center gap-1 rounded-full border border-white/10 bg-white/5 px-3 py-1.5 text-[12px] text-fg-muted hover:text-fg lg:hidden">
        <SlidersHorizontal size={13} /> Filters
      </button>
      <select
        defaultValue="featured"
        aria-label="Sort"
        className="h-9 rounded-full border border-white/10 bg-white/5 px-3 text-[12px] text-fg outline-none hover:bg-white/10"
      >
        <option value="featured">Featured</option>
        <option value="popular">Most popular</option>
        <option value="new">Newest</option>
        <option value="low">Price: low to high</option>
        <option value="high">Price: high to low</option>
        <option value="rating">Top rated</option>
      </select>
    </div>
  );
}
