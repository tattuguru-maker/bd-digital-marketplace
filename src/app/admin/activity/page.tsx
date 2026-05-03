"use client";

import Link from "next/link";
import { useQuery } from "convex/react";
import {
  Award,
  Loader2,
  Package,
  ShieldCheck,
  Users as UsersIcon,
  Activity as ActivityIcon,
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Breadcrumb } from "@/components/marketplace/breadcrumb";
import { api } from "@/lib/convex/api";

type Event = {
  id: string;
  kind: "signup" | "seller_apply" | "listing_create" | "kyc_decision";
  at: number;
  title: string;
  sub: string | null;
  href: string | null;
};

const KIND_META: Record<
  Event["kind"],
  { icon: React.ReactNode; label: string }
> = {
  signup: {
    icon: <UsersIcon size={14} className="text-iris-300" />,
    label: "New signup",
  },
  seller_apply: {
    icon: <ShieldCheck size={14} className="text-amber-300" />,
    label: "Seller application",
  },
  listing_create: {
    icon: <Package size={14} className="text-cyan-400" />,
    label: "Listing created",
  },
  kyc_decision: {
    icon: <Award size={14} className="text-success" />,
    label: "KYC decision",
  },
};

export default function AdminActivityPage() {
  const events = useQuery(api.admin.recentActivity) as Event[] | undefined;

  return (
    <div>
      <Breadcrumb
        items={[
          { label: "Admin", href: "/admin" },
          { label: "Activity log" },
        ]}
      />

      <header className="mt-4">
        <Badge variant="brand">
          <ActivityIcon size={11} /> Activity
        </Badge>
        <h1 className="mt-2 font-display text-2xl font-bold md:text-3xl">
          Recent activity
        </h1>
        <p className="mt-1 text-[14px] text-fg-muted">
          Live feed across signups, seller applications, listings and KYC
          decisions. Real-time via Convex.
        </p>
      </header>

      <div className="surface-card mt-5 overflow-hidden">
        {events === undefined ? (
          <div className="flex items-center gap-2 p-6 text-sm text-fg-muted">
            <Loader2 size={14} className="animate-spin" /> Loading activity…
          </div>
        ) : events.length === 0 ? (
          <div className="p-8 text-center text-[13px] text-fg-muted">
            No activity yet.
          </div>
        ) : (
          <ul className="divide-y divide-white/5">
            {events.map((e) => (
              <Row key={e.id} event={e} />
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}

function Row({ event }: { event: Event }) {
  const meta = KIND_META[event.kind];
  const body = (
    <>
      <span className="grid h-9 w-9 shrink-0 place-items-center rounded-md bg-white/5">
        {meta.icon}
      </span>
      <div className="min-w-0 flex-1">
        <div className="flex flex-wrap items-center gap-2">
          <span className="text-[12px] font-semibold uppercase tracking-wider text-fg-subtle">
            {meta.label}
          </span>
          <span className="text-[11px] text-fg-subtle">
            {new Date(event.at).toLocaleString("en-GB", {
              day: "numeric",
              month: "short",
              hour: "2-digit",
              minute: "2-digit",
            })}
          </span>
        </div>
        <div className="text-[14px] text-fg">{event.title}</div>
        {event.sub && (
          <div className="text-[12px] text-fg-subtle">{event.sub}</div>
        )}
      </div>
    </>
  );
  return (
    <li>
      {event.href ? (
        <Link
          href={event.href}
          className="flex items-center gap-3 px-5 py-3 transition hover:bg-white/[0.03]"
        >
          {body}
        </Link>
      ) : (
        <div className="flex items-center gap-3 px-5 py-3">{body}</div>
      )}
    </li>
  );
}
