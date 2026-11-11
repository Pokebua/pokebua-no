"use client";

import { useEffect, useState } from "react";
import ProductImageGallery from "@/components/products/ProductImageGallery";
import AddToCartButton from "@/components/cart/AddToCartButton";
import BuyNowButton from "@/components/cart/BuyNowButton";
import { formatMoney } from "@/utils/formatMoney";

export default function ShopifyProductDetail({ product }) {
  const variants = product.variants.nodes;

  const [isBuyingNow, setIsBuyingNow] = useState(false);

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
              dangerouslySetInnerHTML={{
                __html: product.descriptionHtml,
              }}
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
                onChange={(event) => setSelectedVariantId(event.target.value)}
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

        <div className="mt-8 grid grid-cols-1 items-start gap-4 xl:grid-cols-2">
          <AddToCartButton
            key={selectedVariantId}
            variantId={selectedVariantId}
            productName={productName}
            available={available}
            requiresSellingPlan={product.requiresSellingPlan}
            disabled={isBuyingNow}
          />

          <BuyNowButton
            key={`buy-now-${selectedVariantId}`}
            variantId={selectedVariantId}
            available={available}
            requiresSellingPlan={product.requiresSellingPlan}
            isPending={isBuyingNow}
            onPendingChange={setIsBuyingNow}
          />
        </div>
      </div>
    </section>
  );
}
