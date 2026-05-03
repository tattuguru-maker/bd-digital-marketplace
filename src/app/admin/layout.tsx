"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useQuery } from "convex/react";
import {
  LayoutDashboard,
  ShieldCheck,
  Users as UsersIcon,
  Package,
  Activity,
  Loader2,
  Lock,
} from "lucide-react";
import { Logo } from "@/components/site/logo";
import { Badge } from "@/components/ui/badge";
import { ButtonLink } from "@/components/ui/button";
import { api } from "@/lib/convex/api";
import { cn } from "@/lib/utils";

const items = [
  { href: "/admin", label: "Overview", icon: LayoutDashboard },
  { href: "/admin/users", label: "Users", icon: UsersIcon },
  { href: "/admin/listings", label: "Listings", icon: Package },
  { href: "/admin/kyc", label: "KYC review", icon: ShieldCheck },
  { href: "/admin/activity", label: "Activity log", icon: Activity },
];

type Me = {
  role: "buyer" | "seller" | "admin" | null;
  fullName: string | null;
  email: string | null;
} | null | undefined;

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const me = useQuery(api.users.current) as Me;

  if (me === undefined) {
    return (
      <div className="container-page py-16">
        <div className="surface-card flex items-center gap-2 p-6 text-sm text-fg-muted">
          <Loader2 size={14} className="animate-spin" /> Loading admin console…
        </div>
      </div>
    );
  }

  if (!me) {
    return (
      <div className="container-page py-16">
        <div className="surface-card mx-auto max-w-md p-6 text-center">
          <Lock className="mx-auto text-fg-subtle" size={28} />
          <h1 className="mt-3 font-display text-xl font-bold">Sign in required</h1>
          <p className="mt-1 text-[13.5px] text-fg-muted">
            The admin console is only available to signed-in administrators.
          </p>
          <div className="mt-4">
            <ButtonLink href="/login?next=/admin">Sign in</ButtonLink>
          </div>
        </div>
      </div>
    );
  }

  if (me.role !== "admin") {
    return (
      <div className="container-page py-16">
        <div className="surface-card mx-auto max-w-md p-6 text-center">
          <Lock className="mx-auto text-fg-subtle" size={28} />
          <h1 className="mt-3 font-display text-xl font-bold">Admins only</h1>
          <p className="mt-1 text-[13.5px] text-fg-muted">
            Your account doesn&apos;t have admin permissions. If this looks
            wrong, ask another admin to promote your role from the Convex
            dashboard.
          </p>
          <div className="mt-4">
            <ButtonLink href="/" variant="secondary">
              Back to home
            </ButtonLink>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="container-page py-6">
      <div className="grid gap-6 lg:grid-cols-[260px_minmax(0,1fr)]">
        <aside className="hidden lg:block">
          <div className="surface-card sticky top-32 p-3">
            <div className="px-2 py-2">
              <Logo />
            </div>
            <nav className="mt-2 space-y-0.5">
              {items.map((it) => {
                const Icon = it.icon;
                const active =
                  pathname === it.href ||
                  (it.href !== "/admin" && pathname?.startsWith(it.href));
                return (
                  <Link
                    key={it.href}
                    href={it.href}
                    className={cn(
                      "group flex items-center gap-3 rounded-lg px-3 py-2 text-[13.5px] transition",
                      active
                        ? "bg-iris-500/15 text-iris-100"
                        : "text-fg-muted hover:bg-white/5 hover:text-fg",
                    )}
                  >
                    <Icon
                      size={15}
                      className={cn(
                        "transition",
                        active
                          ? "text-iris-300"
                          : "text-fg-subtle group-hover:text-iris-300",
                      )}
                    />
                    <span>{it.label}</span>
                  </Link>
                );
              })}
            </nav>
            <div className="mx-2 my-3 h-px bg-white/5" />
            <div className="rounded-lg border border-iris-400/30 bg-iris-500/10 p-3">
              <div className="flex items-center gap-1.5 text-[11px] font-semibold uppercase tracking-wider text-iris-200">
                <ShieldCheck size={11} /> Admin
              </div>
              <p className="mt-1 text-[12px] text-iris-100">
                Signed in as{" "}
                <strong>{me.fullName ?? me.email ?? "admin"}</strong>.
              </p>
            </div>
          </div>
        </aside>

        <div>
          <div className="surface-card mb-5 flex items-center gap-3 p-3">
            <Badge variant="brand">
              <ShieldCheck size={11} /> Admin console
            </Badge>
            <span className="text-[12.5px] text-fg-muted">
              {me.fullName ?? me.email}
            </span>
            <span className="ml-auto inline-flex items-center gap-2 text-[12px] text-iris-200">
              <Link href="/dashboard" className="hover:text-iris-100">
                Seller dashboard →
              </Link>
            </span>
          </div>
          {children}
        </div>
      </div>
    </div>
  );
}
