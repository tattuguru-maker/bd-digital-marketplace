"use client";

import { useMemo, useState } from "react";
import { ChevronDown, SlidersHorizontal, X } from "lucide-react";
import { ProductCard } from "@/components/marketplace/product-card";
import {
  type Product,
  type DeliveryType,
  type Region,
} from "@/lib/data";
import { cn, discountPercent } from "@/lib/utils";

export type SortKey =
  | "featured"
  | "popular"
  | "new"
  | "price-asc"
  | "price-desc"
  | "rating"
  | "discount";

const SORT_LABELS: Record<SortKey, string> = {
  featured:    "Featured",
  popular:     "Most popular",
  new:         "Newest",
  "price-asc": "Price: low to high",
  "price-desc": "Price: high to low",
  rating:      "Top rated",
  discount:    "Biggest discount",
};

function discountOf(p: Product) {
  return p.originalPrice ? discountPercent(p.originalPrice, p.price) : 0;
}

function sortProducts(items: Product[], sort: SortKey, original: Product[]): Product[] {
  const copy = items.slice();
  switch (sort) {
    case "popular":     return copy.sort((a, b) => b.sold - a.sold);
    case "new":         // assume reverse insertion order = newest first; "newest" = later in array
                        return copy.sort((a, b) =>
                          original.indexOf(b) - original.indexOf(a),
                        );
    case "price-asc":   return copy.sort((a, b) => a.price - b.price);
    case "price-desc":  return copy.sort((a, b) => b.price - a.price);
    case "rating":      return copy.sort((a, b) => b.rating - a.rating || b.sold - a.sold);
    case "discount":    return copy.sort((a, b) => discountOf(b) - discountOf(a));
    case "featured":
    default:            // preserve original (curated) order
                        return copy.sort((a, b) =>
                          original.indexOf(a) - original.indexOf(b),
                        );
  }
}

type Filters = {
  delivery: Set<DeliveryType>;
  region: Set<Region>;
  minRating: number;        // 0 = no filter
  maxPrice: number | null;  // null = no filter
  onSale: boolean;
};

const DEFAULT_FILTERS: Filters = {
  delivery: new Set(),
  region: new Set(),
  minRating: 0,
  maxPrice: null,
  onSale: false,
};

function applyFilters(items: Product[], f: Filters): Product[] {
  return items.filter((p) => {
    if (f.delivery.size > 0 && !f.delivery.has(p.delivery)) return false;
    if (f.region.size > 0 && !f.region.has(p.region)) return false;
    if (f.minRating > 0 && p.rating < f.minRating) return false;
    if (f.maxPrice !== null && p.price > f.maxPrice) return false;
    if (f.onSale && !p.originalPrice) return false;
    return true;
  });
}

const PRICE_PRESETS: { label: string; max: number | null }[] = [
  { label: "All",          max: null },
  { label: "Under ৳200",   max: 200 },
  { label: "Under ৳500",   max: 500 },
  { label: "Under ৳1k",    max: 1000 },
  { label: "Under ৳2k",    max: 2000 },
];

const DELIVERY_OPTIONS: { value: DeliveryType; label: string }[] = [
  { value: "instant",     label: "Instant" },
  { value: "manual-15m",  label: "≤ 15 min" },
  { value: "manual-1h",   label: "≤ 1 hour" },
  { value: "manual-24h",  label: "≤ 24h" },
];

const REGION_OPTIONS: { value: Region; label: string }[] = [
  { value: "global",  label: "Global" },
  { value: "asia",    label: "Asia" },
  { value: "in",      label: "India" },
  { value: "us",      label: "US" },
  { value: "eu",      label: "Europe" },
];

export function ProductGrid({
  initialProducts,
  emptyState,
}: {
  initialProducts: Product[];
  emptyState?: React.ReactNode;
}) {
  const [sort, setSort] = useState<SortKey>("featured");
  const [filters, setFilters] = useState<Filters>(DEFAULT_FILTERS);
  const [filtersOpen, setFiltersOpen] = useState(false);

  const filtered = useMemo(
    () => applyFilters(initialProducts, filters),
    [initialProducts, filters],
  );
  const sorted = useMemo(
    () => sortProducts(filtered, sort, initialProducts),
    [filtered, sort, initialProducts],
  );

  const activeFilterCount =
    filters.delivery.size +
    filters.region.size +
    (filters.minRating > 0 ? 1 : 0) +
    (filters.maxPrice !== null ? 1 : 0) +
    (filters.onSale ? 1 : 0);

  const reset = () => setFilters(DEFAULT_FILTERS);

  return (
    <div>
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-2 text-sm text-fg-muted">
          <span>{sorted.length}</span>
          <span>of</span>
          <span>{initialProducts.length} results</span>
          {activeFilterCount > 0 && (
            <>
              <span className="text-fg-subtle">·</span>
              <button
                onClick={reset}
                className="inline-flex items-center gap-1 text-iris-300 hover:text-iris-200"
              >
                <X size={12} /> Clear filters
              </button>
            </>
          )}
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => setFiltersOpen((v) => !v)}
            className={cn(
              "glass-pill inline-flex items-center gap-1.5 rounded-full px-4 h-10 text-[13px] transition lg:hidden",
              filtersOpen ? "text-fg bg-white/10" : "text-fg-muted",
            )}
          >
            <SlidersHorizontal size={14} /> Filters
            {activeFilterCount > 0 && (
              <span className="ml-1 grid h-5 min-w-5 place-items-center rounded-full bg-iris-500 px-1.5 text-[10px] font-bold text-white">
                {activeFilterCount}
              </span>
            )}
          </button>
          <SortDropdown sort={sort} onChange={setSort} />
        </div>
      </div>

      <FilterChipBar
        className="mt-4"
        filters={filters}
        setFilters={setFilters}
        forceOpen={filtersOpen}
      />

      {sorted.length > 0 ? (
        <div className="mt-5 grid grid-cols-2 gap-4 md:grid-cols-3 xl:grid-cols-4">
          {sorted.map((p) => (
            <ProductCard key={p.id} product={p} />
          ))}
        </div>
      ) : (
        <div className="surface-card mt-5 flex flex-col items-center gap-2 p-12 text-center">
          {emptyState ?? (
            <>
              <div className="text-3xl">🔍</div>
              <h3 className="font-display text-lg font-bold">No matches</h3>
              <p className="max-w-sm text-sm text-fg-muted">
                Try clearing some filters — or change the sort order.
              </p>
              <button
                onClick={reset}
                className="mt-2 inline-flex items-center gap-1 rounded-full border border-iris-400/40 bg-iris-500/10 px-4 py-1.5 text-[13px] font-medium text-iris-200 hover:bg-iris-500/20"
              >
                Reset filters
              </button>
            </>
          )}
        </div>
      )}
    </div>
  );
}

