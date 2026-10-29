"use client";

import { useEffect, useState } from "react";
import { searchProducts } from "@/services/productSearch";

export default function useProductSearch(value, enabled = true) {
  const query = value.trim().toLowerCase();
  const hasQuery = query.length > 0;

  const [attempt, setAttempt] = useState(0);
  const [result, setResult] = useState(null);

  useEffect(() => {
    if (!enabled || !query) return;

    let ignore = false;

    async function findMatches() {
      try {
        const products = await searchProducts(query);

        if (!ignore) {
          setResult({
            query,
            attempt,
            products,
            error: null,
          });
        }
      } catch (error) {
        if (!ignore) {
          console.error("Product search failed:", error);

          setResult({
            query,
            attempt,
            products: [],
            error: "Kunne ikke hente søkeresultater. Prøv igjen.",
          });
        }
      }
    }

    findMatches();

    return () => {
      ignore = true;
    };
  }, [query, enabled, attempt]);

  const isCurrent = result?.query === query && result?.attempt === attempt;

  const isPending = enabled && hasQuery && !isCurrent;

  const matches = enabled && hasQuery && isCurrent ? result.products : [];

  const error = enabled && hasQuery && isCurrent ? result.error : null;

  function retry() {
    setAttempt((previous) => previous + 1);
  }

  return {
    matches,
    hasQuery,
    isPending,
    error,
    retry,
  };
}
