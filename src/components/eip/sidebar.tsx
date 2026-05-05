"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  Database,
  Grid3X3,
  Filter,
  Play,
  LayoutDashboard,
  Rss,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";
import { useState } from "react";

const navItems = [
  { href: "/eip", label: "Dashboard", icon: LayoutDashboard },
  { href: "/eip/sources", label: "Data Sources", icon: Database },
  { href: "/eip/matrix", label: "Input Matrix", icon: Grid3X3 },
  { href: "/eip/criteria", label: "Criteria Builder", icon: Filter },
  { href: "/eip/runs", label: "Cohort Runs", icon: Play },
  { href: "/eip/feed", label: "API Feed", icon: Rss },
];

export function EipSidebar() {
  const pathname = usePathname();
  const [collapsed, setCollapsed] = useState(false);

  return (
    <aside
      className={`flex flex-col border-r border-border bg-bg-elev transition-all duration-200 ${
        collapsed ? "w-16" : "w-60"
      }`}
    >
      <div className="flex items-center justify-between p-4 border-b border-border">
        {!collapsed && (
          <Link href="/eip" className="flex items-center gap-2">
            <div className="h-8 w-8 rounded-md brand-gradient flex items-center justify-center">
              <Filter className="h-4 w-4 text-white" />
            </div>
            <div>
              <span className="font-display text-sm font-bold text-fg">EIP</span>
              <span className="block text-[10px] text-fg-subtle leading-tight">Cohort Identifier</span>
            </div>
          </Link>
        )}
        <button
          onClick={() => setCollapsed(!collapsed)}
          className="p-1.5 rounded-md hover:bg-surface text-fg-subtle hover:text-fg transition-colors"
        >
          {collapsed ? <ChevronRight className="h-4 w-4" /> : <ChevronLeft className="h-4 w-4" />}
        </button>
      </div>

      <nav className="flex-1 p-2 space-y-1">
        {navItems.map((item) => {
          const isActive =
            item.href === "/eip"
              ? pathname === "/eip"
              : pathname.startsWith(item.href) && item.href !== "/eip";

          return (
            <Link
              key={item.href}
              href={item.href}
              className={`flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm transition-all ${
                isActive
                  ? "bg-iris-500/15 text-iris-300 font-medium"
                  : "text-fg-muted hover:bg-surface hover:text-fg"
              } ${collapsed ? "justify-center px-0" : ""}`}
              title={collapsed ? item.label : undefined}
            >
              <item.icon className={`h-4.5 w-4.5 shrink-0 ${isActive ? "text-iris-400" : ""}`} />
              {!collapsed && <span>{item.label}</span>}
            </Link>
          );
        })}
      </nav>

      <div className="p-3 border-t border-border">
        {!collapsed && (
          <p className="text-[10px] text-fg-subtle text-center">
            BCC Early Intervention &amp; Prevention
          </p>
        )}
      </div>
    </aside>
  );
}
