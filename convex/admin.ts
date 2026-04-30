/**
 * Admin-only queries + mutations powering the master `/admin` dashboard.
 *
 * Every export gates on the caller's `users.role === "admin"`. Non-admin
 * callers either receive an empty / typed-empty result (queries) or an
 * error (mutations).
 */
import { mutation, query, type QueryCtx } from "./_generated/server";
import { v } from "convex/values";
import { getAuthUserId } from "@convex-dev/auth/server";
import type { Doc, Id } from "./_generated/dataModel";

const ROLES = v.union(
  v.literal("buyer"),
  v.literal("seller"),
  v.literal("admin"),
);

const DAY_MS = 24 * 60 * 60 * 1000;

async function requireAdmin(ctx: QueryCtx) {
  const callerId = await getAuthUserId(ctx);
  if (!callerId) throw new Error("You need to sign in first.");
  const caller = await ctx.db.get(callerId);
  if (caller?.role !== "admin") throw new Error("Admin access required.");
  return { callerId, caller };
}

async function isAdmin(ctx: QueryCtx) {
  const callerId = await getAuthUserId(ctx);
  if (!callerId) return false;
  const caller = await ctx.db.get(callerId);
  return caller?.role === "admin";
}

/**
 * Bucket an array of timestamps into N daily buckets ending today.
 * Returns an array of { date: ms, count: number } from oldest to newest.
 */
function bucketByDay(timestamps: number[], days: number) {
  const now = Date.now();
  const todayStart = new Date(now);
  todayStart.setHours(0, 0, 0, 0);
  const start = todayStart.getTime() - (days - 1) * DAY_MS;

  const buckets: { date: number; count: number }[] = [];
  for (let i = 0; i < days; i++) {
    buckets.push({ date: start + i * DAY_MS, count: 0 });
  }

  for (const t of timestamps) {
    if (t < start) continue;
    const idx = Math.floor((t - start) / DAY_MS);
    if (idx >= 0 && idx < days) buckets[idx].count++;
  }
  return buckets;
}

/**
 * 7-day moving-average forecast for the next `forecastDays` days.
 * Heuristic only — not ML.
 */
function forecastNext(
  buckets: { date: number; count: number }[],
  forecastDays: number,
) {
  const window = 7;
  const tail = buckets.slice(-window).map((b) => b.count);
  const avg =
    tail.length > 0 ? tail.reduce((a, b) => a + b, 0) / tail.length : 0;
  const last = buckets[buckets.length - 1]?.date ?? Date.now();
  const out: { date: number; count: number }[] = [];
  for (let i = 1; i <= forecastDays; i++) {
    out.push({ date: last + i * DAY_MS, count: Math.round(avg) });
  }
  return out;
}

/**
 * Master overview KPIs + 30d trend series + 7d forecast.
 */