function SortDropdown({ sort, onChange }: { sort: SortKey; onChange: (s: SortKey) => void }) {
  return (
    <label className="glass-pill relative inline-flex h-10 items-center gap-2 rounded-full pl-4 pr-2 text-[13px] text-fg">
      <span className="text-[11px] font-semibold uppercase tracking-wider text-fg-subtle">
        Sort
      </span>
      <span>{SORT_LABELS[sort]}</span>
      <ChevronDown size={14} className="text-fg-subtle" />
      <select
        value={sort}
        onChange={(e) => onChange(e.target.value as SortKey)}
        className="absolute inset-0 cursor-pointer opacity-0"
        aria-label="Sort products"
      >
        {(Object.keys(SORT_LABELS) as SortKey[]).map((k) => (
          <option key={k} value={k}>
            {SORT_LABELS[k]}
          </option>
        ))}
      </select>
    </label>
  );
}

function FilterChipBar({
  filters,
  setFilters,
  className,
  forceOpen,
}: {
  filters: Filters;
  setFilters: (updater: (f: Filters) => Filters) => void;
  className?: string;
  forceOpen?: boolean;
}) {
  const toggleDelivery = (d: DeliveryType) =>
    setFilters((f) => {
      const next = new Set(f.delivery);
      if (next.has(d)) next.delete(d);
      else next.add(d);
      return { ...f, delivery: next };
    });

  const toggleRegion = (r: Region) =>
    setFilters((f) => {
      const next = new Set(f.region);
      if (next.has(r)) next.delete(r);
      else next.add(r);
      return { ...f, region: next };
    });

  return (
    <div
      className={cn(
        "flex flex-col gap-3 rounded-2xl border border-white/5 bg-white/[0.02] p-4",
        forceOpen ? "" : "max-lg:hidden lg:flex",
        className,
      )}
    >
      <ChipGroup label="Price">
        {PRICE_PRESETS.map((p) => (
          <Chip
            key={p.label}
            active={filters.maxPrice === p.max}
            onClick={() =>
              setFilters((f) => ({ ...f, maxPrice: p.max }))
            }
          >
            {p.label}
          </Chip>
        ))}
        <Chip
          active={filters.onSale}
          onClick={() => setFilters((f) => ({ ...f, onSale: !f.onSale }))}
        >
          On sale
        </Chip>
      </ChipGroup>

      <ChipGroup label="Delivery">
        {DELIVERY_OPTIONS.map((d) => (
          <Chip
            key={d.value}
            active={filters.delivery.has(d.value)}
            onClick={() => toggleDelivery(d.value)}
          >
            {d.label}
          </Chip>
        ))}
      </ChipGroup>

      <ChipGroup label="Region">
        {REGION_OPTIONS.map((r) => (
          <Chip
            key={r.value}
            active={filters.region.has(r.value)}
            onClick={() => toggleRegion(r.value)}
          >
            {r.label}
          </Chip>
        ))}
      </ChipGroup>

      <ChipGroup label="Rating">
        {[0, 4, 4.5].map((r) => (
          <Chip
            key={r}
            active={filters.minRating === r}
            onClick={() => setFilters((f) => ({ ...f, minRating: r }))}
          >
            {r === 0 ? "All" : `${r}★+`}
          </Chip>
        ))}
      </ChipGroup>
    </div>
  );
}

function ChipGroup({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div className="flex flex-wrap items-center gap-2">
      <span className="mr-1 text-[11px] font-semibold uppercase tracking-wider text-fg-subtle">
        {label}
      </span>
      {children}
    </div>
  );
}

function Chip({
  active,
  onClick,
  children,
}: {
  active?: boolean;
  onClick?: () => void;
  children: React.ReactNode;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={cn(
        "inline-flex h-8 items-center rounded-full border px-3 text-[12.5px] transition",
        active
          ? "border-iris-400/60 bg-iris-500/15 text-iris-100 shadow-[inset_0_0_0_1px_rgba(91,61,255,0.25)]"
          : "border-white/10 bg-white/[0.04] text-fg-muted hover:border-white/20 hover:text-fg",
      )}
    >
      {children}
    </button>
  );
}

