import "server-only";

import { shopifyFetch } from "./client";

export async function createBuyNowCheckout(variantId, { buyerIp } = {}) {
  if (
    typeof variantId !== "string" ||
    !/^gid:\/\/shopify\/ProductVariant\/[1-9]\d*$/.test(variantId)
  ) {
    throw new Error("Ugyldig produktvariant.");
  }

  const data = await shopifyFetch({
    query: `
      mutation BuyNow($input: CartInput!) {
        cartCreate(input: $input) {
          cart {
            checkoutUrl
            totalQuantity
            lines(first: 2) {
              nodes {
                quantity
                merchandise {
                  ... on ProductVariant {
                    id
                  }
                }
              }
            }
          }
          userErrors {
            code
            message
          }
          warnings {
            code
            message
          }
        }
      }
    `,
    variables: {
      input: {
        lines: [
          {
            merchandiseId: variantId,
            quantity: 1,
          },
        ],
      },
    },
    buyerIp,
  });

  return data.cartCreate;
}
