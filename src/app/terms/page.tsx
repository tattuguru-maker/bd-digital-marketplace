import { LegalShell } from "@/components/site/legal-shell";

export const metadata = { title: "Terms of Service · Digibazar" };

export default function TermsPage() {
  return (
    <LegalShell
      title="Terms of Service"
      effectiveDate="1 January 2026"
      intro="These Terms of Service govern your use of the Digibazar marketplace operated by Digibazar Bangladesh Ltd. By creating an account, browsing or transacting on Digibazar, you agree to the terms below. Please read carefully."
      sections={[
        {
          id: "accounts",
          title: "1. Accounts",
          body: (
            <>
              <p>
                You must be at least 18 years old (or have a guardian&apos;s
                consent) and provide accurate, current information when
                registering. You are responsible for keeping your password and
                bKash / Nagad / Rocket numbers secure. Sharing accounts is not
                permitted.
              </p>
              <p>
                We may suspend or close accounts that violate these Terms,
                misuse buyer protection, or attempt to circumvent our payments
                system.
              </p>
            </>
          ),
        },
        {
          id: "buying",
          title: "2. Buying digital products",
          body: (
            <>
              <p>
                Each listing on Digibazar is provided by an independent verified
                seller. Digibazar facilitates the transaction, holds funds in
                escrow, and protects both parties via our buyer protection
                policy.
              </p>
              <p>
                Once a digital product (CD key, account, top-up, gift card) is
                successfully redeemed, it is generally considered consumed and
                non-refundable, except in cases where buyer protection applies
                — see our refund policy.
              </p>
            </>
          ),
        },
        {
          id: "selling",
          title: "3. Selling on Digibazar",
          body: (
            <>
              <p>
                Sellers must complete KYC verification before listing. You may
                only list products you have the legal right to sell.
                Counterfeit, stolen, fraudulent or region-locked items
                misrepresented as global are strictly prohibited.
              </p>
              <p>
                During the onboarding promotion, Digibazar charges{" "}
                <strong className="text-fg">0% platform fees</strong> — sellers
                keep 100% of the sale price. Standard payment-processor fees
                charged by bKash, Nagad, Rocket, Visa or Mastercard still apply
                and are deducted at payout. Once the onboarding period ends, a
                published platform fee will apply with at least 30 days&apos;
                notice.
              </p>
            </>
          ),
        },
        {
          id: "payments",
          title: "4. Payments and payouts",
          body: (
            <>
              <p>
                We accept bKash, Nagad, Rocket, Upay, Visa, Mastercard, Amex
                and bank transfer. All transactions are processed in BDT.
                Buyer payments are held in escrow until delivery is confirmed
                by the buyer or auto-confirmed after the seller&apos;s stated
                warranty window.
              </p>
              <p>
                Seller payouts are auto-transferred to the seller&apos;s
                preferred MFS account or bank, daily by 11:59 PM BST. Payment
                processor fees (e.g., bKash merchant fees) are itemised in the
                payout breakdown.
              </p>
            </>
          ),
        },
        {
          id: "prohibited",
          title: "5. Prohibited items and activity",
          body: (
            <>
              <p>You may not list, buy or trade:</p>
              <ul className="ml-6 list-disc space-y-1.5">
                <li>Pirated software, cracked games, leaked accounts</li>
                <li>Region-locked items misrepresented as global</li>
                <li>
                  Top-ups using stolen credit cards or compromised payment
                  methods
                </li>
                <li>
                  Anything illegal under the laws of the People&apos;s Republic
                  of Bangladesh
                </li>
              </ul>
            </>
          ),
        },
        {
          id: "liability",
          title: "6. Limitation of liability",
          body: (
            <p>
              Digibazar is not liable for indirect, consequential or punitive
              damages arising from your use of the platform. Our maximum
              aggregate liability for any individual transaction is the
              transaction amount itself, which is fully refundable under our
              buyer protection policy.
            </p>
          ),
        },
        {
          id: "changes",
          title: "7. Changes to these terms",
          body: (
            <p>
              We may update these Terms from time to time. We will notify
              registered users of material changes by email and via an
              in-app banner at least 14 days before they take effect.
            </p>
          ),
        },
      ]}
    />
  );
}
