"use client";

import Link from "next/link";
import { useState } from "react";
import { useMutation, useQuery } from "convex/react";
import { ShieldCheck, ChevronRight } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Breadcrumb } from "@/components/marketplace/breadcrumb";
import { api } from "@/lib/convex/api";

type SellerStatus = "pending_review" | "verified" | "rejected" | "suspended";

type ListedSeller = {
  id: string;
  displayName: string;
  handle: string;
  bio: string | null;
  location: string | null;
  nidNumber: string | null;
  status: SellerStatus;
  submittedAt: number;
  rejectionReason: string | null;
  owner: {
    fullName: string | null;
    email: string | null;
    phone: string | null;
  } | null;
  documents: Array<{
    id: string;
    kind: string;
    mime: string;
    url: string | null;
  }>;
};

const STATUSES: { value: SellerStatus; label: string }[] = [
  { value: "pending_review", label: "Pending" },
  { value: "verified", label: "Approved" },
  { value: "rejected", label: "Rejected" },
];

export default function AdminKycPage() {
  const [status, setStatus] = useState<SellerStatus>("pending_review");
  const sellers = useQuery(api.sellers.listForReview, { status }) as
    | ListedSeller[]
    | undefined;

  return (
    <div className="container-page py-8">
      <Breadcrumb
        items={[
          { label: "Home", href: "/" },
          { label: "Admin", href: "/admin/kyc" },
          { label: "KYC review" },
        ]}
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
            {sellers === undefined
              ? "Loading…"
              : `${sellers.length} seller${sellers.length === 1 ? "" : "s"} with status \u2018${status.replace("_", " ")}\u2019.`}
          </p>
        </div>
        <div className="flex gap-2">
          {STATUSES.map((s) => (
            <FilterTab
              key={s.value}
              active={status === s.value}
              onClick={() => setStatus(s.value)}
            >
              {s.label}
            </FilterTab>
          ))}
        </div>
      </div>

      {sellers !== undefined && sellers.length === 0 ? (
        <div className="mt-8 surface-card p-10 text-center">
          <h2 className="font-display text-lg font-bold">
            Inbox zero — no applications here.
          </h2>
          <p className="mt-1 text-[13.5px] text-fg-muted">
            New seller applications will appear here as they come in.
          </p>
        </div>
      ) : (
        <div className="mt-6 space-y-5">
          {(sellers ?? []).map((s) => (
            <SellerCard
              key={s.id}
              seller={s}
              showActions={status === "pending_review"}
            />
          ))}
        </div>
      )}
    </div>
  );
}

function FilterTab({
  active,
  onClick,
  children,
}: {
  active: boolean;
  onClick: () => void;
  children: React.ReactNode;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`inline-flex h-9 items-center rounded-full px-3.5 text-[12.5px] font-medium transition ${
        active
          ? "bg-iris-500 text-white"
          : "border border-white/10 bg-white/5 text-fg-muted hover:text-fg"
      }`}
    >
      {children}
    </button>
  );
}

function SellerCard({
  seller,
  showActions,
}: {
  seller: ListedSeller;
  showActions: boolean;
}) {
  const approve = useMutation(api.sellers.approve);
  const reject = useMutation(api.sellers.reject);
  const [pending, setPending] = useState<"approve" | "reject" | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [notes, setNotes] = useState("");
  const [reason, setReason] = useState("");

  return (
    <div className="surface-card overflow-hidden">
      <div className="grid gap-5 p-5 md:grid-cols-2">
        <div>
          <h3 className="font-display text-lg font-bold">
            {seller.displayName}{" "}
            <span className="text-fg-subtle">@{seller.handle}</span>
          </h3>
          <div className="mt-1 text-[13px] text-fg-muted">
            {seller.location ?? "Unknown location"}
          </div>

          <dl className="mt-4 space-y-2 text-[13px]">
            <Row label="Account">
              {seller.owner?.fullName ?? "—"}{" "}
              <span className="text-fg-subtle">
                ({seller.owner?.email ?? "no email"})
              </span>
            </Row>
            <Row label="Phone">{seller.owner?.phone ?? "—"}</Row>
            <Row label="NID number">
              <span className="font-mono">{seller.nidNumber ?? "—"}</span>
            </Row>
            <Row label="Submitted">
              {new Date(seller.submittedAt).toLocaleString("en-GB")}
            </Row>
            {seller.rejectionReason && (
              <Row label="Rejection reason">{seller.rejectionReason}</Row>
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
            {seller.documents.map((d) => {
              const isImage = d.mime.startsWith("image/");
              return (
                <Link
                  key={d.id}
                  href={d.url ?? "#"}
                  target="_blank"
                  rel="noreferrer"
                  className="group block overflow-hidden rounded-md border border-white/10 bg-black/30"
                >
                  <div className="relative aspect-[4/3]">
                    {d.url && isImage ? (
                      // eslint-disable-next-line @next/next/no-img-element
                      <img
                        src={d.url}
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
                </Link>
              );
            })}
          </div>
        </div>
      </div>

      {showActions && (
        <div className="space-y-2 border-t border-white/5 bg-white/[0.02] p-5">
          {error && (
            <div className="rounded-md border border-danger/30 bg-danger/10 p-2.5 text-[12.5px] text-danger">
              {error}
            </div>
          )}
          <div className="grid gap-3 md:grid-cols-2">
            <div className="flex items-center gap-2">
              <input
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                placeholder="Optional approval note"
                className="h-10 flex-1 rounded-md border border-white/10 bg-white/5 px-3 text-[13px] placeholder:text-fg-subtle focus:border-iris-400/50 focus:bg-white/[0.06] focus:outline-none"
              />
              <Button
                type="button"
                variant="primary"
                size="md"
                disabled={pending !== null}
                onClick={async () => {
                  setError(null);
                  setPending("approve");
                  try {
                    await approve({ sellerId: seller.id, notes: notes || undefined });
                  } catch (e) {
                    setError(e instanceof Error ? e.message : "Approve failed");
                  } finally {
                    setPending(null);
                  }
                }}
              >
                {pending === "approve" ? "Approving…" : "Approve"}
              </Button>
            </div>
            <div className="flex items-center gap-2">
              <input
                value={reason}
                onChange={(e) => setReason(e.target.value)}
                placeholder="Reason (shown to seller)"
                className="h-10 flex-1 rounded-md border border-white/10 bg-white/5 px-3 text-[13px] placeholder:text-fg-subtle focus:border-iris-400/50 focus:bg-white/[0.06] focus:outline-none"
              />
              <Button
                type="button"
                variant="danger"
                size="md"
                disabled={pending !== null || reason.trim().length < 5}
                onClick={async () => {
                  setError(null);
                  setPending("reject");
                  try {
                    await reject({ sellerId: seller.id, reason });
                  } catch (e) {
                    setError(e instanceof Error ? e.message : "Reject failed");
                  } finally {
                    setPending(null);
                  }
                }}
              >
                {pending === "reject" ? "Rejecting…" : "Reject"}
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

function Row({
  label,
  children,
}: {
  label: string;
  children: React.ReactNode;
}) {
  return (
    <div className="flex flex-wrap gap-x-3">
      <dt className="w-32 shrink-0 text-fg-subtle">{label}</dt>
      <dd className="min-w-0 flex-1 break-all text-fg">{children}</dd>
    </div>
  );
}
