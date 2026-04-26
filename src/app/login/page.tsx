import Link from "next/link";
import { ArrowRight, Lock, Mail, Phone } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Logo } from "@/components/site/logo";

export const metadata = { title: "Sign in · Digibazar" };

export default function LoginPage() {
  return (
    <AuthLayout
      title="Welcome back"
      subtitle="Sign in to access your orders, wishlists and digital codes."
    >
      <div className="grid gap-2">
        <SocialButton label="Continue with Google" />
        <SocialButton label="Continue with Facebook" />
        <SocialButton label="Continue with Apple" />
      </div>

      <Divider>or sign in with email</Divider>

      <form className="space-y-3">
        <Field icon={<Mail size={14} />} label="Email or phone" placeholder="you@example.com or 01XXXXXXXXX" />
        <Field icon={<Lock size={14} />} label="Password" placeholder="••••••••" type="password" />
        <div className="flex items-center justify-between text-[12.5px]">
          <label className="inline-flex items-center gap-2 text-fg-muted">
            <input type="checkbox" defaultChecked className="size-3.5 accent-iris-500" /> Remember me
          </label>
          <Link href="/forgot" className="text-iris-200 hover:text-iris-100">Forgot password?</Link>
        </div>
        <Button size="lg" className="w-full">Sign in <ArrowRight size={16} /></Button>
      </form>

      <p className="mt-6 text-center text-[13px] text-fg-muted">
        New to Digibazar?{" "}
        <Link href="/register" className="font-medium text-iris-200 hover:text-iris-100">
          Create an account
        </Link>
      </p>

      <p className="mt-2 text-center text-[12px] text-fg-subtle">
        Selling digital products? <Link href="/sell" className="text-iris-200 hover:text-iris-100">Apply as seller</Link>
      </p>
    </AuthLayout>
  );
}

export function AuthLayout({
  title, subtitle, children,
}: {
  title: string; subtitle: string; children: React.ReactNode;
}) {
  return (
    <div className="container-page py-12">
      <div className="mx-auto grid max-w-5xl gap-10 lg:grid-cols-12">
        <div className="lg:col-span-5">
          <div className="lg:hidden"><Logo size="lg" /></div>
          <div className="surface-card relative mt-6 overflow-hidden p-8 lg:mt-0">
            <div aria-hidden className="pointer-events-none absolute -right-20 -top-20 h-60 w-60 rounded-full bg-iris-500/30 blur-3xl" />
            <h1 className="font-display text-2xl font-extrabold md:text-3xl">{title}</h1>
            <p className="mt-1 text-sm text-fg-muted">{subtitle}</p>
            <div className="mt-6">{children}</div>
          </div>
        </div>

        <aside className="hidden lg:col-span-7 lg:block">
          <div className="surface-card relative h-full overflow-hidden p-10">
            <div aria-hidden className="absolute inset-0 bg-[radial-gradient(70%_60%_at_30%_-10%,rgba(91,61,255,0.35),transparent_60%)]" />
            <div className="relative">
              <Logo size="lg" />
              <h2 className="mt-8 font-display text-3xl font-extrabold leading-tight">
                Bangladesh&apos;s premium home for <span className="gradient-text">digital sellers & buyers.</span>
              </h2>
              <p className="mt-4 max-w-md text-sm text-fg-muted">
                Trusted Facebook sellers, instant delivery, full buyer protection. Pay with bKash,
                Nagad, Rocket — or your card.
              </p>

              <div className="mt-10 grid gap-3 md:grid-cols-2">
                <Stat v="62K+" l="orders this month" />
                <Stat v="2 min" l="avg. delivery" />
                <Stat v="4.91" l="avg. rating" />
                <Stat v="0%" l="seller fees during onboarding" />
              </div>

              <div className="mt-10 flex flex-wrap items-center gap-2 text-[12.5px] text-fg-muted">
                <Phone size={13} /> 24/7 support · Bangla & English
              </div>
            </div>
          </div>
        </aside>
      </div>
    </div>
  );
}

function Stat({ v, l }: { v: string; l: string }) {
  return (
    <div className="rounded-xl border border-white/10 bg-white/[0.03] p-4">
      <div className="font-display text-xl font-bold">{v}</div>
      <div className="text-[12px] text-fg-subtle">{l}</div>
    </div>
  );
}

function SocialButton({ label }: { label: string }) {
  return (
    <button className="h-11 rounded-lg border border-white/10 bg-white/[0.04] text-[13.5px] font-medium hover:bg-white/[0.07]">
      {label}
    </button>
  );
}

function Divider({ children }: { children: React.ReactNode }) {
  return (
    <div className="relative my-5 flex items-center">
      <div className="h-px flex-1 bg-white/5" />
      <span className="px-3 text-[11px] uppercase tracking-wider text-fg-subtle">{children}</span>
      <div className="h-px flex-1 bg-white/5" />
    </div>
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
