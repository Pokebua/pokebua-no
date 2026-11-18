import { getProducts } from "@/lib/shopify/products";
import { getProductSort } from "@/lib/shopify/productSort";
import {
  CATALOG_PAGE_SIZE,
  getCatalogPageNumber,
  getCatalogPagination,
} from "@/lib/shopify/productPagination";
import ProductListing from "@/components/products/ProductListing";

export const metadata = {
  title: "Alle produkter | Pokébua",
};

export default async function ProductsPage({ searchParams }) {
  const parameters = await searchParams;
  const currentPage = getCatalogPageNumber(parameters.page);
  const { sort, sortKey, reverse, options } = getProductSort(parameters.sort);

  const { after, totalPages } = await getCatalogPagination({
    currentPage,
    sortKey,
    reverse,
  });

  const products =
    currentPage <= totalPages
      ? await getProducts({
          first: CATALOG_PAGE_SIZE,
          after,
          sortKey,
          reverse,
        })
      : { nodes: [] };

  return (
    <ProductListing
      title="Alle produkter"
      products={products}
      basePath="/produkter"
      currentPage={currentPage}
      totalPages={totalPages}
      sort={sort}
      sortOptions={options}
    />
  );
}
