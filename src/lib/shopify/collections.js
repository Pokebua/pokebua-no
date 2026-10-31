import "server-only";

import { shopifyFetch } from "./client";
import {
  imageFields,
  productCardFragment,
  pageInfoFields,
  validatePageSize,
} from "./fragments";

const collectionFields = `
  id
  handle
  title
  description
  image {
    ${imageFields}
  }
`;

export async function getCollections({ first = 50, after = null } = {}) {
  validatePageSize(first);

  const data = await shopifyFetch({
    query: `
      query Collections($first: Int!, $after: String) {
        collections(first: $first, after: $after, sortKey: TITLE) {
          nodes {
            ${collectionFields}
          }
          pageInfo {
            ${pageInfoFields}
          }
        }
      }
    `,
    variables: { first, after },
  });

  return data.collections;
}

export async function getCollectionByHandle(
  handle,
  { first = 24, after = null } = {},
) {
  validatePageSize(first);

  if (typeof handle !== "string" || !handle.trim()) {
    return null;
  }

  const data = await shopifyFetch({
    query: `
      ${productCardFragment}

      query CollectionDetails(
        $handle: String!
        $first: Int!
        $after: String
      ) {
        collection(handle: $handle) {
          ${collectionFields}
          seo {
            title
            description
          }
          products(
            first: $first
            after: $after
            sortKey: COLLECTION_DEFAULT
          ) {
            nodes {
              ...ProductCardFields
            }
            pageInfo {
              ${pageInfoFields}
            }
          }
        }
      }
    `,
    variables: { handle: handle.trim(), first, after },
  });

  return data.collection;
}
