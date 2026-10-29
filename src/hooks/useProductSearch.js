"use client";

import { useEffect, useState } from "react";
import { searchProducts } from "@/services/productSearch";

export default function useProductSearch(value, enabled = true) {
  const query = value.trim().toLowerCase();
  const [result, setResult] = useState({
    query: "",
    products: [],
  });

  useEffect(() => {
    if (!enabled || !query) return;

    let ignore = false;

    async function findMatches() {
      try {
        const products = await searchProducts(query);

        if (!ignore) {
          setResult({ query, products });
        }
      } catch (error) {
        if (!ignore) {
          setResult({ query, products: [] });
          console.error("Product search failed:", error);
        }
      }
    }

    findMatches();

    return () => {
      ignore = true;
    };
  }, [query, enabled]);

  // Never display results belonging to a different query.
  const matches =
    enabled && query && result.query === query ? result.products : [];

  return {
    matches,
    hasQuery: query.length > 0,
  };
}
