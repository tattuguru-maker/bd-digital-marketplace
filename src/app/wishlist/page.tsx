import Link from "next/link";
import { Heart, Sparkles, Trash2, ShoppingCart } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { ButtonLink } from "@/components/ui/button";
import { Breadcrumb } from "@/components/marketplace/breadcrumb";
import { ProductArt } from "@/components/marketplace/product-art";
import { RatingStars } from "@/components/marketplace/rating-stars";
import { products, getOffersForProduct } from "@/lib/data";
import { discountPercent, formatBDT, formatNumber } from "@/lib/utils";

export const metadata = { title: "Wishlist · Digibazar" };

// Pretend the user has saved every 3rd product.
const SAVED_INDICES = [0, 3, 6, 9, 12, 15];

export default function WishlistPage() {
  const saved = SAVED_INDICES.map((i) => products[i]).filter(Boolean);

  return (
    <div className="container-page py-8 md:py-10">
      <Breadcrumb items={[{ label: "Home", href: "/" }, { label: "Wishlist" }]} />

      <div className="mt-5 flex flex-wrap items-end justify-between gap-3">
        <div>
          <Badge variant="brand">
            <Heart size={11} /> Saved for later
          </Badge>
          <h1 className="mt-2 font-display text-3xl font-extrabold md:text-[40px] md:leading-tight">
            Your wishlist
          </h1>
          <p className="mt-1 text-[14px] text-fg-muted md:text-[15px]">
            {saved.length} product{saved.length === 1 ? "" : "s"} saved · prices update in real time
          </p>
        </div>
        <ButtonLink href="/browse" variant="secondary" size="md">
          <Sparkles size={15} /> Discover more
        </ButtonLink>
      </div>

      {saved.length === 0 ? (
        <EmptyState />
      ) : (
        <div className="mt-8 grid gap-3">
          {saved.map((p) => {
            const offers = getOffersForProduct(p.id);
            const fromPrice = offers[0]?.price ?? p.price;
            const fromOriginal = offers[0]?.originalPrice ?? p.originalPrice;
            const off = fromOriginal ? discountPercent(fromOriginal, fromPrice) : 0;
            return (
              <article
                key={p.id}
                className="surface-card flex flex-col gap-4 p-4 transition hover:border-iris-400/40 md:flex-row md:items-center"
              >
                <Link
                  href={`/product/${p.slug}`}
                  className="block w-full shrink-0 md:w-[160px]"
                >
                  <ProductArt
                    brandColor={p.brandColor}
                    brandLabel={p.brandLabel}
                    className="aspect-[4/3] w-full md:aspect-square"
                    rounded="rounded-lg"
                  />
                </Link>

                <div className="min-w-0 flex-1">
                  <div className="flex flex-wrap items-center gap-1.5 text-[11px]">
                    <Badge variant="brand">{p.platform}</Badge>
                    {p.badges.includes("Best Seller") && (
                      <Badge variant="gold">★ Best Seller</Badge>
                    )}
                    {off > 0 && <Badge variant="danger">-{off}%</Badge>}
                  </div>
                  <Link
                    href={`/product/${p.slug}`}
                    className="mt-1.5 block font-display text-[18px] font-semibold leading-snug hover:text-white md:text-[19px]"
                  >
                    {p.name}
                  </Link>
                  <div className="mt-1.5 flex items-center gap-2 text-[12.5px] text-fg-subtle">
                    <RatingStars rating={p.rating} size={12} />
                    <span>
                      {p.rating.toFixed(2)} · {formatNumber(p.sold)} sold ·{" "}
                      {offers.length} sellers
                    </span>
                  </div>
                </div>

                <div className="flex flex-wrap items-center justify-between gap-3 md:flex-col md:items-end md:justify-center md:gap-2">
                  <div className="text-right">
                    <div className="text-[11px] uppercase tracking-wider text-fg-subtle">
                      from
                    </div>
                    <div className="font-display text-2xl font-extrabold gradient-text">
                      {formatBDT(fromPrice)}
                    </div>
                    {fromOriginal && fromOriginal > fromPrice && (
                      <div className="text-[12px] text-fg-subtle line-through">
                        {formatBDT(fromOriginal)}
                      </div>
                    )}
                  </div>
                  <div className="flex items-center gap-1.5">
                    <ButtonLink href={`/product/${p.slug}`} size="sm">
                      <ShoppingCart size={13} /> View offers
                    </ButtonLink>
                    <button
                      type="button"
                      aria-label={`Remove ${p.name} from wishlist`}
                      className="grid h-9 w-9 place-items-center rounded-full text-fg-muted transition hover:bg-white/5 hover:text-danger"
                    >
                      <Trash2 size={15} />
                    </button>
                  </div>
                </div>
              </article>
            );
          })}
        </div>
      )}
    </div>
  );
}

function EmptyState() {
  return (
    <div className="surface-card mt-8 flex flex-col items-center gap-3 p-12 text-center">
      <div className="grid h-14 w-14 place-items-center rounded-2xl bg-iris-500/15 text-iris-300">
        <Heart size={26} />
      </div>
      <h2 className="font-display text-xl font-bold">Nothing saved yet</h2>
      <p className="max-w-md text-[14px] text-fg-muted">
        Tap the heart on any product to save it for later. Wishlist syncs across
        your devices.
      </p>
      <ButtonLink href="/browse" size="md" className="mt-2">
        Browse the marketplace
      </ButtonLink>
    </div>
  );
}
