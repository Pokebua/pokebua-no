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

export async function removeCartItem(lines, lineId) {
  const exists = lines.some((line) => line.id === lineId);

  if (!exists) {
    throw new Error("Varen finnes ikke i handlekurven.");
  }

  return lines.filter((line) => line.id !== lineId);
}

export async function restoreCartItems(savedLines) {
  if (!Array.isArray(savedLines)) return [];

  const restoredLines = [];
  const usedLineIds = new Set();
  const usedVariantIds = new Set();

  for (const savedLine of savedLines) {
    if (!savedLine || typeof savedLine !== "object") continue;

    const { id, productId, variantId, quantity } = savedLine;

    const validProductId =
      (typeof productId === "number" &&
        Number.isSafeInteger(productId) &&
        productId > 0) ||
      (typeof productId === "string" && /^[1-9]\d*$/.test(productId));

    if (
      typeof id !== "string" ||
      !id.startsWith("mock-line-") ||
      id.length <= "mock-line-".length ||
      !validProductId ||
      typeof variantId !== "string" ||
      !Number.isSafeInteger(quantity) ||
      quantity < 1
    ) {
      continue;
    }

    const product = await getProductById(productId);

    // Products removed from the dataset are not restored.
    if (!product) continue;

    const expectedVariantId = `mock-variant-${product.id}-default`;

    if (
      variantId !== expectedVariantId ||
      usedLineIds.has(id) ||
      usedVariantIds.has(variantId)
    ) {
      continue;
    }

    restoredLines.push({
      id,
      productId: product.id,
      variantId: expectedVariantId,
      quantity,
      product,
    });

    usedLineIds.add(id);
    usedVariantIds.add(variantId);
  }

  return restoredLines;
}
