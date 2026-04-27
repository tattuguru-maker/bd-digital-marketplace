import Link from "next/link";
import {
  Search,
  Heart,
  ShoppingCart,
  Bell,
  ChevronDown,
  Store,
  Headphones,
} from "lucide-react";
import { Logo } from "@/components/site/logo";
import { Badge } from "@/components/ui/badge";
import { ButtonLink } from "@/components/ui/button";
import { categories } from "@/lib/data";
import { UserMenu } from "@/components/site/user-menu";

export async function Header() {
  return (
    <header className="sticky top-0 z-40 border-b border-white/5 bg-bg/70 backdrop-blur-xl">
      {/* Row 1 — Logo + Search + Account actions */}
      <div className="container-page flex h-20 items-center gap-5">
        <Logo />

        {/* Search */}
        <div className="hidden flex-1 justify-center md:flex">
          <form action="/search" className="relative w-full max-w-3xl">
            <input
              name="q"
              placeholder="Search Netflix, Free Fire, Steam keys..."
              className="h-12 w-full rounded-full border border-white/10 bg-white/[0.04] pl-12 pr-28 text-[15px] text-fg placeholder:text-fg-subtle focus:border-iris-400/50 focus:bg-white/[0.06] focus:outline-none"
            />
            <Search
              size={18}
              className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-fg-subtle"
            />
            <kbd className="absolute right-3 top-1/2 hidden -translate-y-1/2 rounded-md border border-white/10 bg-white/5 px-2 py-0.5 text-[11px] text-fg-subtle md:inline-block">
              ⌘ K
            </kbd>
          </form>
        </div>

        <div className="ml-auto flex items-center gap-1.5">
          <Link
            href="/wishlist"
            className="hidden h-11 w-11 place-items-center rounded-full text-fg-muted hover:bg-white/5 hover:text-fg sm:grid"
            aria-label="Wishlist"
          >
            <Heart size={20} />
          </Link>
          <Link
            href="/notifications"
            className="hidden h-11 w-11 place-items-center rounded-full text-fg-muted hover:bg-white/5 hover:text-fg sm:grid"
            aria-label="Notifications"
          >
            <Bell size={20} />
          </Link>
          <Link
            href="/cart"
            aria-label="Cart"
            className="relative grid h-11 w-11 place-items-center rounded-full text-fg hover:bg-white/5"
          >
            <ShoppingCart size={20} />
            <span className="absolute right-0.5 top-0.5 grid h-[18px] min-w-[18px] place-items-center rounded-full bg-iris-500 px-1 text-[10.5px] font-bold text-white">
              3
            </span>
          </Link>

          <div className="mx-1.5 hidden h-7 w-px bg-white/10 sm:block" />

          <UserMenu />

          <ButtonLink
            href="/sell"
            variant="gold"
            size="md"
            className="hidden sm:inline-flex"
          >
            <Store size={16} /> Become a Seller
          </ButtonLink>
        </div>
      </div>

      {/* Row 2 — Primary nav */}
      <div className="border-t border-white/5">
        <div className="container-page flex h-12 items-center gap-1 lg:h-14">
          <nav className="hidden flex-1 items-center gap-1 lg:flex">
            <BrowseMegaMenu />
            <NavLink href="/category/game-topup">Game Top-ups</NavLink>
            <NavLink href="/category/streaming">Streaming</NavLink>
            <NavLink href="/category/cd-keys">CD Keys</NavLink>
            <NavLink href="/category/gift-cards">Gift Cards</NavLink>
            <NavLink href="/category/ai-tools">AI Tools</NavLink>
            <NavLink href="/category/software">Software</NavLink>
            <NavLink href="/sell">Sell</NavLink>
          </nav>
          {/* Mobile fallback — show category list inline */}
          <nav className="flex flex-1 items-center gap-2 overflow-x-auto lg:hidden">
            <NavLink href="/browse">Browse</NavLink>
            <NavLink href="/category/game-topup">Game Top-ups</NavLink>
            <NavLink href="/category/streaming">Streaming</NavLink>
            <NavLink href="/category/cd-keys">CD Keys</NavLink>
            <NavLink href="/sell">Sell</NavLink>
          </nav>
        </div>
      </div>

      {/* Row 3 — Status / utility links */}
      <div className="border-t border-white/5 bg-bg-elev/40">
        <div className="container-page flex h-11 items-center gap-5 overflow-x-auto text-[13px] text-fg-muted">
          <span className="inline-flex items-center gap-1.5 text-fg">
            <span className="grid h-1.5 w-1.5 animate-pulse rounded-full bg-success" />
            All systems operational
          </span>
          <Link href="/buyer-protection" className="hover:text-fg whitespace-nowrap">Buyer Protection</Link>
          <Link href="/how-it-works" className="hover:text-fg whitespace-nowrap">How it works</Link>
          <Link href="/sell" className="hover:text-fg whitespace-nowrap">For sellers</Link>
          <Link href="/support" className="hover:text-fg inline-flex items-center gap-1 whitespace-nowrap">
            <Headphones size={13} /> 24/7 Support
          </Link>
          <span className="ml-auto hidden whitespace-nowrap md:inline-flex items-center gap-2">
            <Badge variant="brand">BDT</Badge>
            <span>Bangladesh · বাংলা</span>
          </span>
        </div>
      </div>
    </header>
  );
}

