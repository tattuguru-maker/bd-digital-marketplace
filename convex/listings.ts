/**
 * Seller listings — create, edit, archive + public read endpoints.
 *
 * Sellers must have a `verified` (or `admin` for testing) profile before
 * they can write listings. All write mutations re-check ownership.
 */
import { mutation, query, type QueryCtx } from "./_generated/server";
import type { Doc, Id } from "./_generated/dataModel";
import { v } from "convex/values";
import { getAuthUserId } from "@convex-dev/auth/server";

const SLUG_RE = /^[a-z0-9](?:[a-z0-9-]{1,78}[a-z0-9])$/;
const MAX_IMAGES = 6;

const listingCategory = v.union(
  v.literal("streaming"),
  v.literal("ai-tools"),
  v.literal("game-topup"),
  v.literal("cd-keys"),
  v.literal("gift-cards"),
  v.literal("software"),
  v.literal("vpn"),
  v.literal("education"),
  v.literal("social"),
);

const listingDelivery = v.union(
  v.literal("instant"),
  v.literal("manual-15m"),
  v.literal("manual-1h"),
  v.literal("manual-24h"),
);

const listingRegion = v.union(
  v.literal("global"),
  v.literal("bd"),
  v.literal("in"),
  v.literal("asia"),
  v.literal("eu"),
  v.literal("us"),
);

const listingStatusInput = v.union(v.literal("draft"), v.literal("active"));

function slugify(input: string) {
  return input
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 80);
}

function validateBasics(args: {
  title: string;
  shortDesc: string;
  longDesc: string;
  priceTaka: number;
  originalPriceTaka?: number;
  stock: number;
  images: Id<"_storage">[];
}) {
  if (args.title.trim().length < 5 || args.title.trim().length > 120) {
    throw new Error("Title must be 5–120 characters.");
  }
  if (args.shortDesc.trim().length < 20 || args.shortDesc.trim().length > 240) {
    throw new Error("Short description must be 20–240 characters.");
  }
  if (args.longDesc.trim().length < 60 || args.longDesc.trim().length > 5000) {
    throw new Error("Long description must be 60–5000 characters.");
  }
  if (!Number.isFinite(args.priceTaka) || args.priceTaka < 1 || args.priceTaka > 1_000_000) {
    throw new Error("Price must be between ৳1 and ৳1,000,000.");
  }
  if (
    args.originalPriceTaka != null &&
    (args.originalPriceTaka < args.priceTaka || args.originalPriceTaka > 1_000_000)
  ) {
    throw new Error("Compare-at price must be greater than the sale price.");
  }
  if (!Number.isInteger(args.stock) || args.stock < 0 || args.stock > 100_000) {
    throw new Error("Stock must be a whole number between 0 and 100,000.");
  }
  if (args.images.length === 0) throw new Error("Add at least one image.");
  if (args.images.length > MAX_IMAGES) {
    throw new Error(`At most ${MAX_IMAGES} images per listing.`);
  }
}

async function requireSeller(ctx: QueryCtx) {
  const userId = await getAuthUserId(ctx);
  if (!userId) throw new Error("You need to sign in first.");
  const user = await ctx.db.get(userId);
  if (!user) throw new Error("Account not found.");

  const seller = await ctx.db
    .query("sellers")
    .withIndex("by_user", (q) => q.eq("userId", userId))
    .unique();

  // Admins without their own seller row aren't allowed to create listings — they
  // would need a storefront identity. They can still moderate other sellers'.
  if (!seller) {
    throw new Error("Submit your seller application before creating listings.");
  }
  if (seller.status !== "verified" && user.role !== "admin") {
    throw new Error(
      seller.status === "pending_review"
        ? "Your seller application is still under review."
        : seller.status === "rejected"
          ? "Your seller application was rejected. Reapply to start listing."
          : "Your seller account is suspended.",
    );
  }
  return { userId, user, seller };
}

async function uniqueSlug(ctx: QueryCtx, base: string, ignoreId?: Id<"listings">) {
  let candidate = base || "listing";
  let suffix = 1;
  while (true) {
    const hit = await ctx.db
      .query("listings")
      .withIndex("by_slug", (q) => q.eq("slug", candidate))
      .first();
    if (!hit || hit._id === ignoreId) return candidate;
    suffix += 1;
    candidate = `${base}-${suffix}`;
    if (suffix > 50) throw new Error("Could not generate a unique slug.");
  }
}

