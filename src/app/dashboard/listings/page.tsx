"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import { useQuery, useMutation } from "convex/react";
import {
  Plus,
  Search,
  Edit3,
  Eye,
  Archive,
  RotateCcw,
  Package,
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { ButtonLink } from "@/components/ui/button";
import { api } from "@/lib/convex/api";
import { formatBDT, formatNumber } from "@/lib/utils";
import { CATEGORY_OPTIONS } from "@/components/dashboard/listing-form";

type ListingRow = {
  id: string;
  title: string;
  slug: string;
  category: string;
  shortDesc: string;
  priceTaka: number;
  originalPriceTaka: number | null;
  stock: number;
  status: "draft" | "active" | "archived";
  sold: number;
  views: number;
  createdAt: number;
  images: string[];
};

const CATEGORY_LABEL = Object.fromEntries(
  CATEGORY_OPTIONS.map((c) => [c.value, c.label]),
) as Record<string, string>;

export default function DashboardListingsPage() {
  const data = useQuery(api.listings.mine) as ListingRow[] | undefined;
  const archive = useMutation(api.listings.archive);
  const unarchive = useMutation(api.listings.unarchive);

  const [filter, setFilter] = useState<"all" | "active" | "draft" | "archived">("all");
  const [search, setSearch] = useState("");
  const [pendingId, setPendingId] = useState<string | null>(null);

  const items = useMemo(() => {
    if (!data) return null;
    return data.filter((l) => {
      if (filter !== "all" && l.status !== filter) return false;
      if (search.trim() && !l.title.toLowerCase().includes(search.trim().toLowerCase())) {
        return false;
      }
      return true;
    });
  }, [data, filter, search]);

  const counts = useMemo(() => {
    const base = { all: 0, active: 0, draft: 0, archived: 0 };
    if (!data) return base;
    for (const l of data) {
      base.all += 1;
      base[l.status as keyof typeof base] += 1;
    }
    return base;
  }, [data]);

  return (
    <>
      <div className="flex flex-wrap items-end justify-between gap-3">
        <div>
          <h1 className="font-display text-3xl font-bold">Your listings</h1>
          <p className="mt-1 text-sm text-fg-muted">
            {counts.all === 0
              ? "No listings yet — start by creating one."
              : `${counts.active} active · ${counts.draft} draft${
                  counts.archived > 0 ? ` · ${counts.archived} archived` : ""
                }`}
          </p>
        </div>
        <ButtonLink href="/dashboard/listings/new">
          <Plus size={14} /> New listing
        </ButtonLink>
      </div>

      <div className="mt-5 surface-card overflow-hidden">
        <div className="flex flex-wrap items-center gap-2 border-b border-white/5 p-3">
          <div className="relative min-w-[220px] flex-1">
            <Search
              size={14}
              className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-fg-subtle"
            />
            <input
              placeholder="Search your listings..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="h-9 w-full rounded-md border border-white/10 bg-white/5 pl-9 pr-3 text-[13px] placeholder:text-fg-subtle focus:border-iris-400/50 focus:bg-white/[0.06] focus:outline-none"
            />
          </div>
          <div className="flex gap-1">
            {(["all", "active", "draft", "archived"] as const).map((f) => (
              <button
                key={f}
                type="button"
                onClick={() => setFilter(f)}
                className={`rounded-md px-3 py-1.5 text-[12px] capitalize transition ${
                  filter === f
                    ? "bg-iris-500/20 text-iris-100"
                    : "text-fg-muted hover:bg-white/5 hover:text-fg"
                }`}
              >
                {f}
                {counts[f] > 0 && (
                  <span className="ml-1 text-[10.5px] text-fg-subtle">{counts[f]}</span>
                )}
              </button>
            ))}
          </div>
        </div>

        {data === undefined ? (
          <LoadingState />
        ) : items && items.length === 0 ? (
          counts.all === 0 ? (
            <EmptyState />
          ) : (
            <div className="px-6 py-12 text-center text-sm text-fg-muted">
              No listings match this filter.
            </div>
          )
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-[13px]">
              <thead className="text-[11px] uppercase tracking-wider text-fg-subtle">
                <tr className="bg-white/[0.02]">
                  <th className="py-3 pl-4 pr-3">Listing</th>
                  <th className="py-3 pr-3">Category</th>
                  <th className="py-3 pr-3">Stock</th>
                  <th className="py-3 pr-3">Price</th>
                  <th className="py-3 pr-3">Sold</th>
                  <th className="py-3 pr-3">Status</th>
                  <th className="py-3 pr-3 text-right">Actions</th>
                </tr>
              </thead>
              <tbody>
                {(items ?? []).map((l) => (
                  <tr key={l.id} className="border-t border-white/5 align-middle">
                    <td className="py-3 pl-4 pr-3">
                      <div className="flex items-center gap-3">
                        <div className="grid h-12 w-12 shrink-0 place-items-center overflow-hidden rounded-md border border-white/10 bg-white/5">
                          {l.images[0] ? (
                            // eslint-disable-next-line @next/next/no-img-element
                            <img
                              src={l.images[0]}
                              alt=""
                              className="h-full w-full object-cover"
                            />
                          ) : (
                            <Package size={16} className="text-fg-subtle" />
                          )}
                        </div>
                        <div className="min-w-0">
                          <div className="truncate font-medium text-fg">{l.title}</div>
                          <div className="truncate text-[11.5px] text-fg-subtle">
                            /{l.slug}
                          </div>
                        </div>
                      </div>
                    </td>
                    <td className="py-3 pr-3 text-fg-muted">
                      {CATEGORY_LABEL[l.category] ?? l.category}
                    </td>
                    <td className="py-3 pr-3">{formatNumber(l.stock)}</td>
                    <td className="py-3 pr-3">
                      <div className="font-medium">{formatBDT(l.priceTaka)}</div>
                      {l.originalPriceTaka && (
                        <div className="text-[11px] text-fg-subtle line-through">
                          {formatBDT(l.originalPriceTaka)}
                        </div>
                      )}
                    </td>
                    <td className="py-3 pr-3 text-fg-muted">{formatNumber(l.sold)}</td>
                    <td className="py-3 pr-3">
                      <StatusBadge status={l.status} />
                    </td>
                    <td className="py-3 pr-3">
                      <div className="flex items-center justify-end gap-1">
                        {l.status === "active" && (
                          <Link
                            href={`/product/${l.slug}`}
                            target="_blank"
                            className="grid h-8 w-8 place-items-center rounded-md text-fg-muted hover:bg-white/5 hover:text-fg"
                            aria-label="View public listing"
                          >
                            <Eye size={14} />
                          </Link>
                        )}
                        <Link
                          href={`/dashboard/listings/${l.id}/edit`}
                          className="grid h-8 w-8 place-items-center rounded-md text-fg-muted hover:bg-white/5 hover:text-fg"
                          aria-label="Edit listing"
                        >
                          <Edit3 size={14} />
                        </Link>
                        {l.status === "archived" ? (
                          <button
                            type="button"
                            disabled={pendingId === l.id}
                            onClick={async () => {
                              setPendingId(l.id);
                              try {
                                await unarchive({ id: l.id });
                              } finally {
                                setPendingId(null);
                              }
                            }}
                            className="grid h-8 w-8 place-items-center rounded-md text-fg-muted hover:bg-white/5 hover:text-fg disabled:opacity-50"
                            aria-label="Unarchive listing"
                          >
                            <RotateCcw size={14} />
                          </button>
                        ) : (
                          <button
                            type="button"
                            disabled={pendingId === l.id}
                            onClick={async () => {
                              if (!confirm(`Archive "${l.title}"?`)) return;
                              setPendingId(l.id);
                              try {
                                await archive({ id: l.id });
                              } finally {
                                setPendingId(null);
                              }
                            }}
                            className="grid h-8 w-8 place-items-center rounded-md text-fg-muted hover:bg-danger/10 hover:text-danger disabled:opacity-50"
                            aria-label="Archive listing"
                          >
                            <Archive size={14} />
                          </button>
                        )}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </>
  );
}

function StatusBadge({ status }: { status: string }) {
  if (status === "active") return <Badge variant="brand">Active</Badge>;
  if (status === "draft") return <Badge>Draft</Badge>;
  return <Badge variant="ghost">Archived</Badge>;
}

function LoadingState() {
  return (
    <div className="space-y-2 p-4">
      {[0, 1, 2].map((i) => (
        <div
          key={i}
          className="h-14 animate-pulse rounded-md border border-white/5 bg-white/[0.02]"
        />
      ))}
    </div>
  );
}

function EmptyState() {
  return (
    <div className="flex flex-col items-center justify-center gap-3 px-6 py-16 text-center">
      <div className="grid h-12 w-12 place-items-center rounded-full bg-iris-500/15 text-iris-200">
        <Package size={20} />
      </div>
      <div>
        <h2 className="font-display text-lg font-semibold">No listings yet</h2>
        <p className="mt-1 max-w-md text-[12.5px] text-fg-muted">
          Create your first listing — title, description, price, stock and one
          or two photos. You can save drafts and publish when ready.
        </p>
      </div>
      <ButtonLink href="/dashboard/listings/new">
        <Plus size={14} /> Create your first listing
      </ButtonLink>
    </div>
  );
}


