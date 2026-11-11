"use client";

import { createContext, useCallback, useEffect, useRef, useState } from "react";
import {
  addCartVariant,
  deleteCartLine,
  ensureCart,
  fetchCart,
  fetchCartCheckout,
  updateCartQuantity,
} from "@/services/shopifyCart";

export const CartContext = createContext(null);

const RECOVERY_MESSAGE =
  "Handlekurven må lastes inn på nytt før du gjør flere endringer.";

export default function CartProvider({ children }) {
  const [cart, setCart] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [pendingCount, setPendingCount] = useState(0);
  const [cartError, setCartError] = useState("");
  const [warnings, setWarnings] = useState([]);
  const [isCheckingOut, setIsCheckingOut] = useState(false);

  const cartRef = useRef(null);
  const restorationRef = useRef(null);
  const queueRef = useRef(Promise.resolve());
  const needsRefreshRef = useRef(false);
  const checkoutRef = useRef(false);

  const applyCart = useCallback((nextCart) => {
    cartRef.current = nextCart;
    setCart(nextCart);
  }, []);

  const restoreCart = useCallback(() => {
    if (restorationRef.current) {
      return restorationRef.current;
    }

    setIsLoading(true);

    const operation = fetchCart()
      .then(({ cart: restoredCart }) => {
        applyCart(restoredCart);
        needsRefreshRef.current = false;
        setCartError("");
        setWarnings([]);

        return restoredCart;
      })
      .catch((error) => {
        needsRefreshRef.current = true;
        setCartError(error.message || RECOVERY_MESSAGE);
        throw error;
      })
      .finally(() => {
        setIsLoading(false);
        restorationRef.current = null;
      });

    restorationRef.current = operation;

    return operation;
  }, [applyCart]);

  useEffect(() => {
    // Restore failures are displayed through cartError.
    void restoreCart().catch(() => {});
  }, [restoreCart]);

  useEffect(() => {
    function handlePageShow(event) {
      if (!event.persisted) return;

      // Restore controls when returning through the browser's
      // back/forward cache.
      checkoutRef.current = false;
      setIsCheckingOut(false);

      void restoreCart().catch(() => {});
    }

    window.addEventListener("pageshow", handlePageShow);

    return () => {
      window.removeEventListener("pageshow", handlePageShow);
    };
  }, [restoreCart]);

  function handleOperationError(error) {
    const data = error.data;

    if (data && Object.prototype.hasOwnProperty.call(data, "cart")) {
      // A null cart in a rejected mutation does not necessarily mean
      // the existing cart disappeared.
      if (data.cart || data.code === "CART_NOT_FOUND") {
        applyCart(data.cart);
      }
    }

    if (data?.warnings) {
      setWarnings(data.warnings);
    }

    if (data?.needsRefresh || data?.mutationMayHaveSucceeded) {
      needsRefreshRef.current = true;
      setCartError(RECOVERY_MESSAGE);
    }
  }

  function enqueueOperation(operation) {
    setPendingCount((count) => count + 1);

    const pending = queueRef.current.then(async () => {
      if (checkoutRef.current) {
        throw new Error("Kassen åpnes. Vent litt.");
      }

      if (restorationRef.current) {
        await restorationRef.current;
      }

      if (needsRefreshRef.current) {
        throw new Error(RECOVERY_MESSAGE);
      }

      setWarnings([]);

      try {
        return await operation();
      } catch (error) {
        handleOperationError(error);
        throw error;
      }
    });

    const completed = pending.finally(() => {
      setPendingCount((count) => count - 1);
    });

    // Failed operations must not block later cart changes.
    queueRef.current = completed.catch(() => {});

    return completed;
  }

  function acceptResponse(data) {
    if (!data.cart) {
      needsRefreshRef.current = true;
      setCartError(RECOVERY_MESSAGE);
      throw new Error(RECOVERY_MESSAGE);
    }

    applyCart(data.cart);
    setWarnings(data.warnings ?? []);

    return data;
  }

  function addItem(variantId) {
    return enqueueOperation(async () => {
      if (!cartRef.current) {
        acceptResponse(await ensureCart());
      }

      return acceptResponse(await addCartVariant(variantId));
    });
  }

  function changeQuantity(lineId, change) {
    return enqueueOperation(async () => {
      if (change !== -1 && change !== 1) {
        throw new Error("Ugyldig antallsendring.");
      }

      const line = cartRef.current?.lines.find((entry) => entry.id === lineId);

      if (!line) {
        throw new Error("Varen finnes ikke lenger i handlekurven.");
      }

      const nextQuantity = line.quantity + change;

      if (
        !Number.isSafeInteger(nextQuantity) ||
        nextQuantity < 1 ||
        nextQuantity > 2147483647
      ) {
        throw new Error("Antallet må være et gyldig positivt heltall.");
      }

      return acceptResponse(await updateCartQuantity(lineId, nextQuantity));
    });
  }

  function removeItem(lineId) {
    return enqueueOperation(async () => {
      const result = acceptResponse(await deleteCartLine(lineId));

      if (result.cart.lines.some((line) => line.id === lineId)) {
        throw new Error("Varen ble ikke fjernet fra handlekurven.");
      }

      return result;
    });
  }

  async function openCheckout() {
    const result = await fetchCartCheckout();

    if (typeof result.checkoutUrl !== "string" || !result.checkoutUrl) {
      throw new Error("Kunne ikke åpne kassen. Prøv igjen.");
    }

    acceptResponse(result);

    // Keep controls locked while navigating to Shopify.
    window.location.assign(result.checkoutUrl);
  }

  function buyNow(variantId) {
    return enqueueOperation(async () => {
      checkoutRef.current = true;
      setIsCheckingOut(true);

      let itemAdded = false;

      try {
        if (!cartRef.current) {
          acceptResponse(await ensureCart());
        }

        const added = acceptResponse(await addCartVariant(variantId));
        itemAdded = true;

        if (added.warnings?.length) {
          throw new Error(
            `${added.warnings
              .map((warning) => warning.message)
              .join(" ")} Kontroller handlekurven før du går til kassen.`,
          );
        }

        await openCheckout();
      } catch (error) {
        checkoutRef.current = false;
        setIsCheckingOut(false);

        // The button can retry checkout without adding another item.
        error.itemAdded = itemAdded;

        throw error;
      }
    });
  }

  function checkout() {
    return enqueueOperation(async () => {
      checkoutRef.current = true;
      setIsCheckingOut(true);

      try {
        await openCheckout();
      } catch (error) {
        checkoutRef.current = false;
        setIsCheckingOut(false);
        throw error;
      }
    });
  }

  async function reloadCart() {
    setPendingCount((count) => count + 1);

    const operation = queueRef.current.then(async () => {
      if (checkoutRef.current) return;

      return await restoreCart();
    });

    // Reserve this position in the queue before awaiting the result.
    queueRef.current = operation.catch(() => {});

    try {
      return await operation;
    } catch {
      // Restore failures are displayed through cartError.
      return undefined;
    } finally {
      setPendingCount((count) => count - 1);
    }
  }

  return (
    <CartContext.Provider
      value={{
        lines: cart?.lines ?? [],
        itemCount: cart?.totalQuantity ?? 0,
        subtotal: cart?.cost.subtotalAmount ?? null,
        isLoading,
        isBusy: pendingCount > 0 || isCheckingOut,
        isCheckingOut,
        cartError,
        warnings,
        addItem,
        changeQuantity,
        removeItem,
        reloadCart,
        checkout,
        buyNow,
      }}
    >
      {children}
    </CartContext.Provider>
  );
}
