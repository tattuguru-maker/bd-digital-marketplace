"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import {
  Award, Crown, Globe, Shield, Zap, ChevronDown, MessageCircle, ShoppingCart,
  TrendingUp, Trophy, Clock,
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { ButtonLink } from "@/components/ui/button";
import { RatingStars } from "@/components/marketplace/rating-stars";
import { cn, formatBDT, formatNumber, discountPercent } from "@/lib/utils";
import {
  getSeller,
  type SellerOffer,
} from "@/lib/data";

type SortKey = "best" | "cheapest" | "fastest" | "rated";

const SORT_LABELS: Record<SortKey, { label: string; icon: React.ReactNode }> = {
  best:     { label: "Best value",        icon: <Trophy size={13} /> },
  cheapest: { label: "Lowest price",      icon: <TrendingUp size={13} /> },
  fastest:  { label: "Fastest delivery",  icon: <Zap size={13} /> },
  rated:    { label: "Top rated seller",  icon: <Award size={13} /> },
};

const DELIVERY_RANK: Record<string, number> = {
  instant: 0, "manual-15m": 1, "manual-1h": 2, "manual-24h": 3,
};

function deliveryLabel(d: string) {
  switch (d) {
    case "instant":     return "Instant (~ 5 min)";
    case "manual-15m":  return "Manual · 15 min";
    case "manual-1h":   return "Manual · 1 hour";
    case "manual-24h":  return "Manual · within 24h";
    default:            return d;
  }
}

function regionLabel(r: string) {
  switch (r) {
    case "global": return "Global";
    case "bd":     return "Bangladesh";
    case "in":     return "India";
    case "asia":   return "Asia / Pacific";
    case "eu":     return "Europe";
    case "us":     return "United States";
    default:       return r.toUpperCase();
  }
}

const PAYMENT_STYLE: Record<string, { label: string; bg: string }> = {
  bkash:  { label: "bKash",  bg: "bg-pink-600" },
  nagad:  { label: "Nagad",  bg: "bg-orange-500" },
  rocket: { label: "Rocket", bg: "bg-purple-600" },
  card:   { label: "Card",   bg: "bg-blue-600" },
  bank:   { label: "Bank",   bg: "bg-zinc-700" },
};

export function SellerOffersPanel({ offers }: { offers: SellerOffer[] }) {
  const [sort, setSort] = useState<SortKey>("best");

  const sorted = useMemo(() => {
    const copy = offers.slice();
    switch (sort) {
      case "cheapest":
        copy.sort((a, b) => a.price - b.price);
        break;
      case "fastest":
        copy.sort(
          (a, b) =>
            (DELIVERY_RANK[a.delivery] ?? 9) - (DELIVERY_RANK[b.delivery] ?? 9) ||
            a.price - b.price,
        );
        break;
      case "rated":
        copy.sort((a, b) => {
          const ra = getSeller(a.sellerId)?.rating ?? 0;
          const rb = getSeller(b.sellerId)?.rating ?? 0;
          return rb - ra || a.price - b.price;
        });
        break;
      case "best":
      default:
        // Heuristic: weight by rating, faster delivery, cheaper price
        copy.sort((a, b) => {
          const ra = getSeller(a.sellerId)?.rating ?? 0;
          const rb = getSeller(b.sellerId)?.rating ?? 0;
          const sa =
            ra * 1000 -
            (DELIVERY_RANK[a.delivery] ?? 9) * 25 -
            a.price * 0.05;
          const sb =
            rb * 1000 -
            (DELIVERY_RANK[b.delivery] ?? 9) * 25 -
            b.price * 0.05;
          return sb - sa;
        });
        break;
    }
    return copy;
  }, [offers, sort]);

  const best = useMemo(() => {
    return offers.slice().sort((a, b) => a.price - b.price)[0];
  }, [offers]);

  return (
    <section className="surface-card overflow-hidden">
      <header className="flex flex-wrap items-center justify-between gap-3 border-b border-white/5 px-5 py-4 md:px-7">
        <div>
          <div className="text-[11px] font-semibold uppercase tracking-[0.18em] text-iris-300">
            Seller offers
          </div>
          <h2 className="mt-1 font-display text-xl font-bold md:text-2xl">
            {offers.length} verified sellers offer this product
          </h2>
          <p className="mt-1 text-[13px] text-fg-muted">
            From{" "}
            <span className="font-semibold text-fg">{formatBDT(best.price)}</span>
            {" "}— pick the seller that suits you best.
          </p>
        </div>
        <SortDropdown sort={sort} onChange={setSort} />
      </header>

      {best && <BestOfferCard offer={best} />}

      <ul className="divide-y divide-white/5">
        {sorted.map((offer) => (
          <OfferRow key={offer.id} offer={offer} isBest={offer.id === best?.id} />
        ))}
      </ul>
    </section>
  );
}

