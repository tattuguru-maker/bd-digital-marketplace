import { Filter, Tag, Truck, Globe, Star } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { categories } from "@/lib/data";

export function FiltersSidebar({ activeSlug }: { activeSlug?: string }) {
  return (
    <aside className="hidden w-64 shrink-0 lg:block">
      <div className="surface-card sticky top-32 p-5">
        <div className="flex items-center justify-between">
          <h3 className="inline-flex items-center gap-2 text-sm font-semibold">
            <Filter size={14} className="text-iris-300" /> Filters
          </h3>
          <button className="text-[11px] text-fg-subtle hover:text-fg">Reset</button>
        </div>

        <FilterGroup label="Category" icon={<Tag size={13} />}>
          <ul className="space-y-1.5">
            {categories.map((c) => (
              <li key={c.slug}>
                <label className="flex cursor-pointer items-center gap-2 text-[13px] text-fg-muted hover:text-fg">
                  <input
                    type="checkbox"
                    defaultChecked={c.slug === activeSlug}
                    className="size-3.5 accent-iris-500"
                  />
                  <span>{c.emoji}</span>
                  <span className="flex-1">{c.name}</span>
                  <span className="text-[10px] text-fg-subtle">{c.count}</span>
                </label>
              </li>
            ))}
          </ul>
        </FilterGroup>

        <FilterGroup label="Price (BDT)" icon={<Tag size={13} />}>
          <div className="flex items-center gap-2">
            <input className="h-8 w-full rounded-md border border-white/10 bg-white/5 px-2 text-[12px]" placeholder="Min" />
            <span className="text-fg-subtle">–</span>
            <input className="h-8 w-full rounded-md border border-white/10 bg-white/5 px-2 text-[12px]" placeholder="Max" />
          </div>
          <div className="mt-3 flex flex-wrap gap-1.5">
            {["< ৳200", "৳200–500", "৳500–1k", "৳1k–2k", "৳2k+"].map((p) => (
              <Badge key={p} variant="outline" className="cursor-pointer hover:!border-iris-400/40">
                {p}
              </Badge>
            ))}
          </div>
        </FilterGroup>

        <FilterGroup label="Delivery" icon={<Truck size={13} />}>
          {["Instant (≤ 5 min)", "Manual (≤ 15 min)", "Manual (≤ 1 hour)", "Manual (≤ 24h)"].map((d) => (
            <label key={d} className="flex cursor-pointer items-center gap-2 py-0.5 text-[13px] text-fg-muted hover:text-fg">
              <input type="checkbox" className="size-3.5 accent-iris-500" />
              {d}
            </label>
          ))}
        </FilterGroup>

        <FilterGroup label="Region" icon={<Globe size={13} />}>
          {["Global", "Asia / Pacific", "India", "United States", "Europe"].map((d) => (
            <label key={d} className="flex cursor-pointer items-center gap-2 py-0.5 text-[13px] text-fg-muted hover:text-fg">
              <input type="checkbox" className="size-3.5 accent-iris-500" />
              {d}
            </label>
          ))}
        </FilterGroup>

        <FilterGroup label="Rating" icon={<Star size={13} />}>
          {[5, 4, 3].map((r) => (
            <label key={r} className="flex cursor-pointer items-center gap-2 py-0.5 text-[13px] text-fg-muted hover:text-fg">
              <input type="checkbox" className="size-3.5 accent-iris-500" />
              {r}.0+
              <span className="text-gold-400 text-[11px]">{"★".repeat(r)}</span>
            </label>
          ))}
        </FilterGroup>

        <FilterGroup label="Seller">
          {["Top Rated", "Power Seller", "Verified", "New Seller"].map((d) => (
            <label key={d} className="flex cursor-pointer items-center gap-2 py-0.5 text-[13px] text-fg-muted hover:text-fg">
              <input type="checkbox" className="size-3.5 accent-iris-500" />
              {d}
            </label>
          ))}
        </FilterGroup>
      </div>
    </aside>
  );
}

function FilterGroup({
  label,
  icon,
  children,
}: {
  label: string;
  icon?: React.ReactNode;
  children: React.ReactNode;
}) {
  return (
    <div className="mt-5 border-t border-white/5 pt-5">
      <div className="mb-3 inline-flex items-center gap-1.5 text-[11px] font-semibold uppercase tracking-wider text-fg-subtle">
        {icon}
        {label}
      </div>
      {children}
    </div>
  );
}
