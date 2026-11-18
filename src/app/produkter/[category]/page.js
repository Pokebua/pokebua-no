import { notFound } from "next/navigation";
import { getCollectionByHandle } from "@/lib/shopify/collections";
import { getProductSort } from "@/lib/shopify/productSort";
import ProductListing from "@/components/products/ProductListing";

export default async function CategoryPage({ params, searchParams }) {
  const { category } = await params;
  const parameters = await searchParams;

  const after =
    typeof parameters.after === "string" && parameters.after
      ? parameters.after
      : null;

  const { sort, sortKey, reverse, options } = getProductSort(parameters.sort, {
    isCollection: true,
  });

  const collection = await getCollectionByHandle(category, {
    first: 24,
    after,
    sortKey,
    reverse,
  });

  if (!collection) {
    notFound();
  }

  return (
    <ProductListing
      title={collection.title}
      description={collection.description}
      products={collection.products}
      basePath={`/produkter/${encodeURIComponent(collection.handle)}`}
      hasCursor={Boolean(after)}
      sort={sort}
      sortOptions={options}
    />
  );
}
