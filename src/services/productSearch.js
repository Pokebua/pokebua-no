import { getProducts } from "@/data/products";

/**
 * Searches all test products by name.
 * Returns full product objects for reuse by other search interfaces.
 */
export async function searchProducts(query) {
  const normalizedQuery = query.trim().toLowerCase();

  if (!normalizedQuery) return [];

  const products = await getProducts();

  return products.filter((product) =>
    product.name.toLowerCase().includes(normalizedQuery),
  );
}
