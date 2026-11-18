"use client";

import { useEffect, useState } from "react";
import ProductImageGallery from "@/components/products/ProductImageGallery";
import AddToCartButton from "@/components/cart/AddToCartButton";
import BuyNowButton from "@/components/cart/BuyNowButton";
import useCart from "@/hooks/useCart";
import { formatMoney } from "@/utils/formatMoney";

const MAX_QUANTITY = 2147483647;

const quantityButtonClassName =
  "inline-flex size-11 items-center justify-center rounded-lg border border-gray-600 bg-white text-xl font-semibold hover:bg-gray-100 focus-visible:outline-1 focus-visible:outline-offset-[-2px] focus-visible:outline-black disabled:opacity-50";

export default function ShopifyProductDetail({ product }) {
  const variants = product.variants.nodes;
  const { lines } = useCart();

  const [isBuyingNow, setIsBuyingNow] = useState(false);
  const [quantityInput, setQuantityInput] = useState("1");
  const [triedToExceedLimit, setTriedToExceedLimit] = useState(false);
  const [selectedVariantId, setSelectedVariantId] = useState(
    () =>
      variants.find((variant) => variant.availableForSale)?.id ??
      variants[0]?.id ??
      "",
  );

  useEffect(() => {
    function handlePageShow(event) {
      if (event.persisted) {
        setIsBuyingNow(false);
      }
    }

    window.addEventListener("pageshow", handlePageShow);

    return () => {
      window.removeEventListener("pageshow", handlePageShow);
    };
  }, []);

  const selectedVariant =
    variants.find((variant) => variant.id === selectedVariantId) ?? null;

  const available = Boolean(selectedVariant?.availableForSale);
  const isSoldOut = Boolean(selectedVariant) && !available;
  const price = selectedVariant?.price ?? null;
  const compareAtPrice = selectedVariant?.compareAtPrice ?? null;

  const onSale =
    price &&
    compareAtPrice &&
    price.currencyCode === compareAtPrice.currencyCode &&
    Number(compareAtPrice.amount) > Number(price.amount);

  const showVariantSelector =
    variants.length > 1 ||
    (variants.length === 1 && variants[0].title !== "Default Title");

  const productName =
    selectedVariant && selectedVariant.title !== "Default Title"
      ? `${product.title} – ${selectedVariant.title}`
      : product.title;

  const stock = selectedVariant?.quantityAvailable;
  const hasStockCount = Number.isInteger(stock);

  const quantityInCart = lines.reduce(
    (total, line) =>
      line.merchandise?.id === selectedVariantId
        ? total + line.quantity
        : total,
    0,
  );

  const maxQuantity = hasStockCount
    ? Math.min(MAX_QUANTITY, Math.max(0, stock - quantityInCart))
    : MAX_QUANTITY;

  const quantity = Number(quantityInput);
  const quantityIsValid =
    quantityInput !== "" &&
    Number.isSafeInteger(quantity) &&
    quantity >= 1 &&
    quantity <= maxQuantity;

  const showQuantity = available && !product.requiresSellingPlan;

  let quantityMessage = "";

  if (hasStockCount && maxQuantity === 0) {
    quantityMessage =
      stock > 0
        ? "Du har allerede hele tilgjengelige antallet i handlekurven."
        : "Ingen flere på lager.";
  } else if (quantity > maxQuantity || triedToExceedLimit) {
    if (!hasStockCount) {
      quantityMessage = `Du kan legge til maksimalt ${MAX_QUANTITY} stk.`;
    } else if (quantityInCart > 0) {
      quantityMessage = `Du kan legge til maks ${maxQuantity} stk. til. Du har allerede ${quantityInCart} stk. i handlekurven.`;
    } else {
      quantityMessage = `Kun ${maxQuantity} stk. på lager.`;
    }
  } else if (!quantityIsValid) {
    quantityMessage = "Skriv inn et heltall på minst 1.";
  }

  function changeQuantityInput(value) {
    setQuantityInput(value.replace(/[^0-9]/g, ""));
    setTriedToExceedLimit(false);
  }

  function handleVariantChange(event) {
    setSelectedVariantId(event.target.value);
    changeQuantityInput("1");
  }

  function decreaseQuantity() {
    if (quantity > maxQuantity) {
      changeQuantityInput(String(maxQuantity));
      return;
    }

    changeQuantityInput(String(quantity - 1));
  }

  function increaseQuantity() {
    const nextQuantity = quantity + 1;

    if (nextQuantity > maxQuantity) {
      setTriedToExceedLimit(true);
      return;
    }

    changeQuantityInput(String(nextQuantity));
  }

  return (
    <section
      aria-labelledby="product-heading"
      className="mx-auto grid max-w-6xl grid-cols-1 gap-8 p-6 font-sans md:grid-cols-2"
    >
      <ProductImageGallery
        key={`${product.id}-${selectedVariantId}`}
        images={product.images.nodes}
        preferredImage={selectedVariant?.image}
        featuredImage={product.featuredImage}
        productName={product.title}
        isSoldOut={isSoldOut}
      />

      <div className="flex min-w-0 flex-col justify-between rounded-2xl border-2 border-yellow-400 bg-yellow-100 p-6 text-black">
        <div>
          <h1
            id="product-heading"
            className="wrap-break-word text-3xl font-bold"
          >
            {product.title}
          </h1>

          {product.descriptionHtml ? (
            <div
              className="product-description mt-6"
              dangerouslySetInnerHTML={{ __html: product.descriptionHtml }}
            />
          ) : product.description ? (
            <p className="mt-6 whitespace-pre-line text-base leading-relaxed">
              {product.description}
            </p>
          ) : null}

          {showVariantSelector && (
            <div className="mt-6">
              <label
                htmlFor="product-variant"
                className="block text-sm font-semibold"
              >
                Velg variant
              </label>

              <select
                id="product-variant"
                value={selectedVariantId}
                disabled={isBuyingNow}
                onChange={handleVariantChange}
                className="mt-2 min-h-11 w-full cursor-pointer rounded-lg border border-gray-600 bg-white px-3 py-2 text-black focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-black disabled:cursor-not-allowed disabled:opacity-60"
              >
                {variants.map((variant) => (
                  <option key={variant.id} value={variant.id}>
                    {variant.title}
                    {!variant.availableForSale ? " — Utsolgt" : ""}
                  </option>
                ))}
              </select>
            </div>
          )}

          <div role="status" aria-atomic="true" className="mt-6 space-y-2">
            {price ? (
              <div className="flex flex-wrap items-baseline gap-3">
                {onSale && (
                  <p className="text-base text-gray-700">
                    <span className="sr-only">Førpris: </span>
                    <del>{formatMoney(compareAtPrice)}</del>
                  </p>
                )}

                <p className="text-3xl font-bold">
                  <span className="sr-only">
                    {onSale ? "Tilbudspris: " : "Pris: "}
                  </span>
                  {formatMoney(price)}
                </p>
              </div>
            ) : (
              <p>Pris er ikke tilgjengelig.</p>
            )}

            <p className="text-sm font-semibold">
              {!selectedVariant
                ? "Ingen tilgjengelige varianter."
                : available
                  ? "Tilgjengelig"
                  : "Utsolgt"}
            </p>
          </div>
        </div>

        <div className="mt-8">
          {showQuantity && (
            <div className="mb-4">
              <label
                htmlFor="product-quantity"
                className="block text-sm font-semibold"
              >
                Antall
              </label>

              <div className="mt-2 flex flex-wrap items-center gap-2">
                <button
                  type="button"
                  aria-label="Reduser antall"
                  disabled={isBuyingNow || maxQuantity === 0 || quantity <= 1}
                  onClick={decreaseQuantity}
                  className={quantityButtonClassName}
                >
                  −
                </button>

                <input
                  id="product-quantity"
                  type="text"
                  inputMode="numeric"
                  value={quantityInput}
                  onChange={(event) => changeQuantityInput(event.target.value)}
                  disabled={isBuyingNow}
                  aria-invalid={!quantityIsValid}
                  aria-describedby={
                    quantityMessage ? "product-quantity-message" : undefined
                  }
                  className="min-h-11 w-24 rounded-lg border border-gray-600 bg-white px-2 text-center focus:outline-1 focus:-outline-offset-2 focus:outline-black"
                />

                <button
                  type="button"
                  aria-label="Øk antall"
                  disabled={isBuyingNow || maxQuantity === 0}
                  onClick={increaseQuantity}
                  className={quantityButtonClassName}
                >
                  +
                </button>
              </div>

              <p
                id="product-quantity-message"
                role="status"
                aria-atomic="true"
                className={
                  quantityMessage ? "mt-2 text-sm text-red-800" : "sr-only"
                }
              >
                {quantityMessage}
              </p>
            </div>
          )}

          <div className="grid grid-cols-1 items-start gap-4 xl:grid-cols-2">
            <AddToCartButton
              key={selectedVariantId}
              variantId={selectedVariantId}
              productName={productName}
              quantity={quantity}
              available={available}
              requiresSellingPlan={product.requiresSellingPlan}
              disabled={isBuyingNow || !quantityIsValid}
            />

            <BuyNowButton
              key={`buy-now-${selectedVariantId}`}
              variantId={selectedVariantId}
              quantity={quantity}
              available={available}
              requiresSellingPlan={product.requiresSellingPlan}
              disabled={!quantityIsValid}
              isPending={isBuyingNow}
              onPendingChange={setIsBuyingNow}
            />
          </div>
        </div>
      </div>
    </section>
  );
}
