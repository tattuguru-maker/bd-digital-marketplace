import { notFound } from "next/navigation";
import { ProductCard } from "@/components/marketplace/product-card";
import { FiltersSidebar } from "@/components/marketplace/filters-sidebar";
import { Breadcrumb } from "@/app/browse/page";
import { Badge } from "@/components/ui/badge";
import { categories, productsByCategory, type CategorySlug } from "@/lib/data";

export default async function CategoryPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const category = categories.find((c) => c.slug === slug);
  if (!category) return notFound();

  const items = productsByCategory(slug as CategorySlug);

  return (
    <div className="container-page py-8">
      <Breadcrumb
        items={[
          { label: "Home", href: "/" },
          { label: "Browse", href: "/browse" },
          { label: category.name },
        ]}
      />

      <div className={`mt-4 relative overflow-hidden rounded-2xl border border-white/10 bg-gradient-to-br ${category.accent} p-6 md:p-8`}>
        <div className="absolute inset-0 bg-bg-elev/55 backdrop-blur-[2px]" />
        <div className="relative flex flex-wrap items-center gap-5">
          <div className="text-5xl">{category.emoji}</div>
          <div>
            <Badge variant="brand">Category · {category.bn}</Badge>
            <h1 className="mt-1 font-display text-3xl font-bold md:text-4xl">{category.name}</h1>
            <p className="mt-1 text-sm text-fg-muted md:text-base">{category.tagline}</p>
            <div className="mt-2 text-[12.5px] text-fg-subtle">
              {items.length} listings · from {new Set(items.map((p) => p.sellerId)).size} verified sellers
            </div>
          </div>
        </div>
      </div>

      <div className="mt-6 flex gap-6">
        <FiltersSidebar activeSlug={category.slug} />

        <div className="min-w-0 flex-1">
          <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
            <div className="text-sm text-fg-muted">{items.length} results</div>
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

          <div className="grid grid-cols-2 gap-3 md:grid-cols-3 xl:grid-cols-4">
            {items.map((p) => (
              <ProductCard key={p.id} product={p} />
            ))}
          </div>

          {items.length === 0 && (
            <div className="surface-card flex flex-col items-center gap-2 p-12 text-center">
              <div className="text-3xl">{category.emoji}</div>
              <h3 className="font-display text-lg font-bold">No products yet</h3>
              <p className="max-w-sm text-sm text-fg-muted">
                We&apos;re onboarding sellers in this category. Check back soon — or apply to sell here.
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export function generateStaticParams() {
  return categories.map((c) => ({ slug: c.slug }));
}
