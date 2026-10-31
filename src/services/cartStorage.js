const STORAGE_KEY = "pokebua-test-cart";
const STORAGE_VERSION = 1;

export function readSavedCart() {
  if (typeof window === "undefined") return [];

  try {
    const saved = window.localStorage.getItem(STORAGE_KEY);

    if (!saved) return [];

    const parsed = JSON.parse(saved);

    if (parsed?.version !== STORAGE_VERSION || !Array.isArray(parsed.lines)) {
      return [];
    }

    return parsed.lines;
  } catch (error) {
    console.warn("Could not read saved cart:", error);
    return [];
  }
}

export function saveCart(lines) {
  if (typeof window === "undefined") return;

  try {
    const savedLines = lines.map((line) => ({
      id: line.id,
      productId: line.productId,
      variantId: line.variantId,
      quantity: line.quantity,
    }));

    window.localStorage.setItem(
      STORAGE_KEY,
      JSON.stringify({
        version: STORAGE_VERSION,
        lines: savedLines,
      }),
    );
  } catch (error) {
    console.warn("Could not save cart:", error);
  }
}
