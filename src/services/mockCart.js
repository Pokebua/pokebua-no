import { getProductById } from "@/data/products";

export async function addCartItem(lines, productId) {
  const product = await getProductById(productId);

  if (!product) {
    throw new Error("Produktet finnes ikke.");
  }

  const variantId = `mock-variant-${product.id}-default`;
  const existingLine = lines.find((line) => line.variantId === variantId);

  if (existingLine) {
    return lines.map((line) =>
      line.id === existingLine.id
        ? { ...line, quantity: line.quantity + 1 }
        : line,
    );
  }

  return [
    ...lines,
    {
      id: `mock-line-${crypto.randomUUID()}`,
      productId: product.id,
      variantId,
      quantity: 1,
      product,
    },
  ];
}
