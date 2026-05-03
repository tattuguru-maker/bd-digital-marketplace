"use client";

import Link from "next/link";
import { useQuery } from "convex/react";
import {
  ArrowDownRight,
  ArrowUpRight,
  Award,
  CircleAlert,
  Loader2,
  Package,
  ShieldCheck,
  Users as UsersIcon,
  Sparkles,
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { ButtonLink } from "@/components/ui/button";
import { api } from "@/lib/convex/api";
import { cn, formatNumber } from "@/lib/utils";
import { TrendChart, type TrendPoint } from "@/components/admin/trend-chart";
import { FunnelStrip } from "@/components/admin/funnel-strip";

type Overview = {
  totals: {
    users: number;
    usersLast7d: number;
    usersLast30d: number;
    usersByRole: { buyer: number; seller: number; admin: number };
    sellers: number;
    sellersByStatus: {
      pending_review: number;
      verified: number;
      rejected: number;
      suspended: number;
    };
    listings: number;
    listingsByStatus: { draft: number; active: number; archived: number };
    listingsLast7d: number;
    listingsLast30d: number;
    kycDecisions: number;
    kycApprovals: number;
    kycRejections: number;
  };
  trends: {
    signups: TrendPoint[];
    signupsForecast: TrendPoint[];
    listings: TrendPoint[];
    listingsForecast: TrendPoint[];
    sellers: TrendPoint[];
  };
  funnel: {
    signups: number;
    applied: number;
    verified: number;
    listed: number;
    active: number;
  };
} | null;

type Activity = Array<{
  id: string;
  kind: "signup" | "seller_apply" | "listing_create" | "kyc_decision";
  at: number;
  title: string;
  sub: string | null;
  href: string | null;
}>;

type TopSellers = Array<{
  id: string;
  displayName: string;
  handle: string;
  status: string;
  location: string | null;
  submittedAt: number;
  activeListings: number;
  totalListings: number;
}>;

type PendingSellerSummary = {
  id: string;
  displayName: string;
  handle: string;
  submittedAt: number;
  owner: { fullName: string | null; email: string | null } | null;
};

export default function AdminOverviewPage() {
  const overview = useQuery(api.admin.overview) as Overview | undefined;
  const activity = useQuery(api.admin.recentActivity) as
    | Activity
    | undefined;
  const top = useQuery(api.admin.topSellers, { limit: 8 }) as
    | TopSellers
    | undefined;
  const pendingKyc = useQuery(api.sellers.listForReview, {
    status: "pending_review",
  }) as
    | Array<{
        id: string;
        displayName: string;
        handle: string;
        submittedAt: number;
        owner: { fullName: string | null; email: string | null } | null;
      }>
    | undefined;

  if (overview === undefined) {
    return (
      <div className="surface-card flex items-center gap-2 p-6 text-sm text-fg-muted">
        <Loader2 size={14} className="animate-spin" /> Loading admin overview…
      </div>
    );
  }
  if (overview === null) return null;

  const t = overview.totals;
  return (
    <div className="space-y-6">
      <header className="flex flex-wrap items-end justify-between gap-3">
        <div>
          <Badge variant="brand">
            <ShieldCheck size={11} /> Master dashboard
          </Badge>
          <h1 className="mt-2 font-display text-2xl font-bold md:text-3xl">
            Marketplace overview
          </h1>
          <p className="mt-1 text-[14px] text-fg-muted">
            Live data from your Convex deployment. KPIs refresh in real time.
          </p>
        </div>
        <div className="flex flex-wrap gap-2">
          <ButtonLink href="/admin/kyc" variant="secondary" size="sm">
            <ShieldCheck size={13} /> KYC queue (
            {t.sellersByStatus.pending_review})
          </ButtonLink>
          <ButtonLink href="/admin/listings" variant="ghost" size="sm">
            <Package size={13} /> Manage listings
          </ButtonLink>
        </div>
      </header>

      {/* KPI strip */}
      <section className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
        <KpiCard
          icon={<UsersIcon size={16} className="text-iris-300" />}
          label="Total users"
          value={formatNumber(t.users)}
          delta={t.usersLast7d}
          deltaLabel="last 7d"
          sub={`${t.usersByRole.buyer} buyer · ${t.usersByRole.seller} seller · ${t.usersByRole.admin} admin`}
        />
        <KpiCard
          icon={<Award size={16} className="text-gold-400" />}
          label="Sellers verified"
          value={formatNumber(t.sellersByStatus.verified)}
          delta={t.sellersByStatus.pending_review}
          deltaLabel="pending"
          deltaTone="warn"
          sub={`${t.sellers} total · ${t.sellersByStatus.rejected} rejected · ${t.sellersByStatus.suspended} suspended`}
        />
        <KpiCard
          icon={<Package size={16} className="text-cyan-400" />}
          label="Active listings"
          value={formatNumber(t.listingsByStatus.active)}
          delta={t.listingsLast7d}
          deltaLabel="created 7d"
          sub={`${t.listings} total · ${t.listingsByStatus.draft} draft · ${t.listingsByStatus.archived} archived`}
        />
        <KpiCard
          icon={<CircleAlert size={16} className="text-amber-300" />}
          label="KYC decisions"
          value={formatNumber(t.kycDecisions)}
          delta={t.kycApprovals}
          deltaLabel="approved"
          deltaTone="good"
          sub={`${t.kycRejections} rejected`}
        />
      </section>

      {/* Charts */}
      <section className="grid gap-4 lg:grid-cols-2">
        <ChartCard
          title="Signups"
          subtitle="30-day signup volume + 7-day forecast"
          totalLabel={`${t.usersLast30d} new`}
          accent="iris"
          history={overview.trends.signups}
          forecast={overview.trends.signupsForecast}
        />
        <ChartCard
          title="Listings created"
          subtitle="30-day creation volume + 7-day forecast"
          totalLabel={`${t.listingsLast30d} new`}
          accent="cyan"
          history={overview.trends.listings}
          forecast={overview.trends.listingsForecast}
        />
      </section>

      {/* Funnel */}
      <section className="surface-card overflow-hidden p-5">
        <div className="flex flex-wrap items-baseline justify-between gap-2">
          <div>
            <div className="text-[11px] font-semibold uppercase tracking-[0.18em] text-iris-300">
              Conversion funnel
            </div>
            <h2 className="mt-1 font-display text-xl font-bold">
              From signup to active seller
            </h2>
          </div>
          <p className="text-[12.5px] text-fg-muted">
            Live counts — percentages computed against the previous step.
          </p>
        </div>
        <div className="mt-5">
          <FunnelStrip
            steps={[
              { label: "Signed up", value: overview.funnel.signups },
              { label: "Applied as seller", value: overview.funnel.applied },
              { label: "Verified", value: overview.funnel.verified },
              { label: "Created a listing", value: overview.funnel.listed },
              { label: "Has active listing", value: overview.funnel.active },
            ]}
          />
        </div>
      </section>

      <div className="grid gap-5 lg:grid-cols-3">
        {/* Pending KYC */}
        <PendingKycCard
          pending={
            pendingKyc?.map((s) => ({
              id: s.id,
              displayName: s.displayName,
              handle: s.handle,
              submittedAt: s.submittedAt,
              owner: s.owner,
            })) ?? null
          }
        />

        {/* Top sellers */}
        <TopSellersCard sellers={top} />

        {/* Activity feed */}
        <ActivityFeed events={activity} />
      </div>

      <ForecastNote />
    </div>
  );
}

function KpiCard({
  icon,
  label,
  value,
  delta,
  deltaLabel,
  deltaTone = "neutral",
  sub,
}: {
  icon: React.ReactNode;
  label: string;
  value: string;
  delta: number;
  deltaLabel: string;
  deltaTone?: "good" | "warn" | "neutral";
  sub?: string;
}) {
  const Up = delta >= 0 ? ArrowUpRight : ArrowDownRight;
  const tone =
    deltaTone === "good"
      ? "text-success"
      : deltaTone === "warn"
        ? "text-amber-300"
        : "text-iris-200";
  return (
    <div className="surface-card p-4">
      <div className="flex items-center justify-between">
        <span className="inline-flex items-center gap-2 text-[12px] font-medium text-fg-muted">
          {icon} {label}
        </span>
        <span className={cn("inline-flex items-center gap-1 text-[12px]", tone)}>
          <Up size={12} /> {formatNumber(delta)} {deltaLabel}
        </span>
      </div>
      <div className="mt-2 font-display text-3xl font-extrabold gradient-text">
        {value}
      </div>
      {sub && <div className="mt-1 text-[12px] text-fg-subtle">{sub}</div>}
    </div>
  );
}

function ChartCard({
  title,
  subtitle,
  totalLabel,
  accent,
  history,
  forecast,
}: {
  title: string;
  subtitle: string;
  totalLabel: string;
  accent: "iris" | "cyan";
  history: TrendPoint[];
  forecast: TrendPoint[];
}) {
  return (
    <div className="surface-card overflow-hidden p-5">
      <div className="flex flex-wrap items-baseline justify-between gap-2">
        <div>
          <div className="text-[11px] font-semibold uppercase tracking-[0.18em] text-iris-300">
            {title}
          </div>
          <h2 className="mt-1 font-display text-lg font-bold">{subtitle}</h2>
        </div>
        <span className="text-[12.5px] text-fg-muted">{totalLabel}</span>
      </div>
      <div className="mt-4">
        <TrendChart history={history} forecast={forecast} accent={accent} />
      </div>
      <div className="mt-3 flex items-center gap-3 text-[11px] text-fg-subtle">
        <span className="inline-flex items-center gap-1">
          <span
            className={cn(
              "inline-block h-2 w-3 rounded-sm",
              accent === "iris" ? "bg-iris-400" : "bg-cyan-400",
            )}
          />
          History
        </span>
        <span className="inline-flex items-center gap-1">
          <span
            className={cn(
              "inline-block h-2 w-3 rounded-sm border border-dashed",
              accent === "iris" ? "border-iris-300" : "border-cyan-300",
            )}
          />
          Forecast (7-day moving avg)
        </span>
      </div>
    </div>
  );
}

function PendingKycCard({
  pending,
}: {
  pending: PendingSellerSummary[] | null;
}) {
  return (
    <div className="surface-card p-5">
      <div className="flex items-center justify-between">
        <h3 className="font-display text-lg font-bold">Pending KYC</h3>
        <Link
          href="/admin/kyc"
          className="text-[12px] text-iris-200 hover:text-iris-100"
        >
          View all →
        </Link>
      </div>
      <p className="mt-1 text-[12.5px] text-fg-muted">
        Newest seller applications awaiting review.
      </p>
      <div className="mt-3 space-y-2">
        {pending === null ? (
          <div className="text-[12.5px] text-fg-muted">Loading…</div>
        ) : pending.length === 0 ? (
          <div className="rounded-lg border border-white/5 bg-white/[0.02] p-3 text-[12.5px] text-fg-muted">
            Inbox zero — no pending applications.
          </div>
        ) : (
          pending.slice(0, 4).map((s) => (
            <Link
              key={s.id}
              href="/admin/kyc"
              className="flex items-center gap-3 rounded-lg p-2 transition hover:bg-white/5"
            >
              <div className="grid h-9 w-9 place-items-center rounded-full bg-gradient-to-br from-iris-500 to-cyan-400 font-display text-[13px] font-bold text-white">
                {s.displayName[0]?.toUpperCase() ?? "?"}
              </div>
              <div className="min-w-0 flex-1">
                <div className="truncate text-[13px] font-semibold">
                  {s.displayName}
                </div>
                <div className="truncate text-[11.5px] text-fg-subtle">
                  @{s.handle} · {s.owner?.email ?? "no email"}
                </div>
              </div>
              <span className="text-[11px] text-fg-subtle">
                {timeAgoShort(s.submittedAt)}
              </span>
            </Link>
          ))
        )}
      </div>
    </div>
  );
}

function TopSellersCard({ sellers }: { sellers: TopSellers | undefined }) {
  return (
    <div className="surface-card p-5">
      <div className="flex items-center justify-between">
        <h3 className="font-display text-lg font-bold">Top sellers</h3>
        <Link
          href="/admin/listings"
          className="text-[12px] text-iris-200 hover:text-iris-100"
        >
          View listings →
        </Link>
      </div>
      <p className="mt-1 text-[12.5px] text-fg-muted">Ranked by active listings.</p>
      <div className="mt-3 space-y-2">
        {sellers === undefined ? (
          <div className="text-[12.5px] text-fg-muted">Loading…</div>
        ) : sellers.length === 0 ? (
          <div className="rounded-lg border border-white/5 bg-white/[0.02] p-3 text-[12.5px] text-fg-muted">
            No sellers yet.
          </div>
        ) : (
          sellers.map((s) => (
            <div
              key={s.id}
              className="flex items-center gap-3 rounded-lg p-2 transition hover:bg-white/5"
            >
              <div className="grid h-9 w-9 place-items-center rounded-full bg-gradient-to-br from-emerald-400 to-cyan-500 font-display text-[13px] font-bold text-white">
                {s.displayName[0]?.toUpperCase() ?? "?"}
              </div>
              <div className="min-w-0 flex-1">
                <div className="truncate text-[13px] font-semibold">
                  {s.displayName}
                </div>
                <div className="truncate text-[11.5px] text-fg-subtle">
                  @{s.handle} · {s.location ?? "—"}
                </div>
              </div>
              <span className="text-right">
                <span className="block text-[14px] font-bold">
                  {s.activeListings}
                </span>
                <span className="block text-[10.5px] text-fg-subtle">
                  {s.totalListings} total
                </span>
              </span>
            </div>
          ))
        )}
      </div>
    </div>
  );
}

function ActivityFeed({ events }: { events: Activity | undefined }) {
  return (
    <div className="surface-card p-5">
      <div className="flex items-center justify-between">
        <h3 className="font-display text-lg font-bold">Recent activity</h3>
        <Link
          href="/admin/activity"
          className="text-[12px] text-iris-200 hover:text-iris-100"
        >
          View all →
        </Link>
      </div>
      <p className="mt-1 text-[12.5px] text-fg-muted">
        Live feed across signups, listings and KYC.
      </p>
      <ul className="mt-3 space-y-2">
        {events === undefined ? (
          <li className="text-[12.5px] text-fg-muted">Loading…</li>
        ) : events.length === 0 ? (
          <li className="rounded-lg border border-white/5 bg-white/[0.02] p-3 text-[12.5px] text-fg-muted">
            No activity yet.
          </li>
        ) : (
          events.slice(0, 8).map((e) => <ActivityRow key={e.id} event={e} />)
        )}
      </ul>
    </div>
  );
}

function ActivityRow({ event }: { event: Activity[number] }) {
  const ICON: Record<Activity[number]["kind"], React.ReactNode> = {
    signup: <UsersIcon size={12} className="text-iris-300" />,
    seller_apply: <ShieldCheck size={12} className="text-amber-300" />,
    listing_create: <Package size={12} className="text-cyan-400" />,
    kyc_decision: <Award size={12} className="text-success" />,
  };
  const body = (
    <>
      <span className="grid h-7 w-7 shrink-0 place-items-center rounded-md bg-white/5">
        {ICON[event.kind]}
      </span>
      <div className="min-w-0 flex-1">
        <div className="truncate text-[12.5px] text-fg">{event.title}</div>
        {event.sub && (
          <div className="truncate text-[11px] text-fg-subtle">{event.sub}</div>
        )}
      </div>
      <span className="text-[11px] text-fg-subtle">
        {timeAgoShort(event.at)}
      </span>
    </>
  );
  return (
    <li>
      {event.href ? (
        <Link
          href={event.href}
          className="flex items-center gap-2 rounded-lg p-1.5 transition hover:bg-white/5"
        >
          {body}
        </Link>
      ) : (
        <div className="flex items-center gap-2 rounded-lg p-1.5">{body}</div>
      )}
    </li>
  );
}

function ForecastNote() {
  return (
    <div className="surface-card flex items-start gap-3 border-iris-400/30 bg-iris-500/[0.06] p-4 text-[12.5px] text-iris-100">
      <Sparkles size={14} className="mt-0.5 shrink-0 text-iris-200" />
      <div>
        <strong>How forecasts are calculated.</strong> The dotted segments on
        the trend charts are projected from the trailing 7-day moving average —
        useful as a directional signal, not a prediction. We&apos;ll swap this
        for a proper time-series model once we have ≥90 days of orders + GMV
        data to fit on.
      </div>
    </div>
  );
}

function timeAgoShort(t: number) {
  const diff = Date.now() - t;
  if (diff < 60_000) return "just now";
  if (diff < 3_600_000) return `${Math.floor(diff / 60_000)}m`;
  if (diff < 86_400_000) return `${Math.floor(diff / 3_600_000)}h`;
  return `${Math.floor(diff / 86_400_000)}d`;
}
