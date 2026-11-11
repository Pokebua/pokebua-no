import { createBuyNowCheckout } from "@/lib/shopify/buyNow";
import { getBuyerIp } from "@/lib/shopify/buyerIp";

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

  const contentType = request.headers
    .get("content-type")
    ?.split(";")[0]
    .trim()
    .toLowerCase();

  if (contentType !== "application/json") {
    return jsonResponse({ error: "Forespørselen må inneholde JSON." }, 415);
  }

  let body;

  try {
    body = await request.json();
  } catch {
    return jsonResponse(
      { error: "Forespørselen inneholder ugyldig JSON." },
      400,
    );
  }

  if (
    !body ||
    typeof body !== "object" ||
    Array.isArray(body) ||
    typeof body.variantId !== "string" ||
    !/^gid:\/\/shopify\/ProductVariant\/[1-9]\d*$/.test(body.variantId)
  ) {
    return jsonResponse({ error: "Ugyldig produktvariant." }, 400);
  }

  try {
    const result = await createBuyNowCheckout(body.variantId, {
      buyerIp: getBuyerIp(request),
    });

    if (result.userErrors.length > 0) {
      return jsonResponse(
        {
          error:
            "Kunne ikke starte kjøpet. Varen kan være utilgjengelig eller kreve en kjøpsplan.",
        },
        422,
      );
    }

    // Let the customer review warnings before attempting checkout again.
    if (result.warnings.length > 0) {
      return jsonResponse(
        {
          error:
            "Shopify meldte om en endring. Kontroller varen før du prøver igjen.",
          warnings: result.warnings,
        },
        409,
      );
    }

    const cart = result.cart;
    const lines = cart?.lines.nodes ?? [];
    const line = lines[0];

    const hasRequestedItem =
      cart?.totalQuantity === 1 &&
      lines.length === 1 &&
      line?.quantity === 1 &&
      line?.merchandise.id === body.variantId;

    if (!hasRequestedItem) {
      return jsonResponse(
        {
          error: "Varen kunne ikke legges til i kassen. Den kan være utsolgt.",
        },
        409,
      );
    }

    const checkoutUrl = new URL(cart.checkoutUrl);

    if (
      checkoutUrl.protocol !== "https:" ||
      checkoutUrl.username ||
      checkoutUrl.password
    ) {
      throw new Error("Invalid Shopify checkout URL.");
    }

    // Do not replace the customer's saved shopping-cart cookie.
    return jsonResponse({
      checkoutUrl: checkoutUrl.href,
    });
  } catch {
    console.error("Shopify buy-now request failed.");

    return jsonResponse(
      {
        error: "Kunne ikke åpne kassen. Prøv igjen.",
      },
      502,
    );
  }
}
