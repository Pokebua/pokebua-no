import Image from "next/image";
import Link from "next/link";
import QuickAddToCartButton from "@/components/cart/QuickAddToCartButton";
import { formatMoney } from "@/utils/formatMoney";

export default function ShopifyProductCard({
  product,
  headingAs: Heading = "h2",
}) {
  const image = product.featuredImage;
  const { minVariantPrice, maxVariantPrice } = product.priceRange;

  const hasPriceRange =
    Number(minVariantPrice.amount) !== Number(maxVariantPrice.amount);

  const href = `/produkt/${encodeURIComponent(product.handle)}`;

  const variants = product.quickAddVariants?.nodes ?? [];
  const hasSingleVariant =
    variants.length === 1 &&
    product.quickAddVariants?.pageInfo?.hasNextPage === false;

  const variant = hasSingleVariant ? variants[0] : null;

  const supportsQuickAdd =
    hasSingleVariant && product.requiresSellingPlan === false;

  const available =
    product.availableForSale && Boolean(variant?.availableForSale);

  const productName =
    variant && variant.title !== "Default Title"
      ? `${product.title} – ${variant.title}`
      : product.title;

  const detailsLabel =
    product.availableForSale && !hasSingleVariant && variants.length > 0
      ? "Velg variant"
      : "Se produkt";

  const focusClassName =
    "focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#f7b900]";

  return (
    <article className="flex h-full flex-col overflow-hidden rounded-2xl border-2 border-yellow-400 bg-black">
      <Link
        href={href}
        tabIndex={-1}
        aria-label={`Se ${product.title}`}
        className="relative block aspect-square overflow-hidden bg-white"
      >
        {image ? (
          <Image
            src={image.url}
            alt={image.altText || product.title}
            fill
            sizes="(min-width: 1200px) 384px, (min-width: 1024px) 33vw, (min-width: 640px) 50vw, 100vw"
            className="object-cover object-center"
          />
        ) : (
          <div className="grid h-full place-items-center p-4 text-center text-sm text-gray-600">
            Bilde kommer snart
          </div>
        )}
      </Link>

      <div className="flex flex-1 flex-col p-4 text-white">
        <Heading className="wrap-break-word font-sans text-xl font-semibold leading-snug">
          <Link
            href={href}
            className={`rounded-sm hover:underline hover:underline-offset-4 ${focusClassName}`}
          >
            {product.title}
          </Link>
        </Heading>

        <div className="mt-auto pt-4">
          <p className="flex flex-wrap items-baseline gap-x-1 text-base font-semibold leading-tight sm:text-lg">
            {hasPriceRange && <span className="text-sm font-normal">Fra</span>}

            <span>{formatMoney(minVariantPrice)}</span>
          </p>

          {!product.availableForSale && (
            <p className="mt-2 text-sm text-yellow-400">Utsolgt</p>
          )}

          <div className="mt-4 grid grid-cols-[auto_minmax(0,1fr)] items-start gap-3">
            <Link
              href={href}
              aria-label={`${detailsLabel}: ${product.title}`}
              className={`inline-flex min-h-11 items-center rounded-sm text-sm font-semibold text-yellow-400 hover:underline hover:underline-offset-4 ${focusClassName}`}
            >
              {detailsLabel}
            </Link>

            {supportsQuickAdd && (
              <QuickAddToCartButton
                variantId={variant.id}
                productName={productName}
                available={available}
              />
            )}
          </div>
        </div>
      </div>
    </article>
  );
}
