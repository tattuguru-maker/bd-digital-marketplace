"use client";

import Link from "next/link";
import { notFound } from "next/navigation";
import { use, useState } from "react";
import { useQuery } from "convex/react";
import {
  Zap,
  ShieldCheck,
  Globe,
  RefreshCw,
  Clock,
  Loader2,
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button, ButtonLink } from "@/components/ui/button";
import { Breadcrumb } from "@/components/marketplace/breadcrumb";
import { discountPercent, formatBDT } from "@/lib/utils";
import { api } from "@/lib/convex/api";
import { CATEGORY_OPTIONS } from "@/components/dashboard/listing-form";

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
  seller: {
    id: string;
    handle: string;
    displayName: string;
    location: string | null;
    status: string;
  } | null;
};

const DELIVERY_LABEL: Record<string, string> = {
  instant: "Instant",
  "manual-15m": "Within 15 min",
  "manual-1h": "Within 1 hour",
  "manual-24h": "Within 24 hours",
};

const REGION_LABEL: Record<string, string> = {
  global: "Global",
  bd: "Bangladesh only",
  in: "India",
  asia: "Asia",
  eu: "Europe",
  us: "United States",
};

const CATEGORY_LABEL = Object.fromEntries(
  CATEGORY_OPTIONS.map((c) => [c.value, c.label]),
) as Record<string, string>;

export default function ListingDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = use(params);
  const listing = useQuery(api.listings.bySlug, { slug }) as
    | Listing
    | null
    | undefined;
  const [activeImage, setActiveImage] = useState(0);

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
          <div className="surface-card overflow-hidden p-3">
            <div className="relative aspect-square overflow-hidden rounded-md bg-white/5">
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
            {listing.images.length > 1 && (
              <div className="mt-3 grid grid-cols-6 gap-2">
                {listing.images.map((url, idx) => (
                  <button
                    key={idx}
                    type="button"
                    onClick={() => setActiveImage(idx)}
                    className={`relative aspect-square overflow-hidden rounded-md border ${
                      idx === activeImage
                        ? "border-iris-400/70"
                        : "border-white/10 hover:border-white/30"
                    }`}
                  >
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img src={url} alt="" className="h-full w-full object-cover" />
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* RIGHT — details */}
        <div className="lg:col-span-7">
          <div className="flex flex-wrap items-center gap-2">
            <Badge variant="brand">{categoryLabel}</Badge>
            {discount > 0 && <Badge variant="gold">{discount}% off</Badge>}
            {!inStock && <Badge variant="danger">Out of stock</Badge>}
            <span className="text-[12px] text-fg-subtle">
              Listed by{" "}
              {listing.seller ? (
                <Link
                  href={`/seller/${listing.seller.handle}`}
                  className="text-iris-200 hover:text-iris-100"
                >
                  {listing.seller.displayName}
                </Link>
              ) : (
                <span className="text-fg-muted">a Digibazar seller</span>
              )}
            </span>
          </div>

          <h1 className="mt-3 font-display text-3xl font-bold leading-tight md:text-[34px]">
            {listing.title}
          </h1>
          <p className="mt-2 text-[14.5px] text-fg-muted">{listing.shortDesc}</p>

          <div className="mt-6 surface-card p-5">
            <div className="flex flex-wrap items-end gap-3">
              <span className="font-display text-3xl font-bold text-fg">
                {formatBDT(listing.priceTaka)}
              </span>
              {listing.originalPriceTaka && (
                <span className="text-[14px] text-fg-subtle line-through">
                  {formatBDT(listing.originalPriceTaka)}
                </span>
              )}
            </div>

            <ul className="mt-4 grid grid-cols-2 gap-y-2 text-[12.5px] text-fg-muted">
              <li className="flex items-center gap-2">
                <Zap size={13} className="text-iris-300" />
                {DELIVERY_LABEL[listing.delivery] ?? listing.delivery}
              </li>
              <li className="flex items-center gap-2">
                <Globe size={13} className="text-iris-300" />
                {REGION_LABEL[listing.region] ?? listing.region}
              </li>
              {listing.platform && (
                <li className="flex items-center gap-2">
                  <Clock size={13} className="text-iris-300" />
                  {listing.platform}
                </li>
              )}
              {listing.warranty && (
                <li className="flex items-center gap-2">
                  <RefreshCw size={13} className="text-iris-300" />
                  {listing.warranty}
                </li>
              )}
              <li className="flex items-center gap-2">
                <ShieldCheck size={13} className="text-emerald-300" />
                Buyer protection on every order
              </li>
              <li className="flex items-center gap-2 text-fg-subtle">
                Stock: {listing.stock.toLocaleString()}
              </li>
            </ul>

            <div className="mt-5 flex flex-wrap gap-2">
              <Button size="lg" disabled={!inStock} className="flex-1 min-w-[200px]">
                {inStock ? "Buy now" : "Out of stock"}
              </Button>
              <Button variant="secondary" size="lg" disabled={!inStock}>
                Add to cart
              </Button>
            </div>
            {listing.seller?.status !== "verified" && (
              <p className="mt-3 text-[11.5px] text-fg-subtle">
                Note: this seller is currently in onboarding review.
              </p>
            )}
          </div>

          <div className="mt-6 surface-card p-5">
            <h2 className="font-display text-lg font-semibold">About this listing</h2>
            <p className="mt-2 whitespace-pre-line text-[14px] leading-relaxed text-fg-muted">
              {listing.longDesc}
            </p>
          </div>

          {listing.seller && (
            <div className="mt-6 surface-card flex flex-wrap items-center gap-4 p-5">
              <div className="grid h-12 w-12 place-items-center rounded-full bg-iris-500/15 text-base font-semibold text-iris-100">
                {listing.seller.displayName.slice(0, 1).toUpperCase()}
              </div>
              <div className="min-w-0 flex-1">
                <div className="font-medium">{listing.seller.displayName}</div>
                <div className="text-[12px] text-fg-subtle">
                  @{listing.seller.handle}
                  {listing.seller.location ? ` · ${listing.seller.location}` : ""}
                </div>
              </div>
              <ButtonLink
                href={`/seller/${listing.seller.handle}`}
                variant="secondary"
                size="sm"
              >
                Visit storefront
              </ButtonLink>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
