import Link from "next/link";
import { redirect } from "next/navigation";
import { AuthLayout } from "@/components/site/auth-layout";
import { LoginForm } from "@/components/auth/login-form";
import { GoogleButton } from "@/components/auth/google-button";
import { FormError } from "@/components/auth/auth-fields";
import { createClient, isConfigured } from "@/lib/supabase/server";

export const metadata = { title: "Sign in · Digibazar" };

export default async function LoginPage({
  searchParams,
}: {
  searchParams: Promise<{ next?: string; error?: string }>;
}) {
  const { next = "/", error } = await searchParams;

  // If already signed in, send them to `next`.
  if (isConfigured()) {
    const supabase = await createClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();
    if (user) redirect(next || "/");
  }

  return (
    <AuthLayout
      title="Welcome back"
      subtitle="Sign in to access your orders, wishlists and digital codes."
    >
      <FormError message={error} />

      <div className="grid gap-2">
        <GoogleButton next={next} />
      </div>

      <Divider>or sign in with email</Divider>

      <LoginForm next={next} />

      <p className="mt-6 text-center text-[13px] text-fg-muted">
        New to Digibazar?{" "}
        <Link
          href={`/register${next && next !== "/" ? `?next=${encodeURIComponent(next)}` : ""}`}
          className="font-medium text-iris-200 hover:text-iris-100"
        >
          Create an account
        </Link>
      </p>

      <p className="mt-2 text-center text-[12px] text-fg-subtle">
        Selling digital products?{" "}
        <Link href="/sell" className="text-iris-200 hover:text-iris-100">
          Apply as seller
        </Link>
      </p>
    </AuthLayout>
  );
}

function Divider({ children }: { children: React.ReactNode }) {
  return (
    <div className="relative my-5 flex items-center">
      <div className="h-px flex-1 bg-white/5" />
      <span className="px-3 text-[11px] uppercase tracking-wider text-fg-subtle">
        {children}
      </span>
      <div className="h-px flex-1 bg-white/5" />
    </div>
  );
}