function SortDropdown({ sort, onChange }: { sort: SortKey; onChange: (s: SortKey) => void }) {
  return (
    <label className="glass-pill relative inline-flex h-10 items-center gap-2 rounded-full pl-4 pr-2 text-[13px] text-fg-muted">
      <span className="text-[11px] font-semibold uppercase tracking-wider text-fg-subtle">
        Sort
      </span>
      <span className="inline-flex items-center gap-1.5 text-fg">
        {SORT_LABELS[sort].icon}
        {SORT_LABELS[sort].label}
      </span>
      <ChevronDown size={14} className="text-fg-subtle" />
      <select
        value={sort}
        onChange={(e) => onChange(e.target.value as SortKey)}
        className="absolute inset-0 cursor-pointer opacity-0"
        aria-label="Sort offers"
      >
        {(Object.keys(SORT_LABELS) as SortKey[]).map((k) => (
          <option key={k} value={k}>
            {SORT_LABELS[k].label}
          </option>
        ))}
      </select>
    </label>
  );
}

function BestOfferCard({ offer }: { offer: SellerOffer }) {
  const seller = getSeller(offer.sellerId);
  if (!seller) return null;
  const discount = offer.originalPrice
    ? discountPercent(offer.originalPrice, offer.price)
    : 0;

  return (
    <div className="relative m-4 overflow-hidden rounded-2xl border border-iris-400/30 bg-iris-500/[0.07] p-5 md:m-6 md:p-6">
      <div className="absolute inset-0 -z-10 bg-[radial-gradient(80%_60%_at_15%_-10%,rgba(91,61,255,0.22),transparent_60%)]" />
      <div className="absolute inset-0 -z-10 bg-[radial-gradient(70%_60%_at_95%_120%,rgba(45,212,255,0.18),transparent_60%)]" />

      <div className="flex flex-wrap items-center gap-2">
        <span className="inline-flex items-center gap-1.5 rounded-md bg-gradient-to-r from-iris-500 to-cyan-400 px-2 py-1 text-[11px] font-bold uppercase tracking-wider text-white">
          <Crown size={12} /> Best Offer
        </span>
        {offer.badges
          .filter((b) => b !== "Best Price")
          .map((b) => (
            <Badge key={b} variant="outline" className="!text-[11px]">
              {b}
            </Badge>
          ))}
      </div>

      <div className="mt-3 grid gap-5 md:grid-cols-12 md:items-center">
        <div className="md:col-span-5">
          <Link
            href={`/seller/${seller.id}`}
            className="group flex items-center gap-3 transition"
          >
            <div
              className={cn(
                "grid h-12 w-12 shrink-0 place-items-center rounded-xl bg-gradient-to-br font-display text-lg font-extrabold text-white",
                seller.avatarColor,
              )}
            >
              {seller.displayName[0]}
            </div>
            <div className="min-w-0 flex-1">
              <div className="flex items-center gap-1.5">
                <span className="truncate font-semibold group-hover:text-white">
                  {seller.displayName}
                </span>
                {seller.verified && (
                  <Award size={14} className="text-iris-300" aria-label="Verified" />
                )}
              </div>
              <div className="text-[12px] text-fg-subtle">
                @{seller.handle} · {seller.location.split(",")[0]}
              </div>
              <div className="mt-1 flex items-center gap-2">
                <RatingStars rating={seller.rating} size={12} />
                <span className="text-[12px] text-fg-muted">
                  {seller.rating.toFixed(2)} · {formatNumber(seller.totalSales)} sales
                </span>
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
              {formatBDT(offer.price)}
            </span>
            {offer.originalPrice && (
              <>
                <span className="text-[13px] text-fg-subtle line-through">
                  {formatBDT(offer.originalPrice)}
                </span>
                <Badge variant="danger">-{discount}%</Badge>
              </>
            )}
          </div>
          <OfferMeta offer={offer} className="mt-2" />
        </div>

        <div className="flex flex-wrap items-center gap-2 md:col-span-4 md:justify-end">
          <ButtonLink href="/checkout" size="lg" className="min-w-[140px] flex-1 md:flex-none">
            <ShoppingCart size={15} /> Buy now
          </ButtonLink>
          <Link
            href={`/seller/${seller.id}`}
            className="glass-pill inline-flex h-12 items-center gap-1.5 rounded-lg px-4 text-[13px] font-medium text-fg-muted transition hover:text-fg"
          >
            <MessageCircle size={14} /> Chat
          </Link>
        </div>
      </div>

      <PaymentRow payments={offer.payments} className="mt-4" />
    </div>
  );
}

