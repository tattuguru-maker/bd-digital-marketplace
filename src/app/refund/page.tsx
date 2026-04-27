import { LegalShell } from "@/components/site/legal-shell";

export const metadata = { title: "Refund Policy · Digibazar" };

export default function RefundPage() {
  return (
    <LegalShell
      title="Refund Policy"
      effectiveDate="1 January 2026"
      intro="Every order placed on Digibazar is automatically protected. If a digital product fails to deliver, doesn't work, or is materially different from its listing, you're entitled to a free replacement or full refund — no questions asked."
      sections={[
        {
          id: "covered",
          title: "1. What's covered",
          body: (
            <ul className="ml-6 list-disc space-y-1.5">
              <li>
                The product was never delivered within the seller&apos;s
                stated delivery window
              </li>
              <li>
                A CD key, account or top-up failed to redeem on the official
                platform
              </li>
              <li>
                The product is region-locked when the listing said
                &quot;global&quot;
              </li>
              <li>
                A streaming or subscription account was cancelled, banned or
                changed by the seller within the warranty period
              </li>
              <li>
                The product is materially different from the listing
                description
              </li>
            </ul>
          ),
        },
        {
          id: "not-covered",
          title: "2. What's not covered",
          body: (
            <ul className="ml-6 list-disc space-y-1.5">
              <li>
                Buyer&apos;s remorse on a successfully redeemed CD key, gift
                card or top-up
              </li>
              <li>
                Account bans triggered by the buyer&apos;s own actions
                (cheating, payment chargebacks)
              </li>
              <li>
                Wrong player ID provided by the buyer for a top-up — please
                double-check before paying
              </li>
              <li>Disputes opened more than 30 days after delivery</li>
            </ul>
          ),
        },
        {
          id: "process",
          title: "3. How to request a refund",
          body: (
            <ol className="ml-6 list-decimal space-y-1.5">
              <li>Open the order in My Orders.</li>
              <li>
                Click <strong className="text-fg">Report a problem</strong>,
                pick a reason and attach a screenshot or screen recording.
              </li>
              <li>
                The seller has 12 hours to reply with a replacement or a
                refund offer.
              </li>
              <li>
                If unresolved, our mediation team takes over within 24 hours
                and issues a final decision within 48 hours.
              </li>
            </ol>
          ),
        },
        {
          id: "timeline",
          title: "4. Refund timelines",
          body: (
            <>
              <p>
                Approved refunds return to your original payment method.
                Typical timelines:
              </p>
              <ul className="ml-6 list-disc space-y-1.5">
                <li>bKash, Nagad, Rocket, Upay: instant to 24 hours</li>
                <li>Cards (Visa / Mastercard / Amex): 3-7 business days</li>
                <li>Bank transfer: 2-5 business days</li>
              </ul>
              <p>
                You can also choose <strong className="text-fg">Digibazar credit</strong>{" "}
                instead of a refund — credited instantly and usable on any
                future order.
              </p>
            </>
          ),
        },
      ]}
    />
  );
}
