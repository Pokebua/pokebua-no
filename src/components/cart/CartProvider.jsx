"use client";

import { createContext, useRef, useState } from "react";
import {
  addCartItem,
  changeCartItemQuantity,
  removeCartItem,
} from "@/services/mockCart";
import { toOre } from "@/utils/currency";

export const CartContext = createContext(null);

export default function CartProvider({ children }) {
  const [lines, setLines] = useState([]);

  const linesRef = useRef([]);
  const queueRef = useRef(Promise.resolve());

  function enqueueOperation(updateCart) {
    const operation = queueRef.current.then(async () => {
      const nextLines = await updateCart(linesRef.current);

      linesRef.current = nextLines;
      setLines(nextLines);

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
