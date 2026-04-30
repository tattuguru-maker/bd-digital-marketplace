"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import { notFound } from "next/navigation";
import { useQuery } from "convex/react";
import {
  Award,
  ChevronDown,
  CheckCircle2,
  Clock,
  Crown,
  Globe,
  Heart,
  Loader2,
  RefreshCw,
  Share2,
  Shield,
  ShieldCheck,
  ShoppingCart,
  Users,
  Zap,
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button, ButtonLink } from "@/components/ui/button";
import { Breadcrumb } from "@/components/marketplace/breadcrumb";
import { PaymentMethods } from "@/components/marketplace/payment-methods";
import { ProductCard } from "@/components/marketplace/product-card";
import { RatingStars } from "@/components/marketplace/rating-stars";
import { api } from "@/lib/convex/api";
import { CATEGORY_OPTIONS } from "@/components/dashboard/listing-form";
import { products as mockProducts } from "@/lib/data";
import { cn, discountPercent, formatBDT, formatNumber } from "@/lib/utils";

type Listing = {
  id: string;
  title: string;
  slug: string;
  category: string;
  shortDesc: string;
  longDesc: string;
  priceTaka: number;
  originalPriceTaka: number | null;
  stock: number;
  delivery: string;
  region: string;
  platform: string | null;
  warranty: string | null;
  status: "draft" | "active" | "archived";
  sold: number;
  views: number;
  createdAt: number;
  images: string[];
  imageIds: string[];
  seller: {
    id: string;
    handle: string;
    displayName: string;
    location: string | null;
    status: string;
  } | null;
};

const CATEGORY_LABEL: Record<string, string> = Object.fromEntries(
  CATEGORY_OPTIONS.map((c) => [c.value, c.label]),
);

const REGION_LABEL: Record<string, string> = {
  global: "Global",
  bd: "Bangladesh",
  in: "India",
  asia: "Asia / Pacific",
  eu: "Europe",
  us: "United States",
};

function deliveryLabel(d: string) {
  switch (d) {
    case "instant":
      return "Instant (~ 5 min)";
    case "manual-15m":
      return "Manual · 15 min";
    case "manual-1h":
      return "Manual · 1 hour";
    case "manual-24h":
      return "Manual · within 24h";
    default:
      return d;
  }
}

const TABS = [
  "Description",
  "How to use",
  "Warranty & Refunds",
  "Reviews",
  "Q&A",
] as const;

