/**
 * File upload helpers (KYC documents).
 *
 * The recommended Convex pattern for client uploads is:
 *   1. Client calls `generateUploadUrl()` -> returns a short-lived URL
 *   2. Client `POST`s the file directly to that URL
 *   3. Convex returns a `storageId`
 *   4. Client passes the `storageId` back to a mutation that records it
 */
import { mutation, query } from "./_generated/server";
import { v } from "convex/values";
import { getAuthUserId } from "@convex-dev/auth/server";

export const generateUploadUrl = mutation({
  args: {},
  handler: async (ctx) => {
    const userId = await getAuthUserId(ctx);
    if (!userId) throw new Error("Sign in to upload files");
    return await ctx.storage.generateUploadUrl();
  },
});

/**
 * Admin-only signed URL fetch for a stored KYC document — used by the
 * admin review queue to display NID images.
 */
export const getSignedUrl = query({
  args: { storageId: v.id("_storage") },
  handler: async (ctx, { storageId }) => {
    const callerId = await getAuthUserId(ctx);
    if (!callerId) return null;
    const caller = await ctx.db.get(callerId);
    if (caller?.role !== "admin") return null;
    return await ctx.storage.getUrl(storageId);
  },
});
