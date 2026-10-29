"use client";

import { useEffect, useState } from "react";
import { searchProducts } from "@/services/productSearch";

export default function useProductSearch(value, enabled = true) {
  const query = value.trim().toLowerCase();
  const hasQuery = query.length > 0;

  const [attempt, setAttempt] = useState(0);
  const [request, setRequest] = useState({
    query,
    enabled,
    attempt,
  });
  const [result, setResult] = useState(null);

  // Each change starts a separate search, even when returning to an old query.
  if (
    request.query !== query ||
    request.enabled !== enabled ||
    request.attempt !== attempt
  ) {
    setRequest({ query, enabled, attempt });
  }

  useEffect(() => {
    if (!request.enabled || !request.query) return;

    let ignore = false;

    async function findMatches() {
      try {
        const products = await searchProducts(request.query);

        if (!ignore) {
          setResult({
            request,
            products,
            error: null,
          });
        }
      } catch (error) {
        if (!ignore) {
          console.error("Product search failed:", error);

          setResult({
            request,
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
  }, [request]);

  const isCurrent = result?.request === request;
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
