"use client";

import { createContext, useCallback, useEffect, useRef, useState } from "react";
import {
  addCartVariant,
  deleteCartLine,
  ensureCart,
  fetchCart,
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

  const cartRef = useRef(null);
  const restorationRef = useRef(null);
  const queueRef = useRef(Promise.resolve());
  const needsRefreshRef = useRef(false);

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
        setCartError(error.message);
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

  function reloadCart() {
    setPendingCount((count) => count + 1);

    const operation = queueRef.current.then(() => restoreCart());

    const completed = operation.finally(() => {
      setPendingCount((count) => count - 1);
    });

    queueRef.current = completed.catch(() => {});

    // Failure is shown in the panel.
    return completed.catch(() => {});
  }

  return (
    <CartContext.Provider
      value={{
        lines: cart?.lines ?? [],
        itemCount: cart?.totalQuantity ?? 0,
        subtotal: cart?.cost.subtotalAmount ?? null,
        isLoading,
        isBusy: pendingCount > 0,
        cartError,
        warnings,
        addItem,
        changeQuantity,
        removeItem,
        reloadCart,
      }}
    >
      {children}
    </CartContext.Provider>
  );
}
