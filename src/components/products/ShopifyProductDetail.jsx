"use client";

import { useState } from "react";
import Image from "next/image";
import { formatMoney } from "@/utils/formatMoney";

export default function ShopifyProductDetail({ product }) {
  const variants = product.variants.nodes;

  const [selectedVariantId, setSelectedVariantId] = useState(
    () =>
      variants.find((variant) => variant.availableForSale)?.id ??
      variants[0]?.id ??
      "",
  );

  const selectedVariant =
    variants.find((variant) => variant.id === selectedVariantId) ?? null;

  const image = selectedVariant?.image ?? product.featuredImage;

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

  return (
    <section
      aria-labelledby="product-heading"
      className="mx-auto grid max-w-6xl grid-cols-1 gap-8 p-6 font-sans md:grid-cols-2"
    >
      <div className="relative aspect-square self-start overflow-hidden rounded-2xl border-2 border-yellow-400 bg-white">
        {image ? (
          <Image
            src={image.url}
            alt={image.altText || product.title}
            fill
            sizes="(min-width: 1152px) 536px, (min-width: 768px) 50vw, 100vw"
            className="object-cover object-center"
          />
        ) : (
          <div className="grid h-full place-items-center p-6 text-center text-gray-600">
            Bilde kommer snart
          </div>
        )}
      </div>

      <div className="flex flex-col justify-between rounded-2xl border-2 border-yellow-400 bg-yellow-100 p-6 text-black">
        <div>
          <h1
            id="product-heading"
            className="wrap-break-word text-3xl font-bold"
          >
            {product.title}
          </h1>

          {product.description && (
            <p className="mt-6 whitespace-pre-line text-base leading-relaxed">
              {product.description}
            </p>
          )}

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
                onChange={(event) => setSelectedVariantId(event.target.value)}
                className="mt-2 min-h-11 w-full cursor-pointer rounded-lg border border-gray-600 bg-white px-3 py-2 text-black focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-black"
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
          <button
            type="button"
            disabled
            aria-describedby="product-purchase-help"
            className="min-h-11 w-full cursor-not-allowed rounded-lg border-3 border-yellow-400 bg-black px-6 py-3 font-semibold text-white opacity-60"
          >
            {selectedVariant && !available ? "Utsolgt" : "Legg i handlekurv"}
          </button>

          <p id="product-purchase-help" className="mt-2 text-sm">
            Kjøp er ikke tilgjengelig på denne nettsiden ennå.
          </p>
        </div>
      </div>
    </section>
  );
}
