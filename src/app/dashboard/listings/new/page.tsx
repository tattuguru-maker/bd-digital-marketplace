import Link from "next/link";
import { ChevronRight } from "lucide-react";
import { ListingForm } from "@/components/dashboard/listing-form";

export const metadata = { title: "New listing · Digibazar" };

export default function NewListingPage() {
  return (
    <>
      <nav
        aria-label="Breadcrumb"
        className="mb-3 flex items-center gap-1.5 text-[11.5px] text-fg-subtle"
      >
        <Link href="/dashboard" className="hover:text-fg">
          Dashboard
        </Link>
        <ChevronRight size={11} />
        <Link href="/dashboard/listings" className="hover:text-fg">
          Listings
        </Link>
        <ChevronRight size={11} />
        <span className="text-fg">New</span>
      </nav>

      <header className="mb-5">
        <h1 className="font-display text-3xl font-bold">Create a listing</h1>
        <p className="mt-1 text-sm text-fg-muted">
          Listings published as draft stay private. Choose &quot;Publish now&quot; to
          go live on browse and category pages.
        </p>
      </header>

      <ListingForm mode="create" />
    </>
  );
}
