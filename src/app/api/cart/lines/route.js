import {
  addShopifyCartItem,
  getShopifyCart,
  loadRemainingCartLines,
  removeShopifyCartItem,
  updateShopifyCartItem,
} from "@/lib/shopify/cart";
import {
  clearCartId,
  readCartId,
  saveCartId,
  toPublicCart,
} from "@/lib/shopify/cartSession";

export const runtime = "nodejs";

const MAX_GRAPHQL_INT = 2147483647;

function jsonResponse(body, status = 200) {
  return Response.json(body, {
    status,
    headers: {
      "Cache-Control": "private, no-store",
    },
  });
}

function isValidQuantity(quantity) {
  return (
    Number.isSafeInteger(quantity) &&
    quantity >= 1 &&
    quantity <= MAX_GRAPHQL_INT
  );
}

function validateInput(action, body) {
  if (!body || typeof body !== "object" || Array.isArray(body)) {
    return "Ugyldig forespørsel.";
  }

  if (action === "add") {
    if (
      typeof body.variantId !== "string" ||
      !/^gid:\/\/shopify\/ProductVariant\/[1-9]\d*$/.test(body.variantId)
    ) {
      return "Ugyldig produktvariant.";
    }
  } else if (typeof body.lineId !== "string" || !body.lineId.trim()) {
    return "Ugyldig vare i handlekurven.";
  }

  if (action !== "remove" && !isValidQuantity(body.quantity)) {
    return "Antallet må være et gyldig positivt heltall.";
  }

  return null;
}

async function handleMutation(request, action) {
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

  const validationError = validateInput(action, body);

  if (validationError) {
    return jsonResponse({ error: validationError }, 400);
  }

  let mutationStarted = false;

  try {
    const cartId = await readCartId();

    if (!cartId) {
      return jsonResponse(
        {
          code: "CART_NOT_FOUND",
          cart: null,
          error: "Handlekurven må opprettes før du kan endre den.",
        },
        409,
      );
    }

    const currentCart = await getShopifyCart(cartId);

    if (!currentCart) {
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

    if (action !== "add") {
      const lineExists = currentCart.lines.nodes.some(
        (line) => line.id === body.lineId,
      );

      if (!lineExists) {
        return jsonResponse(
          {
            code: "LINE_NOT_FOUND",
            cart: toPublicCart(currentCart),
            error: "Varen finnes ikke lenger i handlekurven.",
          },
          409,
        );
      }
    }

    mutationStarted = true;

    let result;

    if (action === "add") {
      result = await addShopifyCartItem(cartId, body.variantId, {
        quantity: body.quantity,
      });
    } else if (action === "update") {
      result = await updateShopifyCartItem(cartId, body.lineId, body.quantity);
    } else {
      result = await removeShopifyCartItem(cartId, body.lineId);
    }

    // Save the returned ID before any additional reads.
    if (result.cart) {
      await saveCartId(result.cart.id);
    }

    const cart = result.cart ? await loadRemainingCartLines(result.cart) : null;

    if (result.userErrors.length > 0) {
      return jsonResponse(
        {
          code: "CART_OPERATION_REJECTED",
          cart: toPublicCart(cart),
          error: "Kunne ikke utføre endringen i handlekurven.",
          userErrors: result.userErrors,
          warnings: result.warnings,
          needsRefresh: !cart,
        },
        422,
      );
    }

    if (!cart) {
      return jsonResponse(
        {
          error:
            "Kunne ikke bekrefte endringen. Last inn handlekurven på nytt før du prøver igjen.",
          needsRefresh: true,
          mutationMayHaveSucceeded: true,
        },
        502,
      );
    }

    return jsonResponse({
      cart: toPublicCart(cart),
      warnings: result.warnings,
    });
  } catch {
    console.error("Shopify cart operation failed.");

    return jsonResponse(
      {
        error: mutationStarted
          ? "Kunne ikke bekrefte endringen. Last inn handlekurven på nytt før du prøver igjen."
          : "Kunne ikke hente handlekurven. Prøv igjen.",
        needsRefresh: true,
        mutationMayHaveSucceeded: mutationStarted,
      },
      502,
    );
  }
}

export async function POST(request) {
  return handleMutation(request, "add");
}

export async function PATCH(request) {
  return handleMutation(request, "update");
}

export async function DELETE(request) {
  return handleMutation(request, "remove");
}
