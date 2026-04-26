import Link from "next/link";
import {
  ArrowRight,
  Zap,
  ShieldCheck,
  Wallet,
  Sparkles,
  Headphones,
  Star,
  TrendingUp,
  CheckCircle2,
  Clock,
  Users,
  Award,
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { ButtonLink } from "@/components/ui/button";
import { ProductCard } from "@/components/marketplace/product-card";
import { CategoryCard } from "@/components/marketplace/category-card";
import { ProductArt } from "@/components/marketplace/product-art";
import { RatingStars } from "@/components/marketplace/rating-stars";
import { PaymentMethods } from "@/components/marketplace/payment-methods";
import { categories, products, sellers } from "@/lib/data";
import { formatNumber } from "@/lib/utils";

export default function HomePage() {
  const trending  = products.slice(0, 8);
  const flashDeals = products.filter((p) => p.originalPrice).slice(0, 4);
  const newArrivals = products.slice().reverse().slice(0, 4);
  const topSellers = sellers.slice(0, 4);

  return (
    <>
      {/* HERO */}
      <section className="relative isolate overflow-hidden">
        {/* glowing orbs */}
        <div aria-hidden className="pointer-events-none absolute -top-40 -right-32 h-[420px] w-[420px] rounded-full bg-iris-600/30 blur-[140px]" />
        <div aria-hidden className="pointer-events-none absolute -bottom-32 -left-32 h-[360px] w-[360px] rounded-full bg-cyan-500/20 blur-[120px]" />

        <div className="container-page py-14 md:py-20">
          <div className="grid items-center gap-12 lg:grid-cols-12">
            <div className="lg:col-span-7">
              <div className="inline-flex items-center gap-2 rounded-full border border-iris-400/30 bg-iris-500/10 px-3 py-1 text-[12px] font-medium text-iris-200">
                <span className="grid h-1.5 w-1.5 animate-pulse rounded-full bg-success" />
                Bangladesh&apos;s premium digital marketplace
              </div>

              <h1 className="mt-5 font-display text-4xl font-extrabold leading-[1.05] tracking-tight md:text-6xl">
                Subscriptions, game top-ups <br />
                <span className="gradient-text">delivered in seconds.</span>
              </h1>

              <p className="mt-5 max-w-xl text-base leading-relaxed text-fg-muted md:text-lg">
                The trusted home of Bangladesh&apos;s digital sellers.
                Netflix, Free Fire diamonds, Steam keys, ChatGPT Plus, gift cards
                and more — paid with bKash, Nagad or Rocket. Buyer protection on every order.
              </p>

              <div className="mt-7 flex flex-wrap items-center gap-3">
                <ButtonLink href="/browse" size="lg">
                  Start shopping <ArrowRight size={16} />
                </ButtonLink>
                <ButtonLink href="/sell" variant="gold" size="lg">
                  Become a seller — 0% fees
                </ButtonLink>
              </div>

              <div className="mt-8 grid grid-cols-2 gap-x-6 gap-y-4 sm:grid-cols-4">
                <Stat icon={<Zap className="text-iris-300" size={16} />} value="2 min" label="avg. delivery" />
                <Stat icon={<ShieldCheck className="text-success" size={16} />} value="100%" label="buyer protected" />
                <Stat icon={<Users className="text-cyan-400" size={16} />} value="62K+" label="orders / month" />
                <Stat icon={<Star className="text-gold-400" size={16} />} value="4.91" label="avg. rating" />
              </div>

              <div className="mt-8 flex flex-wrap items-center gap-3 text-[12.5px] text-fg-muted">
                <span>We accept</span>
                <PaymentMethods compact />
              </div>
            </div>

            {/* Hero card stack */}
            <div className="relative lg:col-span-5">
              <HeroCardStack />
            </div>
          </div>
        </div>

        {/* Trust bar */}
        <div className="border-y border-white/5 bg-bg-elev/40">
          <div className="container-page grid grid-cols-2 gap-y-4 py-5 md:grid-cols-4">
            <TrustItem icon={<Zap size={16} />} title="Instant delivery" sub="Most products under 5 mins" />
            <TrustItem icon={<ShieldCheck size={16} />} title="Buyer protection" sub="Refund if not delivered" />
            <TrustItem icon={<Wallet size={16} />} title="bKash · Nagad · Rocket" sub="Pay with what you have" />
            <TrustItem icon={<Headphones size={16} />} title="24/7 BD support" sub="Bangla & English" />
          </div>
        </div>
      </section>

      {/* CATEGORIES */}
      <section className="container-page mt-16">
        <SectionHeader
          eyebrow="Browse by category"
          title="Find what you need, fast"
          subtitle="Subscriptions, top-ups, keys, software, gift cards — all in one place."
          link={{ label: "All categories", href: "/browse" }}
        />
        <div className="mt-6 grid grid-cols-2 gap-3 md:grid-cols-3 lg:grid-cols-5">
          {categories.slice(0, 5).map((c) => (
            <CategoryCard key={c.slug} category={c} />
          ))}
        </div>
        <div className="mt-3 grid grid-cols-2 gap-3 md:grid-cols-4">
          {categories.slice(5).map((c) => (
            <CategoryCard key={c.slug} category={c} />
          ))}
        </div>
      </section>

      {/* FLASH DEALS */}
      <section className="container-page mt-20">
        <div className="surface-card relative overflow-hidden p-6 md:p-8">
          <div aria-hidden className="absolute -right-20 -top-20 h-72 w-72 rounded-full bg-iris-500/30 blur-3xl" />
          <div aria-hidden className="absolute -left-20 bottom-0 h-72 w-72 rounded-full bg-cyan-500/20 blur-3xl" />
          <div className="relative flex flex-wrap items-end justify-between gap-4">
            <div>
              <Badge variant="danger">🔥 FLASH DEALS</Badge>
              <h2 className="mt-3 font-display text-2xl font-bold md:text-3xl">
                Up to 90% off · ends in 04:23:11
              </h2>
              <p className="mt-1 max-w-xl text-sm text-fg-muted">
                Hand-picked by our top-rated sellers. Limited stock, real prices, full buyer protection.
              </p>
            </div>
            <Link href="/browse?sort=deals" className="text-sm text-iris-200 hover:text-iris-100">
              View all deals →
            </Link>
          </div>

          <div className="relative mt-6 grid grid-cols-2 gap-3 md:grid-cols-4">
            {flashDeals.map((p) => (
              <ProductCard key={p.id} product={p} />
            ))}
          </div>
        </div>
      </section>

      {/* TRENDING */}
      <section className="container-page mt-20">
        <SectionHeader
          eyebrow={
            <span className="inline-flex items-center gap-1.5">
              <TrendingUp size={13} className="text-iris-300" /> Trending in Bangladesh
            </span>
          }
          title="Best sellers this week"
          subtitle="Real-time bestsellers across every category."
          link={{ label: "Browse all", href: "/browse" }}
        />

        <div className="mt-6 grid grid-cols-2 gap-3 md:grid-cols-3 lg:grid-cols-4">
          {trending.map((p) => (
            <ProductCard key={p.id} product={p} />
          ))}
        </div>
      </section>

      {/* GAME TOP-UP CTA */}
      <section className="container-page mt-20">
        <div className="relative overflow-hidden rounded-2xl border border-white/10 bg-gradient-to-br from-amber-500/15 via-pink-500/10 to-iris-700/30 p-8 md:p-12">
          <div className="absolute inset-0 bg-[radial-gradient(80%_50%_at_85%_10%,rgba(247,201,72,0.18),transparent_60%)]" />
          <div className="absolute inset-0 bg-[radial-gradient(60%_60%_at_15%_90%,rgba(91,61,255,0.25),transparent_60%)]" />
          <div className="relative grid items-center gap-8 lg:grid-cols-12">
            <div className="lg:col-span-7">
              <Badge variant="gold">⚡ Direct top-up</Badge>
              <h2 className="mt-3 font-display text-3xl font-bold md:text-4xl">
                Free Fire, PUBG, Mobile Legends — topped up in minutes.
              </h2>
              <p className="mt-3 max-w-xl text-sm text-fg-muted md:text-base">
                Just enter your in-game player ID. No login required, no risk to your account.
                Verified gaming sellers, lowest prices in BD, 24/7 support.
              </p>
              <div className="mt-5 flex flex-wrap gap-3">
                <ButtonLink href="/category/game-topup" size="lg">Top-up now</ButtonLink>
                <ButtonLink href="/how-it-works" variant="outline" size="lg">How it works</ButtonLink>
              </div>
            </div>
            <div className="lg:col-span-5">
              <div className="grid grid-cols-2 gap-3">
                {products.filter(p => p.category === "game-topup").slice(0, 4).map((p) => (
                  <Link
                    key={p.id}
                    href={`/product/${p.slug}`}
                    className="group surface-card p-3 transition hover:border-iris-400/40"
                  >
                    <ProductArt
                      brandColor={p.brandColor}
                      brandLabel={p.brandLabel}
                      className="aspect-square w-full"
                      rounded="rounded-md"
                      size="sm"
                    />
                    <div className="mt-2 line-clamp-1 text-[12px] font-medium">{p.name}</div>
                    <div className="text-[12px] font-bold text-iris-200">৳{p.price}</div>
                  </Link>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* TOP SELLERS */}
      <section className="container-page mt-20">
        <SectionHeader
          eyebrow="From verified sellers"
          title="Top-rated sellers in Bangladesh"
          subtitle="Bring your Facebook page customers — keep your reputation, multiply your reach."
          link={{ label: "All sellers", href: "/sellers" }}
        />
        <div className="mt-6 grid gap-3 md:grid-cols-2 lg:grid-cols-4">
          {topSellers.map((s) => (
            <Link
              key={s.id}
              href={`/seller/${s.id}`}
              className="surface-card group block overflow-hidden transition hover:border-iris-400/40"
            >
              <div className={`relative h-24 bg-gradient-to-br ${s.cover}`}>
                <div className="absolute inset-0 bg-[radial-gradient(60%_60%_at_30%_-20%,rgba(255,255,255,0.25),transparent_60%)]" />
              </div>
              <div className="-mt-8 px-4 pb-4">
                <div className={`grid h-14 w-14 place-items-center rounded-xl border-2 border-bg-elev bg-gradient-to-br ${s.avatarColor} text-lg font-display font-extrabold text-white`}>
                  {s.displayName[0]}
                </div>
                <div className="mt-3 flex items-center gap-1.5">
                  <span className="font-semibold">{s.displayName}</span>
                  {s.verified && <Award size={14} className="text-iris-300" />}
                </div>
                <div className="text-[11px] text-fg-subtle">@{s.handle} · {s.location.split(",")[0]}</div>
                <div className="mt-2 flex items-center gap-2">
                  <RatingStars rating={s.rating} size={12} />
                  <span className="text-[12px] font-medium text-fg-muted">
                    {s.rating.toFixed(2)} · {formatNumber(s.totalSales)} sales
                  </span>
                </div>
                <div className="mt-3 flex flex-wrap gap-1">
                  {s.badges.slice(0, 2).map((b) => (
                    <Badge key={b} variant="brand" className="!text-[10px]">{b}</Badge>
                  ))}
                </div>
              </div>
            </Link>
          ))}
        </div>
      </section>

      {/* WHY DIGIBAZAR */}
      <section className="container-page mt-20">
        <div className="grid gap-6 lg:grid-cols-3">
          <div className="surface-card p-6">
            <div className="mb-3 grid h-10 w-10 place-items-center rounded-lg bg-iris-500/15 text-iris-300">
              <Zap size={18} />
            </div>
            <h3 className="font-display text-lg font-bold">Built for instant delivery</h3>
            <p className="mt-1.5 text-sm text-fg-muted">
              Automated stock syncing, smart escrow and instant code release. Most orders complete
              before your kettle finishes boiling.
            </p>
          </div>
          <div className="surface-card p-6">
            <div className="mb-3 grid h-10 w-10 place-items-center rounded-lg bg-success/15 text-success">
              <ShieldCheck size={18} />
            </div>
            <h3 className="font-display text-lg font-bold">Buyer protection on every order</h3>
            <p className="mt-1.5 text-sm text-fg-muted">
              We hold the seller&apos;s payout until your product works. No delivery? Doesn&apos;t work?
              Full refund or replacement, no questions asked.
            </p>
          </div>
          <div className="surface-card p-6">
            <div className="mb-3 grid h-10 w-10 place-items-center rounded-lg bg-gold-400/15 text-gold-300">
              <Sparkles size={18} />
            </div>
            <h3 className="font-display text-lg font-bold">0% fees during onboarding</h3>
            <p className="mt-1.5 text-sm text-fg-muted">
              Migrating from Facebook? Keep 100% of your sale price during the entire onboarding phase.
              Build trust with buyers, grow your reputation, scale without friction.
            </p>
          </div>
        </div>
      </section>

      {/* HOW IT WORKS */}
      <section className="container-page mt-20">
        <SectionHeader
          eyebrow="How it works"
          title="From cart to delivery in 3 steps"
        />
        <div className="mt-8 grid gap-3 md:grid-cols-3">
          {[
            { icon: <CheckCircle2 size={18} />, t: "1. Choose your product", d: "Browse verified sellers, compare ratings, find the best deal." },
            { icon: <Wallet      size={18} />, t: "2. Pay your way",       d: "Pay with bKash, Nagad, Rocket, Upay or card. Funds held in escrow." },
            { icon: <Zap         size={18} />, t: "3. Get it instantly",   d: "Receive your code, account or top-up. Rate the seller. Done." },
          ].map((step) => (
            <div key={step.t} className="surface-card p-6">
              <div className="grid h-10 w-10 place-items-center rounded-lg bg-iris-500/15 text-iris-300">
                {step.icon}
              </div>
              <h3 className="mt-3 font-display text-lg font-bold">{step.t}</h3>
              <p className="mt-1.5 text-sm text-fg-muted">{step.d}</p>
            </div>
          ))}
        </div>
      </section>

      {/* NEW ARRIVALS */}
      <section className="container-page mt-20">
        <SectionHeader
          eyebrow={<span className="inline-flex items-center gap-1.5"><Clock size={13} className="text-iris-300" /> Just listed</span>}
          title="New arrivals"
          link={{ label: "See all", href: "/browse?sort=new" }}
        />
        <div className="mt-6 grid grid-cols-2 gap-3 md:grid-cols-3 lg:grid-cols-4">
          {newArrivals.map((p) => (
            <ProductCard key={p.id} product={p} />
          ))}
        </div>
      </section>

      {/* SELLER CTA */}
      <section className="container-page mt-20">
        <div className="relative overflow-hidden rounded-2xl border border-iris-400/30 brand-gradient p-8 md:p-12">
          <div className="absolute inset-0 bg-[radial-gradient(80%_60%_at_80%_-10%,rgba(255,255,255,0.18),transparent)]" />
          <div className="relative grid items-center gap-8 lg:grid-cols-2">
            <div>
              <Badge variant="gold">For sellers</Badge>
              <h2 className="mt-3 font-display text-3xl font-extrabold leading-tight md:text-4xl">
                Selling on Facebook?
                <br />
                <span className="text-gold-300">Bring your customers to Digibazar.</span>
              </h2>
              <p className="mt-3 max-w-xl text-iris-100/95">
                Replace Messenger DMs with a real storefront — listings, automated delivery,
                payments via bKash, escrow, and a built-in customer base. Zero transaction
                fees during the onboarding phase. We help you migrate.
              </p>
              <div className="mt-6 flex flex-wrap gap-3">
                <ButtonLink href="/sell" variant="gold" size="lg">Apply to sell</ButtonLink>
                <ButtonLink href="/dashboard" variant="secondary" size="lg" className="!bg-white/15 hover:!bg-white/20 !text-white">
                  See seller dashboard
                </ButtonLink>
              </div>
            </div>
            <div className="grid grid-cols-3 gap-3">
              {[
                { v: "0%",    l: "transaction fees" },
                { v: "62K+",  l: "monthly buyers"   },
                { v: "<5m",   l: "avg. delivery"    },
                { v: "24/7",  l: "BD-based support" },
                { v: "৳",     l: "BDT payouts"      },
                { v: "★4.91", l: "avg. seller rating" },
              ].map((s) => (
                <div key={s.l} className="rounded-xl border border-white/15 bg-white/10 p-4 text-white backdrop-blur">
                  <div className="font-display text-2xl font-bold">{s.v}</div>
                  <div className="text-[12px] text-white/80">{s.l}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>
    </>
  );
}

function Stat({ icon, value, label }: { icon: React.ReactNode; value: string; label: string }) {
  return (
    <div>
      <div className="flex items-center gap-1.5 text-fg-subtle">{icon}<span className="text-[11px] uppercase tracking-wider">{label}</span></div>
      <div className="font-display text-xl font-bold">{value}</div>
    </div>
  );
}

function TrustItem({ icon, title, sub }: { icon: React.ReactNode; title: string; sub: string }) {
  return (
    <div className="flex items-center gap-3">
      <div className="grid h-9 w-9 place-items-center rounded-lg bg-iris-500/15 text-iris-300">
        {icon}
      </div>
      <div>
        <div className="text-[13px] font-semibold">{title}</div>
        <div className="text-[11.5px] text-fg-subtle">{sub}</div>
      </div>
    </div>
  );
}

function SectionHeader({
  eyebrow,
  title,
  subtitle,
  link,
}: {
  eyebrow?: React.ReactNode;
  title: string;
  subtitle?: string;
  link?: { label: string; href: string };
}) {
  return (
    <div className="flex flex-wrap items-end justify-between gap-3">
      <div>
        {eyebrow && (
          <div className="text-[11px] font-semibold uppercase tracking-[0.18em] text-iris-300">
            {eyebrow}
          </div>
        )}
        <h2 className="mt-1 font-display text-2xl font-bold md:text-3xl">{title}</h2>
        {subtitle && <p className="mt-1 max-w-xl text-sm text-fg-muted">{subtitle}</p>}
      </div>
      {link && (
        <Link href={link.href} className="text-sm text-iris-200 hover:text-iris-100">
          {link.label} →
        </Link>
      )}
    </div>
  );
}

function HeroCardStack() {
  const featured = products[0]; // Netflix
  const game     = products[6]; // Free Fire
  const ai       = products[3]; // ChatGPT
  return (
    <div className="relative h-[440px] md:h-[480px]">
      <div className="absolute right-0 top-0 w-[280px] animate-float-slow rounded-2xl border border-white/10 bg-bg-elev/80 p-3 shadow-2xl backdrop-blur-xl">
        <ProductArt brandColor={featured.brandColor} brandLabel={featured.brandLabel} className="aspect-[4/3]" />
        <div className="mt-3 flex items-center justify-between px-1">
          <div>
            <div className="text-[12px] text-fg-muted">Netflix Premium · 1 month</div>
            <div className="text-lg font-bold">৳{featured.price}</div>
          </div>
          <Badge variant="gold">★ Best Seller</Badge>
        </div>
      </div>

      <div className="absolute left-2 top-32 w-[260px] rounded-2xl border border-white/10 bg-bg-elev/80 p-3 shadow-2xl backdrop-blur-xl">
        <ProductArt brandColor={game.brandColor} brandLabel={game.brandLabel} className="aspect-[16/9]" />
        <div className="mt-3 px-1">
          <div className="flex items-center gap-1.5 text-[11px] text-iris-200">
            <Zap size={11} className="fill-iris-300 text-iris-300" /> Instant top-up
          </div>
          <div className="text-sm font-semibold">Free Fire — 310 Diamonds</div>
          <div className="mt-1 flex items-baseline gap-1.5">
            <span className="text-base font-bold">৳{game.price}</span>
            <span className="text-[11px] text-fg-subtle line-through">৳{game.originalPrice}</span>
          </div>
        </div>
      </div>

      <div className="absolute bottom-0 right-6 w-[300px] rounded-2xl border border-iris-400/30 bg-bg-elev/85 p-4 shadow-2xl backdrop-blur-xl brand-glow">
        <div className="flex items-center gap-3">
          <ProductArt brandColor={ai.brandColor} brandLabel="AI" className="h-12 w-12" rounded="rounded-lg" size="sm" />
          <div className="flex-1">
            <div className="text-[11px] text-fg-subtle">Order #BD-10246</div>
            <div className="text-sm font-semibold">ChatGPT Plus delivered ✓</div>
          </div>
        </div>
        <div className="mt-3 flex items-center gap-2 rounded-lg bg-success/10 p-2 text-[12px] text-success">
          <CheckCircle2 size={14} /> Login emailed to you · 1m 42s
        </div>
        <div className="mt-2 text-[11px] text-fg-subtle">
          Buyer protection active for 30 days
        </div>
      </div>
    </div>
  );
}