function NavLink({ href, children }: { href: string; children: React.ReactNode }) {
  return (
    <Link
      href={href}
      className="rounded-md px-4 py-2.5 text-[14.5px] font-medium text-fg-muted whitespace-nowrap transition hover:bg-white/5 hover:text-fg"
    >
      {children}
    </Link>
  );
}

function BrowseMegaMenu() {
  return (
    <div className="group relative">
      <button
        type="button"
        className="inline-flex items-center gap-1.5 rounded-md px-4 py-2.5 text-[14.5px] font-semibold text-fg transition hover:bg-white/5"
      >
        Browse all
        <ChevronDown size={15} className="transition group-hover:rotate-180" />
      </button>

      {/* Mega panel — wide, full-bleed within the page container */}
      <div
        className={[
          "invisible absolute left-0 top-full z-50 w-[min(960px,calc(100vw-3rem))] -translate-y-1 opacity-0",
          "rounded-2xl border border-white/10 bg-bg-elev/95 p-4 shadow-[0_30px_80px_-20px_rgba(0,0,0,0.6)] backdrop-blur-2xl",
          "transition-all duration-150 group-hover:visible group-hover:translate-y-0 group-hover:opacity-100",
        ].join(" ")}
      >
        <div className="flex items-center justify-between px-2 pb-3">
          <div>
            <div className="text-[11px] font-semibold uppercase tracking-[0.18em] text-iris-300">
              Categories
            </div>
            <div className="text-[15px] font-semibold text-fg">
              Browse the marketplace
            </div>
          </div>
          <Link
            href="/browse"
            className="glass-pill inline-flex h-9 items-center rounded-full px-4 text-[13px] font-medium text-fg-muted hover:text-fg"
          >
            See everything →
          </Link>
        </div>

        <div className="grid grid-cols-3 gap-2">
          {categories.map((c) => (
            <Link
              key={c.slug}
              href={`/category/${c.slug}`}
              className="group/item flex items-start gap-3 rounded-xl border border-transparent bg-white/[0.02] p-3 transition hover:border-iris-400/40 hover:bg-white/[0.05]"
            >
              <div className="grid h-11 w-11 shrink-0 place-items-center rounded-lg bg-gradient-to-br from-white/8 to-white/2 text-2xl">
                {c.emoji}
              </div>
              <div className="min-w-0 flex-1">
                <div className="flex items-center justify-between gap-2">
                  <span className="text-[14px] font-semibold text-fg group-hover/item:text-white">
                    {c.name}
                  </span>
                  <span className="text-[11px] text-fg-subtle">{c.count}</span>
                </div>
                <div className="mt-0.5 line-clamp-1 text-[12px] text-fg-muted">
                  {c.tagline}
                </div>
              </div>
            </Link>
          ))}
        </div>

        <div className="mt-3 flex items-center justify-between rounded-xl border border-iris-400/20 bg-iris-500/[0.06] px-4 py-3">
          <div className="flex items-center gap-3">
            <div className="grid h-9 w-9 place-items-center rounded-lg bg-iris-500/20 text-[18px]">
              ⚡
            </div>
            <div>
              <div className="text-[13.5px] font-semibold text-fg">
                Top up faster — direct to your player ID
              </div>
              <div className="text-[12px] text-fg-subtle">
                Free Fire, PUBG UC, Mobile Legends and more
              </div>
            </div>
          </div>
          <Link
            href="/category/game-topup"
            className="brand-gradient brand-glow inline-flex h-10 items-center rounded-lg border border-white/15 px-4 text-[13px] font-semibold text-white transition hover:brightness-110"
          >
            Top up now
          </Link>
        </div>
      </div>
    </div>
  );
}
