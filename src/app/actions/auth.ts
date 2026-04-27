"use server";

import { headers } from "next/headers";
import { redirect } from "next/navigation";
import type * as z from "zod";
import { createClient } from "@/lib/supabase/server";
import {
  LoginSchema,
  MagicLinkSchema,
  SignupSchema,
  type AuthFormState,
} from "@/lib/auth/schemas";
import { isDisposableEmail } from "@/lib/auth/disposable-emails";
import { getClientIp, rateLimit } from "@/lib/auth/rate-limit";

function getSiteUrl() {
  return process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000";
}

function flatten(error: z.ZodError): Record<string, string[]> {
  const errors: Record<string, string[]> = {};
  for (const issue of error.issues) {
    const key = issue.path[0]?.toString() ?? "_form";
    (errors[key] ||= []).push(issue.message);
  }
  return errors;
}

// -----------------------------------------------------------------------------
// Email + password signup
// -----------------------------------------------------------------------------
export async function signup(
  _prev: AuthFormState,
  formData: FormData,
): Promise<AuthFormState> {
  const parsed = SignupSchema.safeParse({
    fullName: formData.get("fullName"),
    email: formData.get("email"),
    phone: formData.get("phone"),
    password: formData.get("password"),
    agree: formData.get("agree") ?? "",
  });
  if (!parsed.success) {
    return { ok: false, errors: flatten(parsed.error) };
  }
  const { fullName, email, phone, password } = parsed.data;

  if (isDisposableEmail(email)) {
    return {
      ok: false,
      errors: { email: ["Please use a real email — disposable mailboxes aren't allowed."] },
    };
  }

  const h = await headers();
  const ip = getClientIp(h);
  const rl = rateLimit(`signup:${ip}`, { limit: 5, windowMs: 60 * 60_000 });
  if (!rl.ok) {
    return {
      ok: false,
      message: `Too many signups from this network. Try again in ${Math.ceil(
        rl.retryAfterMs / 60_000,
      )} minutes.`,
    };
  }

  const supabase = await createClient();
  const { error } = await supabase.auth.signUp({
    email,
    password,
    options: {
      data: { full_name: fullName, phone: phone || null },
      emailRedirectTo: `${getSiteUrl()}/auth/callback?next=/`,
    },
  });
  if (error) {
    return { ok: false, message: error.message };
  }

  return {
    ok: true,
    message:
      "Almost there — we've sent a confirmation link to your email. Click it to finish creating your account.",
  };
}

// -----------------------------------------------------------------------------
// Email + password login
// -----------------------------------------------------------------------------
export async function login(
  _prev: AuthFormState,
  formData: FormData,
): Promise<AuthFormState> {
  const parsed = LoginSchema.safeParse({
    email: formData.get("email"),
    password: formData.get("password"),
  });
  if (!parsed.success) {
    return { ok: false, errors: flatten(parsed.error) };
  }
  const { email, password } = parsed.data;

  const h = await headers();
  const ip = getClientIp(h);
  const rl = rateLimit(`login:${ip}:${email}`, { limit: 8, windowMs: 15 * 60_000 });
  if (!rl.ok) {
    return {
      ok: false,
      message: "Too many attempts. Wait a few minutes before trying again.",
    };
  }

  const supabase = await createClient();
  const { error } = await supabase.auth.signInWithPassword({ email, password });
  if (error) {
    return { ok: false, message: "Email or password is incorrect." };
  }

  const next = (formData.get("next") as string) || "/";
  redirect(next);
}

// -----------------------------------------------------------------------------
// Email magic link
// -----------------------------------------------------------------------------
export async function sendMagicLink(
  _prev: AuthFormState,
  formData: FormData,
): Promise<AuthFormState> {
  const parsed = MagicLinkSchema.safeParse({ email: formData.get("email") });
  if (!parsed.success) {
    return { ok: false, errors: flatten(parsed.error) };
  }
  const { email } = parsed.data;

  if (isDisposableEmail(email)) {
    return {
      ok: false,
      errors: { email: ["Please use a real email."] },
    };
  }

  const h = await headers();
  const ip = getClientIp(h);
  const rl = rateLimit(`magic:${ip}`, { limit: 5, windowMs: 60 * 60_000 });
  if (!rl.ok) {
    return { ok: false, message: "Too many requests. Try again later." };
  }

  const supabase = await createClient();
  const next = (formData.get("next") as string) || "/";
  const { error } = await supabase.auth.signInWithOtp({
    email,
    options: {
      shouldCreateUser: true,
      emailRedirectTo: `${getSiteUrl()}/auth/callback?next=${encodeURIComponent(next)}`,
    },
  });
  if (error) {
    return { ok: false, message: error.message };
  }
  return {
    ok: true,
    message: "Check your inbox — we just sent you a sign-in link.",
  };
}

// -----------------------------------------------------------------------------
// Google OAuth
// -----------------------------------------------------------------------------
export async function loginWithGoogle(formData: FormData) {
  const supabase = await createClient();
  const next = (formData.get("next") as string) || "/";
  const { data, error } = await supabase.auth.signInWithOAuth({
    provider: "google",
    options: {
      redirectTo: `${getSiteUrl()}/auth/callback?next=${encodeURIComponent(next)}`,
      queryParams: {
        access_type: "offline",
        prompt: "select_account",
      },
    },
  });
  if (error || !data?.url) {
    redirect(`/login?error=${encodeURIComponent(error?.message ?? "Could not start Google sign-in.")}`);
  }
  redirect(data.url);
}

// -----------------------------------------------------------------------------
// Forgot password — email a reset link
// -----------------------------------------------------------------------------
export async function sendPasswordReset(
  _prev: AuthFormState,
  formData: FormData,
): Promise<AuthFormState> {
  const parsed = MagicLinkSchema.safeParse({ email: formData.get("email") });
  if (!parsed.success) {
    return { ok: false, errors: flatten(parsed.error) };
  }
  const { email } = parsed.data;

  const h = await headers();
  const ip = getClientIp(h);
  const rl = rateLimit(`reset:${ip}`, { limit: 5, windowMs: 60 * 60_000 });
  if (!rl.ok) {
    return { ok: false, message: "Too many requests. Try again later." };
  }

  const supabase = await createClient();
  const { error } = await supabase.auth.resetPasswordForEmail(email, {
    redirectTo: `${getSiteUrl()}/auth/callback?next=/account`,
  });
  if (error) {
    return { ok: false, message: error.message };
  }
  return {
    ok: true,
    message:
      "If an account exists with that email, we just sent a reset link. Check your inbox.",
  };
}

// -----------------------------------------------------------------------------
// Logout
// -----------------------------------------------------------------------------
export async function logout() {
  const supabase = await createClient();
  await supabase.auth.signOut();
  redirect("/");
}


