"use client";

import { useEffect, useState } from "react";
import { searchProducts } from "@/services/productSearch";

const EMPTY_PAGE_INFO = {
  hasNextPage: false,
  endCursor: null,
};

export default function useProductSearch(
  value,
  enabled = true,
  { first = 24, after = null } = {},
) {
  const query = value.trim();
  const hasQuery = query.length > 0;

  const [attempt, setAttempt] = useState(0);
  const [request, setRequest] = useState({
    query,
    enabled,
    first,
    after,
    attempt,
  });
  const [result, setResult] = useState(null);

  // Returning to an earlier query still starts a fresh request.
  if (
    request.query !== query ||
    request.enabled !== enabled ||
    request.first !== first ||
    request.after !== after ||
    request.attempt !== attempt
  ) {
    setRequest({
      query,
      enabled,
      first,
      after,
      attempt,
    });
  }

  useEffect(() => {
    if (!request.enabled || !request.query) return;

    const controller = new AbortController();
    let ignore = false;

    async function findMatches() {
      try {
        const data = await searchProducts(request.query, {
          first: request.first,
          after: request.after,
          signal: controller.signal,
        });

        if (!ignore) {
          setResult({
            request,
            data,
            error: null,
          });
        }
      } catch (error) {
        if (ignore || controller.signal.aborted) return;

        console.error("Product search failed:", error);

        setResult({
          request,
          data: null,
          error: "Kunne ikke hente søkeresultater. Prøv igjen.",
        });
      }
    }

    const timeoutId = window.setTimeout(findMatches, 300);

    return () => {
      ignore = true;
      window.clearTimeout(timeoutId);
      controller.abort();
    };
  }, [request]);

  const isCurrent = result?.request === request;
  const isPending = enabled && hasQuery && !isCurrent;
  const currentResult = enabled && hasQuery && isCurrent ? result : null;

  function retry() {
    setAttempt((previous) => previous + 1);
  }

  return {
    matches: currentResult?.data?.nodes ?? [],
    totalCount: currentResult?.data?.totalCount ?? 0,
    pageInfo: currentResult?.data?.pageInfo ?? EMPTY_PAGE_INFO,
    hasQuery,
    isPending,
    error: currentResult?.error ?? null,
    retry,
  };
}
