import Link from "next/link";
import { AuthLayout } from "@/components/site/auth-layout";
import { SignupForm } from "@/components/auth/signup-form";

export const metadata = { title: "Create account · Digibazar" };

export default async function RegisterPage({
  searchParams,
}: {
  searchParams: Promise<{ next?: string }>;
}) {
  const { next = "/" } = await searchParams;

  return (
    <AuthLayout
      title="Create your account"
      subtitle="Buy digital products, save your wishlists, track your orders."
    >
      <SignupForm next={next} />

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