export function RealProductView({ slug }: { slug: string }) {
  const listing = useQuery(api.listings.bySlug, { slug }) as
    | Listing
    | null
    | undefined;
  const [activeImage, setActiveImage] = useState(0);
  const [activeTab, setActiveTab] = useState<(typeof TABS)[number]>("Description");

  const related = useMemo(() => {
    if (!listing) return [];
    return mockProducts
      .filter((p) => p.category === listing.category)
      .slice(0, 4);
  }, [listing]);

  if (listing === undefined) {
    return (
      <div className="container-page py-16">
        <div className="surface-card flex items-center gap-2 p-6 text-sm text-fg-muted">
          <Loader2 size={14} className="animate-spin" /> Loading listing…
        </div>
      </div>
    );
  }

  if (listing === null) return notFound();

  const discount = listing.originalPriceTaka
    ? discountPercent(listing.originalPriceTaka, listing.priceTaka)
    : 0;
  const inStock = listing.stock > 0;
  const categoryLabel = CATEGORY_LABEL[listing.category] ?? listing.category;
  const regionUpper = listing.region.toUpperCase();
  const main = listing.images[activeImage] ?? listing.images[0];

  return (
    <div className="container-page py-8">
      <Breadcrumb
        items={[
          { label: "Home", href: "/" },
          { label: "Browse", href: "/browse" },
          { label: categoryLabel, href: `/category/${listing.category}` },
          { label: listing.title },
        ]}
      />

      <div className="mt-6 grid gap-8 lg:grid-cols-12">
        {/* LEFT — gallery */}
        <div className="lg:col-span-5">
          <div className="surface-card p-3">
            <div className="relative aspect-square overflow-hidden rounded-xl bg-white/5">
              {main ? (
                /* eslint-disable-next-line @next/next/no-img-element */
                <img
                  src={main}
                  alt={listing.title}
                  className="h-full w-full object-cover"
                />
              ) : (
                <div className="grid h-full place-items-center text-fg-subtle">
                  No image
                </div>
              )}
            </div>
          </div>
          {listing.images.length > 1 && (
            <div className="mt-3 grid grid-cols-4 gap-2">
              {listing.images.slice(0, 4).map((url, idx) => (
                <button
                  key={idx}
                  type="button"
                  onClick={() => setActiveImage(idx)}
                  className={cn(
                    "relative aspect-square overflow-hidden rounded-lg border transition",
                    idx === activeImage
                      ? "border-iris-400/70"
                      : "border-white/10 opacity-70 hover:opacity-100",
                  )}
                >
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src={url} alt="" className="h-full w-full object-cover" />
                </button>
              ))}
            </div>
          )}
        </div>

        {/* RIGHT — details */}
        <div className="lg:col-span-7">
          <div className="flex flex-wrap items-center gap-1.5">
            <Badge variant="success">✓ Verified seller</Badge>
            {listing.platform && <Badge variant="brand">{listing.platform}</Badge>}
            <Badge variant="outline">{regionUpper}</Badge>
            {discount > 0 && <Badge variant="danger">-{discount}%</Badge>}
            {!inStock && <Badge variant="danger">Out of stock</Badge>}
          </div>

          <h1 className="mt-3 font-display text-2xl font-bold leading-tight md:text-3xl">
            {listing.title}
          </h1>

          <div className="mt-3 flex flex-wrap items-center gap-3 text-[13px]">
            <span className="text-fg-muted">{listing.shortDesc}</span>
          </div>

          <div className="mt-3 flex flex-wrap items-center gap-3 text-[13px] text-fg-muted">
            <span className="inline-flex items-center gap-1.5">
              <Globe size={13} className="text-cyan-400" /> Region: {regionUpper}
            </span>
            {listing.sold > 0 && (
              <>
                <span className="text-fg-subtle">·</span>
                <span>{formatNumber(listing.sold)} sold</span>
              </>
            )}
          </div>

          <div className="surface-card mt-5 p-6">
            <div className="flex flex-wrap items-baseline gap-2">
              <span className="text-[13px] font-medium text-fg-subtle">From</span>
              <span className="font-display text-3xl font-extrabold gradient-text md:text-4xl">
                {formatBDT(listing.priceTaka)}
              </span>
              {listing.originalPriceTaka && (
                <>
                  <span className="text-fg-subtle line-through">
                    {formatBDT(listing.originalPriceTaka)}
                  </span>
                  <Badge variant="danger">-{discount}%</Badge>
                </>
              )}
            </div>
            <div className="mt-1.5 inline-flex items-center gap-1.5 text-[12.5px] text-fg-subtle">
              <Users size={13} className="text-iris-300" />1 verified seller offers
              this · pricing direct from seller
            </div>

            <div className="mt-5 flex flex-wrap gap-3">
              <ButtonLink
                href="/checkout"
                size="lg"
                className="min-w-[160px] flex-1"
              >
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
            <TrustPill
              icon={<Zap size={14} className="text-iris-300" />}
              label="Delivery"
              sub={deliveryLabel(listing.delivery)}
            />
            <TrustPill
              icon={<ShieldCheck size={14} className="text-success" />}
              label="Buyer protection"
              sub={listing.warranty || "30 days"}
            />
            <TrustPill
              icon={<RefreshCw size={14} className="text-cyan-400" />}
              label="Replacement"
              sub="Free, no questions"
            />
            <TrustPill
              icon={<Award size={14} className="text-gold-400" />}
              label="Stock"
              sub={inStock ? `${listing.stock} available` : "Out of stock"}
            />
          </div>

          <a
            href="#offers"
            className="surface-card mt-4 flex items-center gap-4 p-4 transition hover:border-iris-400/40"
          >
            <div className="grid h-12 w-12 place-items-center rounded-xl bg-iris-500/15 text-iris-300">
              <Users size={20} />
            </div>
            <div className="flex-1 min-w-0">
              <div className="text-[14px] font-semibold">
                Sold directly by {listing.seller?.displayName ?? "verified seller"}
              </div>
              <div className="text-[12px] text-fg-subtle">
                See seller details, payment options and warranty below.
              </div>
            </div>
            <span className="glass-pill inline-flex h-9 items-center rounded-lg px-3 text-[12.5px] font-medium text-fg-muted">
              See offer
            </span>
          </a>
        </div>
      </div>

      {/* SINGLE-SELLER OFFER */}
      <div id="offers" className="mt-12 scroll-mt-24">
        <SingleSellerOfferPanel listing={listing} />
      </div>

      {/* TABS */}
      <div className="mt-12 border-b border-white/5">
        <div className="flex flex-wrap gap-1">
          {TABS.map((t) => (
            <button
              key={t}
              type="button"
              onClick={() => setActiveTab(t)}
              className={cn(
                "relative px-4 py-3 text-[13px] font-medium",
                t === activeTab ? "text-fg" : "text-fg-muted hover:text-fg",
              )}
            >
              {t}
              {t === activeTab && (
                <span className="absolute inset-x-0 -bottom-px h-0.5 brand-gradient" />
              )}
            </button>
          ))}
        </div>
      </div>

      <div className="mt-6 grid gap-10 lg:grid-cols-12">
        <div className="lg:col-span-8">
          {activeTab === "Description" && (
            <>
              <h2 className="font-display text-xl font-bold">
                About this listing
              </h2>
              <p className="mt-3 whitespace-pre-line leading-relaxed text-fg-muted">
                {listing.longDesc}
              </p>
              <h3 className="mt-8 font-display text-lg font-bold">
                What you get
              </h3>
              <ul className="mt-3 space-y-2.5 text-sm text-fg-muted">
                {[
                  `Delivered ${deliveryLabel(listing.delivery).toLowerCase()} after payment`,
                  listing.warranty
                    ? `${listing.warranty} included`
                    : "Replacement covered under buyer protection",
                  `Available for ${REGION_LABEL[listing.region] ?? regionUpper}`,
                  listing.platform
                    ? `Works on ${listing.platform}`
                    : "Activation details delivered with your order",
                  "Pay with bKash, Nagad, Rocket, Upay or card",
                ].map((f) => (
                  <li key={f} className="flex items-start gap-2">
                    <CheckCircle2
                      size={15}
                      className="mt-0.5 shrink-0 text-success"
                    />
                    <span>{f}</span>
                  </li>
                ))}
              </ul>
            </>
          )}

          {activeTab === "How to use" && (
            <>
              <h2 className="font-display text-xl font-bold">How it works</h2>
              <ol className="mt-3 space-y-3 text-sm text-fg-muted">
                <li>1. Click <strong>Buy now</strong> and complete payment.</li>
                <li>
                  2. Your order is delivered to your dashboard and email
                  ({deliveryLabel(listing.delivery).toLowerCase()}).
                </li>
                <li>
                  3. Follow the seller&apos;s included instructions to activate.
                </li>
                <li>
                  4. If anything goes wrong within the warranty window, request
                  a replacement from your order page.
                </li>
              </ol>
            </>
          )}

          {activeTab === "Warranty & Refunds" && (
            <>
              <h2 className="font-display text-xl font-bold">
                Warranty &amp; refunds
              </h2>
              <p className="mt-3 text-sm text-fg-muted">
                Every order on Digibazar is covered by our buyer protection
                policy. {listing.warranty ? (
                  <>
                    This listing includes <strong>{listing.warranty}</strong>{" "}
                    direct from the seller — replacements are free during that
                    window.
                  </>
                ) : (
                  <>
                    Replacements are available for the first 7 days if the
                    product doesn&apos;t work as described.
                  </>
                )}
              </p>
              <p className="mt-3 text-sm text-fg-muted">
                Refunds are issued to the original payment method within 1–3
                business days for bKash / Nagad / Rocket and within 5–7 business
                days for cards.
              </p>
            </>
          )}

          {activeTab === "Reviews" && (
            <>
              <h2 className="font-display text-xl font-bold">Reviews</h2>
              <p className="mt-3 text-sm text-fg-muted">
                No reviews yet — be the first to buy this listing.
              </p>
            </>
          )}

          {activeTab === "Q&A" && (
            <>
              <h2 className="font-display text-xl font-bold">
                Questions &amp; answers
              </h2>
              <p className="mt-3 text-sm text-fg-muted">
                No questions yet. Have one? Open a chat with the seller from the
                offer panel above.
              </p>
            </>
          )}
        </div>

        <aside className="lg:col-span-4">
          <div className="surface-card sticky top-32 p-5">
            <div className="text-[11px] font-semibold uppercase tracking-wider text-fg-subtle">
              Listing highlights
            </div>
            <ul className="mt-3 space-y-3 text-[13px] text-fg-muted">
              <li className="flex items-center gap-2">
                <Clock size={14} className="text-iris-300" /> Delivery:{" "}
                <span className="text-fg">{deliveryLabel(listing.delivery)}</span>
              </li>
              <li className="flex items-center gap-2">
                <Globe size={14} className="text-cyan-400" /> Region:{" "}
                <span className="text-fg">
                  {REGION_LABEL[listing.region] ?? regionUpper}
                </span>
              </li>
              {listing.warranty && (
                <li className="flex items-center gap-2">
                  <ShieldCheck size={14} className="text-success" /> Warranty:{" "}
                  <span className="text-fg">{listing.warranty}</span>
                </li>
              )}
              {listing.platform && (
                <li className="flex items-center gap-2">
                  <Award size={14} className="text-gold-400" /> Platform:{" "}
                  <span className="text-fg">{listing.platform}</span>
                </li>
              )}
              <li className="flex items-center gap-2">
                <Zap size={14} className="text-iris-300" /> Stock:{" "}
                <span className="text-fg">
                  {inStock ? `${listing.stock} available` : "Out of stock"}
                </span>
              </li>
            </ul>

            <div className="mt-5 rounded-lg border border-iris-400/30 bg-iris-500/10 p-3 text-[12px] text-iris-100">
              <div className="font-semibold">Onboarding offer</div>
              <p className="mt-1 text-iris-200/80">
                Sellers pay <strong>0% platform fees</strong> right now — savings
                passed on to you.
              </p>
            </div>
          </div>
        </aside>
      </div>

      {/* Related */}
      {related.length > 0 && (
        <section className="mt-16">
          <h2 className="font-display text-2xl font-bold">
            You might also like
          </h2>
          <div className="mt-4 grid grid-cols-2 gap-3 md:grid-cols-3 lg:grid-cols-4">
            {related.map((p) => (
              <ProductCard key={p.id} product={p} />
            ))}
          </div>
        </section>
      )}
    </div>
  );
}

