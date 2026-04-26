import { Search } from "lucide-react";
import { Breadcrumb } from "@/app/browse/page";
import { ProductCard } from "@/components/marketplace/product-card";
import { FiltersSidebar } from "@/components/marketplace/filters-sidebar";
import { products } from "@/lib/data";

export const metadata = { title: "Search · Digibazar" };

export default async function SearchPage({
  searchParams,
}: {
  searchParams: Promise<{ q?: string }>;
}) {
  const { q } = await searchParams;
  const term = (q ?? "").trim().toLowerCase();
  const matches = term
    ? products.filter((p) =>
        [p.name, p.platform ?? "", p.category, ...p.tags].some((s) =>
          s.toLowerCase().includes(term)
        )
      )
    : products;

  return (
    <div className="container-page py-8">
      <Breadcrumb items={[{ label: "Home", href: "/" }, { label: "Search" }]} />

      <div className="mt-4">
        <form action="/search" className="relative max-w-2xl">
          <input
            name="q"
            defaultValue={term}
            placeholder="Search Netflix, Free Fire, Steam keys..."
            className="h-12 w-full rounded-full border border-white/10 bg-white/[0.04] pl-11 pr-4 text-[15px] placeholder:text-fg-subtle focus:border-iris-400/50 focus:bg-white/[0.06] focus:outline-none"
          />
          <Search size={16} className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-fg-subtle" />
        </form>
        <h1 className="mt-4 font-display text-2xl font-bold md:text-3xl">
          {term ? <>Results for <span className="gradient-text">&ldquo;{term}&rdquo;</span></> : "All products"}
        </h1>
        <p className="mt-1 text-sm text-fg-muted">{matches.length} products found</p>
      </div>

      <div className="mt-6 flex gap-6">
        <FiltersSidebar />
        <div className="min-w-0 flex-1">
          {matches.length === 0 ? (
            <div className="surface-card flex flex-col items-center gap-2 p-12 text-center">
              <div className="text-3xl">🔎</div>
              <h2 className="font-display text-lg font-bold">No matches</h2>
              <p className="max-w-sm text-sm text-fg-muted">
                Try a different keyword, or browse our categories.
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-2 gap-3 md:grid-cols-3 xl:grid-cols-4">
              {matches.map((p) => (
                <ProductCard key={p.id} product={p} />
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
