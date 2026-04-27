import { ProductCard } from "@/components/marketplace/product-card";
import { ProductRail } from "@/components/marketplace/product-rail";
import {
  HeroCarousel,
  type HeroSidePanel,
  type HeroSlide,
} from "@/components/marketplace/hero-carousel";
import {
  PromoBannerCard,
  type PromoBanner,
} from "@/components/marketplace/promo-banner";
import { PlatformPills } from "@/components/marketplace/platform-pills";
import { CategoryPills } from "@/components/marketplace/category-pills";
import { PricePills } from "@/components/marketplace/price-pills";
import { PlusBanner } from "@/components/marketplace/plus-banner";
import { Newsletter } from "@/components/marketplace/newsletter";
import { TrustStrip } from "@/components/marketplace/trust-strip";
import { products } from "@/lib/data";

const heroSlides: HeroSlide[] = [
  {
    id: "h1",
    eyebrow: "Flash Sale · Limited time",
    title: "Netflix Premium 4K",
    highlight: "from ৳220",
    subtitle:
      "Stream in Ultra HD on up to 4 devices. Instant email delivery, 30-day replacement guarantee.",
    cta: { label: "Buy now", href: "/product/netflix-premium-1-month" },
    secondaryCta: { label: "View deals", href: "/browse?sort=deals" },
    art: "from-[#7a0d12] via-[#e50914] to-[#ff5b66]",
    artLabel: "Netflix",
    accent: "fuchsia",
  },
  {
    id: "h2",
    eyebrow: "Direct top-up",
    title: "Free Fire Diamonds",
    highlight: "in under 5 minutes",
    subtitle:
      "Just enter your in-game player ID. No login required. 100% safe. Lowest BD prices.",
    cta: { label: "Top up now", href: "/category/game-topup" },
    secondaryCta: { label: "How it works", href: "/how-it-works" },
    art: "from-amber-600 via-orange-500 to-pink-500",
    artLabel: "Free Fire",
    accent: "amber",
  },
  {
    id: "h3",
    eyebrow: "AI bundles",
    title: "ChatGPT Plus",
    highlight: "for Bangladesh",
    subtitle:
      "Personal & shared plans, paid in BDT. bKash, Nagad and Rocket accepted. Replacement included.",
    cta: { label: "Explore AI", href: "/category/ai-tools" },
    secondaryCta: { label: "All categories", href: "/browse" },
    art: "from-[#0a4a3f] via-[#10a37f] to-[#4ee0ba]",
    artLabel: "ChatGPT",
    accent: "emerald",
  },
];

const heroSidePanels: HeroSidePanel[] = [
  {
    id: "sp1",
    title: "PlayStation Store",
    subtitle: "PSN gift cards & PS Plus subscriptions",
    href: "/category/gift-cards?platform=psn",
    art: "from-[#003791] via-[#0070d1] to-[#3ba0ff]",
    badge: "PSN",
    ctaLabel: "Shop PSN",
  },
  {
    id: "sp2",
    title: "Random Mystery Key",
    subtitle: "AAA Steam games for under ৳200",
    href: "/browse?sort=mystery",
    art: "from-iris-700 via-iris-500 to-cyan-500",
    badge: "Mystery",
    ctaLabel: "Try your luck",
  },
];

const promoBanners: PromoBanner[] = [
  {
    title: "Roblox 200 Robux",
    subtitle: "Cheapest in Bangladesh — instant delivery",
    href: "/category/game-topup?platform=roblox",
    art: "from-[#1e1e1e] via-[#3a3a3a] to-[#e2231a]",
    artLabel: "Roblox",
    badge: "🔥 Hot",
    badgeVariant: "danger",
  },
  {
    title: "Random Game Key",
    subtitle: "Mystery Steam keys from ৳89",
    href: "/browse?sort=mystery",
    art: "from-iris-700 via-fuchsia-500 to-amber-400",
    artLabel: "Mystery",
    badge: "Surprise",
    badgeVariant: "brand",
  },
  {
    title: "Xbox Game Pass",
    subtitle: "1 / 3 / 12 month subscriptions",
    href: "/category/gift-cards?platform=xbox",
    art: "from-[#0e7a0d] via-[#107c10] to-[#5fce5f]",
    artLabel: "Xbox",
    badge: "Subscription",
    badgeVariant: "success",
  },
];

