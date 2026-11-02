import "server-only";

import { cookies } from "next/headers";

const CART_COOKIE_NAME = "pokebua-shopify-cart";

const cookieOptions = {
  httpOnly: true,
  secure: process.env.NODE_ENV === "production",
  sameSite: "lax",
  path: "/",
};

export async function readCartId() {
  const cookieStore = await cookies();

  return cookieStore.get(CART_COOKIE_NAME)?.value ?? null;
}

export async function saveCartId(cartId) {
  const cookieStore = await cookies();

  cookieStore.set(CART_COOKIE_NAME, cartId, {
    ...cookieOptions,
    maxAge: 60 * 60 * 24 * 14,
  });
}

export async function clearCartId() {
  const cookieStore = await cookies();

  cookieStore.set(CART_COOKIE_NAME, "", {
    ...cookieOptions,
    maxAge: 0,
  });
}

/**
 * Explicitly select browser-safe cart fields.
 * The full cart ID stays on the server.
 */
export function toPublicCart(cart) {
  if (!cart) return null;

  return {
    totalQuantity: cart.totalQuantity,
    cost: cart.cost,
    lines: cart.lines.nodes,
  };
}
