import { notFound } from "next/navigation";
import { ProductGrid } from "@/components/marketplace/product-grid";
import { Breadcrumb } from "@/components/marketplace/breadcrumb";
import { LiveListingsRail } from "@/components/marketplace/live-listings-rail";
import { Badge } from "@/components/ui/badge";
import { categories, productsByCategory, type CategorySlug } from "@/lib/data";

export default async function CategoryPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const category = categories.find((c) => c.slug === slug);
  if (!category) return notFound();

  const items = productsByCategory(slug as CategorySlug);
  const sellerCount = new Set(items.map((p) => p.sellerId)).size;

  return (
    <div className="container-page py-10 md:py-12">
      <Breadcrumb
        items={[
          { label: "Home", href: "/" },
          { label: "Browse", href: "/browse" },
          { label: category.name },
        ]}
      />

      <div className={`mt-5 relative overflow-hidden rounded-2xl border border-white/10 bg-gradient-to-br ${category.accent} p-7 md:p-10`}>
        <div className="absolute inset-0 bg-bg-elev/55 backdrop-blur-[2px]" />
        <div className="relative flex flex-wrap items-center gap-6">
          <div className="text-6xl">{category.emoji}</div>
          <div>
            <Badge variant="brand">Category · {category.bn}</Badge>
            <h1 className="mt-2 font-display text-3xl font-bold md:text-[40px] md:leading-tight">
              {category.name}
            </h1>
            <p className="mt-1 text-[14px] text-fg-muted md:text-[15px]">{category.tagline}</p>
            <div className="mt-2 text-[12.5px] text-fg-subtle">
              {items.length} listings · from {sellerCount} verified sellers
            </div>
          </div>
        </div>
      </div>

      <LiveListingsRail
        category={slug as CategorySlug}
        title={`Live ${category.name.toLowerCase()} from sellers`}
      />

      <div className="mt-7">
        <ProductGrid
          initialProducts={items}
          emptyState={
            <>
              <div className="text-3xl">{category.emoji}</div>
              <h3 className="font-display text-lg font-bold">No products yet</h3>
              <p className="max-w-sm text-sm text-fg-muted">
                We&apos;re onboarding sellers in this category. Check back soon — or
                apply to sell here.
              </p>
            </>
          }
        />
      </div>
    </div>
  );
}

export function generateStaticParams() {
  return categories.map((c) => ({ slug: c.slug }));
}
