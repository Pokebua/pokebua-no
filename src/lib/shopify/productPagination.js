import "server-only";

import { shopifyFetch } from "./client";

export const CATALOG_PAGE_SIZE = 24;

const CURSOR_BATCH_SIZE = 240;

export function getCatalogPageNumber(value) {
  if (typeof value !== "string" || !/^[1-9]\d*$/.test(value)) {
    return 1;
  }

  const page = Number(value);

  return Number.isSafeInteger(page) ? page : 1;
}

export async function getCatalogPagination({
  currentPage,
  sortKey,
  reverse,
  collectionHandle,
}) {
  const isCollection = typeof collectionHandle === "string";
  const sortType = isCollection
    ? "ProductCollectionSortKeys!"
    : "ProductSortKeys!";

  const productConnection = `
    products(first: $first, after: $after, sortKey: $sortKey, reverse: $reverse) {
      edges {
        cursor
      }
      pageInfo {
        hasNextPage
        endCursor
      }
    }
  `;

  const query = `
    query CatalogPagination(
      $first: Int!
      $after: String
      $sortKey: ${sortType}
      $reverse: Boolean!
      ${isCollection ? "$handle: String!" : ""}
    ) {
      ${
        isCollection
          ? `collection(handle: $handle) { ${productConnection} }`
          : productConnection
      }
    }
  `;

  const seenCursors = new Set();
  let batchCursor = null;
  let pageCursor = null;
  let totalCount = 0;

  while (true) {
    const data = await shopifyFetch({
      query,
      variables: {
        first: CURSOR_BATCH_SIZE,
        after: batchCursor,
        sortKey,
        reverse,
        ...(isCollection ? { handle: collectionHandle } : {}),
      },
    });

    const connection = isCollection ? data.collection?.products : data.products;

    if (!connection) return null;

    const { edges, pageInfo } = connection;
    const cursorEdgeIndex =
      (currentPage - 1) * CATALOG_PAGE_SIZE - totalCount - 1;

    if (cursorEdgeIndex >= 0 && cursorEdgeIndex < edges.length) {
      pageCursor = edges[cursorEdgeIndex].cursor;
    }

    totalCount += edges.length;

    if (!pageInfo.hasNextPage) {
      return {
        after: pageCursor,
        totalPages: Math.ceil(totalCount / CATALOG_PAGE_SIZE),
      };
    }

    const nextCursor = pageInfo.endCursor;

    if (!nextCursor || seenCursors.has(nextCursor) || edges.length === 0) {
      throw new Error("Shopify catalog pagination did not advance.");
    }

    seenCursors.add(nextCursor);
    batchCursor = nextCursor;
  }
}
