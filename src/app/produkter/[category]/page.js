import { notFound } from "next/navigation";
import { getCollectionByHandle } from "@/lib/shopify/collections";
import { getProductSort } from "@/lib/shopify/productSort";
import {
  CATALOG_PAGE_SIZE,
  getCatalogPageNumber,
  getCatalogPagination,
} from "@/lib/shopify/productPagination";
import ProductListing from "@/components/products/ProductListing";

export default async function CategoryPage({ params, searchParams }) {
  const { category } = await params;
  const parameters = await searchParams;
  const currentPage = getCatalogPageNumber(parameters.page);
  const collectionHandle = category.trim();

  const { sort, sortKey, reverse, options } = getProductSort(parameters.sort, {
    isCollection: true,
  });

  const pagination = await getCatalogPagination({
    collectionHandle,
    currentPage,
    sortKey,
    reverse,
  });

  if (!pagination) {
    notFound();
  }

  const { after, totalPages } = pagination;
  const isValidPage = currentPage <= totalPages;

  const collection = await getCollectionByHandle(collectionHandle, {
    first: isValidPage ? CATALOG_PAGE_SIZE : 1,
    after: isValidPage ? after : null,
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
      products={isValidPage ? collection.products : { nodes: [] }}
      basePath={`/produkter/${encodeURIComponent(collection.handle)}`}
      currentPage={currentPage}
      totalPages={totalPages}
      sort={sort}
      sortOptions={options}
    />
  );
}
