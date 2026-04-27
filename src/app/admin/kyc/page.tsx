import Link from "next/link";
import { ShieldCheck, ChevronRight } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Breadcrumb } from "@/components/marketplace/breadcrumb";
import { requireAdmin } from "@/lib/auth/guards";
import { createAdminClient } from "@/lib/supabase/admin";
import { approveSeller, rejectSeller } from "@/app/actions/seller";

export const metadata = { title: "KYC review · Admin · Digibazar", robots: "noindex" };

export const dynamic = "force-dynamic";

type ListedSeller = {
  id: string;
  user_id: string;
  display_name: string;
  handle: string;
  bio: string | null;
  location: string | null;
  nid_number: string | null;
  status: "pending_review" | "verified" | "rejected" | "suspended";
  submitted_at: string;
  rejection_reason: string | null;
  profiles: {
    full_name: string | null;
    email: string;
    phone: string | null;
  } | null;
  kyc_documents: Array<{
    id: string;
    kind: string;
    storage_path: string;
    mime: string;
  }>;
};

export default async function AdminKycPage({
  searchParams,
}: {
  searchParams: Promise<{ status?: string }>;
}) {
  await requireAdmin();
  const { status = "pending_review" } = await searchParams;

  const admin = createAdminClient();
  const { data, error } = await admin
    .from("sellers")
    .select(`
      id, user_id, display_name, handle, bio, location, nid_number, status,
      submitted_at, rejection_reason,
      profiles!sellers_user_id_fkey(full_name, email, phone),
      kyc_documents(id, kind, storage_path, mime)
    `)
    .eq("status", status as ListedSeller["status"])
    .order("submitted_at", { ascending: false });

  const sellers = ((data ?? []) as unknown as ListedSeller[]) || [];

  // Pre-sign all the document URLs in parallel.
  const signedByPath = new Map<string, string>();
  await Promise.all(
    sellers.flatMap((s) =>
      s.kyc_documents.map(async (d) => {
        const { data } = await admin.storage
          .from("kyc-documents")
          .createSignedUrl(d.storage_path, 60 * 5);
        if (data?.signedUrl) signedByPath.set(d.storage_path, data.signedUrl);
      }),
    ),
  );

  return (
    <div className="container-page py-8">
      <Breadcrumb
        items={[{ label: "Home", href: "/" }, { label: "Admin", href: "/admin/kyc" }, { label: "KYC review" }]}
      />

      <div className="mt-4 flex flex-wrap items-end justify-between gap-3">
        <div>
          <Badge variant="brand">
            <ShieldCheck size={11} /> Admin
          </Badge>
          <h1 className="mt-2 font-display text-2xl font-bold md:text-3xl">
            Seller KYC review
          </h1>
          <p className="mt-1 text-[14px] text-fg-muted">
            {sellers.length} seller{sellers.length === 1 ? "" : "s"} with status
            &lsquo;{status.replace("_", " ")}&rsquo;.
          </p>
        </div>
        <div className="flex gap-2">
          <FilterTab href="/admin/kyc?status=pending_review" active={status === "pending_review"}>
            Pending
          </FilterTab>
          <FilterTab href="/admin/kyc?status=verified" active={status === "verified"}>
            Approved
          </FilterTab>
          <FilterTab href="/admin/kyc?status=rejected" active={status === "rejected"}>
            Rejected
          </FilterTab>
        </div>
      </div>

      {error && (
        <div className="mt-4 rounded-md border border-danger/30 bg-danger/10 p-3 text-[13px] text-danger">
          Failed to load: {error.message}
        </div>
      )}

      {sellers.length === 0 ? (
        <div className="mt-8 surface-card p-10 text-center">
          <h2 className="font-display text-lg font-bold">Inbox zero — no applications here.</h2>
          <p className="mt-1 text-[13.5px] text-fg-muted">
            New seller applications will appear here as they come in.
          </p>
        </div>
      ) : (
        <div className="mt-6 space-y-5">
          {sellers.map((s) => (
            <SellerCard
              key={s.id}
              seller={s}
              urlsByPath={signedByPath}
              showActions={status === "pending_review"}
            />
          ))}
        </div>
      )}
    </div>
  );
}

function FilterTab({
  href,
  active,
  children,
}: {
  href: string;
  active: boolean;
  children: React.ReactNode;
}) {
  return (
    <Link
      href={href}
      className={`inline-flex h-9 items-center rounded-full px-3.5 text-[12.5px] font-medium transition ${
        active
          ? "bg-iris-500 text-white"
          : "border border-white/10 bg-white/5 text-fg-muted hover:text-fg"
      }`}
    >
      {children}
    </Link>
  );
}

