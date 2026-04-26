import Link from "next/link";
import { Zap, Shield, Heart } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { ProductArt } from "@/components/marketplace/product-art";
import { RatingStars } from "@/components/marketplace/rating-stars";
import { cn, discountPercent, formatBDT, formatNumber } from "@/lib/utils";
import type { Product } from "@/lib/data";

export function ProductCard({ product, className }: { product: Product; className?: string }) {
  const discount = product.originalPrice
    ? discountPercent(product.originalPrice, product.price)
    : 0;

  const isInstant = product.delivery === "instant";

  return (
    <article
      className={cn(
        "group relative surface-card overflow-hidden transition-all duration-300",
        "hover:border-iris-400/40 hover:-translate-y-0.5",
        "hover:shadow-[0_18px_50px_-25px_rgba(91,61,255,0.55)]",
        className
      )}
    >
      <Link href={`/product/${product.slug}`} className="block">
        <div className="relative p-3">
          <ProductArt
            brandColor={product.brandColor}
            brandLabel={product.brandLabel}
            className="aspect-[4/3] w-full"
            rounded="rounded-lg"
          />
          {/* Top-left badges */}
          <div className="absolute left-5 top-5 flex flex-col gap-1.5 items-start">
            {discount > 0 && (
              <span className="rounded-md bg-danger px-1.5 py-0.5 text-[11px] font-bold tracking-wide text-white">
                -{discount}%
              </span>
            )}
            {product.badges.includes("Best Seller") && (
              <Badge variant="gold" className="!text-[10px]">★ Best Seller</Badge>
            )}
            {product.badges.includes("New") && (
              <Badge variant="brand" className="!text-[10px]">New</Badge>
            )}
            {product.badges.includes("Hot") && (
              <Badge variant="danger" className="!text-[10px]">🔥 Hot</Badge>
            )}
          </div>
          {/* Wishlist */}
          <span
            aria-label="Add to wishlist"
            className="absolute right-5 top-5 grid h-8 w-8 place-items-center rounded-full bg-black/40 text-white/80 backdrop-blur transition hover:bg-black/60 hover:text-white"
          >
            <Heart size={15} />
          </span>
        </div>

        <div className="px-4 pb-4 pt-1">
          <div className="flex items-center gap-1.5 text-[11px] text-fg-subtle">
            {isInstant ? (
              <span className="inline-flex items-center gap-1 text-iris-200">
                <Zap size={12} className="fill-iris-300 text-iris-300" /> Instant
              </span>
            ) : (
              <span>Manual delivery</span>
            )}
            <span>·</span>
            <span className="truncate">{product.platform}</span>
          </div>

          <h3 className="mt-1.5 line-clamp-2 min-h-[2.6em] text-[14px] font-semibold leading-snug text-fg group-hover:text-white">
            {product.name}
          </h3>

          <div className="mt-2 flex items-center gap-2">
            <RatingStars rating={product.rating} size={12} />
            <span className="text-[11px] text-fg-subtle">
              {product.rating.toFixed(2)} · {formatNumber(product.sold)} sold
            </span>
          </div>

          <div className="mt-3 flex items-end justify-between">
            <div className="flex items-baseline gap-1.5">
              <span className="text-lg font-bold text-fg">{formatBDT(product.price)}</span>
              {product.originalPrice && (
                <span className="text-[12px] text-fg-subtle line-through">
                  {formatBDT(product.originalPrice)}
                </span>
              )}
            </div>
            <span className="inline-flex items-center gap-1 text-[10px] text-fg-subtle">
              <Shield size={11} className="text-success" /> Buyer Protected
            </span>
          </div>
        </div>
      </Link>
    </article>
  );
}
