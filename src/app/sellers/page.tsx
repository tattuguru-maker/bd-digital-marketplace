import Link from "next/link";
import { Award, MapPin } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { RatingStars } from "@/components/marketplace/rating-stars";
import { Breadcrumb } from "@/app/browse/page";
import { sellers, productsBySeller } from "@/lib/data";
import { formatNumber } from "@/lib/utils";

export const metadata = { title: "All sellers · Digibazar" };

export default function SellersPage() {
  return (
    <div className="container-page py-8">
      <Breadcrumb items={[{ label: "Home", href: "/" }, { label: "Sellers" }]} />
      <div className="mt-3 flex flex-wrap items-end justify-between gap-3">
        <div>
          <h1 className="font-display text-3xl font-bold md:text-4xl">Verified sellers</h1>
          <p className="mt-1 text-sm text-fg-muted">
            {sellers.length} top-rated sellers across Bangladesh
          </p>
        </div>
        <Link href="/sell" className="text-sm text-iris-200 hover:text-iris-100">
          Become a seller →
        </Link>
      </div>

      <div className="mt-6 grid gap-3 md:grid-cols-2 lg:grid-cols-3">
        {sellers.map((s) => {
          const items = productsBySeller(s.id);
          return (
            <Link
              key={s.id}
              href={`/seller/${s.id}`}
              className="surface-card group block overflow-hidden transition hover:border-iris-400/40"
            >
              <div className={`relative h-24 bg-gradient-to-br ${s.cover}`}>
                <div className="absolute inset-0 bg-[radial-gradient(60%_60%_at_30%_-20%,rgba(255,255,255,0.25),transparent_60%)]" />
              </div>
              <div className="-mt-8 px-5 pb-5">
                <div className={`grid h-14 w-14 place-items-center rounded-xl border-2 border-bg-elev bg-gradient-to-br ${s.avatarColor} font-display text-xl font-extrabold text-white`}>
                  {s.displayName[0]}
                </div>
                <div className="mt-3 flex items-center gap-1.5">
                  <span className="font-semibold">{s.displayName}</span>
                  {s.verified && <Award size={14} className="text-iris-300" />}
                  {s.topRated && <Badge variant="gold">★ Top</Badge>}
                </div>
                <div className="text-[11.5px] text-fg-subtle inline-flex items-center gap-1">
                  <MapPin size={11} /> {s.location}
                </div>
                <div className="mt-2 flex items-center gap-2">
                  <RatingStars rating={s.rating} size={12} />
                  <span className="text-[12px] text-fg-muted">
                    {s.rating.toFixed(2)} · {formatNumber(s.totalSales)} sales
                  </span>
                </div>
                <p className="mt-3 line-clamp-2 text-[12.5px] text-fg-muted">{s.bio}</p>
                <div className="mt-3 flex items-center justify-between text-[11.5px]">
                  <span className="text-fg-subtle">{items.length} listings</span>
                  <span className="text-iris-200 group-hover:text-iris-100">Visit store →</span>
                </div>
              </div>
            </Link>
          );
        })}
      </div>
    </div>
  );
}
