import "server-only";

import { shopifyFetch } from "./client";
import {
  imageFields,
  productCardFragment,
  pageInfoFields,
  validatePageSize,
} from "./fragments";

const variantFields = `
  id
  title
  availableForSale
  selectedOptions {
    name
    value
  }
  price {
    amount
    currencyCode
  }
  compareAtPrice {
    amount
    currencyCode
  }
  image {
    ${imageFields}
  }
`;

export async function getProducts({ first = 24, after = null } = {}) {
  validatePageSize(first);

  const data = await shopifyFetch({
    query: `
      ${productCardFragment}

      query Products($first: Int!, $after: String) {
        products(first: $first, after: $after, sortKey: TITLE) {
          nodes {
            ...ProductCardFields
          }
          pageInfo {
            ${pageInfoFields}
          }
        }
      }
    `,
    variables: { first, after },
  });

  return data.products;
}

export async function getProductByHandle(handle) {
  if (typeof handle !== "string" || !handle.trim()) {
    return null;
  }

  const data = await shopifyFetch({
    query: `
      ${productCardFragment}

      query ProductDetails($handle: String!) {
        product(handle: $handle) {
          ...ProductCardFields
          description
          requiresSellingPlan
          seo {
            title
            description
          }
          options {
            name
            values
          }
          images(first: 20) {
            nodes {
              ${imageFields}
            }
            pageInfo {
              ${pageInfoFields}
            }
          }
          variants(first: 50) {
            nodes {
              ${variantFields}
            }
            pageInfo {
              ${pageInfoFields}
            }
          }
        }
      }
    `,
    variables: { handle: handle.trim() },
  });

  return data.product;
}

export async function getProductVariants(
  productId,
  { first = 50, after = null } = {},
) {
  validatePageSize(first);

  const data = await shopifyFetch({
    query: `
      query ProductVariants(
        $productId: ID!
        $first: Int!
        $after: String
      ) {
        product(id: $productId) {
          variants(first: $first, after: $after) {
            nodes {
              ${variantFields}
            }
            pageInfo {
              ${pageInfoFields}
            }
          }
        }
      }
    `,
    variables: { productId, first, after },
  });

  return data.product?.variants ?? null;
}

export async function getProductImages(
  productId,
  { first = 20, after = null } = {},
) {
  validatePageSize(first);

  const data = await shopifyFetch({
    query: `
      query ProductImages(
        $productId: ID!
        $first: Int!
        $after: String
      ) {
        product(id: $productId) {
          images(first: $first, after: $after) {
            nodes {
              ${imageFields}
            }
            pageInfo {
              ${pageInfoFields}
            }
          }
        }
      }
    `,
    variables: { productId, first, after },
  });

  return data.product?.images ?? null;
}
