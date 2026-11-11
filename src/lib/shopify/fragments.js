export const imageFields = `
  url
  altText
  width
  height
`;

export const productCardFragment = `
  fragment ProductCardFields on Product {
    id
    handle
    title
    availableForSale
    requiresSellingPlan
    featuredImage {
      ${imageFields}
    }
    priceRange {
      minVariantPrice {
        amount
        currencyCode
      }
      maxVariantPrice {
        amount
        currencyCode
      }
    }
    quickAddVariants: variants(first: 2) {
      nodes {
        id
        title
        availableForSale
      }
      pageInfo {
        hasNextPage
      }
    }
  }
`;

export const pageInfoFields = `
  hasNextPage
  endCursor
`;

export function validatePageSize(first) {
  if (!Number.isInteger(first) || first < 1 || first > 250) {
    throw new Error("Page size must be an integer between 1 and 250.");
  }
}
