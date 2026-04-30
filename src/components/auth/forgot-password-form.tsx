"use client";

import { Mail } from "lucide-react";
import { FormSuccess } from "@/components/auth/auth-fields";

/**
 * Password reset is wired through Convex Auth's `Password` provider. Reset
 * emails require the `Resend` email provider to be configured on the Convex
 * deployment. Until that integration is set up, point the user at support so
 * they can recover their account manually.
 */
export function ForgotPasswordForm() {
  return (
    <div className="space-y-4">
      <FormSuccess message="Password reset emails are being set up — almost there." />
      <p className="text-[13px] text-fg-muted">
        While we finish wiring our email service, please email{" "}
        <a
          href="mailto:support@digibazar.com"
          className="text-iris-200 hover:text-iris-100"
        >
          support@digibazar.com
        </a>{" "}
        from the address on your account and we&apos;ll reset your password
        within an hour during business hours.
      </p>
      <div className="rounded-md border border-white/5 bg-white/[0.03] p-3 text-[12px] text-fg-subtle">
        <Mail size={12} className="mr-1.5 inline-block" />
        Once the reset email pipeline is live, you&apos;ll receive a one-click
        link here automatically — no extra steps on your side.
      </div>
    </div>
  );
}
