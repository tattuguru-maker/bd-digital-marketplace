"use client";

import Link from "next/link";
import { use } from "react";
import { useQuery } from "convex/react";
import { ChevronRight, Loader2 } from "lucide-react";
import { ListingForm, type ListingFormInitial } from "@/components/dashboard/listing-form";
import { api } from "@/lib/convex/api";

type DetailedListing = {
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
  images: string[];
  imageIds: string[];
};

export default function EditListingPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = use(params);
  const listing = useQuery(api.listings.byId, { id }) as
    | DetailedListing
    | null
    | undefined;

  return (
    <>
      <nav
        aria-label="Breadcrumb"
        className="mb-3 flex items-center gap-1.5 text-[11.5px] text-fg-subtle"
      >
        <Link href="/dashboard" className="hover:text-fg">
          Dashboard
        </Link>
        <ChevronRight size={11} />
        <Link href="/dashboard/listings" className="hover:text-fg">
          Listings
        </Link>
        <ChevronRight size={11} />
        <span className="text-fg">Edit</span>
      </nav>

      <header className="mb-5">
        <h1 className="font-display text-3xl font-bold">Edit listing</h1>
        <p className="mt-1 text-sm text-fg-muted">
          Changes are saved live. Switch to &quot;Save as draft&quot; to take it
          off the public browse.
        </p>
      </header>

      {listing === undefined ? (
        <div className="surface-card flex items-center gap-2 p-6 text-sm text-fg-muted">
          <Loader2 size={14} className="animate-spin" /> Loading listing...
        </div>
      ) : listing === null ? (
        <div className="surface-card p-6 text-sm text-fg-muted">
          This listing doesn&apos;t exist or you don&apos;t have access to it.
        </div>
      ) : (
        <ListingForm
          mode="edit"
          initial={
            {
              id: listing.id,
              title: listing.title,
              category: listing.category,
              shortDesc: listing.shortDesc,
              longDesc: listing.longDesc,
              priceTaka: listing.priceTaka,
              originalPriceTaka: listing.originalPriceTaka,
              stock: listing.stock,
              delivery: listing.delivery,
              region: listing.region,
              platform: listing.platform,
              warranty: listing.warranty,
              status: listing.status,
              images: listing.imageIds.map((id, idx) => ({
                id,
                url: listing.images[idx] ?? "",
              })),
            } satisfies ListingFormInitial
          }
        />
      )}
    </>
  );
}