function OfferRow({ offer, isBest }: { offer: SellerOffer; isBest: boolean }) {
  const seller = getSeller(offer.sellerId);
  if (!seller) return null;
  const discount = offer.originalPrice
    ? discountPercent(offer.originalPrice, offer.price)
    : 0;

  return (
    <li className="grid items-center gap-4 px-5 py-4 transition hover:bg-white/[0.02] md:grid-cols-12 md:px-7 md:py-5">
      {/* Seller */}
      <div className="md:col-span-4">
        <Link
          href={`/seller/${seller.id}`}
          className="group flex items-center gap-3"
        >
          <div
            className={cn(
              "grid h-11 w-11 shrink-0 place-items-center rounded-xl bg-gradient-to-br font-display text-base font-bold text-white",
              seller.avatarColor,
            )}
          >
            {seller.displayName[0]}
          </div>
          <div className="min-w-0 flex-1">
            <div className="flex flex-wrap items-center gap-1.5">
              <span className="truncate text-[14px] font-semibold text-fg group-hover:text-white">
                {seller.displayName}
              </span>
              {seller.verified && <Award size={13} className="text-iris-300" />}
              {isBest && (
                <span className="inline-flex items-center gap-1 rounded-md bg-iris-500/15 px-1.5 py-0.5 text-[10px] font-bold uppercase tracking-wider text-iris-200">
                  <Crown size={10} /> Best
                </span>
              )}
            </div>
            <div className="mt-0.5 flex items-center gap-2 text-[12px] text-fg-subtle">
              <RatingStars rating={seller.rating} size={11} />
              <span>{seller.rating.toFixed(2)}</span>
              <span>·</span>
              <span>{formatNumber(seller.totalSales)} sales</span>
            </div>
          </div>
        </Link>
      </div>

      {/* Meta */}
      <div className="md:col-span-4">
        <OfferMeta offer={offer} />
        <PaymentRow payments={offer.payments} className="mt-2" compact />
      </div>

      {/* Price */}
      <div className="md:col-span-2">
        <div className="flex flex-wrap items-baseline gap-2 md:flex-col md:items-start md:gap-1">
          <span className="text-xl font-bold text-fg">{formatBDT(offer.price)}</span>
          {offer.originalPrice && (
            <span className="inline-flex items-center gap-1.5">
              <span className="text-[12px] text-fg-subtle line-through">
                {formatBDT(offer.originalPrice)}
              </span>
              {discount > 0 && (
                <span className="rounded-md bg-danger/15 px-1.5 py-0.5 text-[11px] font-bold text-danger">
                  -{discount}%
                </span>
              )}
            </span>
          )}
        </div>
        <div className="mt-1 text-[11px] text-fg-subtle">
          Stock: {offer.stock > 99 ? "99+" : offer.stock}
        </div>
      </div>

      {/* CTA */}
      <div className="flex items-center gap-2 md:col-span-2 md:justify-end">
        <ButtonLink
          href="/checkout"
          variant={isBest ? "primary" : "secondary"}
          size="md"
          className="flex-1 md:flex-none"
        >
          Buy
        </ButtonLink>
      </div>
    </li>
  );
}

function OfferMeta({ offer, className }: { offer: SellerOffer; className?: string }) {
  return (
    <div className={cn("flex flex-wrap items-center gap-x-3 gap-y-1 text-[12px] text-fg-muted", className)}>
      <span className="inline-flex items-center gap-1">
        <Clock size={12} className="text-iris-300" />
        {deliveryLabel(offer.delivery)}
      </span>
      <span className="text-fg-subtle">·</span>
      <span className="inline-flex items-center gap-1">
        <Globe size={12} className="text-cyan-400" />
        {regionLabel(offer.region)}
      </span>
      <span className="text-fg-subtle">·</span>
      <span className="inline-flex items-center gap-1">
        <Shield size={12} className="text-success" />
        {offer.warranty} warranty
      </span>
    </div>
  );
}

function PaymentRow({
  payments,
  className,
  compact = false,
}: {
  payments: SellerOffer["payments"];
  className?: string;
  compact?: boolean;
}) {
  return (
    <div className={cn("flex flex-wrap items-center gap-1.5", className)}>
      {!compact && (
        <span className="text-[11px] text-fg-subtle">Pay with:</span>
      )}
      {payments.map((p) => {
        const m = PAYMENT_STYLE[p];
        if (!m) return null;
        return (
          <span
            key={p}
            title={m.label}
            className={cn(
              "inline-flex items-center justify-center rounded-md font-bold tracking-tight text-white",
              m.bg,
              compact ? "h-5 min-w-9 px-1.5 text-[10px]" : "h-6 min-w-11 px-2 text-[10.5px]",
            )}
          >
            {m.label}
          </span>
        );
      })}
    </div>
  );
}
