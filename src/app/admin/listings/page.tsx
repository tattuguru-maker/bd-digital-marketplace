"use client";

import Link from "next/link";
import { useState } from "react";
import { useMutation, useQuery } from "convex/react";
import { AlertTriangle, ExternalLink, Loader2, Package } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Breadcrumb } from "@/components/marketplace/breadcrumb";
import { api } from "@/lib/convex/api";
import { cn, formatBDT } from "@/lib/utils";

type ListingStatus = "draft" | "active" | "archived";

type AdminListing = {
  id: string;
  title: string;
  slug: string;
  category: string;
  priceTaka: number;
  originalPriceTaka: number | null;
  stock: number;
  status: ListingStatus;
  createdAt: number;
  publishedAt: number | null;
  archivedAt: number | null;
  sold: number;
  views: number;
  seller: {
    id: string;
    displayName: string;
    handle: string;
    status: string;
  } | null;
};

const STATUS_TABS: { value: ListingStatus | "all"; label: string }[] = [
  { value: "all", label: "All" },
  { value: "active", label: "Active" },
  { value: "draft", label: "Draft" },
  { value: "archived", label: "Archived" },
];

export default function AdminListingsPage() {
  const [search, setSearch] = useState("");
  const [status, setStatus] = useState<ListingStatus | "all">("all");
  const listings = useQuery(api.admin.listingsList, {
    search,
    status,
    limit: 100,
  }) as AdminListing[] | undefined;

  return (
    <div>
      <Breadcrumb
        items={[
          { label: "Admin", href: "/admin" },
          { label: "Listings" },
        ]}
      />

      <header className="mt-4 flex flex-wrap items-end justify-between gap-3">
        <div>
          <Badge variant="brand">
            <Package size={11} /> Listings
          </Badge>
          <h1 className="mt-2 font-display text-2xl font-bold md:text-3xl">
            Listing moderation
          </h1>
          <p className="mt-1 text-[14px] text-fg-muted">
            {listings === undefined
              ? "Loading…"
              : `${listings.length} listing${listings.length === 1 ? "" : "s"} match the current filter.`}
          </p>
        </div>
      </header>

      <div className="mt-4 flex flex-wrap items-center gap-2">
        <div className="surface-card flex h-10 min-w-[260px] flex-1 items-center gap-2 px-3">
          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search by title or slug…"
            className="h-full flex-1 bg-transparent text-[13px] outline-none placeholder:text-fg-subtle"
          />
        </div>
        <div className="flex flex-wrap gap-1">
          {STATUS_TABS.map((s) => (
            <button
              key={s.value}
              type="button"
              onClick={() => setStatus(s.value)}
              className={cn(
                "inline-flex h-9 items-center rounded-full px-3.5 text-[12.5px] font-medium transition",
                status === s.value
                  ? "bg-iris-500 text-white"
                  : "border border-white/10 bg-white/5 text-fg-muted hover:text-fg",
              )}
            >
              {s.label}
            </button>
          ))}
        </div>
      </div>

      <div className="surface-card mt-5 overflow-hidden">
        {listings === undefined ? (
          <div className="flex items-center gap-2 p-6 text-sm text-fg-muted">
            <Loader2 size={14} className="animate-spin" /> Loading listings…
          </div>
        ) : listings.length === 0 ? (
          <div className="p-8 text-center text-[13px] text-fg-muted">
            No listings match this filter.
          </div>
        ) : (
          <table className="w-full text-left text-[13px]">
            <thead className="text-[11.5px] uppercase tracking-wider text-fg-subtle">
              <tr className="border-b border-white/5">
                <th className="px-4 py-3 font-medium">Listing</th>
                <th className="px-4 py-3 font-medium">Seller</th>
                <th className="px-4 py-3 font-medium">Status</th>
                <th className="px-4 py-3 font-medium text-right">Price</th>
                <th className="px-4 py-3 font-medium text-right">Stock</th>
                <th className="px-4 py-3 font-medium text-right">Actions</th>
              </tr>
            </thead>
            <tbody>
              {listings.map((l) => (
                <ListingRow key={l.id} listing={l} />
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}

function ListingRow({ listing }: { listing: AdminListing }) {
  const archive = useMutation(api.admin.archiveListing);
  const unarchive = useMutation(api.admin.unarchiveListing);
  const [pending, setPending] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const onArchive = async () => {
    setError(null);
    setPending(true);
    try {
      await archive({ listingId: listing.id as never });
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to archive.");
    } finally {
      setPending(false);
    }
  };
  const onUnarchive = async () => {
    setError(null);
    setPending(true);
    try {
      await unarchive({ listingId: listing.id as never });
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to unarchive.");
    } finally {
      setPending(false);
    }
  };

  return (
    <tr className="border-b border-white/5 last:border-b-0 hover:bg-white/[0.02]">
      <td className="px-4 py-3">
        <div className="font-medium">{listing.title}</div>
        <div className="text-[11.5px] text-fg-subtle">
          /{listing.slug} · {listing.category}
        </div>
      </td>
      <td className="px-4 py-3">
        {listing.seller ? (
          <div>
            <div>{listing.seller.displayName}</div>
            <div className="text-[11.5px] text-fg-subtle">
              @{listing.seller.handle}
            </div>
          </div>
        ) : (
          <span className="text-fg-subtle">—</span>
        )}
      </td>
      <td className="px-4 py-3">
        <StatusPill status={listing.status} />
      </td>
      <td className="px-4 py-3 text-right">
        <div className="font-semibold">{formatBDT(listing.priceTaka)}</div>
        {listing.originalPriceTaka && (
          <div className="text-[11px] text-fg-subtle line-through">
            {formatBDT(listing.originalPriceTaka)}
          </div>
        )}
      </td>
      <td className="px-4 py-3 text-right">{listing.stock}</td>
      <td className="px-4 py-3">
        <div className="flex flex-wrap items-center justify-end gap-1.5">
          <Link
            href={`/product/${listing.slug}`}
            target="_blank"
            className="glass-pill inline-flex h-8 items-center gap-1 rounded-md px-2.5 text-[11.5px] text-fg-muted hover:text-fg"
          >
            <ExternalLink size={11} /> View
          </Link>
          {listing.status !== "archived" ? (
            <Button
              size="sm"
              variant="ghost"
              disabled={pending}
              onClick={onArchive}
            >
              Archive
            </Button>
          ) : (
            <Button
              size="sm"
              variant="secondary"
              disabled={pending}
              onClick={onUnarchive}
            >
              Unarchive
            </Button>
          )}
          {pending && <Loader2 size={13} className="animate-spin text-fg-subtle" />}
        </div>
        {error && (
          <div className="mt-1 inline-flex items-center gap-1 text-[11px] text-danger">
            <AlertTriangle size={11} /> {error}
          </div>
        )}
      </td>
    </tr>
  );
}

function StatusPill({ status }: { status: ListingStatus }) {
  const STYLES: Record<ListingStatus, string> = {
    draft: "border border-white/10 bg-white/5 text-fg-muted",
    active: "bg-emerald-500/15 text-emerald-200",
    archived: "bg-amber-500/15 text-amber-200",
  };
  return (
    <span
      className={cn(
        "inline-flex items-center rounded-md px-1.5 py-0.5 text-[11px] font-semibold uppercase tracking-wider",
        STYLES[status],
      )}
    >
      {status}
    </span>
  );
}