function SellerCard({
  seller,
  urlsByPath,
  showActions,
}: {
  seller: ListedSeller;
  urlsByPath: Map<string, string>;
  showActions: boolean;
}) {
  return (
    <div className="surface-card overflow-hidden">
      <div className="grid gap-5 p-5 md:grid-cols-2">
        <div>
          <h3 className="font-display text-lg font-bold">
            {seller.display_name}{" "}
            <span className="text-fg-subtle">@{seller.handle}</span>
          </h3>
          <div className="mt-1 text-[13px] text-fg-muted">
            {seller.location ?? "Unknown location"}
          </div>

          <dl className="mt-4 space-y-2 text-[13px]">
            <Row label="Account">
              {seller.profiles?.full_name ?? "—"}{" "}
              <span className="text-fg-subtle">
                ({seller.profiles?.email ?? "no email"})
              </span>
            </Row>
            <Row label="Phone">{seller.profiles?.phone ?? "—"}</Row>
            <Row label="NID number">
              <span className="font-mono">{seller.nid_number ?? "—"}</span>
            </Row>
            <Row label="Submitted">
              {new Date(seller.submitted_at).toLocaleString("en-GB")}
            </Row>
            {seller.rejection_reason && (
              <Row label="Rejection reason">{seller.rejection_reason}</Row>
            )}
          </dl>

          {seller.bio && (
            <div className="mt-4 rounded-md border border-white/5 bg-white/[0.02] p-3 text-[13px] text-fg-muted">
              {seller.bio}
            </div>
          )}
        </div>

        <div>
          <div className="text-[11px] font-semibold uppercase tracking-wider text-fg-subtle">
            Submitted documents
          </div>
          <div className="mt-2 grid grid-cols-3 gap-2">
            {seller.kyc_documents.map((d) => {
              const url = urlsByPath.get(d.storage_path);
              const isImage = d.mime.startsWith("image/");
              return (
                <a
                  key={d.id}
                  href={url ?? "#"}
                  target="_blank"
                  rel="noreferrer"
                  className="group block overflow-hidden rounded-md border border-white/10 bg-black/30"
                >
                  <div className="relative aspect-[4/3]">
                    {url && isImage ? (
                      // Signed URL is short-lived, no point optimising
                      // eslint-disable-next-line @next/next/no-img-element
                      <img
                        src={url}
                        alt={d.kind}
                        className="absolute inset-0 h-full w-full object-cover transition group-hover:scale-105"
                      />
                    ) : (
                      <div className="absolute inset-0 grid place-items-center text-[11px] uppercase tracking-wider text-fg-subtle">
                        {d.mime.split("/")[1] ?? "doc"}
                      </div>
                    )}
                  </div>
                  <div className="flex items-center justify-between border-t border-white/5 px-2 py-1.5 text-[11.5px] text-fg-muted">
                    <span>{d.kind.replace("_", " ")}</span>
                    <ChevronRight size={12} />
                  </div>
                </a>
              );
            })}
          </div>
        </div>
      </div>

      {showActions && (
        <div className="grid gap-3 border-t border-white/5 bg-white/[0.02] p-5 md:grid-cols-2">
          <form action={approveSeller} className="flex items-center gap-2">
            <input type="hidden" name="sellerId" value={seller.id} />
            <input
              name="notes"
              placeholder="Optional approval note"
              className="h-10 flex-1 rounded-md border border-white/10 bg-white/5 px-3 text-[13px] placeholder:text-fg-subtle focus:border-iris-400/50 focus:bg-white/[0.06] focus:outline-none"
            />
            <Button type="submit" variant="primary" size="md">
              Approve
            </Button>
          </form>
          <form action={rejectSeller} className="flex items-center gap-2">
            <input type="hidden" name="sellerId" value={seller.id} />
            <input
              name="reason"
              placeholder="Reason (shown to seller)"
              className="h-10 flex-1 rounded-md border border-white/10 bg-white/5 px-3 text-[13px] placeholder:text-fg-subtle focus:border-iris-400/50 focus:bg-white/[0.06] focus:outline-none"
            />
            <Button type="submit" variant="danger" size="md">
              Reject
            </Button>
          </form>
        </div>
      )}
    </div>
  );
}

function Row({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div className="flex flex-wrap gap-x-3">
      <dt className="w-32 shrink-0 text-fg-subtle">{label}</dt>
      <dd className="min-w-0 flex-1 break-all text-fg">{children}</dd>
    </div>
  );
}


