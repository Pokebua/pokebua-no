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
