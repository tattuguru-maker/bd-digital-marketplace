import { LegalShell } from "@/components/site/legal-shell";

export const metadata = { title: "Seller Policies · Digibazar" };

export default function PoliciesPage() {
  return (
    <LegalShell
      title="Seller Policies"
      effectiveDate="1 January 2026"
      intro="These policies apply to every verified seller on Digibazar. They exist to keep the marketplace trustworthy for buyers and protect honest sellers from bad actors."
      sections={[
        {
          id: "kyc",
          title: "1. KYC and verification",
          body: (
            <p>
              Every seller must complete identity verification before listing.
              For individuals: NID front and back. For businesses: trade
              license + TIN. We re-verify every 12 months. Sellers who fail
              re-verification are paused until they complete KYC.
            </p>
          ),
        },
        {
          id: "fees",
          title: "2. Fees and payouts",
          body: (
            <>
              <p>
                During the onboarding promotion, Digibazar charges{" "}
                <strong className="text-fg">0% platform fees</strong>. Sellers
                keep 100% of the sale price (less standard processor fees from
                bKash / cards, which are itemised on every payout).
              </p>
              <p>
                Payouts are auto-disbursed daily at 11:59 PM BST to your
                preferred MFS account or bank. Minimum payout is ৳50.
              </p>
            </>
          ),
        },
        {
          id: "listings",
          title: "3. Listing standards",
          body: (
            <ul className="ml-6 list-disc space-y-1.5">
              <li>
                Use accurate titles, screenshots and descriptions; misleading
                listings will be removed
              </li>
              <li>
                Always declare the region (Global / Asia / India / US / EU /
                BD) — never list region-locked items as global
              </li>
              <li>
                State a realistic delivery time. Manual deliveries should
                ship within the stated window
              </li>
              <li>
                Always set a warranty period; a minimum of 7 days for
                accounts and 24 hours for CD keys
              </li>
            </ul>
          ),
        },
        {
          id: "delivery",
          title: "4. Delivery and warranty",
          body: (
            <p>
              Sellers must deliver within the time window stated on each
              listing. Late or undelivered orders are auto-refunded after the
              window expires. Sellers are required to honour their warranty
              period — if a product fails within warranty, replacement or
              refund must be issued within 12 hours.
            </p>
          ),
        },
        {
          id: "performance",
          title: "5. Performance metrics",
          body: (
            <>
              <p>Each seller is scored on three rolling 30-day metrics:</p>
              <ul className="ml-6 list-disc space-y-1.5">
                <li>
                  <strong className="text-fg">On-time delivery rate</strong> —
                  must stay above 95%
                </li>
                <li>
                  <strong className="text-fg">Replacement rate</strong> — must
                  stay below 4%
                </li>
                <li>
                  <strong className="text-fg">Average rating</strong> — must
                  stay above 4.5 stars
                </li>
              </ul>
              <p>
                Sellers who fall below these thresholds enter a 14-day
                probation; repeat failures lead to suspension.
              </p>
            </>
          ),
        },
        {
          id: "prohibited",
          title: "6. Prohibited behaviour",
          body: (
            <p>
              Sellers must not pressure buyers to cancel disputes, route
              transactions outside the platform, sell counterfeit / pirated
              products, or use stolen payment methods. Violations result in
              immediate permanent suspension and forfeit of escrow balances.
            </p>
          ),
        },
      ]}
    />
  );
}
