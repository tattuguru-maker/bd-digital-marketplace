import {
  Sparkles, ShieldCheck, Wallet, Users, Award, Zap, ArrowRight,
  CheckCircle2, Store, MessageCircle, BadgePercent, BarChart3, Bot,
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button, ButtonLink } from "@/components/ui/button";

export const metadata = { title: "Become a seller · Digibazar" };

export default function SellPage() {
  return (
    <>
      {/* HERO */}
      <section className="relative isolate overflow-hidden">
        <div aria-hidden className="pointer-events-none absolute -top-40 -right-32 h-[420px] w-[420px] rounded-full bg-gold-400/15 blur-[140px]" />
        <div aria-hidden className="pointer-events-none absolute -bottom-32 -left-32 h-[360px] w-[360px] rounded-full bg-iris-500/30 blur-[120px]" />

        <div className="container-page py-14 md:py-20">
          <div className="grid items-center gap-10 lg:grid-cols-12">
            <div className="lg:col-span-7">
              <Badge variant="gold">For sellers · 0% platform fees</Badge>
              <h1 className="mt-4 font-display text-4xl font-extrabold leading-[1.05] tracking-tight md:text-6xl">
                Move your Facebook customers
                <br />
                <span className="gradient-text">to a real marketplace.</span>
              </h1>
              <p className="mt-5 max-w-xl text-base leading-relaxed text-fg-muted md:text-lg">
                Stop juggling Messenger DMs, screenshots and bKash personal numbers.
                Open a verified Digibazar storefront — automated delivery, escrow payments,
                ratings, replacements and a built-in customer base.
                <strong className="text-fg"> 0% platform fees during onboarding.</strong>
              </p>

              <div className="mt-7 flex flex-wrap items-center gap-3">
                <ButtonLink href="/sell/apply" size="lg">
                  Apply to sell <ArrowRight size={16} />
                </ButtonLink>
                <ButtonLink href="/dashboard" variant="secondary" size="lg">
                  Preview the dashboard
                </ButtonLink>
              </div>

              <div id="fees" className="mt-8 grid grid-cols-2 gap-x-6 gap-y-4 sm:grid-cols-4">
                <Stat v="0%" l="platform fees" />
                <Stat v="62K+" l="monthly buyers" />
                <Stat v="<5m" l="avg. delivery" />
                <Stat v="৳" l="BDT payouts" />
              </div>
            </div>

            <div className="lg:col-span-5">
              <div className="surface-card relative overflow-hidden p-6">
                <div aria-hidden className="absolute -right-10 -top-10 h-40 w-40 rounded-full bg-iris-500/30 blur-2xl" />
                <div className="relative">
                  <div className="text-[11px] font-semibold uppercase tracking-wider text-iris-300">
                    Your storefront
                  </div>
                  <div className="mt-3 flex items-center gap-3">
                    <div className="grid h-12 w-12 place-items-center rounded-xl bg-gradient-to-br from-iris-500 to-cyan-400 font-display text-xl font-extrabold text-white">
                      D
                    </div>
                    <div>
                      <div className="font-semibold">Your Digital Store</div>
                      <div className="text-[11px] text-fg-subtle">@yourstore · Bangladesh</div>
                    </div>
                    <Badge variant="brand" className="ml-auto"><Award size={11} /> Verified</Badge>
                  </div>

                  <div className="mt-5 space-y-2">
                    <Quick line="🎬 Netflix Premium · 1 mo" sub="62 sold this week" amt="৳ 220" />
                    <Quick line="🎮 Free Fire · 310 Diamonds" sub="118 sold this week" amt="৳ 290" />
                    <Quick line="🤖 ChatGPT Plus · 1 mo" sub="34 sold this week" amt="৳ 1,690" />
                  </div>

                  <div className="mt-5 flex items-center justify-between rounded-lg bg-success/10 p-3 text-[12.5px] text-success">
                    <span className="inline-flex items-center gap-1.5">
                      <CheckCircle2 size={14} /> 6 orders auto-delivered today
                    </span>
                    <span className="font-semibold">৳ 9,860</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* BENEFITS */}
      <section className="container-page mt-12">
        <div className="grid gap-3 md:grid-cols-2 lg:grid-cols-3">
          <Benefit
            icon={<Sparkles size={18} />}
            title="0% platform fees"
            text="Keep 100% of your sale price during onboarding — no listing fees, no commission. (Standard processor fees from bKash / cards still apply.)"
          />
          <Benefit
            icon={<Wallet size={18} />}
            title="Get paid in BDT"
            text="Auto-payouts to bKash, Nagad, Rocket or your bank account. Daily settlements, no minimum."
          />
          <Benefit
            icon={<ShieldCheck size={18} />}
            title="Escrow & dispute protection"
            text="We hold customer payment until delivery is verified. Sellers get clear policies — buyers get peace of mind."
          />
          <Benefit
            icon={<Users size={18} />}
            title="Built-in customer base"
            text="Tap into 62K+ active buyers from across Bangladesh. SEO + social campaigns send you traffic from day one."
          />
          <Benefit
            icon={<Zap size={18} />}
            title="Automated delivery"
            text="Bulk import codes, link a stock CSV, or accept manual orders. We handle distribution, replacement and warranties."
          />
          <Benefit
            icon={<BarChart3 size={18} />}
            title="Real seller analytics"
            text="See best-sellers, refunds, repeat customers and conversion. Make decisions on data, not screenshots."
          />
        </div>
      </section>

      {/* HOW TO START */}
      <section id="guide" className="container-page mt-16">
        <div className="text-center">
          <Badge variant="brand">3 simple steps</Badge>
          <h2 className="mt-3 font-display text-3xl font-bold md:text-4xl">From Facebook page to Digibazar storefront</h2>
          <p className="mx-auto mt-2 max-w-xl text-sm text-fg-muted">
            Most sellers go live within 24 hours. Our onboarding team helps with everything.
          </p>
        </div>

        <div className="mt-8 grid gap-3 md:grid-cols-3">
          <StepCard n={1} icon={<Store size={18} />} title="Apply & verify" text="Submit your NID, business info and Facebook page link. We verify within 12–24h." />
          <StepCard n={2} icon={<BadgePercent size={18} />} title="List your products" text="Bulk import or manual add. We import your top sellers from your Facebook page for free." />
          <StepCard n={3} icon={<Bot size={18} />} title="Auto-deliver & grow" text="Orders flow into your dashboard. Set automated delivery rules. Reply, rate and grow." />
        </div>
      </section>

      {/* COMPARE */}
      <section className="container-page mt-16">
        <div className="surface-card overflow-hidden">
          <div className="grid divide-y divide-white/5 md:grid-cols-2 md:divide-x md:divide-y-0">
            <div className="p-6">
              <Badge variant="ghost">Selling on Facebook</Badge>
              <ul className="mt-4 space-y-2.5 text-sm text-fg-muted">
                <li className="flex gap-2"><X /> Manual Messenger replies, all day</li>
                <li className="flex gap-2"><X /> Buyers don&apos;t trust personal bKash numbers</li>
                <li className="flex gap-2"><X /> No reviews, no ratings, no reputation</li>
                <li className="flex gap-2"><X /> Refund disputes turn into Facebook drama</li>
                <li className="flex gap-2"><X /> Hard to scale — limited by your DM speed</li>
              </ul>
            </div>
            <div className="p-6">
              <Badge variant="brand">Selling on Digibazar</Badge>
              <ul className="mt-4 space-y-2.5 text-sm text-fg-muted">
                <li className="flex gap-2"><Y /> Automated delivery, 24/7</li>
                <li className="flex gap-2"><Y /> Verified storefront with Buyer Protection seal</li>
                <li className="flex gap-2"><Y /> Public ratings, reviews, badges</li>
                <li className="flex gap-2"><Y /> Clear escrow rules; we mediate disputes</li>
                <li className="flex gap-2"><Y /> Scale to thousands of orders / month</li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* FORM */}
      <section id="apply" className="container-page mt-16">
        <div className="grid gap-8 lg:grid-cols-12">
          <div className="lg:col-span-5">
            <h2 className="font-display text-3xl font-bold">Apply to sell</h2>
            <p className="mt-2 text-sm text-fg-muted">
              Tell us about your business — we&apos;ll get back within 24 hours.
              Bringing customers from your Facebook page? Mention it; we&apos;ll prioritize you.
            </p>
            <div className="mt-5 space-y-3 text-sm text-fg-muted">
              <Bullet text="0% platform fees during onboarding" />
              <Bullet text="Free migration help from your Facebook page" />
              <Bullet text="Personal onboarding manager" />
              <Bullet text="Daily auto-payouts via bKash / bank" />
            </div>
            <div className="mt-6 surface-card p-4 text-[12.5px] text-fg-muted">
              <div className="font-semibold text-fg flex items-center gap-1.5"><MessageCircle size={13} /> Need help?</div>
              <p className="mt-1">
                Message us on Telegram <span className="text-iris-200">@digibazar_bd</span> — our onboarding team responds within minutes.
              </p>
            </div>
          </div>

          <div className="lg:col-span-7">
            <form className="surface-card grid gap-3 p-6 md:grid-cols-2">
              <Field label="Business / store name" placeholder="Dhaka Digital" />
              <Field label="Your full name" placeholder="As on NID" />
              <Field label="Phone (bKash)" placeholder="01XXXXXXXXX" />
              <Field label="Email" placeholder="you@example.com" />
              <Field label="Facebook page (optional)" placeholder="fb.com/yourpage" wide />
              <Field label="Categories you sell in" placeholder="e.g. Streaming, Free Fire top-ups" wide />
              <label className="md:col-span-2">
                <div className="mb-1 text-[11px] font-semibold uppercase tracking-wider text-fg-subtle">
                  Tell us about your business
                </div>
                <textarea
                  rows={4}
                  placeholder="How long you've been selling, monthly volume, current channels..."
                  className="w-full rounded-md border border-white/10 bg-white/5 px-3 py-2 text-sm placeholder:text-fg-subtle focus:border-iris-400/50 focus:bg-white/[0.06] focus:outline-none"
                />
              </label>
              <label className="md:col-span-2 flex items-start gap-2 text-[12px] text-fg-muted">
                <input type="checkbox" defaultChecked className="mt-1 size-3.5 accent-iris-500" />
                I&apos;m a registered seller in Bangladesh and accept the seller terms.
              </label>
              <div className="md:col-span-2">
                <Button size="lg" variant="gold" className="w-full">
                  Submit application <ArrowRight size={16} />
                </Button>
              </div>
            </form>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="container-page mt-16">
        <div className="relative overflow-hidden rounded-2xl border border-white/10 brand-gradient p-10 text-center">
          <div className="absolute inset-0 bg-[radial-gradient(80%_60%_at_50%_-10%,rgba(255,255,255,0.18),transparent)]" />
          <div className="relative">
            <h2 className="font-display text-3xl font-extrabold md:text-4xl">
              Sell more, stress less.
            </h2>
            <p className="mx-auto mt-3 max-w-xl text-iris-100/95">
              Bangladesh&apos;s scattered Facebook digital sellers deserve a real platform. Let&apos;s build it together.
            </p>
            <div className="mt-5 flex flex-wrap justify-center gap-3">
              <ButtonLink href="/sell/apply" variant="gold" size="lg">Apply now</ButtonLink>
              <ButtonLink href="/dashboard" variant="secondary" size="lg" className="!bg-white/15 hover:!bg-white/20 !text-white">
                Preview dashboard
              </ButtonLink>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}

