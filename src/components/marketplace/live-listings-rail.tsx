"use client";

import Link from "next/link";
import { useQuery } from "convex/react";
import { Sparkles, Store } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { discountPercent, formatBDT } from "@/lib/utils";
import { api } from "@/lib/convex/api";

type Listing = {
  id: string;
  title: string;
  slug: string;
  category: string;
  shortDesc: string;
  priceTaka: number;
  originalPriceTaka: number | null;
  stock: number;
  status: "active";
  images: string[];
  seller: { id: string; handle: string; displayName: string } | null;
};

export type LiveListingCategory =
  | "streaming"
  | "ai-tools"
  | "game-topup"
  | "cd-keys"
  | "gift-cards"
  | "software"
  | "vpn"
  | "education"
  | "social";

export function LiveListingsRail({
  category,
  title = "Live from sellers",
  emptyHint,
  limit = 12,
}: {
  category?: LiveListingCategory;
  title?: string;
  emptyHint?: string;
  limit?: number;
}) {
  const data = useQuery(
    api.listings.publicListings,
    category ? { category, limit } : { limit },
  ) as Listing[] | undefined;

  if (!data || data.length === 0) {
    if (data && data.length === 0 && emptyHint) {
      return (
        <section className="surface-card mt-6 p-5">
          <SectionHeader title={title} subtitle={emptyHint} />
        </section>
      );
    }
    return null;
  }

  return (
    <section className="surface-card mt-6 p-5">
      <SectionHeader
        title={title}
        subtitle="Real listings from verified Digibazar sellers, posted via the seller dashboard."
      />
      <div className="mt-4 grid grid-cols-2 gap-3 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5">
        {data.map((l) => (
          <ListingCard key={l.id} listing={l} />
        ))}
      </div>
    </section>
  );
}

function SectionHeader({
  title,
  subtitle,
}: {
  title: string;
  subtitle: string;
}) {
  return (
    <header className="flex flex-wrap items-end justify-between gap-3">
      <div className="flex items-center gap-3">
        <span className="grid h-9 w-9 place-items-center rounded-md bg-iris-500/15 text-iris-200">
          <Sparkles size={16} />
        </span>
        <div>
          <h2 className="font-display text-lg font-semibold">{title}</h2>
          <p className="mt-0.5 text-[12.5px] text-fg-muted">{subtitle}</p>
        </div>
      </div>
      <Badge variant="brand">Live data</Badge>
    </header>
  );
}

function ListingCard({ listing }: { listing: Listing }) {
  const main = listing.images[0];
  const discount = listing.originalPriceTaka
    ? discountPercent(listing.originalPriceTaka, listing.priceTaka)
    : 0;
  return (
    <Link
      href={`/product/${listing.slug}`}
      className="group surface-card flex h-full flex-col overflow-hidden transition hover:border-iris-400/40 hover:bg-white/[0.06]"
    >
      <div className="relative aspect-[4/3] overflow-hidden bg-white/5">
        {main ? (
          /* eslint-disable-next-line @next/next/no-img-element */
          <img
            src={main}
            alt={listing.title}
            className="h-full w-full object-cover transition group-hover:scale-[1.03]"
          />
        ) : (
          <div className="grid h-full place-items-center text-fg-subtle">
            <Store size={20} />
          </div>
        )}
        {discount > 0 && (
          <span className="absolute left-2 top-2 rounded-md bg-gold-400/90 px-1.5 py-0.5 text-[10.5px] font-semibold text-zinc-900">
            -{discount}%
          </span>
        )}
      </div>
      <div className="flex flex-1 flex-col gap-2 p-3">
        <div className="line-clamp-2 text-[13px] font-medium leading-snug text-fg">
          {listing.title}
        </div>
        <div className="mt-auto flex items-end justify-between gap-2">
          <div>
            <div className="font-display text-[15px] font-bold text-fg">
              {formatBDT(listing.priceTaka)}
            </div>
            {listing.originalPriceTaka && (
              <div className="text-[10.5px] text-fg-subtle line-through">
                {formatBDT(listing.originalPriceTaka)}
              </div>
            )}
          </div>
          {listing.seller && (
            <div className="truncate text-right text-[10.5px] text-fg-subtle">
              by{" "}
              <span className="text-iris-200">@{listing.seller.handle}</span>
            </div>
          )}
        </div>
      </div>
    </Link>
  );
}
