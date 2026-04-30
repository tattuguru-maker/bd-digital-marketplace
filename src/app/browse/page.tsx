import { ProductGrid } from "@/components/marketplace/product-grid";
import { Breadcrumb } from "@/components/marketplace/breadcrumb";
import { LiveListingsRail } from "@/components/marketplace/live-listings-rail";
import { products } from "@/lib/data";

export const metadata = {
  title: "Browse digital products · Digibazar",
};

export default function BrowsePage() {
  const sellerCount = new Set(products.map((p) => p.sellerId)).size;

  return (
    <div className="container-page py-10 md:py-12">
      <Breadcrumb items={[{ label: "Home", href: "/" }, { label: "Browse" }]} />

      <div className="mt-5 flex flex-wrap items-end justify-between gap-3">
        <div>
          <h1 className="font-display text-3xl font-bold md:text-[40px] md:leading-tight">
            All digital products
          </h1>
          <p className="mt-2 text-[14px] text-fg-muted md:text-[15px]">
            {products.length} products from {sellerCount} verified Bangladeshi sellers
          </p>
        </div>
      </div>

      <LiveListingsRail title="Live from Digibazar sellers" />

      <div className="mt-7">
        <ProductGrid initialProducts={products} />
      </div>
    </div>
  );
}
