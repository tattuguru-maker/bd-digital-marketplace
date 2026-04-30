import { Phone } from "lucide-react";
import { Logo } from "@/components/site/logo";

export function AuthLayout({
  title,
  subtitle,
  children,
}: {
  title: string;
  subtitle: string;
  children: React.ReactNode;
}) {
  return (
    <div className="container-page py-12">
      <div className="mx-auto grid max-w-5xl gap-10 lg:grid-cols-12">
        <div className="lg:col-span-5">
          <div className="lg:hidden">
            <Logo size="lg" />
          </div>
          <div className="surface-card relative mt-6 overflow-hidden p-8 lg:mt-0">
            <div
              aria-hidden
              className="pointer-events-none absolute -right-20 -top-20 h-60 w-60 rounded-full bg-iris-500/30 blur-3xl"
            />
            <h1 className="font-display text-2xl font-extrabold md:text-3xl">
              {title}
            </h1>
            <p className="mt-1 text-sm text-fg-muted">{subtitle}</p>
            <div className="mt-6">{children}</div>
          </div>
        </div>

        <aside className="hidden lg:col-span-7 lg:block">
          <div className="surface-card relative h-full overflow-hidden p-10">
            <div
              aria-hidden
              className="absolute inset-0 bg-[radial-gradient(70%_60%_at_30%_-10%,rgba(91,61,255,0.35),transparent_60%)]"
            />
            <div className="relative">
              <Logo size="lg" />
              <h2 className="mt-8 font-display text-3xl font-extrabold leading-tight">
                Bangladesh&apos;s premium home for{" "}
                <span className="gradient-text">digital sellers &amp; buyers.</span>
              </h2>
              <p className="mt-4 max-w-md text-sm text-fg-muted">
                Trusted Facebook sellers, instant delivery, full buyer protection.
                Pay with bKash, Nagad, Rocket — or your card.
              </p>

              <div className="mt-10 grid gap-3 md:grid-cols-2">
                <Stat v="62K+" l="orders this month" />
                <Stat v="2 min" l="avg. delivery" />
                <Stat v="4.91" l="avg. rating" />
                <Stat v="0%" l="platform fees during onboarding" />
              </div>

              <div className="mt-10 flex flex-wrap items-center gap-2 text-[12.5px] text-fg-muted">
                <Phone size={13} /> 24/7 support · Bangla &amp; English
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
