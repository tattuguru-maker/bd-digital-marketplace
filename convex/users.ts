/**
 * User / profile queries and mutations.
 */
import { query, mutation } from "./_generated/server";
import { v } from "convex/values";
import { getAuthUserId } from "@convex-dev/auth/server";

/**
 * The currently signed-in user's profile (or null when anonymous).
 *
 * Also pulls the related seller record (if any) so the UI can show "you're a
 * seller / pending review" without a second round-trip.
 */
export const current = query({
  args: {},
  handler: async (ctx) => {
    const userId = await getAuthUserId(ctx);
    if (!userId) return null;

    const user = await ctx.db.get(userId);
    if (!user) return null;

    const seller = await ctx.db
      .query("sellers")
      .withIndex("by_user", (q) => q.eq("userId", userId))
      .unique();

    return {
      id: user._id,
      email: user.email,
      fullName: user.fullName ?? user.name ?? null,
      role: user.role ?? "buyer",
      emailVerified: Boolean(user.emailVerificationTime),
      seller: seller
        ? {
            id: seller._id,
            displayName: seller.displayName,
            handle: seller.handle,
            status: seller.status,
            rejectionReason: seller.rejectionReason ?? null,
            submittedAt: seller.submittedAt,
            reviewedAt: seller.reviewedAt ?? null,
          }
        : null,
    };
  },
});

/**
 * Admin-only: promote/demote a user. Used to bootstrap the very first admin
 * by hand from the Convex dashboard, then via the UI afterwards.
 */
export const setRole = mutation({
  args: {
    targetUserId: v.id("users"),
    role: v.union(
      v.literal("buyer"),
      v.literal("seller"),
      v.literal("admin"),
    ),
  },
  handler: async (ctx, { targetUserId, role }) => {
    const callerId = await getAuthUserId(ctx);
    if (!callerId) throw new Error("Not signed in");
    const caller = await ctx.db.get(callerId);
    if (caller?.role !== "admin") throw new Error("Admin access required");
    await ctx.db.patch(targetUserId, { role });
  },
});
