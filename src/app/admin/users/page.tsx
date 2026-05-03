"use client";

import { useState } from "react";
import { useMutation, useQuery } from "convex/react";
import {
  Loader2,
  ShieldCheck,
  Users as UsersIcon,
  AlertTriangle,
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Breadcrumb } from "@/components/marketplace/breadcrumb";
import { api } from "@/lib/convex/api";
import { cleanConvexError, cn } from "@/lib/utils";

type Role = "buyer" | "seller" | "admin";

type AdminUser = {
  id: string;
  email: string | null;
  fullName: string | null;
  role: Role;
  createdAt: number;
  seller: {
    id: string;
    displayName: string;
    handle: string;
    status: string;
  } | null;
};

const ROLE_FILTERS: { value: Role | "all"; label: string }[] = [
  { value: "all", label: "All" },
  { value: "buyer", label: "Buyers" },
  { value: "seller", label: "Sellers" },
  { value: "admin", label: "Admins" },
];

export default function AdminUsersPage() {
  const [search, setSearch] = useState("");
  const [role, setRole] = useState<Role | "all">("all");
  const users = useQuery(api.admin.usersList, {
    search,
    role,
    limit: 100,
  }) as AdminUser[] | undefined;

  return (
    <div>
      <Breadcrumb
        items={[
          { label: "Admin", href: "/admin" },
          { label: "Users" },
        ]}
      />

      <header className="mt-4 flex flex-wrap items-end justify-between gap-3">
        <div>
          <Badge variant="brand">
            <UsersIcon size={11} /> Users
          </Badge>
          <h1 className="mt-2 font-display text-2xl font-bold md:text-3xl">
            User management
          </h1>
          <p className="mt-1 text-[14px] text-fg-muted">
            {users === undefined
              ? "Loading…"
              : `${users.length} user${users.length === 1 ? "" : "s"} match the current filter.`}
          </p>
        </div>
      </header>

      <div className="mt-4 flex flex-wrap items-center gap-2">
        <div className="surface-card flex h-10 min-w-[260px] flex-1 items-center gap-2 px-3">
          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search by name or email…"
            className="h-full flex-1 bg-transparent text-[13px] outline-none placeholder:text-fg-subtle"
          />
        </div>
        <div className="flex flex-wrap gap-1">
          {ROLE_FILTERS.map((f) => (
            <button
              key={f.value}
              type="button"
              onClick={() => setRole(f.value)}
              className={cn(
                "inline-flex h-9 items-center rounded-full px-3.5 text-[12.5px] font-medium transition",
                role === f.value
                  ? "bg-iris-500 text-white"
                  : "border border-white/10 bg-white/5 text-fg-muted hover:text-fg",
              )}
            >
              {f.label}
            </button>
          ))}
        </div>
      </div>

      <div className="surface-card mt-5 overflow-hidden">
        {users === undefined ? (
          <div className="flex items-center gap-2 p-6 text-sm text-fg-muted">
            <Loader2 size={14} className="animate-spin" /> Loading users…
          </div>
        ) : users.length === 0 ? (
          <div className="p-8 text-center text-[13px] text-fg-muted">
            No users match this filter.
          </div>
        ) : (
          <table className="w-full text-left text-[13px]">
            <thead className="text-[11.5px] uppercase tracking-wider text-fg-subtle">
              <tr className="border-b border-white/5">
                <th className="px-4 py-3 font-medium">User</th>
                <th className="px-4 py-3 font-medium">Role</th>
                <th className="px-4 py-3 font-medium">Seller</th>
                <th className="px-4 py-3 font-medium">Joined</th>
                <th className="px-4 py-3 font-medium text-right">Actions</th>
              </tr>
            </thead>
            <tbody>
              {users.map((u) => (
                <UserRow key={u.id} user={u} />
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}

function UserRow({ user }: { user: AdminUser }) {
  const setRole = useMutation(api.admin.setUserRole);
  const setSeller = useMutation(api.admin.setSellerStatus);
  const [pending, setPending] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const initials = (user.fullName ?? user.email ?? "?")
    .slice(0, 1)
    .toUpperCase();

  const handleRoleChange = async (next: Role) => {
    if (next === user.role) return;
    setError(null);
    setPending(true);
    try {
      await setRole({ userId: user.id as never, role: next });
    } catch (err) {
      setError(cleanConvexError(err, "Failed to update role."));
    } finally {
      setPending(false);
    }
  };

  const handleSellerStatus = async (next: "verified" | "suspended") => {
    if (!user.seller) return;
    setError(null);
    setPending(true);
    try {
      await setSeller({
        sellerId: user.seller.id as never,
        status: next,
      });
    } catch (err) {
      setError(cleanConvexError(err, "Failed to update seller status."));
    } finally {
      setPending(false);
    }
  };

  return (
    <tr className="border-b border-white/5 last:border-b-0 hover:bg-white/[0.02]">
      <td className="px-4 py-3">
        <div className="flex items-center gap-3">
          <div className="grid h-9 w-9 place-items-center rounded-full bg-gradient-to-br from-iris-500 to-cyan-400 font-display text-[13px] font-bold text-white">
            {initials}
          </div>
          <div className="min-w-0">
            <div className="truncate font-semibold">
              {user.fullName ?? "Unnamed user"}
            </div>
            <div className="truncate text-[11.5px] text-fg-subtle">
              {user.email ?? "no email"}
            </div>
          </div>
        </div>
      </td>
      <td className="px-4 py-3">
        <RolePill role={user.role} />
      </td>
      <td className="px-4 py-3">
        {user.seller ? (
          <div>
            <div className="font-medium">
              {user.seller.displayName}{" "}
              <span className="text-fg-subtle">@{user.seller.handle}</span>
            </div>
            <div className="text-[11.5px] text-fg-subtle">
              {sellerStatusLabel(user.seller.status)}
            </div>
          </div>
        ) : (
          <span className="text-fg-subtle">—</span>
        )}
      </td>
      <td className="px-4 py-3 text-fg-muted">
        {new Date(user.createdAt).toLocaleDateString("en-GB", {
          day: "numeric",
          month: "short",
          year: "numeric",
        })}
      </td>
      <td className="px-4 py-3">
        <div className="flex flex-wrap items-center justify-end gap-1.5">
          {user.role !== "admin" && (
            <Button
              size="sm"
              variant="ghost"
              disabled={pending}
              onClick={() => handleRoleChange("admin")}
            >
              Make admin
            </Button>
          )}
          {user.role === "admin" && (
            <Button
              size="sm"
              variant="ghost"
              disabled={pending}
              onClick={() => handleRoleChange("buyer")}
            >
              Demote
            </Button>
          )}
          {user.seller && user.seller.status === "verified" && (
            <Button
              size="sm"
              variant="ghost"
              disabled={pending}
              onClick={() => handleSellerStatus("suspended")}
            >
              Suspend seller
            </Button>
          )}
          {user.seller && user.seller.status === "suspended" && (
            <Button
              size="sm"
              variant="secondary"
              disabled={pending}
              onClick={() => handleSellerStatus("verified")}
            >
              Reinstate
            </Button>
          )}
          {pending && <Loader2 size={13} className="animate-spin text-fg-subtle" />}
        </div>
        {error && (
          <div className="mt-1 inline-flex items-center gap-1 text-[11px] text-danger">
            <AlertTriangle size={11} /> {error}
          </div>
        )}
      </td>
    </tr>
  );
}

function RolePill({ role }: { role: Role }) {
  const STYLES: Record<Role, string> = {
    buyer: "border border-white/10 bg-white/5 text-fg-muted",
    seller: "bg-emerald-500/15 text-emerald-200",
    admin: "bg-iris-500/15 text-iris-100",
  };
  return (
    <span
      className={cn(
        "inline-flex items-center gap-1 rounded-md px-1.5 py-0.5 text-[11px] font-semibold uppercase tracking-wider",
        STYLES[role],
      )}
    >
      {role === "admin" && <ShieldCheck size={10} />}
      {role}
    </span>
  );
}

function sellerStatusLabel(status: string) {
  switch (status) {
    case "pending_review":
      return "Pending review";
    case "verified":
      return "Verified seller";
    case "rejected":
      return "Rejected";
    case "suspended":
      return "Suspended";
    default:
      return status;
  }
}
