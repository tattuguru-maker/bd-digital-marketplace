import Link from "next/link";
import { Plus, Search, Filter, Edit3, Eye, Copy, Trash2 } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ProductArt } from "@/components/marketplace/product-art";
import { products } from "@/lib/data";
import { formatBDT, formatNumber } from "@/lib/utils";

export const metadata = { title: "Listings · Digibazar" };

export default function ListingsPage() {
  const items = products.slice(0, 12);
  return (
    <>
      <div className="flex flex-wrap items-end justify-between gap-3">
        <div>
          <h1 className="font-display text-3xl font-bold">Your listings</h1>
          <p className="mt-1 text-sm text-fg-muted">{items.length} active products · 4 drafts</p>
        </div>
        <div className="flex gap-2">
          <Button variant="secondary"><Filter size={14} /> Filter</Button>
          <Button><Plus size={14} /> New listing</Button>
        </div>
      </div>

      <div className="mt-5 surface-card overflow-hidden">
        <div className="flex flex-wrap items-center gap-2 border-b border-white/5 p-3">
          <div className="relative flex-1 min-w-[220px]">
            <Search size={14} className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-fg-subtle" />
            <input
              placeholder="Search your products..."
              className="h-9 w-full rounded-md border border-white/10 bg-white/5 pl-9 pr-3 text-[13px] placeholder:text-fg-subtle focus:border-iris-400/50 focus:bg-white/[0.06] focus:outline-none"
            />
          </div>
          <select className="h-9 rounded-md border border-white/10 bg-white/5 px-3 text-[12px]">
            <option>All categories</option>
            <option>Streaming</option>
            <option>Game top-up</option>
          </select>
          <select className="h-9 rounded-md border border-white/10 bg-white/5 px-3 text-[12px]">
            <option>All statuses</option>
            <option>Active</option>
            <option>Draft</option>
            <option>Out of stock</option>
          </select>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-[13px]">
            <thead className="text-[11px] uppercase tracking-wider text-fg-subtle">
              <tr className="bg-white/[0.02]">
                <th className="py-3 pl-4 pr-3">Product</th>
                <th className="py-3 pr-3">Category</th>
                <th className="py-3 pr-3">Stock</th>
                <th className="py-3 pr-3">Price</th>
                <th className="py-3 pr-3">Sold</th>
                <th className="py-3 pr-3">Status</th>
                <th className="py-3 pr-3 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5">
              {items.map((p, i) => (
                <tr key={p.id} className="text-fg-muted hover:bg-white/[0.02]">
                  <td className="py-3 pl-4 pr-3">
                    <div className="flex items-center gap-3">
                      <ProductArt
                        brandColor={p.brandColor}
                        brandLabel={p.brandLabel}
                        className="h-10 w-10 shrink-0"
                        rounded="rounded-md"
                        size="sm"
                      />
                      <div className="min-w-0">
                        <Link href={`/product/${p.slug}`} className="line-clamp-1 font-medium text-fg hover:text-iris-200">
                          {p.name}
                        </Link>
                        <div className="text-[11px] text-fg-subtle">{p.platform} · {p.region.toUpperCase()}</div>
                      </div>
                    </div>
                  </td>
                  <td className="py-3 pr-3 capitalize">{p.category.replace("-", " ")}</td>
                  <td className="py-3 pr-3">
                    <span className={i % 5 === 0 ? "text-warning" : "text-fg"}>{i % 5 === 0 ? "12 left" : "In stock"}</span>
                  </td>
                  <td className="py-3 pr-3 font-medium text-fg">{formatBDT(p.price)}</td>
                  <td className="py-3 pr-3">{formatNumber(p.sold)}</td>
                  <td className="py-3 pr-3">
                    {i % 7 === 0 ? <Badge variant="ghost">Draft</Badge> : <Badge variant="success">Active</Badge>}
                  </td>
                  <td className="py-3 pr-3">
                    <div className="flex items-center justify-end gap-1">
                      <button className="grid h-8 w-8 place-items-center rounded-md text-fg-muted hover:bg-white/5 hover:text-fg" aria-label="View"><Eye size={14} /></button>
                      <button className="grid h-8 w-8 place-items-center rounded-md text-fg-muted hover:bg-white/5 hover:text-fg" aria-label="Edit"><Edit3 size={14} /></button>
                      <button className="grid h-8 w-8 place-items-center rounded-md text-fg-muted hover:bg-white/5 hover:text-fg" aria-label="Duplicate"><Copy size={14} /></button>
                      <button className="grid h-8 w-8 place-items-center rounded-md text-fg-muted hover:bg-white/5 hover:text-danger" aria-label="Delete"><Trash2 size={14} /></button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div className="border-t border-white/5 p-3 text-[12px] text-fg-subtle text-center">
          Showing 1–{items.length} of {items.length} listings
        </div>
      </div>
    </>
  );
}
