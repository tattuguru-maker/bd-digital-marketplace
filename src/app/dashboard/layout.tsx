import Link from "next/link";
import {
  LayoutDashboard, Package, ShoppingBag, Users, Wallet, Settings, MessageCircle, Bell,
  TrendingUp, BarChart3, BadgePercent,
} from "lucide-react";
import { Logo } from "@/components/site/logo";
import { Badge } from "@/components/ui/badge";

const items = [
  { href: "/dashboard",            label: "Overview",   icon: LayoutDashboard },
  { href: "/dashboard/listings",   label: "Listings",   icon: Package },
  { href: "/dashboard/orders",     label: "Orders",     icon: ShoppingBag },
  { href: "/dashboard/customers",  label: "Customers",  icon: Users },
  { href: "/dashboard/payouts",    label: "Payouts",    icon: Wallet },
  { href: "/dashboard/analytics",  label: "Analytics",  icon: BarChart3 },
  { href: "/dashboard/promos",     label: "Promotions", icon: BadgePercent },
  { href: "/dashboard/messages",   label: "Messages",   icon: MessageCircle },
  { href: "/dashboard/settings",   label: "Settings",   icon: Settings },
];

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="container-page py-6">
      <div className="grid gap-6 lg:grid-cols-[260px_minmax(0,1fr)]">
        <aside className="hidden lg:block">
          <div className="surface-card sticky top-32 p-3">
            <div className="px-2 py-2"><Logo /></div>
            <nav className="mt-2 space-y-0.5">
              {items.map((it) => {
                const Icon = it.icon;
                return (
                  <Link
                    key={it.href}
                    href={it.href}
                    className="group flex items-center gap-3 rounded-lg px-3 py-2 text-[13.5px] text-fg-muted transition hover:bg-white/5 hover:text-fg"
                  >
                    <Icon size={15} className="text-fg-subtle group-hover:text-iris-300" />
                    <span>{it.label}</span>
                  </Link>
                );
              })}
            </nav>
            <div className="mx-2 my-3 h-px bg-white/5" />
            <div className="rounded-lg border border-iris-400/30 bg-iris-500/10 p-3">
              <div className="flex items-center gap-1.5 text-[11px] font-semibold uppercase tracking-wider text-iris-200">
                <TrendingUp size={11} /> 0% fees
              </div>
              <p className="mt-1 text-[12px] text-iris-100">
                You&apos;re on our <strong>Onboarding plan</strong>. No transaction fees apply.
              </p>
            </div>
          </div>
        </aside>

        <div>
          <div className="surface-card mb-5 flex items-center gap-3 p-3">
            <Badge variant="gold">Seller dashboard</Badge>
            <span className="text-[12.5px] text-fg-muted">Dhaka Digital · @dhakadigital</span>
            <span className="ml-auto inline-flex items-center gap-2">
              <button className="grid h-9 w-9 place-items-center rounded-md text-fg-muted hover:bg-white/5 hover:text-fg" aria-label="Notifications">
                <Bell size={16} />
              </button>
              <Link href="/seller/s1" className="text-[12px] text-iris-200 hover:text-iris-100">View public store →</Link>
            </span>
          </div>
          {children}
        </div>
      </div>
    </div>
  );
}
