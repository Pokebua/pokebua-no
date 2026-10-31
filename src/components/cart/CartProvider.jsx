"use client";

import { createContext, useCallback, useEffect, useRef, useState } from "react";
import {
  addCartItem,
  changeCartItemQuantity,
  removeCartItem,
  restoreCartItems,
} from "@/services/mockCart";
import { readSavedCart, saveCart } from "@/services/cartStorage";
import { toOre } from "@/utils/currency";

export const CartContext = createContext(null);

export default function CartProvider({ children }) {
  const [lines, setLines] = useState([]);

  const linesRef = useRef([]);
  const queueRef = useRef(Promise.resolve());
  const restorationRef = useRef(null);

  const ensureRestored = useCallback(() => {
    if (!restorationRef.current) {
      restorationRef.current = Promise.resolve()
        .then(() => restoreCartItems(readSavedCart()))
        .catch((error) => {
          console.warn("Could not restore cart:", error);
          return [];
        })
        .then((restoredLines) => {
          linesRef.current = restoredLines;
          setLines(restoredLines);

          return restoredLines;
        });
    }

    return restorationRef.current;
  }, []);

  useEffect(() => {
    void ensureRestored();
  }, [ensureRestored]);

  function enqueueOperation(updateCart) {
    const operation = queueRef.current.then(async () => {
      await ensureRestored();

      const nextLines = await updateCart(linesRef.current);

      linesRef.current = nextLines;
      setLines(nextLines);
      saveCart(nextLines);

      return nextLines;
    });

    // Failed operations must not block later cart changes.
    queueRef.current = operation.catch(() => {});

    return operation;
  }

  function addItem(productId) {
    return enqueueOperation((currentLines) =>
      addCartItem(currentLines, productId),
    );
  }

  function changeQuantity(lineId, change) {
    return enqueueOperation((currentLines) =>
      changeCartItemQuantity(currentLines, lineId, change),
    );
  }

  function removeItem(lineId) {
    return enqueueOperation((currentLines) =>
      removeCartItem(currentLines, lineId),
    );
  }

  const itemCount = lines.reduce((total, line) => total + line.quantity, 0);

  const subtotalInOre = lines.reduce(
    (total, line) => total + toOre(line.product.price) * line.quantity,
    0,
  );

  return (
    <CartContext.Provider
      value={{
        lines,
        addItem,
        changeQuantity,
        removeItem,
        itemCount,
        subtotalInOre,
      }}
    >
      {children}
    </CartContext.Provider>
  );
}
