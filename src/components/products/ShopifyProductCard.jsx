import Image from "next/image";
import Link from "next/link";
import QuickAddToCartButton from "@/components/cart/QuickAddToCartButton";
import { formatMoney } from "@/utils/formatMoney";

const focusClassName =
  "focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#f7b900]";

const badgeClassName =
  "pointer-events-none absolute left-2 top-2 rounded-md px-2.5 py-1 text-sm font-bold uppercase leading-tight sm:left-3 sm:top-3 sm:px-4 sm:py-2 sm:text-lg";

function isDiscounted(variant) {
  const price = variant.price;
  const previousPrice = variant.compareAtPrice;

  return (
    variant.availableForSale &&
    price &&
    previousPrice &&
    price.currencyCode === previousPrice.currencyCode &&
    Number(previousPrice.amount) > Number(price.amount)
  );
}

export default function ShopifyProductCard({
  product,
  headingAs: Heading = "h2",
}) {
  const href = `/produkt/${encodeURIComponent(product.handle)}`;
  const image = product.featuredImage;
  const isSoldOut = !product.availableForSale;

  const { minVariantPrice, maxVariantPrice } = product.priceRange;
  const hasPriceRange =
    Number(minVariantPrice.amount) !== Number(maxVariantPrice.amount);

  const variants = product.quickAddVariants?.nodes ?? [];
  const hasSingleVariant =
    variants.length === 1 &&
    product.quickAddVariants?.pageInfo?.hasNextPage === false;

  const variant = hasSingleVariant ? variants[0] : null;

  const canQuickAdd =
    !isSoldOut &&
    variant?.availableForSale &&
    product.requiresSellingPlan === false;

  const discountedVariants = variants.filter(isDiscounted);
  const isOnSale = !isSoldOut && discountedVariants.length > 0;

  const previousPrice = discountedVariants.find(
    (saleVariant) =>
      saleVariant.price.currencyCode === minVariantPrice.currencyCode &&
      Number(saleVariant.price.amount) === Number(minVariantPrice.amount),
  )?.compareAtPrice;

  const productName =
    variant && variant.title !== "Default Title"
      ? `${product.title} – ${variant.title}`
      : product.title;

  const detailsLabel =
    !isSoldOut && !hasSingleVariant && variants.length > 0
      ? "Velg variant"
      : "Se produkt";

  const badgeText = isSoldOut ? "Utsolgt" : isOnSale ? "Tilbud" : null;

  return (
    <article className="flex h-full min-w-0 flex-col overflow-hidden rounded-2xl border-2 border-yellow-400 bg-black">
      <Link
        href={href}
        tabIndex={-1}
        aria-label={`Se ${product.title}`}
        className="relative block aspect-square shrink-0 overflow-hidden bg-white"
      >
        {image ? (
          <Image
            src={image.url}
            alt={image.altText || product.title}
            fill
            sizes="(min-width: 1200px) 384px, (min-width: 1024px) 33vw, 50vw"
            className={`object-cover object-center ${
              isSoldOut ? "opacity-60 grayscale" : ""
            }`}
          />
        ) : (
          <span className="grid h-full place-items-center p-2 text-center text-sm text-gray-600">
            Bilde kommer snart
          </span>
        )}

        {badgeText && (
          <span
            aria-hidden="true"
            className={`${badgeClassName} ${
              isSoldOut
                ? "bg-[#001016] text-white"
                : "bg-[#f7b900] text-[#001016]"
            }`}
          >
            {badgeText}
          </span>
        )}
      </Link>

      <div className="flex min-w-0 flex-1 flex-col px-2 pt-2.5 pb-1.5 text-white sm:p-4">
        <Heading className="wrap-break-word font-sans text-[0.9375rem] leading-[1.3] font-semibold sm:text-xl sm:leading-snug">
          <Link
            href={href}
            className={`rounded-sm hover:underline hover:underline-offset-4 ${focusClassName}`}
          >
            {product.title}
            {badgeText && <span className="sr-only"> – {badgeText}</span>}
          </Link>
        </Heading>

        <div className="mt-auto pt-2.5 sm:pt-4">
          <p className="flex flex-wrap items-baseline gap-x-2 gap-y-0.5 leading-tight">
            <span className="text-base font-semibold sm:text-lg">
              {hasPriceRange && (
                <span className="mr-1 text-sm font-normal">Fra</span>
              )}
              {formatMoney(minVariantPrice)}
            </span>

            {previousPrice && (
              <span className="text-xs text-gray-300 sm:text-sm">
                <span className="sr-only">Førpris: </span>
                <del>{formatMoney(previousPrice)}</del>
              </span>
            )}
          </p>

          <Link
            href={href}
            aria-label={`${detailsLabel}: ${product.title}`}
            className={`mt-1 inline-flex min-h-11 items-center rounded-sm text-sm font-semibold text-yellow-400 hover:underline hover:underline-offset-4 sm:mt-2 ${focusClassName}`}
          >
            {detailsLabel}
          </Link>

          {canQuickAdd && (
            <QuickAddToCartButton
              variantId={variant.id}
              productName={productName}
              available={variant.availableForSale}
              quantityAvailable={variant.quantityAvailable}
            />
          )}
        </div>
      </div>
    </article>
  );
}
