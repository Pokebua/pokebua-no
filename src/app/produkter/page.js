import { getProducts } from "@/lib/shopify/products";
import { getProductSort } from "@/lib/shopify/productSort";
import ProductListing from "@/components/products/ProductListing";

export const metadata = {
  title: "Alle produkter | Pokébua",
};

export default async function ProductsPage({ searchParams }) {
  const parameters = await searchParams;
  const after =
    typeof parameters.after === "string" && parameters.after
      ? parameters.after
      : null;

  const { sort, sortKey, reverse, options } = getProductSort(parameters.sort);

  const products = await getProducts({
    first: 24,
    after,
    sortKey,
    reverse,
  });

  return (
    <ProductListing
      title="Alle produkter"
      products={products}
      basePath="/produkter"
      hasCursor={Boolean(after)}
      sort={sort}
      sortOptions={options}
    />
  );
}