export const overview = query({
  args: {},
  handler: async (ctx) => {
    if (!(await isAdmin(ctx))) return null;

    const [users, sellers, listings, kycReviews] = await Promise.all([
      ctx.db.query("users").collect(),
      ctx.db.query("sellers").collect(),
      ctx.db.query("listings").collect(),
      ctx.db.query("kycReviews").collect(),
    ]);

    const now = Date.now();
    const day7 = now - 7 * DAY_MS;
    const day30 = now - 30 * DAY_MS;

    const userTimestamps = users.map((u) => u._creationTime);
    const listingTimestamps = listings.map((l) => l._creationTime);
    const sellerTimestamps = sellers.map((s) => s.submittedAt);

    const usersBuckets = bucketByDay(userTimestamps, 30);
    const listingsBuckets = bucketByDay(listingTimestamps, 30);
    const sellersBuckets = bucketByDay(sellerTimestamps, 30);

    return {
      totals: {
        users: users.length,
        usersLast7d: users.filter((u) => u._creationTime >= day7).length,
        usersLast30d: users.filter((u) => u._creationTime >= day30).length,
        usersByRole: {
          buyer: users.filter((u) => (u.role ?? "buyer") === "buyer").length,
          seller: users.filter((u) => u.role === "seller").length,
          admin: users.filter((u) => u.role === "admin").length,
        },
        sellers: sellers.length,
        sellersByStatus: {
          pending_review: sellers.filter((s) => s.status === "pending_review")
            .length,
          verified: sellers.filter((s) => s.status === "verified").length,
          rejected: sellers.filter((s) => s.status === "rejected").length,
          suspended: sellers.filter((s) => s.status === "suspended").length,
        },
        listings: listings.length,
        listingsByStatus: {
          draft: listings.filter((l) => l.status === "draft").length,
          active: listings.filter((l) => l.status === "active").length,
          archived: listings.filter((l) => l.status === "archived").length,
        },
        listingsLast7d: listings.filter((l) => l._creationTime >= day7).length,
        listingsLast30d: listings.filter((l) => l._creationTime >= day30).length,
        kycDecisions: kycReviews.length,
        kycApprovals: kycReviews.filter((r) => r.decision === "approved")
          .length,
        kycRejections: kycReviews.filter((r) => r.decision === "rejected")
          .length,
      },
      trends: {
        signups: usersBuckets,
        signupsForecast: forecastNext(usersBuckets, 7),
        listings: listingsBuckets,
        listingsForecast: forecastNext(listingsBuckets, 7),
        sellers: sellersBuckets,
      },
      funnel: {
        // signups → applied to be a seller → verified → has at least one
        // listing → has at least one *active* listing.
        signups: users.length,
        applied: sellers.length,
        verified: sellers.filter((s) => s.status === "verified").length,
        listed: new Set(listings.map((l) => String(l.sellerId))).size,
        active: new Set(
          listings
            .filter((l) => l.status === "active")
            .map((l) => String(l.sellerId)),
        ).size,
      },
    };
  },
});

/**
 * The 25 most recent admin-relevant events. Combines new signups, seller
 * applications, listing creations and KYC decisions into a single feed.
 */
export const recentActivity = query({
  args: {},
  handler: async (ctx) => {
    if (!(await isAdmin(ctx))) return [];

    const [users, sellers, listings, kycReviews] = await Promise.all([
      ctx.db.query("users").order("desc").take(50),
      ctx.db.query("sellers").order("desc").take(50),
      ctx.db.query("listings").order("desc").take(50),
      ctx.db.query("kycReviews").order("desc").take(50),
    ]);

    const userById = new Map<string, Doc<"users">>();
    for (const u of users) userById.set(String(u._id), u);
    const sellerById = new Map<string, Doc<"sellers">>();
    for (const s of sellers) sellerById.set(String(s._id), s);

    type Event = {
      id: string;
      kind: "signup" | "seller_apply" | "listing_create" | "kyc_decision";
      at: number;
      title: string;
      sub: string | null;
      href: string | null;
    };

    const events: Event[] = [];

    for (const u of users) {
      events.push({
        id: `u:${u._id}`,
        kind: "signup",
        at: u._creationTime,
        title: u.fullName ?? u.name ?? u.email ?? "New signup",
        sub: u.email ?? null,
        href: `/admin/users?focus=${u._id}`,
      });
    }
    for (const s of sellers) {
      events.push({
        id: `s:${s._id}`,
        kind: "seller_apply",
        at: s.submittedAt,
        title: `${s.displayName} applied as seller`,
        sub: `@${s.handle}`,
        href: "/admin/kyc",
      });
    }
    for (const l of listings) {
      const seller = sellerById.get(String(l.sellerId));
      events.push({
        id: `l:${l._id}`,
        kind: "listing_create",
        at: l._creationTime,
        title: `New listing: ${l.title}`,
        sub: seller ? `@${seller.handle}` : null,
        href: `/product/${l.slug}`,
      });
    }
    for (const r of kycReviews) {
      const seller = sellerById.get(String(r.sellerId));
      events.push({
        id: `r:${r._id}`,
        kind: "kyc_decision",
        at: r._creationTime,
        title:
          r.decision === "approved"
            ? `Approved seller${seller ? ` ${seller.displayName}` : ""}`
            : r.decision === "rejected"
              ? `Rejected seller${seller ? ` ${seller.displayName}` : ""}`
              : `KYC needs more info${seller ? ` from ${seller.displayName}` : ""}`,
        sub: r.notes ?? null,
        href: "/admin/kyc",
      });
    }

    events.sort((a, b) => b.at - a.at);
    return events.slice(0, 25);
  },
});

