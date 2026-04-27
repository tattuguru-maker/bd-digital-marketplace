import { notFound } from "next/navigation";
import { Award, MapPin, Clock, Calendar, MessageCircle, Heart, ShieldCheck, Zap } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button, ButtonLink } from "@/components/ui/button";
import { ProductCard } from "@/components/marketplace/product-card";
import { RatingStars } from "@/components/marketplace/rating-stars";
import { Breadcrumb } from "@/components/marketplace/breadcrumb";
import { getSeller, productsBySeller, sellers } from "@/lib/data";
import { formatNumber, timeAgo } from "@/lib/utils";

export default async function SellerPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const seller = getSeller(id);
  if (!seller) return notFound();

  const items = productsBySeller(seller.id);
  const stats = [
    { v: formatNumber(seller.totalSales),    l: "Lifetime sales" },
    { v: formatNumber(seller.totalReviews),  l: "Reviews" },
    { v: seller.rating.toFixed(2) + " ★",    l: "Avg. rating" },
    { v: seller.responseTime,                l: "Response time" },
  ];

  return (
    <div>
      {/* Cover */}
      <div className={`relative h-44 overflow-hidden md:h-56 bg-gradient-to-br ${seller.cover}`}>
        <div className="absolute inset-0 bg-[radial-gradient(70%_50%_at_30%_-10%,rgba(255,255,255,0.18),transparent_60%)]" />
        <div className="absolute inset-0 bg-[radial-gradient(80%_60%_at_85%_120%,rgba(0,0,0,0.6),transparent_60%)]" />
        <svg className="absolute inset-0 h-full w-full opacity-[0.06]" xmlns="http://www.w3.org/2000/svg">
          <defs>
            <pattern id="cover-grid" width="22" height="22" patternUnits="userSpaceOnUse">
              <path d="M 22 0 L 0 0 0 22" fill="none" stroke="white" strokeWidth="0.5" />
            </pattern>
          </defs>
          <rect width="100%" height="100%" fill="url(#cover-grid)" />
        </svg>
      </div>

      <div className="container-page -mt-16 pb-12">
        <div className="surface-card p-5 md:p-6">
          <div className="flex flex-col items-start gap-5 md:flex-row md:items-center md:gap-6">
            <div className={`grid h-20 w-20 shrink-0 place-items-center rounded-2xl border-4 border-bg-elev bg-gradient-to-br ${seller.avatarColor} font-display text-3xl font-extrabold text-white`}>
              {seller.displayName[0]}
            </div>
            <div className="min-w-0 flex-1">
              <div className="flex flex-wrap items-center gap-2">
                <h1 className="font-display text-2xl font-bold">{seller.displayName}</h1>
                {seller.verified && (
                  <Badge variant="brand"><Award size={11} /> Verified</Badge>
                )}
                {seller.topRated && <Badge variant="gold">★ Top Rated</Badge>}
              </div>
              <div className="mt-1 flex flex-wrap items-center gap-3 text-[12.5px] text-fg-subtle">
                <span>@{seller.handle}</span>
                <span className="inline-flex items-center gap-1"><MapPin size={12} /> {seller.location}</span>
                <span className="inline-flex items-center gap-1"><Calendar size={12} /> Joined {timeAgo(seller.joined)}</span>
                <span className="inline-flex items-center gap-1"><Clock size={12} /> {seller.responseTime}</span>
              </div>
              <div className="mt-2 flex items-center gap-2">
                <RatingStars rating={seller.rating} size={13} />
                <span className="text-[13px] font-medium text-fg-muted">
                  {seller.rating.toFixed(2)} · {formatNumber(seller.totalReviews)} reviews
                </span>
              </div>
              <p className="mt-3 max-w-2xl text-sm text-fg-muted">{seller.bio}</p>
              <div className="mt-3 flex flex-wrap gap-1.5">
                {seller.badges.map((b) => (
                  <Badge key={b} variant="brand">{b}</Badge>
                ))}
              </div>
            </div>

            <div className="flex w-full flex-wrap items-center gap-2 md:w-auto md:flex-col md:items-stretch">
              <Button size="md" className="w-full md:w-auto">
                <MessageCircle size={14} /> Chat with seller
              </Button>
              <Button variant="secondary" size="md" className="w-full md:w-auto">
                <Heart size={14} /> Follow
              </Button>
            </div>
          </div>

          <div className="mt-6 grid grid-cols-2 gap-3 border-t border-white/5 pt-5 md:grid-cols-4">
            {stats.map((s) => (
              <div key={s.l} className="rounded-xl border border-white/5 bg-white/[0.03] p-4">
                <div className="font-display text-2xl font-bold">{s.v}</div>
                <div className="mt-0.5 text-[11.5px] text-fg-subtle">{s.l}</div>
              </div>
            ))}
          </div>
        </div>

        <Breadcrumb className="mt-6" items={[{ label: "Home", href: "/" }, { label: "Sellers", href: "/sellers" }, { label: seller.displayName }]} />

        <div className="mt-6 flex flex-wrap items-center gap-2 border-b border-white/5">
          {[`Listings (${items.length})`, "Reviews", "Policies", "About"].map((t, i) => (
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

        <div className="mt-6 grid gap-6 lg:grid-cols-12">
          <aside className="lg:col-span-3">
            <div className="surface-card p-5">
              <h3 className="font-display text-base font-bold">Why buy from this seller</h3>
              <ul className="mt-3 space-y-2.5 text-[13px] text-fg-muted">
                <li className="flex items-start gap-2"><Zap size={14} className="mt-0.5 text-iris-300" /> Most orders delivered in {seller.responseTime.toLowerCase()}.</li>
                <li className="flex items-start gap-2"><ShieldCheck size={14} className="mt-0.5 text-success" /> 30-day replacement guarantee on every order.</li>
                <li className="flex items-start gap-2"><Award size={14} className="mt-0.5 text-gold-400" /> {seller.totalReviews}+ verified buyer reviews.</li>
                <li className="flex items-start gap-2"><MapPin size={14} className="mt-0.5 text-cyan-400" /> Based in {seller.location.split(",")[0]}, BD-based support.</li>
              </ul>
              <ButtonLink href={`/sell`} variant="outline" size="sm" className="mt-4 w-full">
                Compare sellers
              </ButtonLink>
            </div>
          </aside>
          <div className="lg:col-span-9">
            <div className="grid grid-cols-2 gap-3 md:grid-cols-3">
              {items.map((p) => (
                <ProductCard key={p.id} product={p} />
              ))}
            </div>
            {items.length === 0 && (
              <div className="surface-card p-10 text-center text-sm text-fg-muted">
                This seller hasn&apos;t listed any products yet.
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export function generateStaticParams() {
  return sellers.map((s) => ({ id: s.id }));
}
