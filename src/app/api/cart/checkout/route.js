import { shopifyFetch } from "@/lib/shopify/client";
import { cartFields } from "@/lib/shopify/cartFragments";
import { loadRemainingCartLines } from "@/lib/shopify/cart";
import { getBuyerIp } from "@/lib/shopify/buyerIp";
import {
  clearCartId,
  readCartId,
  toPublicCart,
} from "@/lib/shopify/cartSession";

export const runtime = "nodejs";

function jsonResponse(body, status = 200) {
  return Response.json(body, {
    status,
    headers: {
      "Cache-Control": "private, no-store",
    },
  });
}

export async function POST(request) {
  const origin = request.headers.get("origin");
  const expectedOrigin = new URL(request.url).origin;

  if (origin !== expectedOrigin) {
    return jsonResponse({ error: "Forespørselen er ikke tillatt." }, 403);
  }

  try {
    const cartId = await readCartId();

    if (!cartId) {
      return jsonResponse(
        {
          code: "CART_NOT_FOUND",
          cart: null,
          error: "Handlekurven er ikke tilgjengelig. Legg til en vare først.",
        },
        409,
      );
    }

    const buyerIp = getBuyerIp(request);

    const data = await shopifyFetch({
      query: `
        query CartCheckout($cartId: ID!) {
          cart(id: $cartId) {
            ${cartFields}
            checkoutUrl
          }
        }
      `,
      variables: { cartId },
      buyerIp,
    });

    if (!data.cart) {
      await clearCartId();

      return jsonResponse(
        {
          code: "CART_NOT_FOUND",
          cart: null,
          error: "Handlekurven er ikke lenger tilgjengelig.",
        },
        409,
      );
    }

    const cart = await loadRemainingCartLines(data.cart, { buyerIp });

    if (cart.totalQuantity < 1) {
      return jsonResponse(
        {
          code: "CART_EMPTY",
          cart: toPublicCart(cart),
          error: "Handlekurven er tom. Legg til en vare først.",
        },
        409,
      );
    }

    // Use only the checkout URL returned by Shopify.
    const checkoutUrl = new URL(cart.checkoutUrl);

    if (
      checkoutUrl.protocol !== "https:" ||
      checkoutUrl.username ||
      checkoutUrl.password
    ) {
      throw new Error("Invalid Shopify checkout URL.");
    }

    return jsonResponse({
      cart: toPublicCart(cart),
      checkoutUrl: checkoutUrl.href,
      warnings: [],
    });
  } catch {
    console.error("Shopify checkout request failed.");

    return jsonResponse(
      {
        error: "Kunne ikke åpne kassen. Prøv igjen.",
      },
      502,
    );
  }
}