function Stat({ v, l }: { v: string; l: string }) {
  return (
    <div>
      <div className="font-display text-2xl font-bold">{v}</div>
      <div className="text-[11.5px] text-fg-subtle">{l}</div>
    </div>
  );
}

function Benefit({ icon, title, text }: { icon: React.ReactNode; title: string; text: string }) {
  return (
    <div className="surface-card p-6">
      <div className="grid h-10 w-10 place-items-center rounded-lg bg-iris-500/15 text-iris-300">{icon}</div>
      <h3 className="mt-3 font-display text-base font-bold">{title}</h3>
      <p className="mt-1.5 text-[13.5px] text-fg-muted">{text}</p>
    </div>
  );
}

function StepCard({ n, icon, title, text }: { n: number; icon: React.ReactNode; title: string; text: string }) {
  return (
    <div className="surface-card relative p-6">
      <span className="absolute right-5 top-5 font-display text-3xl font-black text-white/5">0{n}</span>
      <div className="grid h-10 w-10 place-items-center rounded-lg bg-iris-500/15 text-iris-300">{icon}</div>
      <h3 className="mt-3 font-display text-base font-bold">{title}</h3>
      <p className="mt-1.5 text-[13.5px] text-fg-muted">{text}</p>
    </div>
  );
}

function Bullet({ text }: { text: string }) {
  return (
    <div className="flex items-start gap-2">
      <CheckCircle2 size={15} className="mt-0.5 text-success" />
      <span>{text}</span>
    </div>
  );
}

