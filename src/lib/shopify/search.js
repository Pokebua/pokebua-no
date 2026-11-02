import "server-only";

import { shopifyFetch } from "./client";
import {
  productCardFragment,
  pageInfoFields,
  validatePageSize,
} from "./fragments";

export async function searchShopifyProducts(
  query,
  { first = 24, after = null } = {},
) {
  validatePageSize(first);

  const normalizedQuery = query.trim();

  if (!normalizedQuery) {
    return {
      nodes: [],
      totalCount: 0,
      pageInfo: {
        hasNextPage: false,
        endCursor: null,
      },
    };
  }

  const data = await shopifyFetch({
    query: `
      ${productCardFragment}

      query SearchProducts(
        $query: String!
        $first: Int!
        $after: String
      ) {
        search(
          query: $query
          first: $first
          after: $after
          types: [PRODUCT]
          sortKey: RELEVANCE
        ) {
          nodes {
            ...ProductCardFields
          }
          totalCount
          pageInfo {
            ${pageInfoFields}
          }
        }
      }
    `,
    variables: {
      query: normalizedQuery,
      first,
      after,
    },
  });

  return data.search;
}

export async function getShopifySearchPage(
  query,
  { first = 24, page = 1 } = {},
) {
  validatePageSize(first);

  const normalizedQuery = query.trim();

  if (!Number.isSafeInteger(page) || page < 1) {
    throw new Error("Ugyldig sidetall.");
  }

  // Shopify search exposes at most 1,000 results.
  if (page > Math.ceil(1000 / first)) {
    throw new Error("Sidetallet er for høyt.");
  }

  let after = null;
  let remaining = (page - 1) * first;

  // Find the target cursor without fetching skipped product details.
  while (normalizedQuery && remaining > 0) {
    const batchSize = Math.min(remaining, 250);

    const data = await shopifyFetch({
      query: `
        query SearchPageCursor(
          $query: String!
          $first: Int!
          $after: String
        ) {
          search(
            query: $query
            first: $first
            after: $after
            types: [PRODUCT]
            sortKey: RELEVANCE
          ) {
            totalCount
            pageInfo {
              ${pageInfoFields}
            }
          }
        }
      `,
      variables: {
        query: normalizedQuery,
        first: batchSize,
        after,
      },
    });

    const connection = data.search;

    if (!connection.pageInfo.hasNextPage) {
      return {
        nodes: [],
        totalCount: connection.totalCount,
        pageInfo: {
          hasNextPage: false,
          endCursor: null,
        },
      };
    }

    const nextCursor = connection.pageInfo.endCursor;

    if (!nextCursor || nextCursor === after) {
      throw new Error("Shopify search pagination did not advance.");
    }

    after = nextCursor;
    remaining -= batchSize;
  }

  return searchShopifyProducts(normalizedQuery, { first, after });
}
