import Link from "next/link";
import { AuthLayout } from "@/components/site/auth-layout";
import { LoginForm } from "@/components/auth/login-form";
import { FormError } from "@/components/auth/auth-fields";

export const metadata = { title: "Sign in · Digibazar" };

export default async function LoginPage({
  searchParams,
}: {
  searchParams: Promise<{ next?: string; error?: string }>;
}) {
  const { next = "/", error } = await searchParams;

  return (
    <AuthLayout
      title="Welcome back"
      subtitle="Sign in to access your orders, wishlists and digital codes."
    >
      <FormError message={error} />

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
