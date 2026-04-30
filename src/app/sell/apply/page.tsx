import Link from "next/link";
import { ShieldCheck, Sparkles } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Breadcrumb } from "@/components/marketplace/breadcrumb";
import { SellerApplyForm } from "@/components/auth/seller-apply-form";

export const metadata = { title: "Apply as a seller · Digibazar" };

/**
 * The seller-apply route is protected by `proxy.ts`, so any user that
 * reaches this page is already signed in. The form itself queries Convex
 * for the user's existing seller record (if any) and renders the right
 * state (form, pending, rejected, or verified).
 */
export default function SellApplyPage() {
  return (
    <div className="container-page py-10">
      <Breadcrumb
        items={[
          { label: "Home", href: "/" },
          { label: "Sell", href: "/sell" },
          { label: "Apply" },
        ]}
      />

      <div className="mt-6 flex flex-wrap items-center gap-3">
        <Badge variant="brand">
          <Sparkles size={11} /> 0% platform fees
        </Badge>
        <Badge variant="success">
          <ShieldCheck size={11} /> KYC verified
        </Badge>
      </div>

      <h1 className="mt-3 font-display text-3xl font-extrabold md:text-[40px] md:leading-tight">
        Become a verified seller
      </h1>
      <p className="mt-2 max-w-2xl text-[15px] text-fg-muted">
        We KYC every seller before they can list, so buyers always know who
        they&apos;re paying. The form below takes about 5 minutes — keep your
        NID and a phone camera handy.
      </p>

      <div className="mt-8 grid gap-8 lg:grid-cols-12">
        <div className="lg:col-span-8">
          <SellerApplyForm />
        </div>

        <aside className="lg:col-span-4">
          <div className="surface-card sticky top-44 p-5">
            <h2 className="font-display text-lg font-bold">What we check</h2>
            <ul className="mt-3 space-y-2.5 text-[13.5px] text-fg-muted">
              <li>• Your name on the NID matches the account name</li>
              <li>
                • The NID front, back and selfie are legible &amp; un-tampered
              </li>
              <li>• No duplicate NID across other Digibazar accounts</li>
              <li>
                • The IP / device hasn&apos;t been flagged for previous abuse
              </li>
            </ul>
            <div className="mt-5 rounded-lg border border-iris-400/30 bg-iris-500/[0.08] p-3 text-[12.5px] text-iris-100">
              Your documents are stored privately, only seen by our review
              team, and deleted after a rejection or after you close your
              seller account.
            </div>
            <p className="mt-4 text-[12.5px] text-fg-subtle">
              Need help? Email{" "}
              <Link
                href="mailto:sellers@digibazar.bd"
                className="text-iris-200 hover:text-iris-100"
              >
                sellers@digibazar.bd
              </Link>{" "}
              or call <strong>16263</strong>.
            </p>
          </div>
        </aside>
      </div>
    </div>
  );
}
