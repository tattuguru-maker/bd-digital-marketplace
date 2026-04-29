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
