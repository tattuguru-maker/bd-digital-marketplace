import Link from "next/link";
import {
  Search,
  Heart,
  ShoppingCart,
  User,
  Bell,
  ChevronDown,
  Store,
  Headphones,
} from "lucide-react";
import { Logo } from "@/components/site/logo";
import { Badge } from "@/components/ui/badge";
import { ButtonLink } from "@/components/ui/button";
import { categories } from "@/lib/data";

export function Header() {
  return (
    <header className="sticky top-0 z-40 border-b border-white/5 bg-bg/70 backdrop-blur-xl">
      <div className="container-page flex h-16 items-center gap-4">
        <Logo />

        <nav className="hidden items-center gap-1 lg:flex">
          <HeaderDropdown label="Browse" items={categories.map((c) => ({ label: c.name, href: `/category/${c.slug}`, emoji: c.emoji }))} />
          <Link href="/category/game-topup" className="px-3 py-2 text-sm text-fg-muted hover:text-fg">
            Game Top-ups
          </Link>
          <Link href="/category/streaming" className="px-3 py-2 text-sm text-fg-muted hover:text-fg">
            Streaming
          </Link>
          <Link href="/category/cd-keys" className="px-3 py-2 text-sm text-fg-muted hover:text-fg">
            CD Keys
          </Link>
          <Link href="/sell" className="px-3 py-2 text-sm text-fg-muted hover:text-fg">
            Sell
          </Link>
        </nav>

        {/* Search */}
        <div className="hidden flex-1 justify-center md:flex">
          <form action="/search" className="relative w-full max-w-xl">
            <input
              name="q"
              placeholder="Search Netflix, Free Fire, Steam keys..."
              className="h-10 w-full rounded-full border border-white/10 bg-white/[0.04] pl-10 pr-24 text-sm text-fg placeholder:text-fg-subtle focus:border-iris-400/50 focus:bg-white/[0.06] focus:outline-none"
            />
            <Search
              size={16}
              className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 text-fg-subtle"
            />
            <kbd className="absolute right-2 top-1/2 hidden -translate-y-1/2 rounded-md border border-white/10 bg-white/5 px-1.5 py-0.5 text-[10px] text-fg-subtle md:inline-block">
              ⌘ K
            </kbd>
          </form>
        </div>

        <div className="ml-auto flex items-center gap-1">
          <Link
            href="/wishlist"
            className="hidden h-10 w-10 place-items-center rounded-full text-fg-muted hover:bg-white/5 hover:text-fg sm:grid"
            aria-label="Wishlist"
          >
            <Heart size={18} />
          </Link>
          <Link
            href="/notifications"
            className="hidden h-10 w-10 place-items-center rounded-full text-fg-muted hover:bg-white/5 hover:text-fg sm:grid"
            aria-label="Notifications"
          >
            <Bell size={18} />
          </Link>
          <Link
            href="/cart"
            aria-label="Cart"
            className="relative grid h-10 w-10 place-items-center rounded-full text-fg hover:bg-white/5"
          >
            <ShoppingCart size={18} />
            <span className="absolute -right-0.5 -top-0.5 grid h-4 min-w-4 place-items-center rounded-full bg-iris-500 px-1 text-[10px] font-bold text-white">
              3
            </span>
          </Link>

          <div className="mx-1 hidden h-6 w-px bg-white/10 sm:block" />

          <Link
            href="/login"
            className="hidden h-9 items-center rounded-full px-3 text-[13px] text-fg-muted hover:bg-white/5 hover:text-fg sm:inline-flex"
          >
            <User size={15} className="mr-1.5" />
            Sign in
          </Link>

          <ButtonLink href="/sell" variant="gold" size="sm" className="hidden sm:inline-flex">
            <Store size={14} /> Become a Seller
          </ButtonLink>
        </div>
      </div>

      {/* Sub-nav row */}
      <div className="border-t border-white/5 bg-bg-elev/40">
        <div className="container-page flex h-10 items-center gap-5 overflow-x-auto text-[12.5px] text-fg-muted">
          <span className="inline-flex items-center gap-1 text-fg">
            <span className="grid h-1.5 w-1.5 animate-pulse rounded-full bg-success" />
            All systems operational
          </span>
          <Link href="/buyer-protection" className="hover:text-fg whitespace-nowrap">Buyer Protection</Link>
          <Link href="/how-it-works" className="hover:text-fg whitespace-nowrap">How it works</Link>
          <Link href="/sell" className="hover:text-fg whitespace-nowrap">For sellers</Link>
          <Link href="/support" className="hover:text-fg inline-flex items-center gap-1 whitespace-nowrap">
            <Headphones size={12} /> 24/7 Support
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

function HeaderDropdown({
  label,
  items,
}: {
  label: string;
  items: { label: string; href: string; emoji: string }[];
}) {
  return (
    <div className="group relative">
      <button
        type="button"
        className="inline-flex items-center gap-1 rounded-md px-3 py-2 text-sm text-fg-muted hover:text-fg"
      >
        {label}
        <ChevronDown size={14} className="transition group-hover:rotate-180" />
      </button>
      <div className="invisible absolute left-0 top-full w-[280px] -translate-y-1 rounded-xl border border-white/10 bg-bg-elev/95 p-2 opacity-0 shadow-2xl backdrop-blur-xl transition-all duration-150 group-hover:visible group-hover:translate-y-0 group-hover:opacity-100">
        {items.map((it) => (
          <Link
            key={it.href}
            href={it.href}
            className="flex items-center gap-3 rounded-lg px-3 py-2 text-sm text-fg-muted hover:bg-white/5 hover:text-fg"
          >
            <span className="text-lg">{it.emoji}</span>
            <span>{it.label}</span>
          </Link>
        ))}
      </div>
    </div>
  );
}
