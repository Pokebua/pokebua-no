"use client";

import { createContext, useRef, useState } from "react";
import { addCartItem } from "@/services/mockCart";
import { toOre } from "@/utils/currency";

export const CartContext = createContext(null);

export default function CartProvider({ children }) {
  const [lines, setLines] = useState([]);

  const linesRef = useRef([]);
  const queueRef = useRef(Promise.resolve());

  function addItem(productId) {
    const operation = queueRef.current.then(async () => {
      const nextLines = await addCartItem(linesRef.current, productId);

      linesRef.current = nextLines;
      setLines(nextLines);
    });

    // A failed operation must not block subsequent additions.
    queueRef.current = operation.catch(() => {});

    return operation;
  }

  const itemCount = lines.reduce((total, line) => total + line.quantity, 0);

  const subtotalInOre = lines.reduce(
    (total, line) => total + toOre(line.product.price) * line.quantity,
    0,
  );

  return (
    <CartContext.Provider value={{ lines, addItem, itemCount, subtotalInOre }}>
      {children}
    </CartContext.Provider>
  );
}
