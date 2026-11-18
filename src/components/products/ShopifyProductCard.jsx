import Image from "next/image";
import Link from "next/link";
import QuickAddToCartButton from "@/components/cart/QuickAddToCartButton";
import { formatMoney } from "@/utils/formatMoney";

const focusClassName =
  "focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#f7b900]";

const badgeClassName =
  "pointer-events-none absolute left-3 top-3 rounded-lg px-4 py-2 text-base font-bold uppercase tracking-wide sm:text-lg";

function isDiscounted(variant) {
  const { availableForSale, price, compareAtPrice } = variant;

  return (
    availableForSale &&
    price &&
    compareAtPrice &&
    price.currencyCode === compareAtPrice.currencyCode &&
    Number(compareAtPrice.amount) > Number(price.amount)
  );
}

export default function ShopifyProductCard({
  product,
  headingAs: Heading = "h2",
}) {
  const image = product.featuredImage;
  const { minVariantPrice, maxVariantPrice } = product.priceRange;
  const isSoldOut = !product.availableForSale;

  const hasPriceRange =
    Number(minVariantPrice.amount) !== Number(maxVariantPrice.amount);

  const href = `/produkt/${encodeURIComponent(product.handle)}`;

  const variants = product.quickAddVariants?.nodes ?? [];
  const hasSingleVariant =
    variants.length === 1 &&
    product.quickAddVariants?.pageInfo?.hasNextPage === false;

  const variant = hasSingleVariant ? variants[0] : null;
  const discountedVariants = isSoldOut ? [] : variants.filter(isDiscounted);
  const isOnSale = discountedVariants.length > 0;

  const displayedSaleVariant = discountedVariants.find(
    ({ price }) =>
      price.currencyCode === minVariantPrice.currencyCode &&
      Number(price.amount) === Number(minVariantPrice.amount),
  );

  const oldPrice = displayedSaleVariant?.compareAtPrice;

  const canQuickAdd =
    !isSoldOut &&
    Boolean(variant?.availableForSale) &&
    product.requiresSellingPlan === false;

  const productName =
    variant && variant.title !== "Default Title"
      ? `${product.title} – ${variant.title}`
      : product.title;

  const detailsLabel =
    !isSoldOut && !hasSingleVariant && variants.length > 0
      ? "Velg variant"
      : "Se produkt";

  const badgeLabel = isSoldOut ? "Utsolgt" : isOnSale ? "Tilbud" : null;

  return (
    <article className="flex h-full flex-col overflow-hidden rounded-2xl border-2 border-yellow-400 bg-black">
      <div className="relative aspect-square overflow-hidden bg-white">
        <Link
          href={href}
          tabIndex={-1}
          aria-label={`Se ${product.title}`}
          className="relative block h-full"
        >
          {image ? (
            <Image
              src={image.url}
              alt={image.altText || product.title}
              fill
              sizes="(min-width: 1200px) 384px, (min-width: 1024px) 33vw, (min-width: 640px) 50vw, 100vw"
              className={`object-cover object-center ${
                isSoldOut ? "opacity-60 grayscale" : ""
              }`}
            />
          ) : (
            <div className="grid h-full place-items-center p-4 text-center text-sm text-gray-600">
              Bilde kommer snart
            </div>
          )}
        </Link>

        {badgeLabel && (
          <span
            aria-hidden="true"
            className={`${badgeClassName} ${
              isSoldOut
                ? "bg-[#001016] text-white"
                : "bg-[#f7b900] text-[#001016]"
            }`}
          >
            {badgeLabel}
          </span>
        )}
      </div>

      <div className="flex flex-1 flex-col p-4 text-white">
        <Heading className="wrap-break-word font-sans text-xl font-semibold leading-snug">
          <Link
            href={href}
            className={`rounded-sm hover:underline hover:underline-offset-4 ${focusClassName}`}
          >
            {product.title}
            {badgeLabel && <span className="sr-only"> – {badgeLabel}</span>}
          </Link>
        </Heading>

        <div className="mt-auto pt-4">
          <p className="flex flex-wrap items-baseline gap-x-2 gap-y-1 text-base font-semibold leading-tight sm:text-lg">
            <span>
              {oldPrice && <span className="sr-only">Tilbudspris: </span>}
              {hasPriceRange && (
                <span className="mr-1 text-sm font-normal">Fra</span>
              )}
              {formatMoney(minVariantPrice)}
            </span>

            {oldPrice && (
              <span className="text-sm font-normal text-gray-300">
                <span className="sr-only">Førpris: </span>
                <del>{formatMoney(oldPrice)}</del>
              </span>
            )}
          </p>

          <Link
            href={href}
            aria-label={`${detailsLabel}: ${product.title}`}
            className={`mt-2 inline-flex min-h-11 items-center rounded-sm text-sm font-semibold text-yellow-400 hover:underline hover:underline-offset-4 ${focusClassName}`}
          >
            {detailsLabel}
          </Link>

          {canQuickAdd && (
            <QuickAddToCartButton
              variantId={variant.id}
              productName={productName}
              available={canQuickAdd}
              quantityAvailable={variant.quantityAvailable}
            />
          )}
        </div>
      </div>
    </article>
  );
}
