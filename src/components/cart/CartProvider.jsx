"use client";

import { createContext, useRef, useState } from "react";
import { addCartItem } from "@/services/mockCart";

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

  return (
    <CartContext.Provider value={{ lines, addItem }}>
      {children}
    </CartContext.Provider>
  );
}