/**
 * Top sellers by listing count (active listings ranked first).
 */
export const topSellers = query({
  args: { limit: v.optional(v.number()) },
  handler: async (ctx, { limit }) => {
    if (!(await isAdmin(ctx))) return [];
    const cap = Math.min(Math.max(limit ?? 8, 1), 25);

    const sellers = await ctx.db.query("sellers").collect();
    const listings = await ctx.db.query("listings").collect();

    const stats = new Map<
      string,
      { active: number; total: number }
    >();
    for (const l of listings) {
      const key = String(l.sellerId);
      const cur = stats.get(key) ?? { active: 0, total: 0 };
      cur.total++;
      if (l.status === "active") cur.active++;
      stats.set(key, cur);
    }

    return sellers
      .map((s) => {
        const st = stats.get(String(s._id)) ?? { active: 0, total: 0 };
        return {
          id: s._id,
          displayName: s.displayName,
          handle: s.handle,
          status: s.status,
          location: s.location ?? null,
          submittedAt: s.submittedAt,
          activeListings: st.active,
          totalListings: st.total,
        };
      })
      .sort(
        (a, b) =>
          b.activeListings - a.activeListings ||
          b.totalListings - a.totalListings ||
          a.displayName.localeCompare(b.displayName),
      )
      .slice(0, cap);
  },
});

/**
 * Paginated user list with optional search term (matches email, fullName,
 * name).
 */
export const usersList = query({
  args: {
    search: v.optional(v.string()),
    role: v.optional(v.union(ROLES, v.literal("all"))),
    limit: v.optional(v.number()),
  },
  handler: async (ctx, { search, role, limit }) => {
    if (!(await isAdmin(ctx))) return [];
    const cap = Math.min(Math.max(limit ?? 50, 1), 200);
    const term = (search ?? "").trim().toLowerCase();
    const roleFilter = role && role !== "all" ? role : null;

    const all = await ctx.db.query("users").collect();
    const filtered = all
      .filter((u) => {
        if (roleFilter) {
          const r = u.role ?? "buyer";
          if (r !== roleFilter) return false;
        }
        if (term) {
          const hay = [u.email, u.fullName, u.name]
            .filter((x): x is string => !!x)
            .join(" ")
            .toLowerCase();
          if (!hay.includes(term)) return false;
        }
        return true;
      })
      .sort((a, b) => b._creationTime - a._creationTime)
      .slice(0, cap);

    // Decorate with seller status if any.
    const sellerByUser = new Map<string, Doc<"sellers">>();
    const sellers = await ctx.db.query("sellers").collect();
    for (const s of sellers) sellerByUser.set(String(s.userId), s);

    return filtered.map((u) => ({
      id: u._id,
      email: u.email ?? null,
      fullName: u.fullName ?? u.name ?? null,
      role: (u.role ?? "buyer") as "buyer" | "seller" | "admin",
      createdAt: u._creationTime,
      seller: (() => {
        const s = sellerByUser.get(String(u._id));
        if (!s) return null;
        return {
          id: s._id,
          displayName: s.displayName,
          handle: s.handle,
          status: s.status,
        };
      })(),
    }));
  },
});

/**
 * All listings with seller info and current status, optionally filtered.
 */
