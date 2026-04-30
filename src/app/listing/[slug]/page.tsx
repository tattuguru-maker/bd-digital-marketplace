import { permanentRedirect } from "next/navigation";

export default async function ListingRedirectPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  permanentRedirect(`/product/${slug}`);
}
