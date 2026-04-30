/**
 * Convex schema for Digibazar.
 *
 * This file defines every table, its fields and the indexes we query by.
 * Convex enforces this schema at deployment time. Tables coming from
 * `authTables` (`users`, `authAccounts`, `authSessions`, ...) are managed by
 * Convex Auth.
 */
import { defineSchema, defineTable } from "convex/server";
import { v } from "convex/values";
import { authTables } from "@convex-dev/auth/server";

const profileRole = v.union(
  v.literal("buyer"),
  v.literal("seller"),
  v.literal("admin"),
);

const sellerStatus = v.union(
  v.literal("pending_review"),
  v.literal("verified"),
  v.literal("rejected"),
  v.literal("suspended"),
);

const kycDocKind = v.union(
  v.literal("nid_front"),
  v.literal("nid_back"),
  v.literal("selfie"),
  v.literal("trade_license"),
  v.literal("tin"),
);

const kycReviewDecision = v.union(
  v.literal("approved"),
  v.literal("rejected"),
  v.literal("needs_more_info"),
);

const listingStatus = v.union(
  v.literal("draft"),
  v.literal("active"),
  v.literal("archived"),
);

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

export default defineSchema({
  // ---------------------------------------------------------------------
  // Tables required by Convex Auth.
  //   users, authSessions, authAccounts, authRefreshTokens,
  //   authVerificationCodes, authVerifiers, authRateLimits
  //
  // We extend `users` with our app-specific profile fields. Convex Auth
  // merges these fields with the defaults (email, image, etc.) so they live
  // on the same row.
  // ---------------------------------------------------------------------
  ...authTables,

  users: defineTable({
    // Defaults coming from Convex Auth — keep optional so OAuth / email
    // verification flows that haven't filled them in yet still type-check.
    name: v.optional(v.string()),
    image: v.optional(v.string()),
    email: v.optional(v.string()),
    emailVerificationTime: v.optional(v.number()),
    phone: v.optional(v.string()),
    phoneVerificationTime: v.optional(v.number()),
    isAnonymous: v.optional(v.boolean()),

    // App-specific fields layered on top.
    fullName: v.optional(v.string()),
    role: v.optional(profileRole),
    createdAt: v.optional(v.number()),
  })
    .index("email", ["email"])
    .index("phone", ["phone"]),

  // ---------------------------------------------------------------------
  // sellers — one row per seller storefront.
  // ---------------------------------------------------------------------
  sellers: defineTable({
    userId: v.id("users"),
    displayName: v.string(),
    handle: v.string(),
    bio: v.optional(v.string()),
    location: v.optional(v.string()),
    nidNumber: v.optional(v.string()),
    status: sellerStatus,
    submittedAt: v.number(),
    reviewedAt: v.optional(v.number()),
    reviewerId: v.optional(v.id("users")),
    rejectionReason: v.optional(v.string()),
  })
    .index("by_user", ["userId"])
    .index("by_handle", ["handle"])
    .index("by_status", ["status"]),

  // ---------------------------------------------------------------------
  // kycDocuments — KYC images uploaded to Convex File Storage.
  // ---------------------------------------------------------------------
  kycDocuments: defineTable({
    userId: v.id("users"),
    sellerId: v.optional(v.id("sellers")),
    kind: kycDocKind,
    storageId: v.id("_storage"),
    mime: v.string(),
    sizeBytes: v.number(),
  })
    .index("by_seller", ["sellerId"])
    .index("by_user", ["userId"]),

  // ---------------------------------------------------------------------
  // kycReviews — audit trail for admin decisions.
  // ---------------------------------------------------------------------
  kycReviews: defineTable({
    sellerId: v.id("sellers"),
    reviewerId: v.id("users"),
    decision: kycReviewDecision,
    notes: v.optional(v.string()),
  }).index("by_seller", ["sellerId"]),

  // ---------------------------------------------------------------------
  // listings — products posted by verified sellers.
  // ---------------------------------------------------------------------
  listings: defineTable({
    sellerId: v.id("sellers"),
    userId: v.id("users"), // owner shortcut for permission checks

    title: v.string(),
    slug: v.string(),
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

    status: listingStatus,
    publishedAt: v.optional(v.number()),
    archivedAt: v.optional(v.number()),
    sold: v.number(), // bumped on order completion (future)
    views: v.number(),
  })
    .index("by_seller", ["sellerId"])
    .index("by_user", ["userId"])
    .index("by_status", ["status"])
    .index("by_category_status", ["category", "status"])
    .index("by_slug", ["slug"]),

  // ---------------------------------------------------------------------
  // authAuditLog — login attempts, signups, suspicious activity.
  // ---------------------------------------------------------------------
  authAuditLog: defineTable({
    userId: v.optional(v.id("users")),
    event: v.string(),
    ip: v.optional(v.string()),
    userAgent: v.optional(v.string()),
    metadata: v.optional(v.any()),
  })
    .index("by_user", ["userId"])
    .index("by_event", ["event"]),
});
