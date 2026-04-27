import { redirect } from "next/navigation";
import { createClient, isConfigured } from "@/lib/supabase/server";

/**
 * Server-side helpers for use inside Server Components and Server Actions.
 *
 * Important: route protection itself happens in proxy.ts so that anonymous
 * users hit the /login redirect even when JS is disabled. These helpers exist
 * so individual pages can also load profile/role data and enforce admin-only
 * access.
 */
export async function requireUser(redirectTo?: string) {
  if (!isConfigured()) {
    redirect(`/login${redirectTo ? `?next=${encodeURIComponent(redirectTo)}` : ""}`);
  }
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) {
    redirect(`/login${redirectTo ? `?next=${encodeURIComponent(redirectTo)}` : ""}`);
  }
  return { supabase, user };
}

export async function getProfile() {
  if (!isConfigured()) {
    return { user: null, profile: null, supabase: null };
  }
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return { user: null, profile: null, supabase };

  const { data: profile } = await supabase
    .from("profiles")
    .select("*")
    .eq("id", user.id)
    .single();

  return { user, profile, supabase };
}

export async function requireAdmin() {
  const { user, profile, supabase } = await getProfile();
  if (!user) redirect("/login?next=/admin/kyc");
  if (!profile || profile.role !== "admin") {
    redirect("/?error=admin_required");
  }
  return { user, profile, supabase };
}
