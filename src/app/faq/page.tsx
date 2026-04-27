import { ChevronDown } from "lucide-react";
import { Badge } from "@/components/ui/badge";

export const metadata = { title: "FAQ · Digibazar" };

export default function FaqPage() {
  return (
    <div className="container-page py-12">
      <div className="text-center">
        <Badge variant="brand">Frequently asked</Badge>
        <h1 className="mt-3 font-display text-4xl font-extrabold md:text-5xl">FAQ</h1>
        <p className="mx-auto mt-3 max-w-xl text-fg-muted">Quick answers to the most common questions about buying and selling on Digibazar.</p>
      </div>

      <div className="mx-auto mt-10 max-w-3xl space-y-2">
        {faqs.map((f, i) => (
          <details key={f.q} open={i < 2} className="surface-card group p-5">
            <summary className="flex cursor-pointer list-none items-center justify-between text-[15px] font-semibold">
              {f.q}
              <ChevronDown size={16} className="transition group-open:rotate-180 text-fg-subtle" />
            </summary>
            <div className="mt-3 text-[14px] leading-relaxed text-fg-muted">{f.a}</div>
          </details>
        ))}
      </div>
    </div>
  );
}

const faqs = [
  { q: "Is Digibazar legal in Bangladesh?", a: "Yes. Digibazar is a registered marketplace operating in Bangladesh. We facilitate transactions between buyers and verified sellers. Sellers are individually responsible for the legality of their listings." },
  { q: "How fast is delivery?", a: "Most digital products are delivered in under 5 minutes via instant automation. Manual deliveries (like account-based subscriptions) usually arrive within 15 minutes to 1 hour, depending on the seller." },
  { q: "Can I pay with bKash, Nagad or Rocket?", a: "Absolutely. We accept bKash, Nagad, Rocket, Upay, Visa, Mastercard, Amex and bank transfers. Paying with bKash gets you an extra 2% discount." },
  { q: "What is buyer protection?", a: "Every order is held in escrow until delivery is verified. If your product doesn't work or doesn't arrive, you get a free replacement or full refund." },
  { q: "Will my game account get banned for top-ups?", a: "No. Our gaming sellers use official top-up channels. Just provide your in-game player ID — never your password — and the top-up is applied directly to your account." },
  { q: "How do I become a seller?", a: "Apply at /sell. Submit your NID, business info and your Facebook page (if any). We verify within 12–24 hours. During the onboarding phase, sellers pay 0% platform fees." },
  { q: "What about taxes?", a: "Sellers are responsible for their own tax filings. Digibazar provides each seller with a monthly transaction statement to make filings easier." },
  { q: "Can I refund after I've used my product?", a: "If the product worked and you've consumed it (e.g., used your CD key), refunds aren't available. Refunds apply to delivery or quality issues — see our refund policy." },
];
