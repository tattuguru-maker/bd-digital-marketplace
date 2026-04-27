import Link from "next/link";
import {
  Bell,
  Package,
  ShieldCheck,
  Sparkles,
  Star,
  Wallet,
  CheckCheck,
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Breadcrumb } from "@/components/marketplace/breadcrumb";
import { timeAgo } from "@/lib/utils";

export const metadata = { title: "Notifications · Digibazar" };

type NotifKind = "order" | "delivery" | "promo" | "review" | "payout" | "alert";

type Notif = {
  id: string;
  kind: NotifKind;
  title: string;
  body: string;
  href: string;
  createdAt: string;
  unread: boolean;
};

const NOW = Date.now();
const mins = (n: number) => new Date(NOW - n * 60_000).toISOString();

const notifications: Notif[] = [
  {
    id: "n1",
    kind: "delivery",
    title: "Your Free Fire 310 Diamonds top-up has landed",
    body: "Player ID 248120384 — credited at 11:42 PM. Thanks for shopping with GG Boost BD.",
    href: "/orders/BD-92141",
    createdAt: mins(4),
    unread: true,
  },
  {
    id: "n2",
    kind: "order",
    title: "Order #BD-92140 confirmed",
    body: "Netflix Premium — 1 Month from Dhaka Digital. Email delivery within 5 minutes.",
    href: "/orders/BD-92140",
    createdAt: mins(11),
    unread: true,
  },
  {
    id: "n3",
    kind: "review",
    title: "How was your Spotify subscription?",
    body: "Leave a review for Dhaka Digital — sellers thrive on your honest feedback.",
    href: "/orders/BD-92039#review",
    createdAt: mins(60 * 5),
    unread: true,
  },
  {
    id: "n4",
    kind: "promo",
    title: "Flash sale: Steam Wallet 25% off",
    body: "Today only — ৳540 instead of ৳600. Stock is limited and this drop ends at midnight.",
    href: "/category/gift-cards",
    createdAt: mins(60 * 9),
    unread: false,
  },
  {
    id: "n5",
    kind: "payout",
    title: "Wallet credited: ৳200 cashback",
    body: "Welcome bonus credited to your Digibazar wallet. Spend anywhere on the marketplace.",
    href: "/dashboard",
    createdAt: mins(60 * 20),
    unread: false,
  },
  {
    id: "n6",
    kind: "alert",
    title: "Buyer protection — case BD-92005 resolved",
    body: "We approved your replacement request. A new key will be issued within 24 hours.",
    href: "/orders/BD-92005",
    createdAt: mins(60 * 36),
    unread: false,
  },
];

const ICONS: Record<NotifKind, { icon: React.ReactNode; tint: string }> = {
  order:    { icon: <Package size={18} />,    tint: "bg-iris-500/15 text-iris-300" },
  delivery: { icon: <CheckCheck size={18} />, tint: "bg-success/15 text-success" },
  promo:    { icon: <Sparkles size={18} />,   tint: "bg-fuchsia-500/15 text-fuchsia-300" },
  review:   { icon: <Star size={18} />,       tint: "bg-gold-400/15 text-gold-300" },
  payout:   { icon: <Wallet size={18} />,     tint: "bg-cyan-400/15 text-cyan-300" },
  alert:    { icon: <ShieldCheck size={18} />, tint: "bg-danger/15 text-danger" },
};

export default function NotificationsPage() {
  const unreadCount = notifications.filter((n) => n.unread).length;

  return (
    <div className="container-page py-8 md:py-10">
      <Breadcrumb items={[{ label: "Home", href: "/" }, { label: "Notifications" }]} />

      <div className="mt-5 flex flex-wrap items-end justify-between gap-3">
        <div>
          <Badge variant="brand">
            <Bell size={11} /> Inbox
          </Badge>
          <h1 className="mt-2 font-display text-3xl font-extrabold md:text-[40px] md:leading-tight">
            Notifications
          </h1>
          <p className="mt-1 text-[14px] text-fg-muted md:text-[15px]">
            {unreadCount} unread · order updates, deliveries, payouts and offers
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline" size="sm">Mark all as read</Button>
          <Button variant="ghost" size="sm">Settings</Button>
        </div>
      </div>

      {/* Filter chips */}
      <div className="mt-6 flex flex-wrap gap-2 text-[13px]">
        {[
          ["All", true],
          ["Orders & delivery", false],
          ["Promotions", false],
          ["Account", false],
          ["Reviews", false],
        ].map(([label, active]) => (
          <button
            key={String(label)}
            type="button"
            className={`glass-pill h-9 rounded-full px-4 transition ${
              active ? "border-iris-400/50 text-fg" : "text-fg-muted hover:text-fg"
            }`}
          >
            {label as string}
          </button>
        ))}
      </div>

      {/* Notification list */}
      <div className="mt-6 space-y-2">
        {notifications.map((n) => {
          const { icon, tint } = ICONS[n.kind];
          return (
            <Link
              key={n.id}
              href={n.href}
              className={`surface-card flex items-start gap-4 p-4 transition hover:border-iris-400/40 ${
                n.unread ? "bg-iris-500/[0.04]" : ""
              }`}
            >
              <div className={`grid h-11 w-11 shrink-0 place-items-center rounded-xl ${tint}`}>
                {icon}
              </div>
              <div className="min-w-0 flex-1">
                <div className="flex flex-wrap items-center gap-2">
                  <span className="font-semibold text-fg">{n.title}</span>
                  {n.unread && (
                    <span className="grid h-1.5 w-1.5 rounded-full bg-iris-400" aria-label="Unread" />
                  )}
                </div>
                <p className="mt-1 line-clamp-2 text-[13.5px] text-fg-muted">{n.body}</p>
              </div>
              <div className="shrink-0 text-[12px] text-fg-subtle">
                {timeAgo(n.createdAt)}
              </div>
            </Link>
          );
        })}
      </div>
    </div>
  );
}
