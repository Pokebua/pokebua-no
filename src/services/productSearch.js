/**
 * Searches Shopify through our server endpoint.
 * Private Shopify credentials remain on the server.
 */
export async function searchProducts(
  query,
  { first = 24, after = null, signal } = {},
) {
  const normalizedQuery = query.trim();

  if (!normalizedQuery) {
    return {
      nodes: [],
      totalCount: 0,
      pageInfo: {
        hasNextPage: false,
        endCursor: null,
      },
    };
  }

  const params = new URLSearchParams({
    q: normalizedQuery,
    first: String(first),
  });

  if (after) {
    params.set("after", after);
  }

  const response = await fetch(`/api/search?${params}`, {
    signal,
    cache: "no-store",
  });

  if (!response.ok) {
    throw new Error("Kunne ikke hente søkeresultater. Prøv igjen.");
  }

  return response.json();
}
