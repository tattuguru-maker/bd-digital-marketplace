"use server";

import { revalidatePath } from "next/cache";
import type * as z from "zod";
import { createAdminClient } from "@/lib/supabase/admin";
import { requireUser, requireAdmin } from "@/lib/auth/guards";
import { SellerApplySchema, type AuthFormState } from "@/lib/auth/schemas";

const ALLOWED_MIME = new Set([
  "image/jpeg",
  "image/png",
  "image/webp",
  "application/pdf",
]);
const MAX_BYTES = 10 * 1024 * 1024; // 10 MB
const REQUIRED_DOCS = ["nidFront", "nidBack", "selfie"] as const;
type DocField = (typeof REQUIRED_DOCS)[number];

const DOC_KIND: Record<DocField, "nid_front" | "nid_back" | "selfie"> = {
  nidFront: "nid_front",
  nidBack: "nid_back",
  selfie: "selfie",
};

function flatten(error: z.ZodError): Record<string, string[]> {
  const out: Record<string, string[]> = {};
  for (const issue of error.issues) {
    const key = issue.path[0]?.toString() ?? "_form";
    (out[key] ||= []).push(issue.message);
  }
  return out;
}

function safeExt(mime: string) {
  switch (mime) {
    case "image/jpeg": return "jpg";
    case "image/png":  return "png";
    case "image/webp": return "webp";
    case "application/pdf": return "pdf";
    default: return "bin";
  }
}

// -----------------------------------------------------------------------------
// Submit a seller application (creates seller row + uploads NID docs)
// -----------------------------------------------------------------------------
export async function applyAsSeller(
  _prev: AuthFormState,
  formData: FormData,
): Promise<AuthFormState> {
  const { user, supabase } = await requireUser("/sell/apply");

  const parsed = SellerApplySchema.safeParse({
    displayName: formData.get("displayName"),
    handle: formData.get("handle"),
    location: formData.get("location"),
    bio: formData.get("bio"),
    nidNumber: formData.get("nidNumber"),
    agreePolicies: formData.get("agreePolicies") ?? "",
  });
  if (!parsed.success) {
    return { ok: false, errors: flatten(parsed.error) };
  }
  const data = parsed.data;

  // Check that a seller row doesn't already exist for this user.
  const { data: existing } = await supabase
    .from("sellers")
    .select("id, status")
    .eq("user_id", user.id)
    .maybeSingle();
  if (existing) {
    return {
      ok: false,
      message:
        existing.status === "verified"
          ? "You're already a verified seller."
          : "You already have an application pending review.",
    };
  }

  // Validate uploaded files.
  const docFiles: Record<DocField, File> = {} as Record<DocField, File>;
  for (const field of REQUIRED_DOCS) {
    const file = formData.get(field);
    if (!(file instanceof File) || file.size === 0) {
      return {
        ok: false,
        errors: { [field]: [`Please upload your ${field.replace(/([A-Z])/g, " $1").toLowerCase()}.`] },
      };
    }
    if (!ALLOWED_MIME.has(file.type)) {
      return {
        ok: false,
        errors: { [field]: ["Use JPG, PNG, WEBP or PDF."] },
      };
    }
    if (file.size > MAX_BYTES) {
      return { ok: false, errors: { [field]: ["File too large (max 10MB)."] } };
    }
    docFiles[field] = file;
  }

  // Insert the seller row first so we can attach the docs.
  const { data: seller, error: sellerErr } = await supabase
    .from("sellers")
    .insert({
      user_id: user.id,
      display_name: data.displayName,
      handle: data.handle,
      bio: data.bio,
      location: data.location,
      nid_number: data.nidNumber,
    })
    .select("id")
    .single();
  if (sellerErr || !seller) {
    if (sellerErr?.code === "23505") {
      return {
        ok: false,
        errors: { handle: ["That handle is taken — pick another."] },
      };
    }
    return {
      ok: false,
      message: sellerErr?.message ?? "Could not submit application.",
    };
  }

  // Upload each document under kyc-documents/{user.id}/{kind}-{timestamp}.{ext}
  const ts = Date.now();
  for (const field of REQUIRED_DOCS) {
    const file = docFiles[field];
    const kind = DOC_KIND[field];
    const path = `${user.id}/${kind}-${ts}.${safeExt(file.type)}`;

    const { error: upErr } = await supabase.storage
      .from("kyc-documents")
      .upload(path, file, { contentType: file.type, upsert: false });
    if (upErr) {
      return { ok: false, message: `Could not upload ${kind}: ${upErr.message}` };
    }

    const { error: docErr } = await supabase.from("kyc_documents").insert({
      user_id: user.id,
      seller_id: seller.id,
      kind,
      storage_path: path,
      mime: file.type,
      size_bytes: file.size,
    });
    if (docErr) {
      return { ok: false, message: docErr.message };
    }
  }

  revalidatePath("/sell/apply");
  return {
    ok: true,
    message:
      "Application submitted! Our team typically reviews within 24 hours. We'll email you the decision.",
  };
}

// -----------------------------------------------------------------------------
// Admin: approve / reject a seller application
// -----------------------------------------------------------------------------
export async function approveSeller(formData: FormData) {
  const { user } = await requireAdmin();
  const sellerId = String(formData.get("sellerId") ?? "");
  const notes = String(formData.get("notes") ?? "") || null;
  if (!sellerId) return;

  const admin = createAdminClient();

  const { data: seller, error: sellerErr } = await admin
    .from("sellers")
    .update({
      status: "verified",
      reviewed_at: new Date().toISOString(),
      reviewer_id: user.id,
      rejection_reason: null,
    })
    .eq("id", sellerId)
    .select("user_id")
    .single();
  if (sellerErr || !seller) return;

  await admin.from("kyc_reviews").insert({
    seller_id: sellerId,
    reviewer_id: user.id,
    decision: "approved",
    notes,
  });

  // Promote the user from buyer to seller role.
  await admin
    .from("profiles")
    .update({ role: "seller" })
    .eq("id", seller.user_id);

  revalidatePath("/admin/kyc");
}

export async function rejectSeller(formData: FormData) {
  const { user } = await requireAdmin();
  const sellerId = String(formData.get("sellerId") ?? "");
  const reason = String(formData.get("reason") ?? "").trim() || "Did not meet our seller verification requirements.";
  if (!sellerId) return;

  const admin = createAdminClient();

  await admin
    .from("sellers")
    .update({
      status: "rejected",
      reviewed_at: new Date().toISOString(),
      reviewer_id: user.id,
      rejection_reason: reason,
    })
    .eq("id", sellerId);

  await admin.from("kyc_reviews").insert({
    seller_id: sellerId,
    reviewer_id: user.id,
    decision: "rejected",
    notes: reason,
  });

  revalidatePath("/admin/kyc");
}

// -----------------------------------------------------------------------------
// Used by the admin page — get a signed URL so a private NID image can be
// displayed in the review queue.
// -----------------------------------------------------------------------------
export async function signKycDocumentUrl(storagePath: string) {
  await requireAdmin();
  const admin = createAdminClient();
  const { data, error } = await admin.storage
    .from("kyc-documents")
    .createSignedUrl(storagePath, 60 * 5);
  if (error) return null;
  return data.signedUrl;
}


