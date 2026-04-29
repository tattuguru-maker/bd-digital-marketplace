"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useQuery } from "convex/react";
import { useAuthActions } from "@convex-dev/auth/react";
import {
  User,
  LogOut,
  ShoppingBag,
  Heart,
  Bell,
  LayoutDashboard,
  ShieldCheck,
} from "lucide-react";
import { api } from "@/lib/convex/api";

type CurrentUser = {
  id: string;
  email?: string | null;
  fullName?: string | null;
  role: "buyer" | "seller" | "admin";
};

export function UserMenu() {
  const router = useRouter();
  const { signOut } = useAuthActions();
  const me = useQuery(api.users.current) as CurrentUser | null | undefined;

  if (me === null) {
    return (
      <Link
        href="/login"
        className="hidden h-11 items-center rounded-full px-4 text-[14px] font-medium text-fg-muted hover:bg-white/5 hover:text-fg sm:inline-flex"
      >
        <User size={16} className="mr-1.5" />
        Sign in
      </Link>
    );
  }

  if (me === undefined) {
    // Auth still resolving — render a placeholder slot of the same width to
    // avoid layout shift.
    return <div aria-hidden className="hidden h-11 w-32 sm:inline-block" />;
  }

  const name = me.fullName || me.email?.split("@")[0] || "Account";
  const initial = name.slice(0, 1).toUpperCase();
  const isSeller = me.role === "seller";
  const isAdmin = me.role === "admin";

  async function onSignOut() {
    await signOut();
    router.push("/");
    router.refresh();
  }

  return (
    <div className="relative hidden sm:inline-block group">
      <button
        type="button"
        className="inline-flex h-11 items-center gap-2 rounded-full pl-1.5 pr-3 text-[13.5px] font-medium text-fg hover:bg-white/5"
      >
        <span className="grid h-8 w-8 place-items-center rounded-full bg-gradient-to-br from-iris-400 to-iris-700 font-display text-[12.5px] font-bold text-white">
          {initial}
        </span>
        <span className="max-w-28 truncate">{name}</span>
      </button>

      <div className="invisible absolute right-0 top-full z-50 w-64 translate-y-1 opacity-0 transition group-hover:visible group-hover:translate-y-0 group-hover:opacity-100 group-focus-within:visible group-focus-within:translate-y-0 group-focus-within:opacity-100">
        <div className="surface-card mt-2 overflow-hidden p-1.5">
          <div className="px-3 py-2.5">
            <div className="text-[13px] font-semibold text-fg">{name}</div>
            <div className="text-[11.5px] text-fg-subtle">{me.email}</div>
          </div>
          <div className="my-1 h-px bg-white/5" />
          <MenuItem href="/orders" icon={<ShoppingBag size={14} />}>
            My orders
          </MenuItem>
          <MenuItem href="/wishlist" icon={<Heart size={14} />}>
            Wishlist
          </MenuItem>
          <MenuItem href="/notifications" icon={<Bell size={14} />}>
            Notifications
          </MenuItem>
          {isSeller && (
            <>
              <div className="my-1 h-px bg-white/5" />
              <MenuItem href="/dashboard" icon={<LayoutDashboard size={14} />}>
                Seller dashboard
              </MenuItem>
            </>
          )}
          {isAdmin && (
            <>
              <div className="my-1 h-px bg-white/5" />
              <MenuItem href="/admin/kyc" icon={<ShieldCheck size={14} />}>
                Admin · KYC review
              </MenuItem>
            </>
          )}
          <div className="my-1 h-px bg-white/5" />
          <button
            type="button"
            onClick={onSignOut}
            className="flex w-full items-center gap-2 rounded-md px-3 py-2 text-left text-[13px] text-fg-muted hover:bg-white/5 hover:text-fg"
          >
            <LogOut size={14} /> Sign out
          </button>
        </div>
      </div>
    </div>
  );
}

function MenuItem({
  href,
  icon,
  children,
}: {
  href: string;
  icon: React.ReactNode;
  children: React.ReactNode;
}) {
  return (
    <Link
      href={href}
      className="flex items-center gap-2 rounded-md px-3 py-2 text-[13px] text-fg-muted hover:bg-white/5 hover:text-fg"
    >
      {icon} {children}
    </Link>
  );
}
