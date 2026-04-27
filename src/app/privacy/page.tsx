import { LegalShell } from "@/components/site/legal-shell";

export const metadata = { title: "Privacy Policy · Digibazar" };

export default function PrivacyPage() {
  return (
    <LegalShell
      title="Privacy Policy"
      effectiveDate="1 January 2026"
      intro="This Privacy Policy explains what personal data Digibazar collects when you use our marketplace, how we use it, and the choices you have."
      sections={[
        {
          id: "data",
          title: "1. What we collect",
          body: (
            <>
              <p>
                <strong className="text-fg">Account data:</strong> name,
                email, phone number, encrypted password, and (for sellers)
                NID / business registration documents collected during KYC.
              </p>
              <p>
                <strong className="text-fg">Transaction data:</strong> orders,
                payments, payout history, dispute records, and the in-game
                player IDs you provide for top-up products.
              </p>
              <p>
                <strong className="text-fg">Device data:</strong> IP address,
                user agent, browser fingerprint and approximate location, used
                solely for fraud prevention.
              </p>
            </>
          ),
        },
        {
          id: "use",
          title: "2. How we use your data",
          body: (
            <ul className="ml-6 list-disc space-y-1.5">
              <li>To create and manage your Digibazar account</li>
              <li>To process payments, payouts and refunds</li>
              <li>To detect and prevent fraud, abuse and chargebacks</li>
              <li>
                To send transactional notifications (orders, deliveries,
                disputes)
              </li>
              <li>
                To send marketing only when you opt in — and you can opt out
                from any email at any time
              </li>
            </ul>
          ),
        },
        {
          id: "sharing",
          title: "3. Sharing",
          body: (
            <>
              <p>
                We share data with payment processors (bKash, Nagad, Rocket,
                Visa, Mastercard) and KYC verification partners strictly to
                process transactions and verify identity. We never sell your
                personal data to third parties.
              </p>
              <p>
                We may disclose data when required by Bangladeshi law,
                regulatory authority, or valid court order.
              </p>
            </>
          ),
        },
        {
          id: "retention",
          title: "4. Retention",
          body: (
            <p>
              Account and transaction records are retained for at least 7 years
              to comply with Bangladesh tax and AML regulations. KYC documents
              are retained for the duration of your seller account and 5 years
              after account closure.
            </p>
          ),
        },
        {
          id: "rights",
          title: "5. Your rights",
          body: (
            <>
              <p>
                You can request a copy of the personal data we hold about you,
                ask us to correct inaccuracies, or request deletion of your
                account at any time. Email{" "}
                <a
                  href="mailto:privacy@digibazar.bd"
                  className="text-iris-200 hover:text-iris-100"
                >
                  privacy@digibazar.bd
                </a>{" "}
                from your registered email address.
              </p>
              <p>
                Note: deletion requests for data legally required to retain
                (transaction history, tax records) will be honoured at the end
                of the retention period.
              </p>
            </>
          ),
        },
        {
          id: "cookies",
          title: "6. Cookies",
          body: (
            <p>
              Digibazar uses cookies for session management, fraud prevention
              and analytics. You can disable cookies in your browser settings,
              though some features (such as login and cart) require them to
              function.
            </p>
          ),
        },
      ]}
    />
  );
}
