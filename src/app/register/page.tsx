import Link from "next/link";
import { ArrowRight, Lock, Mail, Phone, User } from "lucide-react";
import { Button } from "@/components/ui/button";
import { AuthLayout } from "@/app/login/page";

export const metadata = { title: "Create account · Digibazar" };

export default function RegisterPage() {
  return (
    <AuthLayout
      title="Create your account"
      subtitle="Buy digital products, save your wishlists, track your orders."
    >
      <form className="space-y-3">
        <div className="grid gap-3 md:grid-cols-2">
          <Field icon={<User size={14} />} label="Full name" placeholder="Your name" />
          <Field icon={<Phone size={14} />} label="Phone (bKash)" placeholder="01XXXXXXXXX" />
        </div>
        <Field icon={<Mail size={14} />} label="Email" placeholder="you@example.com" />
        <Field icon={<Lock size={14} />} label="Password" placeholder="At least 8 characters" type="password" />

        <label className="flex items-start gap-2 text-[12px] text-fg-muted">
          <input type="checkbox" defaultChecked className="mt-1 size-3.5 accent-iris-500" />
          I agree to the{" "}
          <Link href="/terms" className="text-iris-200 hover:text-iris-100">Terms</Link>
          {" "}and{" "}
          <Link href="/privacy" className="text-iris-200 hover:text-iris-100">Privacy Policy</Link>.
        </label>

        <Button size="lg" className="w-full">Create account <ArrowRight size={16} /></Button>
      </form>

      <p className="mt-6 text-center text-[13px] text-fg-muted">
        Already have an account?{" "}
        <Link href="/login" className="font-medium text-iris-200 hover:text-iris-100">Sign in</Link>
      </p>
    </AuthLayout>
  );
}

function Field({
  icon, label, type = "text", placeholder,
}: {
  icon?: React.ReactNode; label: string; type?: string; placeholder?: string;
}) {
  return (
    <label className="block">
      <div className="mb-1 text-[11px] font-semibold uppercase tracking-wider text-fg-subtle">
        {label}
      </div>
      <div className="relative">
        {icon && <span className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-fg-subtle">{icon}</span>}
        <input
          type={type}
          placeholder={placeholder}
          className={`h-11 w-full rounded-md border border-white/10 bg-white/5 ${icon ? "pl-9" : "pl-3"} pr-3 text-sm placeholder:text-fg-subtle focus:border-iris-400/50 focus:bg-white/[0.06] focus:outline-none`}
        />
      </div>
    </label>
  );
}
