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

export async function changeCartItemQuantity(lines, lineId, change) {
  if (change !== -1 && change !== 1) {
    throw new Error("Ugyldig antallsendring.");
  }

  const targetLine = lines.find((line) => line.id === lineId);

  if (!targetLine) {
    throw new Error("Varen finnes ikke i handlekurven.");
  }

  const nextQuantity = targetLine.quantity + change;

  if (!Number.isSafeInteger(nextQuantity) || nextQuantity < 1) {
    throw new Error("Antallet må være et positivt heltall.");
  }

  return lines.map((line) =>
    line.id === lineId ? { ...line, quantity: nextQuantity } : line,
  );
}