async function decorateListing(ctx: QueryCtx, l: Doc<"listings">) {
  const seller = await ctx.db.get(l.sellerId);
  const imageUrls = await Promise.all(l.images.map((id) => ctx.storage.getUrl(id)));
  const pairs = l.images
    .map((id, idx) => ({ id, url: imageUrls[idx] }))
    .filter((p): p is { id: typeof p.id; url: string } => !!p.url);
  return {
    id: l._id,
    title: l.title,
    slug: l.slug,
    category: l.category,
    shortDesc: l.shortDesc,
    longDesc: l.longDesc,
    priceTaka: l.priceTaka,
    originalPriceTaka: l.originalPriceTaka ?? null,
    stock: l.stock,
    delivery: l.delivery,
    region: l.region,
    platform: l.platform ?? null,
    warranty: l.warranty ?? null,
    status: l.status,
    publishedAt: l.publishedAt ?? null,
    archivedAt: l.archivedAt ?? null,
    sold: l.sold,
    views: l.views,
    createdAt: l._creationTime,
    images: pairs.map((p) => p.url),
    imageIds: pairs.map((p) => p.id),
    seller: seller
      ? {
          id: seller._id,
          handle: seller.handle,
          displayName: seller.displayName,
          location: seller.location ?? null,
          status: seller.status,
        }
      : null,
  };
}

// ---------------------------------------------------------------------
// Mutations
// ---------------------------------------------------------------------

export const create = mutation({
  args: {
    title: v.string(),
    slug: v.optional(v.string()),
    category: listingCategory,
    shortDesc: v.string(),
    longDesc: v.string(),
    priceTaka: v.number(),
    originalPriceTaka: v.optional(v.number()),
    stock: v.number(),
    delivery: listingDelivery,
    region: listingRegion,
    platform: v.optional(v.string()),
    warranty: v.optional(v.string()),
    images: v.array(v.id("_storage")),
    status: listingStatusInput,
  },
  handler: async (ctx, args) => {
    const { userId, seller } = await requireSeller(ctx);
    validateBasics(args);

    const desiredSlug = (args.slug && args.slug.trim()) || slugify(args.title);
    if (args.slug && !SLUG_RE.test(desiredSlug)) {
      throw new Error("Slug must be 3–80 lowercase letters, numbers or dashes.");
    }
    const slug = await uniqueSlug(ctx, slugify(desiredSlug));

    const now = Date.now();
    const id = await ctx.db.insert("listings", {
      sellerId: seller._id,
      userId,
      title: args.title.trim(),
      slug,
      category: args.category,
      shortDesc: args.shortDesc.trim(),
      longDesc: args.longDesc.trim(),
      priceTaka: Math.round(args.priceTaka),
      originalPriceTaka:
        args.originalPriceTaka != null ? Math.round(args.originalPriceTaka) : undefined,
      stock: args.stock,
      delivery: args.delivery,
      region: args.region,
      platform: args.platform?.trim() || undefined,
      warranty: args.warranty?.trim() || undefined,
      images: args.images,
      status: args.status,
      publishedAt: args.status === "active" ? now : undefined,
      sold: 0,
      views: 0,
    });
    return { id, slug };
  },
});

