import "server-only";

import { shopifyFetch } from "./client";
import { pageInfoFields } from "./fragments";
import {
  cartFields,
  cartLineFields,
  cartMutationFields,
} from "./cartFragments";

const MAX_GRAPHQL_INT = 2147483647;

function validateQuantity(quantity) {
  if (
    !Number.isSafeInteger(quantity) ||
    quantity < 1 ||
    quantity > MAX_GRAPHQL_INT
  ) {
    throw new Error("Antallet må være et gyldig positivt heltall.");
  }
}

function validateId(id) {
  if (typeof id !== "string" || !id.trim()) {
    throw new Error("Ugyldig Shopify-ID.");
  }
}

function validateVariantId(variantId) {
  if (
    typeof variantId !== "string" ||
    !/^gid:\/\/shopify\/ProductVariant\/[1-9]\d*$/.test(variantId)
  ) {
    throw new Error("Ugyldig produktvariant.");
  }
}

export async function createShopifyCart({ buyerIp } = {}) {
  const data = await shopifyFetch({
    query: `
      mutation CreateCart {
        cartCreate(input: {}) {
          ${cartMutationFields}
        }
      }
    `,
    buyerIp,
  });

  return data.cartCreate;
}

export async function getShopifyCart(cartId, { buyerIp } = {}) {
  validateId(cartId);

  const data = await shopifyFetch({
    query: `
      query GetCart($cartId: ID!) {
        cart(id: $cartId) {
          ${cartFields}
        }
      }
    `,
    variables: { cartId },
    buyerIp,
  });

  if (!data.cart) return null;

  return loadRemainingCartLines(data.cart, { buyerIp });
}

/**
 * Loads remaining lines when Shopify returns a paginated cart.
 * Can also complete a cart returned by a mutation.
 */
export async function loadRemainingCartLines(cart, { buyerIp } = {}) {
  if (!cart || !cart.lines.pageInfo.hasNextPage) {
    return cart;
  }

  const linesById = new Map(cart.lines.nodes.map((line) => [line.id, line]));

  const seenCursors = new Set();
  let pageInfo = cart.lines.pageInfo;

  while (pageInfo.hasNextPage) {
    const after = pageInfo.endCursor;

    if (!after || seenCursors.has(after)) {
      throw new Error("Shopify cart pagination did not advance.");
    }

    seenCursors.add(after);

    const data = await shopifyFetch({
      query: `
        query GetCartLines($cartId: ID!, $after: String!) {
          cart(id: $cartId) {
            lines(first: 250, after: $after) {
              nodes {
                ${cartLineFields}
              }
              pageInfo {
                ${pageInfoFields}
              }
            }
          }
        }
      `,
      variables: {
        cartId: cart.id,
        after,
      },
      buyerIp,
    });

    if (!data.cart) {
      throw new Error("Handlekurven er ikke lenger tilgjengelig.");
    }

    for (const line of data.cart.lines.nodes) {
      linesById.set(line.id, line);
    }

    pageInfo = data.cart.lines.pageInfo;
  }

  return {
    ...cart,
    lines: {
      nodes: [...linesById.values()],
      pageInfo,
    },
  };
}

export async function addShopifyCartItem(
  cartId,
  variantId,
  { quantity = 1, buyerIp } = {},
) {
  validateId(cartId);
  validateVariantId(variantId);
  validateQuantity(quantity);

  const data = await shopifyFetch({
    query: `
      mutation AddCartItem(
        $cartId: ID!
        $lines: [CartLineInput!]!
      ) {
        cartLinesAdd(cartId: $cartId, lines: $lines) {
          ${cartMutationFields}
        }
      }
    `,
    variables: {
      cartId,
      lines: [
        {
          merchandiseId: variantId,
          quantity,
        },
      ],
    },
    buyerIp,
  });

  return data.cartLinesAdd;
}

export async function updateShopifyCartItem(
  cartId,
  lineId,
  quantity,
  { buyerIp } = {},
) {
  validateId(cartId);
  validateId(lineId);
  validateQuantity(quantity);

  const data = await shopifyFetch({
    query: `
      mutation UpdateCartItem(
        $cartId: ID!
        $lines: [CartLineUpdateInput!]!
      ) {
        cartLinesUpdate(cartId: $cartId, lines: $lines) {
          ${cartMutationFields}
        }
      }
    `,
    variables: {
      cartId,
      lines: [
        {
          id: lineId,
          quantity,
        },
      ],
    },
    buyerIp,
  });

  return data.cartLinesUpdate;
}

export async function removeShopifyCartItem(cartId, lineId, { buyerIp } = {}) {
  validateId(cartId);
  validateId(lineId);

  const data = await shopifyFetch({
    query: `
      mutation RemoveCartItem(
        $cartId: ID!
        $lineIds: [ID!]!
      ) {
        cartLinesRemove(cartId: $cartId, lineIds: $lineIds) {
          ${cartMutationFields}
        }
      }
    `,
    variables: {
      cartId,
      lineIds: [lineId],
    },
    buyerIp,
  });

  return data.cartLinesRemove;
}
