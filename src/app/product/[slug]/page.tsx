import { notFound } from "next/navigation";
import {
  Zap, ShieldCheck, Award, Clock, Globe, RefreshCw,
  Heart, Share2, ChevronDown, CheckCircle2, ThumbsUp, Users,
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button, ButtonLink } from "@/components/ui/button";
import { ProductArt } from "@/components/marketplace/product-art";
import { ProductCard } from "@/components/marketplace/product-card";
import { RatingStars } from "@/components/marketplace/rating-stars";
import { PaymentMethods } from "@/components/marketplace/payment-methods";
import { SellerOffersPanel } from "@/components/marketplace/seller-offers-panel";
import { Breadcrumb } from "@/components/marketplace/breadcrumb";
import {
  getProduct, getSeller, products, reviewsForProduct, productsByCategory,
  getOffersForProduct,
} from "@/lib/data";
import { discountPercent, formatBDT, formatNumber, timeAgo } from "@/lib/utils";

export default async function ProductPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const product = getProduct(slug);
  if (!product) return notFound();
  const seller = getSeller(product.sellerId)!;
  const offers = getOffersForProduct(product.id);
  const bestOffer = offers.slice().sort((a, b) => a.price - b.price)[0];
  const fromPrice = bestOffer?.price ?? product.price;
  const productReviews = reviewsForProduct(product.id);
  const related = productsByCategory(product.category)
    .filter((p) => p.id !== product.id)
    .slice(0, 4);

  const ratingDist = [5, 4, 3, 2, 1].map((stars) => {
    const count = productReviews.filter((r) => Math.round(r.rating) === stars).length;
    const pct = productReviews.length ? (count / productReviews.length) * 100 : 0;
    return { stars, count, pct };
  });

  const discount = product.originalPrice
    ? discountPercent(product.originalPrice, product.price)
    : 0;
  const fromOriginal = bestOffer?.originalPrice;

  return (
    <div className="container-page py-8">
      <Breadcrumb
        items={[
          { label: "Home", href: "/" },
          { label: "Browse", href: "/browse" },
          { label: product.brandLabel, href: `/category/${product.category}` },
          { label: product.name },
        ]}
      />

      <div className="mt-6 grid gap-8 lg:grid-cols-12">
        {/* LEFT — gallery */}
        <div className="lg:col-span-5">
          <div className="surface-card p-3">
            <ProductArt
              brandColor={product.brandColor}
              brandLabel={product.brandLabel}
              className="aspect-square w-full"
              rounded="rounded-xl"
              size="lg"
            />
          </div>
          <div className="mt-3 grid grid-cols-4 gap-2">
            {[0, 1, 2, 3].map((i) => (
              <ProductArt
                key={i}
                brandColor={product.brandColor}
                brandLabel={product.brandLabel}
                className="aspect-square cursor-pointer opacity-70 hover:opacity-100 transition"
                rounded="rounded-lg"
                size="sm"
              />
            ))}
          </div>
        </div>

        {/* RIGHT — details */}
        <div className="lg:col-span-7">
          <div className="flex flex-wrap items-center gap-1.5">
            {product.badges.includes("Best Seller") && <Badge variant="gold">★ Best Seller</Badge>}
            {product.badges.includes("Hot") && <Badge variant="danger">🔥 Hot</Badge>}
            {product.badges.includes("Verified Stock") && <Badge variant="success">✓ Verified Stock</Badge>}
            <Badge variant="brand">{product.platform}</Badge>
            <Badge variant="outline">{product.region.toUpperCase()}</Badge>
          </div>

          <h1 className="mt-3 font-display text-2xl font-bold leading-tight md:text-3xl">{product.name}</h1>

          <div className="mt-3 flex flex-wrap items-center gap-3 text-[13px]">
            <span className="inline-flex items-center gap-1.5">
              <RatingStars rating={product.rating} size={14} />
              <span className="font-semibold">{product.rating.toFixed(2)}</span>
              <span className="text-fg-subtle">({formatNumber(product.reviewCount)} reviews)</span>
            </span>
            <span className="text-fg-subtle">·</span>
            <span className="text-fg-muted">{formatNumber(product.sold)} sold</span>
            <span className="text-fg-subtle">·</span>
            <span className="inline-flex items-center gap-1 text-fg-muted">
              <Globe size={13} className="text-cyan-400" /> Region: {product.region.toUpperCase()}
            </span>
          </div>

          <div className="mt-5 surface-card p-6">
            <div className="flex items-baseline gap-2 flex-wrap">
              <span className="text-[13px] font-medium text-fg-subtle">From</span>
              <span className="font-display text-3xl font-extrabold gradient-text md:text-4xl">
                {formatBDT(fromPrice)}
              </span>
              {fromOriginal && fromOriginal > fromPrice && (
                <>
                  <span className="text-fg-subtle line-through">{formatBDT(fromOriginal)}</span>
                  <Badge variant="danger">-{discountPercent(fromOriginal, fromPrice)}%</Badge>
                </>
              )}
              {!fromOriginal && product.originalPrice && (
                <>
                  <span className="text-fg-subtle line-through">{formatBDT(product.originalPrice)}</span>
                  <Badge variant="danger">-{discount}%</Badge>
                </>
              )}
            </div>
            <div className="mt-1.5 inline-flex items-center gap-1.5 text-[12.5px] text-fg-subtle">
              <Users size={13} className="text-iris-300" />
              {offers.length} sellers offer this · best price shown
            </div>

            {product.variants && (
              <div className="mt-5">
                <div className="mb-2 text-[12px] font-semibold uppercase tracking-wider text-fg-subtle">
                  Choose package
                </div>
                <div className="grid grid-cols-2 gap-2">
                  {product.variants.map((v, i) => {
                    const off = v.originalPrice ? discountPercent(v.originalPrice, v.price) : 0;
                    return (
                      <label
                        key={v.id}
                        className={`relative cursor-pointer rounded-lg border p-3 transition ${
                          i === 1
                            ? "border-iris-400/60 bg-iris-500/10"
                            : "border-white/10 hover:border-iris-400/40 bg-white/2"
                        }`}
                      >
                        <input type="radio" name="variant" defaultChecked={i === 1} className="sr-only" />
                        <div className="flex items-center justify-between">
                          <div>
                            <div className="text-[13px] font-medium">{v.label}</div>
                            <div className="mt-0.5 inline-flex items-baseline gap-1.5">
                              <span className="text-[15px] font-bold">{formatBDT(v.price)}</span>
                              {v.originalPrice && (
                                <span className="text-[11px] text-fg-subtle line-through">{formatBDT(v.originalPrice)}</span>
                              )}
                            </div>
                          </div>
                          {off > 0 && (
                            <span className="rounded-md bg-danger/15 px-1.5 py-0.5 text-[10px] font-bold text-danger">
                              -{off}%
                            </span>
                          )}
                        </div>
                        <div className="mt-1 text-[11px] text-fg-subtle">{v.stock > 99 ? "In stock" : `${v.stock} left`}</div>
                      </label>
                    );
                  })}
                </div>
              </div>
            )}

            <div className="mt-5 flex flex-wrap gap-3">
              <ButtonLink href="/checkout" size="lg" className="flex-1 min-w-[160px]">
                Buy now
              </ButtonLink>
              <ButtonLink href="/cart" variant="secondary" size="lg">
                Add to cart
              </ButtonLink>
              <Button variant="ghost" size="lg" aria-label="Wishlist">
                <Heart size={16} />
              </Button>
              <Button variant="ghost" size="lg" aria-label="Share">
                <Share2 size={16} />
              </Button>
            </div>

            <div className="mt-5 flex items-center gap-2 text-[12px] text-fg-muted">
              <span>We accept</span>
              <PaymentMethods compact />
            </div>
          </div>

          {/* Trust pills */}
          <div className="mt-4 grid grid-cols-2 gap-2 sm:grid-cols-4">
            <TrustPill icon={<Zap size={14} className="text-iris-300" />} label="Instant delivery" sub={deliveryLabel(product.delivery)} />
            <TrustPill icon={<ShieldCheck size={14} className="text-success" />} label="Buyer protection" sub={product.warranty || "30 days"} />
            <TrustPill icon={<RefreshCw size={14} className="text-cyan-400" />} label="Replacement" sub="Free, no questions" />
            <TrustPill icon={<Award size={14} className="text-gold-400" />} label="Verified seller" sub={seller.responseTime} />
          </div>

          {/* All sellers CTA */}
          <a
            href="#offers"
            className="mt-4 surface-card flex items-center gap-4 p-4 transition hover:border-iris-400/40"
          >
            <div className="grid h-12 w-12 place-items-center rounded-xl bg-iris-500/15 text-iris-300">
              <Users size={20} />
            </div>
            <div className="flex-1 min-w-0">
              <div className="text-[14px] font-semibold">
                Available from {offers.length} verified sellers
              </div>
              <div className="text-[12px] text-fg-subtle">
                Compare prices, delivery times and warranties below.
              </div>
            </div>
            <span className="glass-pill inline-flex h-9 items-center rounded-lg px-3 text-[12.5px] font-medium text-fg-muted">
              See offers
            </span>
          </a>
        </div>
      </div>

      {/* MULTI-SELLER OFFERS */}
      <div id="offers" className="mt-12 scroll-mt-24">
        <SellerOffersPanel offers={offers} />
      </div>

      {/* TABS */}
      <div className="mt-12 border-b border-white/5">
        <div className="flex flex-wrap gap-1">
          {["Description", "How to use", "Warranty & Refunds", `Reviews (${product.reviewCount})`, "Q&A"].map((t, i) => (
            <button
              key={t}
              className={`relative px-4 py-3 text-[13px] font-medium ${
                i === 0 ? "text-fg" : "text-fg-muted hover:text-fg"
              }`}
            >
              {t}
              {i === 0 && <span className="absolute inset-x-0 -bottom-px h-0.5 brand-gradient" />}
            </button>
          ))}
        </div>
      </div>

      <div className="mt-6 grid gap-10 lg:grid-cols-12">
        <div className="lg:col-span-8">
          <h2 className="font-display text-xl font-bold">About this product</h2>
          <p className="mt-3 leading-relaxed text-fg-muted">{product.longDesc}</p>

          <h3 className="mt-8 font-display text-lg font-bold">What you get</h3>
          <ul className="mt-3 space-y-2.5 text-sm text-fg-muted">
            {product.features.map((f) => (
              <li key={f} className="flex items-start gap-2">
                <CheckCircle2 size={15} className="mt-0.5 shrink-0 text-success" />
                <span>{f}</span>
              </li>
            ))}
          </ul>

          <h3 className="mt-8 font-display text-lg font-bold">Frequently asked questions</h3>
          <div className="mt-3 space-y-2">
            {product.faqs.map((f, i) => (
              <details key={f.q} open={i === 0} className="surface-card group p-4">
                <summary className="flex cursor-pointer list-none items-center justify-between text-sm font-semibold">
                  {f.q}
                  <ChevronDown size={16} className="transition group-open:rotate-180 text-fg-subtle" />
                </summary>
                <p className="mt-2 text-[13.5px] text-fg-muted">{f.a}</p>
              </details>
            ))}
          </div>

          {/* Reviews */}
          <h3 className="mt-10 font-display text-lg font-bold">Reviews ({product.reviewCount})</h3>
          <div className="mt-3 surface-card grid gap-6 p-5 md:grid-cols-3">
            <div className="md:col-span-1">
              <div className="font-display text-5xl font-extrabold">{product.rating.toFixed(2)}</div>
              <RatingStars rating={product.rating} size={16} />
              <div className="mt-2 text-[12px] text-fg-subtle">
                Based on {formatNumber(product.reviewCount)} verified reviews
              </div>
            </div>
            <div className="md:col-span-2 space-y-2">
              {ratingDist.map((d) => (
                <div key={d.stars} className="flex items-center gap-3 text-[12px] text-fg-muted">
                  <span className="w-8">{d.stars}★</span>
                  <div className="h-1.5 flex-1 overflow-hidden rounded-full bg-white/5">
                    <div className="h-full bg-gold-400" style={{ width: `${d.pct}%` }} />
                  </div>
                  <span className="w-8 text-right">{d.count}</span>
                </div>
              ))}
            </div>
          </div>

          <div className="mt-4 space-y-3">
            {productReviews.map((r) => (
              <div key={r.id} className="surface-card p-4">
                <div className="flex items-start gap-3">
                  <div className="grid h-9 w-9 place-items-center rounded-full bg-gradient-to-br from-iris-500 to-cyan-400 font-display text-sm font-bold text-white">
                    {r.authorInitial}
                  </div>
                  <div className="flex-1">
                    <div className="flex flex-wrap items-center gap-2">
                      <span className="text-sm font-semibold">{r.authorName}</span>
                      {r.verified && <Badge variant="success" className="!text-[10px]">✓ Verified buyer</Badge>}
                      <span className="text-[11px] text-fg-subtle">· {timeAgo(r.createdAt)}</span>
                    </div>
                    <RatingStars rating={r.rating} size={12} className="mt-1" />
                    {r.title && <div className="mt-1 text-[14px] font-semibold">{r.title}</div>}
                    <p className="mt-1 text-[13.5px] text-fg-muted">{r.body}</p>
                    <div className="mt-2 inline-flex items-center gap-1 text-[11px] text-fg-subtle">
                      <ThumbsUp size={11} /> Helpful
                    </div>
                  </div>
                </div>
              </div>
            ))}
            {productReviews.length === 0 && (
              <div className="text-sm text-fg-muted">No reviews yet — be the first.</div>
            )}
          </div>
        </div>

        <aside className="lg:col-span-4">
          <div className="surface-card sticky top-32 p-5">
            <div className="text-[11px] font-semibold uppercase tracking-wider text-fg-subtle">
              Product highlights
            </div>
            <ul className="mt-3 space-y-3 text-[13px] text-fg-muted">
              <li className="flex items-center gap-2"><Clock size={14} className="text-iris-300" /> Delivery: <span className="text-fg">{deliveryLabel(product.delivery)}</span></li>
              <li className="flex items-center gap-2"><Globe size={14} className="text-cyan-400" /> Region: <span className="text-fg">{product.region.toUpperCase()}</span></li>
              <li className="flex items-center gap-2"><ShieldCheck size={14} className="text-success" /> Warranty: <span className="text-fg">{product.warranty}</span></li>
              <li className="flex items-center gap-2"><Award size={14} className="text-gold-400" /> Platform: <span className="text-fg">{product.platform}</span></li>
              <li className="flex items-center gap-2"><Zap size={14} className="text-iris-300" /> Sold: <span className="text-fg">{formatNumber(product.sold)} buyers</span></li>
            </ul>

            <div className="mt-5 rounded-lg border border-iris-400/30 bg-iris-500/10 p-3 text-[12px] text-iris-100">
              <div className="font-semibold">Onboarding offer</div>
              <p className="mt-1 text-iris-200/80">
                Sellers pay <strong>0% transaction fees</strong> right now — savings passed on to you.
              </p>
            </div>

            <div className="mt-5">
              <div className="text-[11px] font-semibold uppercase tracking-wider text-fg-subtle">
                Tags
              </div>
              <div className="mt-2 flex flex-wrap gap-1.5">
                {product.tags.map((t) => (
                  <Badge key={t} variant="outline">#{t}</Badge>
                ))}
              </div>
            </div>
          </div>
        </aside>
      </div>

      {/* Related */}
      <section className="mt-16">
        <h2 className="font-display text-2xl font-bold">You might also like</h2>
        <div className="mt-4 grid grid-cols-2 gap-3 md:grid-cols-3 lg:grid-cols-4">
          {related.map((p) => (
            <ProductCard key={p.id} product={p} />
          ))}
        </div>
      </section>
    </div>
  );
}

function TrustPill({ icon, label, sub }: { icon: React.ReactNode; label: string; sub: string }) {
  return (
    <div className="surface-card flex items-start gap-2 p-3">
      <div className="mt-0.5">{icon}</div>
      <div>
        <div className="text-[12px] font-semibold">{label}</div>
        <div className="text-[11px] text-fg-subtle">{sub}</div>
      </div>
    </div>
  );
}

function deliveryLabel(d: string) {
  switch (d) {
    case "instant":     return "Instant (~ 5 min)";
    case "manual-15m":  return "Manual (≤ 15 min)";
    case "manual-1h":   return "Manual (≤ 1 hour)";
    case "manual-24h":  return "Manual (≤ 24 hours)";
    default:            return d;
  }
}

export function generateStaticParams() {
  return products.map((p) => ({ slug: p.slug }));
}
