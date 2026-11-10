export class CartRequestError extends Error {
  constructor(message, { status = 0, data = null } = {}) {
    super(message);
    this.name = "CartRequestError";
    this.status = status;
    this.data = data;
  }
}

async function cartRequest(path, { method = "GET", body } = {}) {
  let response;
  let data;

  try {
    response = await fetch(path, {
      method,
      cache: "no-store",
      credentials: "same-origin",
      headers: body ? { "Content-Type": "application/json" } : undefined,
      body: body ? JSON.stringify(body) : undefined,
    });

    data = await response.json();
  } catch {
    throw new CartRequestError(
      method === "GET"
        ? "Kunne ikke hente handlekurven. Prøv igjen."
        : "Kunne ikke bekrefte endringen. Last inn handlekurven på nytt.",
      {
        data: {
          needsRefresh: true,
          mutationMayHaveSucceeded: method !== "GET",
        },
      },
    );
  }

  if (!response.ok) {
    throw new CartRequestError(
      data.error ?? "Kunne ikke oppdatere handlekurven.",
      {
        status: response.status,
        data,
      },
    );
  }

  return data;
}

export function fetchCart() {
  return cartRequest("/api/cart");
}

export function ensureCart() {
  return cartRequest("/api/cart", {
    method: "POST",
  });
}

export function addCartVariant(variantId) {
  return cartRequest("/api/cart/lines", {
    method: "POST",
    body: {
      variantId,
      quantity: 1,
    },
  });
}

export function updateCartQuantity(lineId, quantity) {
  return cartRequest("/api/cart/lines", {
    method: "PATCH",
    body: {
      lineId,
      quantity,
    },
  });
}

export function deleteCartLine(lineId) {
  return cartRequest("/api/cart/lines", {
    method: "DELETE",
    body: {
      lineId,
    },
  });
}

export function fetchCartCheckout() {
  return cartRequest("/api/cart/checkout", {
    method: "POST",
  });
}
