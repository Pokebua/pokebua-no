import "server-only";

import { imageFields, pageInfoFields } from "./fragments";

export const cartLineFields = `
  id
  quantity
  cost {
    amountPerQuantity {
      amount
      currencyCode
    }
    subtotalAmount {
      amount
      currencyCode
    }
    totalAmount {
      amount
      currencyCode
    }
  }
  merchandise {
    ... on ProductVariant {
      id
      title
      availableForSale
      selectedOptions {
        name
        value
      }
      image {
        ${imageFields}
      }
      product {
        id
        handle
        title
        featuredImage {
          ${imageFields}
        }
      }
    }
  }
`;

export const cartFields = `
  id
  totalQuantity
  cost {
    subtotalAmount {
      amount
      currencyCode
    }
    totalAmount {
      amount
      currencyCode
    }
    subtotalAmountEstimated
    totalAmountEstimated
  }
  lines(first: 250) {
    nodes {
      ${cartLineFields}
    }
    pageInfo {
      ${pageInfoFields}
    }
  }
`;

export const cartMutationFields = `
  cart {
    ${cartFields}
  }
  userErrors {
    code
    field
    message
  }
  warnings {
    code
    message
  }
`;
