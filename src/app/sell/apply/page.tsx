import Link from "next/link";
import { ShieldCheck, Sparkles } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Breadcrumb } from "@/components/marketplace/breadcrumb";
import { SellerApplyForm } from "@/components/auth/seller-apply-form";
import { requireUser } from "@/lib/auth/guards";
import { createClient } from "@/lib/supabase/server";

export const metadata = { title: "Apply as a seller · Digibazar" };

export default async function SellApplyPage() {
  // Require login. Anonymous users get bounced to /login?next=/sell/apply.
  await requireUser("/sell/apply");

  // If the user already has a seller row, show the appropriate state instead
  // of the form.
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  const { data: existing } = await supabase
    .from("sellers")
    .select("status, rejection_reason, display_name, handle, submitted_at, reviewed_at")
    .eq("user_id", user!.id)
    .maybeSingle();

  return (
    <div className="container-page py-10">
      <Breadcrumb
        items={[{ label: "Home", href: "/" }, { label: "Sell", href: "/sell" }, { label: "Apply" }]}
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
          {existing ? (
            <ApplicationStatus existing={existing} />
          ) : (
            <SellerApplyForm />
          )}
        </div>

        <aside className="lg:col-span-4">
          <div className="surface-card sticky top-44 p-5">
            <h2 className="font-display text-lg font-bold">What we check</h2>
            <ul className="mt-3 space-y-2.5 text-[13.5px] text-fg-muted">
              <li>• Your name on the NID matches the account name</li>
              <li>• The NID front, back and selfie are legible &amp; un-tampered</li>
              <li>• No duplicate NID across other Digibazar accounts</li>
              <li>• The IP / device hasn&apos;t been flagged for previous abuse</li>
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

function ApplicationStatus({
  existing,
}: {
  existing: {
    status: "pending_review" | "verified" | "rejected" | "suspended";
    rejection_reason: string | null;
    display_name: string;
    handle: string;
    submitted_at: string;
    reviewed_at: string | null;
  };
}) {
  if (existing.status === "verified") {
    return (
      <div className="surface-card p-6">
        <Badge variant="success">
          <ShieldCheck size={11} /> Verified seller
        </Badge>
        <h2 className="mt-3 font-display text-2xl font-bold">
          {existing.display_name}{" "}
          <span className="text-fg-subtle">@{existing.handle}</span>
        </h2>
        <p className="mt-2 text-[14px] text-fg-muted">
          You&apos;re all set. Head to your seller dashboard to start listing.
        </p>
        <Link
          href="/dashboard"
          className="mt-4 inline-flex h-11 items-center justify-center rounded-lg border border-white/10 bg-white/[0.06] px-4 text-[14px] font-medium hover:bg-white/[0.10]"
        >
          Open seller dashboard →
        </Link>
      </div>
    );
  }
  if (existing.status === "rejected") {
    return (
      <div className="surface-card p-6">
        <Badge variant="danger">Rejected</Badge>
        <h2 className="mt-3 font-display text-2xl font-bold">
          {existing.display_name}
        </h2>
        <p className="mt-2 text-[14px] text-fg-muted">
          Unfortunately your application could not be approved.
        </p>
        {existing.rejection_reason && (
          <div className="mt-3 rounded-md border border-danger/30 bg-danger/10 p-3 text-[13px] text-danger">
            <strong>Reason:</strong> {existing.rejection_reason}
          </div>
        )}
        <p className="mt-3 text-[12.5px] text-fg-subtle">
          You can re-apply once the issue is fixed by emailing{" "}
          <a className="text-iris-200" href="mailto:sellers@digibazar.bd">
            sellers@digibazar.bd
          </a>
          .
        </p>
      </div>
    );
  }
  // pending or suspended
  return (
    <div className="surface-card p-6">
      <Badge variant="brand">Under review</Badge>
      <h2 className="mt-3 font-display text-2xl font-bold">
        Hi {existing.display_name} 👋
      </h2>
      <p className="mt-2 text-[14px] text-fg-muted">
        We&apos;ve received your application and our team is reviewing your
        documents. You&apos;ll get an email at the address on your account once
        a decision is made — usually within 24 hours.
      </p>
      <div className="mt-4 grid gap-2 text-[13px] text-fg-muted">
        <div>
          Submitted:{" "}
          <span className="text-fg">
            {new Date(existing.submitted_at).toLocaleString("en-GB")}
          </span>
        </div>
        <div>
          Status: <span className="text-fg">{existing.status.replace("_", " ")}</span>
        </div>
      </div>
    </div>
  );
}