function TrustPill({
  icon,
  label,
  sub,
}: {
  icon: React.ReactNode;
  label: string;
  sub: string;
}) {
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

function SingleSellerOfferPanel({ listing }: { listing: Listing }) {
  const seller = listing.seller;
  const discount = listing.originalPriceTaka
    ? discountPercent(listing.originalPriceTaka, listing.priceTaka)
    : 0;
  const initial = seller?.displayName[0]?.toUpperCase() ?? "?";

  return (
    <section className="surface-card overflow-hidden">
      <header className="flex flex-wrap items-center justify-between gap-3 border-b border-white/5 px-5 py-4 md:px-7">
        <div>
          <div className="text-[11px] font-semibold uppercase tracking-[0.18em] text-iris-300">
            Seller offer
          </div>
          <h2 className="mt-1 font-display text-xl font-bold md:text-2xl">
            Sold directly by {seller?.displayName ?? "verified seller"}
          </h2>
          <p className="mt-1 text-[13px] text-fg-muted">
            Pricing, warranty and delivery come straight from the seller below.
          </p>
        </div>
      </header>

      {/* Best offer card */}
      <div className="border-b border-white/5 bg-iris-500/[0.04] px-5 py-5 md:px-7">
        <div className="grid items-center gap-5 md:grid-cols-12">
          <div className="md:col-span-5">
            <Link
              href={seller ? `/seller/${seller.handle}` : "#"}
              className="group flex items-center gap-3"
            >
              <div className="grid h-14 w-14 shrink-0 place-items-center rounded-2xl bg-gradient-to-br from-iris-500 to-cyan-400 font-display text-xl font-bold text-white">
                {initial}
              </div>
              <div className="min-w-0 flex-1">
                <div className="flex items-center gap-1.5">
                  <span className="truncate font-semibold group-hover:text-white">
                    {seller?.displayName ?? "Verified seller"}
                  </span>
                  <Award
                    size={14}
                    className="text-iris-300"
                    aria-label="Verified"
                  />
                  <span className="inline-flex items-center gap-1 rounded-md bg-iris-500/15 px-1.5 py-0.5 text-[10px] font-bold uppercase tracking-wider text-iris-200">
                    <Crown size={10} /> Best
                  </span>
                </div>
                {seller && (
                  <div className="text-[12px] text-fg-subtle">
                    @{seller.handle}
                    {seller.location ? ` · ${seller.location.split(",")[0]}` : ""}
                  </div>
                )}
                <div className="mt-1 flex items-center gap-2">
                  <RatingStars rating={5} size={12} />
                  <span className="text-[12px] text-fg-muted">New seller</span>
                </div>
              </div>
            </Link>
          </div>

          <div className="md:col-span-3">
            <div className="text-[11px] font-semibold uppercase tracking-wider text-fg-subtle">
              Price
            </div>
            <div className="mt-1 flex flex-wrap items-baseline gap-2">
              <span className="font-display text-3xl font-extrabold gradient-text">
                {formatBDT(listing.priceTaka)}
              </span>
              {listing.originalPriceTaka && (
                <>
                  <span className="text-[13px] text-fg-subtle line-through">
                    {formatBDT(listing.originalPriceTaka)}
                  </span>
                  <Badge variant="danger">-{discount}%</Badge>
                </>
              )}
            </div>
            <div className="mt-2 flex flex-wrap gap-x-3 gap-y-1 text-[12px] text-fg-muted">
              <span className="inline-flex items-center gap-1">
                <Zap size={12} className="text-iris-300" />
                {deliveryLabel(listing.delivery)}
              </span>
              <span className="inline-flex items-center gap-1">
                <Globe size={12} className="text-cyan-400" />
                {REGION_LABEL[listing.region] ?? listing.region.toUpperCase()}
              </span>
              {listing.warranty && (
                <span className="inline-flex items-center gap-1">
                  <Shield size={12} className="text-success" />
                  {listing.warranty}
                </span>
              )}
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-2 md:col-span-4 md:justify-end">
            <ButtonLink
              href="/checkout"
              size="lg"
              className="min-w-[140px] flex-1 md:flex-none"
            >
              <ShoppingCart size={15} /> Buy now
            </ButtonLink>
            {seller && (
              <Link
                href={`/seller/${seller.handle}`}
                className="glass-pill inline-flex h-12 items-center gap-1.5 rounded-lg px-4 text-[13px] font-medium text-fg-muted transition hover:text-fg"
              >
                Visit storefront
              </Link>
            )}
          </div>
        </div>

        <PaymentMethods compact className="mt-4" />
      </div>

      <details className="group px-5 py-3 text-[13px] text-fg-muted md:px-7">
        <summary className="flex cursor-pointer list-none items-center justify-between font-semibold text-fg">
          More details from this seller
          <ChevronDown
            size={16}
            className="text-fg-subtle transition group-open:rotate-180"
          />
        </summary>
        <p className="mt-2 whitespace-pre-line">
          {listing.longDesc}
        </p>
      </details>
    </section>
  );
}