export const update = mutation({
  args: {
    id: v.id("listings"),
    title: v.string(),
    category: listingCategory,
    shortDesc: v.string(),
    longDesc: v.string(),
    priceTaka: v.number(),
    originalPriceTaka: v.optional(v.number()),
    stock: v.number(),
    delivery: listingDelivery,
    region: listingRegion,
    platform: v.optional(v.string()),
    warranty: v.optional(v.string()),
    images: v.array(v.id("_storage")),
    status: listingStatusInput,
  },
  handler: async (ctx, { id, ...patch }) => {
    const { userId, user } = await requireSeller(ctx);
    const existing = await ctx.db.get(id);
    if (!existing) throw new Error("Listing not found.");
    if (existing.userId !== userId && user.role !== "admin") {
      throw new Error("You can only edit your own listings.");
    }
    validateBasics(patch);

    const wasArchived = existing.status === "archived";
    const becameActive = patch.status === "active" && existing.status !== "active";
    await ctx.db.patch(id, {
      title: patch.title.trim(),
      category: patch.category,
      shortDesc: patch.shortDesc.trim(),
      longDesc: patch.longDesc.trim(),
      priceTaka: Math.round(patch.priceTaka),
      originalPriceTaka:
        patch.originalPriceTaka != null ? Math.round(patch.originalPriceTaka) : undefined,
      stock: patch.stock,
      delivery: patch.delivery,
      region: patch.region,
      platform: patch.platform?.trim() || undefined,
      warranty: patch.warranty?.trim() || undefined,
      images: patch.images,
      status: patch.status,
      publishedAt: becameActive ? Date.now() : existing.publishedAt,
      archivedAt: wasArchived ? undefined : existing.archivedAt,
    });
  },
});

export const archive = mutation({
  args: { id: v.id("listings") },
  handler: async (ctx, { id }) => {
    const { userId, user } = await requireSeller(ctx);
    const existing = await ctx.db.get(id);
    if (!existing) throw new Error("Listing not found.");
    if (existing.userId !== userId && user.role !== "admin") {
      throw new Error("You can only archive your own listings.");
    }
    await ctx.db.patch(id, { status: "archived", archivedAt: Date.now() });
  },
});

export const unarchive = mutation({
  args: { id: v.id("listings") },
  handler: async (ctx, { id }) => {
    const { userId, user } = await requireSeller(ctx);
    const existing = await ctx.db.get(id);
    if (!existing) throw new Error("Listing not found.");
    if (existing.userId !== userId && user.role !== "admin") {
      throw new Error("You can only unarchive your own listings.");
    }
    await ctx.db.patch(id, { status: "draft", archivedAt: undefined });
  },
});

// ---------------------------------------------------------------------
// Queries
// ---------------------------------------------------------------------

/** All listings for the signed-in seller. */
export const mine = query({
  args: {},
  handler: async (ctx) => {
    const userId = await getAuthUserId(ctx);
    if (!userId) return [];
    const rows = await ctx.db
      .query("listings")
      .withIndex("by_user", (q) => q.eq("userId", userId))
      .order("desc")
      .collect();
    return Promise.all(rows.map((l) => decorateListing(ctx, l)));
  },
});

/** A single listing by id, regardless of status (for the seller's edit page). */
export const byId = query({
  args: { id: v.id("listings") },
  handler: async (ctx, { id }) => {
    const userId = await getAuthUserId(ctx);
    const listing = await ctx.db.get(id);
    if (!listing) return null;
    // Owners (and admins) can see drafts/archived; everyone else only active.
    const user = userId ? await ctx.db.get(userId) : null;
    const owns = !!userId && listing.userId === userId;
    const isAdmin = user?.role === "admin";
    if (listing.status !== "active" && !owns && !isAdmin) return null;
    return decorateListing(ctx, listing);
  },
});

/** A single active listing by slug — the public product page. */
export const bySlug = query({
  args: { slug: v.string() },
  handler: async (ctx, { slug }) => {
    const listing = await ctx.db
      .query("listings")
      .withIndex("by_slug", (q) => q.eq("slug", slug))
      .first();
    if (!listing || listing.status !== "active") return null;
    return decorateListing(ctx, listing);
  },
});

/** Public, paginated browse query. Optional category filter. */
export const publicListings = query({
  args: {
    category: v.optional(listingCategory),
    limit: v.optional(v.number()),
  },
  handler: async (ctx, { category, limit }) => {
    const cap = Math.min(Math.max(limit ?? 60, 1), 120);
    const rows = category
      ? await ctx.db
          .query("listings")
          .withIndex("by_category_status", (q) =>
            q.eq("category", category).eq("status", "active"),
          )
          .order("desc")
          .take(cap)
      : await ctx.db
          .query("listings")
          .withIndex("by_status", (q) => q.eq("status", "active"))
          .order("desc")
          .take(cap);
    return Promise.all(rows.map((l) => decorateListing(ctx, l)));
  },
});
