import { createShopifyCart, getShopifyCart } from "@/lib/shopify/cart";
import {
  clearCartId,
  readCartId,
  saveCartId,
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

export async function GET() {
  try {
    const cartId = await readCartId();

    if (!cartId) {
      return jsonResponse({ cart: null });
    }

    const cart = await getShopifyCart(cartId);

    // Clear the cookie only when Shopify confirms the cart is gone.
    if (!cart) {
      await clearCartId();

      return jsonResponse({ cart: null });
    }

    return jsonResponse({
      cart: toPublicCart(cart),
    });
  } catch {
    console.error("Shopify cart restoration failed.");

    return jsonResponse(
      {
        error: "Kunne ikke hente handlekurven. Prøv igjen.",
      },
      502,
    );
  }
}

export async function POST(request) {
  // Only allow browser mutations originating from this website.
  const origin = request.headers.get("origin");
  const expectedOrigin = new URL(request.url).origin;

  if (origin !== expectedOrigin) {
    return jsonResponse({ error: "Forespørselen er ikke tillatt." }, 403);
  }

  try {
    const cartId = await readCartId();

    if (cartId) {
      const existingCart = await getShopifyCart(cartId);

      if (existingCart) {
        return jsonResponse({
          cart: toPublicCart(existingCart),
          warnings: [],
        });
      }

      await clearCartId();
    }

    const result = await createShopifyCart();

    // Preserve a returned cart even if Shopify also reports an error.
    if (result.cart) {
      await saveCartId(result.cart.id);
    }

    if (result.userErrors.length > 0 || !result.cart) {
      return jsonResponse(
        {
          cart: toPublicCart(result.cart),
          error: "Kunne ikke opprette handlekurven. Prøv igjen.",
          warnings: result.warnings,
        },
        422,
      );
    }

    return jsonResponse(
      {
        cart: toPublicCart(result.cart),
        warnings: result.warnings,
      },
      201,
    );
  } catch {
    console.error("Shopify cart creation failed.");

    return jsonResponse(
      {
        error:
          "Kunne ikke bekrefte handlekurven. Last siden på nytt før du prøver igjen.",
      },
      502,
    );
  }
}
