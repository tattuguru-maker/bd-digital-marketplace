import Link from "next/link";
import { Mail, Phone, MessageCircle, HelpCircle, ShieldCheck } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

export const metadata = { title: "Support · Digibazar" };

export default function SupportPage() {
  return (
    <div className="container-page py-12">
      <div className="text-center">
        <Badge variant="brand"><ShieldCheck size={11} /> Support 24/7</Badge>
        <h1 className="mt-3 font-display text-4xl font-extrabold md:text-5xl">We&apos;re here to help.</h1>
        <p className="mx-auto mt-3 max-w-xl text-fg-muted">
          Bangladeshi support team. Bangla & English. We respond within minutes during peak hours.
        </p>
      </div>

      <div className="mx-auto mt-10 grid max-w-5xl gap-3 md:grid-cols-3">
        <Channel icon={<MessageCircle size={20} />} title="Live chat" sub="Open 24/7 · avg. 3 min response" cta="Start chat" />
        <Channel icon={<Mail size={20} />} title="Email"     sub="support@digibazar.bd · reply in 1h" cta="Send email" />
        <Channel icon={<Phone size={20} />} title="Phone"    sub="16263 · 9am–10pm BST" cta="Call now" />
      </div>

      <div className="mx-auto mt-12 grid max-w-5xl gap-6 lg:grid-cols-2">
        <div className="surface-card p-6">
          <h2 className="font-display text-xl font-bold">Submit a ticket</h2>
          <form className="mt-4 grid gap-3">
            <Field label="Order ID (optional)" placeholder="BD-XXXXX" />
            <Field label="Email" placeholder="you@example.com" />
            <label>
              <div className="mb-1 text-[11px] font-semibold uppercase tracking-wider text-fg-subtle">Topic</div>
              <select className="h-10 w-full rounded-md border border-white/10 bg-white/5 px-3 text-sm">
                <option>Order delivery issue</option>
                <option>Payment / refund</option>
                <option>Seller dispute</option>
                <option>Account / login</option>
                <option>Other</option>
              </select>
            </label>
            <label>
              <div className="mb-1 text-[11px] font-semibold uppercase tracking-wider text-fg-subtle">Message</div>
              <textarea
                rows={5}
                placeholder="Describe your issue..."
                className="w-full rounded-md border border-white/10 bg-white/5 px-3 py-2 text-sm"
              />
            </label>
            <Button>Submit ticket</Button>
          </form>
        </div>

        <div className="surface-card p-6">
          <h2 className="font-display text-xl font-bold">Quick links</h2>
          <ul className="mt-4 space-y-3">
            {[
              { t: "How buyer protection works", h: "/buyer-protection" },
              { t: "Refund & replacement policy", h: "/refund" },
              { t: "How to top-up your game",     h: "/how-it-works" },
              { t: "Become a seller",             h: "/sell" },
              { t: "FAQ",                         h: "/faq" },
            ].map((l) => (
              <li key={l.h}>
                <Link href={l.h} className="flex items-center gap-2 text-sm text-fg-muted hover:text-fg">
                  <HelpCircle size={14} className="text-iris-300" /> {l.t}
                </Link>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
}

function Channel({ icon, title, sub, cta }: { icon: React.ReactNode; title: string; sub: string; cta: string }) {
  return (
    <div className="surface-card p-6 text-center">
      <div className="mx-auto grid h-12 w-12 place-items-center rounded-xl bg-iris-500/15 text-iris-300">{icon}</div>
      <h3 className="mt-3 font-display text-lg font-bold">{title}</h3>
      <p className="mt-1 text-[13px] text-fg-muted">{sub}</p>
      <Button variant="secondary" size="sm" className="mt-4 w-full">{cta}</Button>
    </div>
  );
}

function Field({ label, placeholder }: { label: string; placeholder?: string }) {
  return (
    <label>
      <div className="mb-1 text-[11px] font-semibold uppercase tracking-wider text-fg-subtle">{label}</div>
      <input
        placeholder={placeholder}
        className="h-10 w-full rounded-md border border-white/10 bg-white/5 px-3 text-sm placeholder:text-fg-subtle focus:border-iris-400/50 focus:bg-white/[0.06] focus:outline-none"
      />
    </label>
  );
}
