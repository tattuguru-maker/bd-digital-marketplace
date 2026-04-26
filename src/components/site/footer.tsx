import Link from "next/link";
import { Send, Mail, Phone, ShieldCheck } from "lucide-react";
import { Logo } from "@/components/site/logo";
import { PaymentMethods } from "@/components/marketplace/payment-methods";

const SocialIcon = ({ d, className }: { d: string; className?: string }) => (
  <svg viewBox="0 0 24 24" width="18" height="18" className={className} fill="currentColor" aria-hidden>
    <path d={d} />
  </svg>
);

const facebookPath = "M13 22v-8h2.7l.4-3.1H13V8.9c0-.9.3-1.6 1.6-1.6H16V4.5c-.3 0-1.3-.1-2.4-.1-2.4 0-4 1.5-4 4.1V11H7v3.1h2.7V22H13z";
const instagramPath = "M12 2c-2.7 0-3 0-4.1.1-1 0-1.7.2-2.4.5-.6.2-1.2.6-1.7 1.1S2.8 4.9 2.6 5.5c-.3.6-.4 1.4-.5 2.4C2 9 2 9.3 2 12s0 3 .1 4.1c0 1 .2 1.7.5 2.4.2.6.6 1.2 1.1 1.7s1 .9 1.7 1.1c.6.3 1.4.4 2.4.5C9 22 9.3 22 12 22s3 0 4.1-.1c1 0 1.7-.2 2.4-.5.6-.2 1.2-.6 1.7-1.1s.9-1 1.1-1.7c.3-.7.4-1.4.5-2.4 0-1.1.1-1.4.1-4.1s0-3-.1-4.1c0-1-.2-1.7-.5-2.4-.2-.6-.6-1.2-1.1-1.7s-1-.9-1.7-1.1c-.7-.3-1.4-.4-2.4-.5C15 2 14.7 2 12 2zm0 1.8c2.7 0 3 0 4 .1.9 0 1.5.2 1.8.3.4.2.8.4 1.1.7.3.3.5.6.7 1.1.1.3.3.9.3 1.8.1 1 .1 1.3.1 4s0 3-.1 4c0 .9-.2 1.5-.3 1.8-.2.4-.4.8-.7 1.1-.3.3-.6.5-1.1.7-.3.1-.9.3-1.8.3-1 .1-1.3.1-4 .1s-3 0-4-.1c-.9 0-1.5-.2-1.8-.3-.4-.2-.8-.4-1.1-.7-.3-.3-.5-.6-.7-1.1-.1-.3-.3-.9-.3-1.8-.1-1-.1-1.3-.1-4s0-3 .1-4c0-.9.2-1.5.3-1.8.2-.4.4-.8.7-1.1.3-.3.6-.5 1.1-.7.3-.1.9-.3 1.8-.3 1-.1 1.3-.1 4-.1zm0 3.1A5.1 5.1 0 1 0 12 17a5.1 5.1 0 0 0 0-10.1zm0 8.4A3.3 3.3 0 1 1 12 8.7a3.3 3.3 0 0 1 0 6.6zm6.5-8.6a1.2 1.2 0 1 1-2.4 0 1.2 1.2 0 0 1 2.4 0z";
const youtubePath = "M21.6 7.2c-.2-.9-.9-1.6-1.8-1.8C18.2 5 12 5 12 5s-6.2 0-7.8.4c-.9.2-1.6.9-1.8 1.8C2 8.8 2 12 2 12s0 3.2.4 4.8c.2.9.9 1.6 1.8 1.8C5.8 19 12 19 12 19s6.2 0 7.8-.4c.9-.2 1.6-.9 1.8-1.8.4-1.6.4-4.8.4-4.8s0-3.2-.4-4.8zM10 15V9l5 3-5 3z";

export function Footer() {
  return (
    <footer className="mt-20 border-t border-white/5 bg-bg-elev/50">
      <div className="container-page py-14">
        <div className="grid gap-10 lg:grid-cols-12">
          <div className="lg:col-span-5">
            <Logo size="lg" />
            <p className="mt-4 max-w-md text-sm leading-relaxed text-fg-muted">
              Digibazar is Bangladesh&apos;s premium marketplace for digital products —
              streaming subscriptions, game top-ups, CD keys, gift cards and more.
              Trusted sellers, instant delivery, full buyer protection.
            </p>
            <div className="mt-5 flex items-center gap-4 text-fg-muted">
              <Link href="#" aria-label="Facebook"  className="hover:text-fg"><SocialIcon d={facebookPath} /></Link>
              <Link href="#" aria-label="Instagram" className="hover:text-fg"><SocialIcon d={instagramPath} /></Link>
              <Link href="#" aria-label="YouTube"   className="hover:text-fg"><SocialIcon d={youtubePath} /></Link>
              <Link href="#" aria-label="Telegram"  className="hover:text-fg"><Send size={18} /></Link>
            </div>

            <div className="mt-6 flex items-center gap-2 text-[12.5px] text-fg-subtle">
              <ShieldCheck size={14} className="text-success" />
              SSL secure · Buyer protection on every order
            </div>
            <div className="mt-2 text-[12.5px] text-fg-subtle inline-flex items-center gap-3">
              <span className="inline-flex items-center gap-1"><Mail size={13} /> support@digibazar.bd</span>
              <span className="inline-flex items-center gap-1"><Phone size={13} /> 16263</span>
            </div>
          </div>

          <FooterCol
            title="Marketplace"
            links={[
              { label: "Browse all", href: "/browse" },
              { label: "Streaming", href: "/category/streaming" },
              { label: "Game Top-ups", href: "/category/game-topup" },
              { label: "CD Keys", href: "/category/cd-keys" },
              { label: "Gift Cards", href: "/category/gift-cards" },
              { label: "AI Tools", href: "/category/ai-tools" },
            ]}
          />
          <FooterCol
            title="For Sellers"
            links={[
              { label: "Become a seller", href: "/sell" },
              { label: "Seller dashboard", href: "/dashboard" },
              { label: "Fees: 0% (onboarding)", href: "/sell#fees" },
              { label: "Onboarding guide", href: "/sell#guide" },
              { label: "Seller policies", href: "/policies" },
            ]}
          />
          <FooterCol
            title="Help"
            links={[
              { label: "How it works", href: "/how-it-works" },
              { label: "Buyer protection", href: "/buyer-protection" },
              { label: "FAQ", href: "/faq" },
              { label: "Contact support", href: "/support" },
              { label: "Refund policy", href: "/refund" },
              { label: "Terms · Privacy", href: "/terms" },
            ]}
          />
        </div>

        <div className="mt-10 flex flex-col items-start justify-between gap-4 border-t border-white/5 pt-6 sm:flex-row sm:items-center">
          <div className="text-[12px] text-fg-subtle">
            © {new Date().getFullYear()} Digibazar Bangladesh. Registered in Dhaka. All trademarks belong to their respective owners.
          </div>
          <div className="flex items-center gap-3">
            <span className="text-[11px] uppercase tracking-wider text-fg-subtle">We accept</span>
            <PaymentMethods />
          </div>
        </div>
      </div>
    </footer>
  );
}

function FooterCol({
  title,
  links,
}: {
  title: string;
  links: { label: string; href: string }[];
}) {
  return (
    <div className="lg:col-span-2">
      <h4 className="text-[11px] font-semibold uppercase tracking-[0.2em] text-fg-subtle">
        {title}
      </h4>
      <ul className="mt-4 space-y-2.5">
        {links.map((l) => (
          <li key={l.href}>
            <Link href={l.href} className="text-sm text-fg-muted hover:text-fg">
              {l.label}
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}