export const listingsList = query({
  args: {
    search: v.optional(v.string()),
    status: v.optional(
      v.union(
        v.literal("all"),
        v.literal("draft"),
        v.literal("active"),
        v.literal("archived"),
      ),
    ),
    limit: v.optional(v.number()),
  },
  handler: async (ctx, { search, status, limit }) => {
    if (!(await isAdmin(ctx))) return [];
    const cap = Math.min(Math.max(limit ?? 50, 1), 200);
    const term = (search ?? "").trim().toLowerCase();

    const all = await ctx.db.query("listings").order("desc").collect();
    const filtered = all
      .filter((l) => {
        if (status && status !== "all" && l.status !== status) return false;
        if (term) {
          const hay = [l.title, l.slug, l.shortDesc].join(" ").toLowerCase();
          if (!hay.includes(term)) return false;
        }
        return true;
      })
      .slice(0, cap);

    const sellers = await ctx.db.query("sellers").collect();
    const sellerById = new Map<string, Doc<"sellers">>();
    for (const s of sellers) sellerById.set(String(s._id), s);

    return filtered.map((l) => {
      const s = sellerById.get(String(l.sellerId));
      return {
        id: l._id,
        title: l.title,
        slug: l.slug,
        category: l.category,
        priceTaka: l.priceTaka,
        originalPriceTaka: l.originalPriceTaka ?? null,
        stock: l.stock,
        status: l.status,
        createdAt: l._creationTime,
        publishedAt: l.publishedAt ?? null,
        archivedAt: l.archivedAt ?? null,
        sold: l.sold,
        views: l.views,
        seller: s
          ? {
              id: s._id,
              displayName: s.displayName,
              handle: s.handle,
              status: s.status,
            }
          : null,
      };
    });
  },
});

/**
 * Promote / demote a user. Admins cannot demote themselves to avoid being
 * locked out.
 */
export const setUserRole = mutation({
  args: {
    userId: v.id("users"),
    role: ROLES,
  },
  handler: async (ctx, { userId, role }) => {
    const { callerId } = await requireAdmin(ctx);
    if (String(userId) === String(callerId) && role !== "admin") {
      throw new Error("You cannot remove your own admin role.");
    }
    const target = await ctx.db.get(userId);
    if (!target) throw new Error("User not found.");
    await ctx.db.patch(userId, { role });
  },
});

/**
 * Force-archive any listing as admin (independent of seller ownership).
 */
export const archiveListing = mutation({
  args: { listingId: v.id("listings") },
  handler: async (ctx, { listingId }) => {
    await requireAdmin(ctx);
    const listing = await ctx.db.get(listingId);
    if (!listing) throw new Error("Listing not found.");
    if (listing.status === "archived") return;
    await ctx.db.patch(listingId, {
      status: "archived",
      archivedAt: Date.now(),
    });
  },
});

/**
 * Force-unarchive any listing back to draft.
 */
export const unarchiveListing = mutation({
  args: { listingId: v.id("listings") },
  handler: async (ctx, { listingId }) => {
    await requireAdmin(ctx);
    const listing = await ctx.db.get(listingId);
    if (!listing) throw new Error("Listing not found.");
    if (listing.status !== "archived") return;
    await ctx.db.patch(listingId, {
      status: "draft",
      archivedAt: undefined,
    });
  },
});

/**
 * Suspend or reinstate a seller. Suspending also archives all of their
 * active listings so they drop off public surfaces immediately.
 */
export const setSellerStatus = mutation({
  args: {
    sellerId: v.id("sellers"),
    status: v.union(
      v.literal("verified"),
      v.literal("suspended"),
    ),
  },
  handler: async (ctx, { sellerId, status }) => {
    const { callerId } = await requireAdmin(ctx);
    const seller = await ctx.db.get(sellerId);
    if (!seller) throw new Error("Seller not found.");
    await ctx.db.patch(sellerId, {
      status,
      reviewedAt: Date.now(),
      reviewerId: callerId,
    });

    if (status === "suspended") {
      const active = await ctx.db
        .query("listings")
        .withIndex("by_seller", (q) =>
          q.eq("sellerId", sellerId as Id<"sellers">),
        )
        .collect();
      for (const l of active) {
        if (l.status === "active") {
          await ctx.db.patch(l._id, {
            status: "archived",
            archivedAt: Date.now(),
          });
        }
      }
    }
  },
});
