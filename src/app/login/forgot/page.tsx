import Link from "next/link";
import { AuthLayout } from "@/components/site/auth-layout";
import { ForgotPasswordForm } from "@/components/auth/forgot-password-form";

export const metadata = { title: "Forgot password · Digibazar" };

export default function ForgotPasswordPage() {
  return (
    <AuthLayout
      title="Reset your password"
      subtitle="We'll email you a one-time link to set a new password."
    >
      <ForgotPasswordForm />
      <p className="mt-6 text-center text-[13px] text-fg-muted">
        Remembered it?{" "}
        <Link href="/login" className="font-medium text-iris-200 hover:text-iris-100">
          Back to sign in
        </Link>
      </p>
    </AuthLayout>
  );
}