export default function HomePage() {
  const recommended  = products.slice(0, 10);
  const bestSelling  = products.slice(2, 12);
  const giftCards    = products.filter((p) => p.category === "gift-cards");
  const gameTopups   = products.filter((p) => p.category === "game-topup");
  const subscriptions = products.filter(
    (p) => p.category === "streaming" || p.category === "ai-tools",
  );

  return (
    <div className="space-y-14 pb-20 md:space-y-16">
      {/* HERO */}
      <HeroCarousel slides={heroSlides} sidePanels={heroSidePanels} />

      {/* PROMO BANNER ROW */}
      <section className="container-page">
        <div className="grid gap-3 md:grid-cols-3">
          {promoBanners.map((b) => (
            <PromoBannerCard key={b.title} banner={b} />
          ))}
        </div>
      </section>

      {/* RECOMMENDED FOR YOU */}
      <ProductRail
        eyebrow="For you"
        title="Recommended for you"
        link={{ label: "See all", href: "/browse" }}
      >
        {recommended.map((p) => (
          <ProductCard key={p.id} product={p} />
        ))}
      </ProductRail>

      {/* EXPLORE BY PLATFORMS */}
      <section className="container-page">
        <div className="mb-5">
          <div className="text-[11px] font-semibold uppercase tracking-[0.18em] text-iris-300">
            Shortcuts
          </div>
          <h2 className="mt-1 font-display text-xl font-bold md:text-2xl">
            Explore by platform
          </h2>
        </div>
        <PlatformPills />
      </section>

      {/* BEST SELLING THIS WEEK */}
      <ProductRail
        eyebrow="Trending in BD"
        title="Best selling this week"
        link={{ label: "Browse all", href: "/browse?sort=trending" }}
      >
        {bestSelling.map((p) => (
          <ProductCard key={p.id} product={p} />
        ))}
      </ProductRail>

      {/* DIGIBAZAR PLUS */}
      <section className="container-page">
        <PlusBanner />
      </section>

      {/* BEST SELLING GIFT CARDS */}
      {giftCards.length > 0 && (
        <ProductRail
          eyebrow="Top picks"
          title="Best selling gift cards"
          link={{ label: "All gift cards", href: "/category/gift-cards" }}
        >
          {giftCards.map((p) => (
            <ProductCard key={p.id} product={p} />
          ))}
        </ProductRail>
      )}

      {/* DISCOVER BY CATEGORY */}
      <section className="container-page">
        <div className="mb-5 flex flex-wrap items-end justify-between gap-3">
          <div>
            <div className="text-[11px] font-semibold uppercase tracking-[0.18em] text-iris-300">
              Browse
            </div>
            <h2 className="mt-1 font-display text-xl font-bold md:text-2xl">
              Discover by category
            </h2>
          </div>
        </div>
        <CategoryPills />
      </section>

      {/* BEST SELLING GAME TOP-UPS */}
      {gameTopups.length > 0 && (
        <ProductRail
          eyebrow="Direct top-up"
          title="Best selling game top-ups"
          link={{ label: "All top-ups", href: "/category/game-topup" }}
          itemWidthClass="w-[160px] sm:w-[180px] md:w-[200px]"
        >
          {gameTopups.map((p) => (
            <ProductCard key={p.id} product={p} />
          ))}
        </ProductRail>
      )}

      {/* DISCOVER BY PRICE */}
      <section className="container-page">
        <div className="mb-5">
          <div className="text-[11px] font-semibold uppercase tracking-[0.18em] text-iris-300">
            Find a deal
          </div>
          <h2 className="mt-1 font-display text-xl font-bold md:text-2xl">
            Discover by price
          </h2>
        </div>
        <PricePills />
      </section>

      {/* NEWSLETTER */}
      <section className="container-page">
        <Newsletter />
      </section>

      {/* BEST SELLING SUBSCRIPTIONS */}
      {subscriptions.length > 0 && (
        <ProductRail
          eyebrow="Recurring favourites"
          title="Best selling subscriptions"
          link={{ label: "All subscriptions", href: "/category/streaming" }}
        >
          {subscriptions.map((p) => (
            <ProductCard key={p.id} product={p} />
          ))}
        </ProductRail>
      )}

      {/* TRUST STRIP */}
      <section className="container-page">
        <TrustStrip />
      </section>
    </div>
  );
}