function Field({ label, placeholder, wide }: { label: string; placeholder?: string; wide?: boolean }) {
  return (
    <label className={wide ? "md:col-span-2" : ""}>
      <div className="mb-1 text-[11px] font-semibold uppercase tracking-wider text-fg-subtle">
        {label}
      </div>
      <input
        placeholder={placeholder}
        className="h-10 w-full rounded-md border border-white/10 bg-white/5 px-3 text-sm placeholder:text-fg-subtle focus:border-iris-400/50 focus:bg-white/[0.06] focus:outline-none"
      />
    </label>
  );
}

function Quick({ line, sub, amt }: { line: string; sub: string; amt: string }) {
  return (
    <div className="flex items-center justify-between rounded-lg border border-white/5 bg-white/[0.03] px-3 py-2 text-[13px]">
      <div>
        <div className="font-medium">{line}</div>
        <div className="text-[11px] text-fg-subtle">{sub}</div>
      </div>
      <div className="font-semibold text-iris-200">{amt}</div>
    </div>
  );
}

function X() {
  return <span className="grid h-5 w-5 shrink-0 place-items-center rounded-full bg-danger/20 text-danger text-[11px]">✕</span>;
}
function Y() {
  return <span className="grid h-5 w-5 shrink-0 place-items-center rounded-full bg-success/20 text-success text-[11px]">✓</span>;
}
