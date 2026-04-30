/**
 * Seller registration + admin review.
 */
import { mutation, query } from "./_generated/server";
import { v } from "convex/values";
import { getAuthUserId } from "@convex-dev/auth/server";

const HANDLE_RE = /^[a-z0-9](?:[a-z0-9-]{1,22}[a-z0-9])$/;
const NID_RE = /^\d{10,17}$/;

const docKind = v.union(
  v.literal("nid_front"),
  v.literal("nid_back"),
  v.literal("selfie"),
);

const documentInput = v.object({
  kind: docKind,
  storageId: v.id("_storage"),
  mime: v.string(),
  sizeBytes: v.number(),
});

/**
 * Submit a seller application. Creates the seller row in `pending_review`
 * and links the previously-uploaded KYC documents to it.
 */
export const apply = mutation({
  args: {
    displayName: v.string(),
    handle: v.string(),
    location: v.string(),
    bio: v.optional(v.string()),
    nidNumber: v.string(),
    documents: v.array(documentInput),
  },
  handler: async (ctx, args) => {
    const userId = await getAuthUserId(ctx);
    if (!userId) throw new Error("You need to sign in first.");

    // Server-side validation. Mirrors the Zod schema in the UI but never
    // trust the client.
    const displayName = args.displayName.trim();
    const handle = args.handle.trim().toLowerCase();
    const location = args.location.trim();
    const bio = (args.bio ?? "").trim();
    const nidNumber = args.nidNumber.trim();

    if (displayName.length < 3 || displayName.length > 60) {
      throw new Error("Display name must be 3–60 characters.");
    }
    if (!HANDLE_RE.test(handle)) {
      throw new Error(
        "Handle must be 3–24 lowercase letters, numbers or dashes.",
      );
    }
    if (location.length < 2) throw new Error("Location is required.");
    if (bio && (bio.length < 40 || bio.length > 500)) {
      throw new Error("Bio must be 40–500 characters when provided.");
    }
    if (!NID_RE.test(nidNumber)) {
      throw new Error("NID number must be 10–17 digits.");
    }
    if (args.documents.length < 3) {
      throw new Error("Upload your NID front, NID back and selfie.");
    }

    // One seller record per user.
    const existing = await ctx.db
      .query("sellers")
      .withIndex("by_user", (q) => q.eq("userId", userId))
      .unique();
    if (existing) {
      throw new Error(
        existing.status === "verified"
          ? "You're already a verified seller."
          : "You already have a seller application on file.",
      );
    }

    // Reject duplicate handles.
    const handleTaken = await ctx.db
      .query("sellers")
      .withIndex("by_handle", (q) => q.eq("handle", handle))
      .unique();
    if (handleTaken) throw new Error("That handle is already taken.");

    const sellerId = await ctx.db.insert("sellers", {
      userId,
      displayName,
      handle,
      bio: bio || undefined,
      location,
      nidNumber,
      status: "pending_review",
      submittedAt: Date.now(),
    });

    for (const doc of args.documents) {
      await ctx.db.insert("kycDocuments", {
        userId,
        sellerId,
        kind: doc.kind,
        storageId: doc.storageId,
        mime: doc.mime,
        sizeBytes: doc.sizeBytes,
      });
    }

    return { sellerId };
  },
});

/**
 * The current user's seller application (if any). Used by /sell/apply to
 * show pending / approved / rejected state.
 */
export const myApplication = query({
  args: {},
  handler: async (ctx) => {
    const userId = await getAuthUserId(ctx);
    if (!userId) return null;
    return await ctx.db
      .query("sellers")
      .withIndex("by_user", (q) => q.eq("userId", userId))
      .unique();
  },
});

/**
 * Admin-only: list seller applications by status, with their KYC docs.
 */
export const listForReview = query({
  args: {
    status: v.union(
      v.literal("pending_review"),
      v.literal("verified"),
      v.literal("rejected"),
      v.literal("suspended"),
    ),
  },
  handler: async (ctx, { status }) => {
    const callerId = await getAuthUserId(ctx);
    if (!callerId) return [];
    const caller = await ctx.db.get(callerId);
    if (caller?.role !== "admin") return [];

    const sellers = await ctx.db
      .query("sellers")
      .withIndex("by_status", (q) => q.eq("status", status))
      .order("desc")
      .collect();

    const enriched = await Promise.all(
      sellers.map(async (s) => {
        const owner = await ctx.db.get(s.userId);
        const docs = await ctx.db
          .query("kycDocuments")
          .withIndex("by_seller", (q) => q.eq("sellerId", s._id))
          .collect();
        const docsWithUrls = await Promise.all(
          docs.map(async (d) => ({
            id: d._id,
            kind: d.kind,
            mime: d.mime,
            url: await ctx.storage.getUrl(d.storageId),
          })),
        );
        return {
          id: s._id,
          displayName: s.displayName,
          handle: s.handle,
          bio: s.bio ?? null,
          location: s.location ?? null,
          nidNumber: s.nidNumber ?? null,
          status: s.status,
          submittedAt: s.submittedAt,
          rejectionReason: s.rejectionReason ?? null,
          owner: owner
            ? {
                fullName: owner.fullName ?? owner.name ?? null,
                email: owner.email ?? null,
                phone: owner.phone ?? null,
              }
            : null,
          documents: docsWithUrls,
        };
      }),
    );
    return enriched;
  },
});

export const approve = mutation({
  args: { sellerId: v.id("sellers"), notes: v.optional(v.string()) },
  handler: async (ctx, { sellerId, notes }) => {
    const callerId = await getAuthUserId(ctx);
    if (!callerId) throw new Error("Not signed in");
    const caller = await ctx.db.get(callerId);
    if (caller?.role !== "admin") throw new Error("Admin access required");

    const seller = await ctx.db.get(sellerId);
    if (!seller) throw new Error("Seller not found");

    await ctx.db.patch(sellerId, {
      status: "verified",
      reviewedAt: Date.now(),
      reviewerId: callerId,
      rejectionReason: undefined,
    });
    // Promote the seller's account, but never downgrade an admin.
    const owner = await ctx.db.get(seller.userId);
    if (owner && owner.role !== "admin") {
      await ctx.db.patch(seller.userId, { role: "seller" });
    }
    await ctx.db.insert("kycReviews", {
      sellerId,
      reviewerId: callerId,
      decision: "approved",
      notes,
    });
  },
});

export const reject = mutation({
  args: { sellerId: v.id("sellers"), reason: v.string() },
  handler: async (ctx, { sellerId, reason }) => {
    const callerId = await getAuthUserId(ctx);
    if (!callerId) throw new Error("Not signed in");
    const caller = await ctx.db.get(callerId);
    if (caller?.role !== "admin") throw new Error("Admin access required");

    const trimmed = reason.trim();
    if (trimmed.length < 5) throw new Error("Reason must be at least 5 characters.");

    await ctx.db.patch(sellerId, {
      status: "rejected",
      reviewedAt: Date.now(),
      reviewerId: callerId,
      rejectionReason: trimmed,
    });
    await ctx.db.insert("kycReviews", {
      sellerId,
      reviewerId: callerId,
      decision: "rejected",
      notes: trimmed,
    });
  },
});
