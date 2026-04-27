import Link from "next/link";
import { redirect } from "next/navigation";
import { AuthLayout } from "@/components/site/auth-layout";
import { SignupForm } from "@/components/auth/signup-form";
import { GoogleButton } from "@/components/auth/google-button";
import { createClient, isConfigured } from "@/lib/supabase/server";

export const metadata = { title: "Create account · Digibazar" };

export default async function RegisterPage({
  searchParams,
}: {
  searchParams: Promise<{ next?: string }>;
}) {
  const { next = "/" } = await searchParams;

  if (isConfigured()) {
    const supabase = await createClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();
    if (user) redirect(next || "/");
  }

  return (
    <AuthLayout
      title="Create your account"
      subtitle="Buy digital products, save your wishlists, track your orders."
    >
      <div className="grid gap-2">
        <GoogleButton next={next} />
      </div>

      <Divider>or sign up with email</Divider>

      <SignupForm />

      <p className="mt-6 text-center text-[13px] text-fg-muted">
        Already have an account?{" "}
        <Link
          href={`/login${next && next !== "/" ? `?next=${encodeURIComponent(next)}` : ""}`}
          className="font-medium text-iris-200 hover:text-iris-100"
        >
          Sign in
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
