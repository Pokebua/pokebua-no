import Image from "next/image";
import Link from "next/link";
import { formatMoney } from "@/utils/formatMoney";

export default function ShopifyProductCard({ product }) {
  const image = product.featuredImage;
  const { minVariantPrice, maxVariantPrice } = product.priceRange;

  const hasPriceRange =
    Number(minVariantPrice.amount) !== Number(maxVariantPrice.amount);

  return (
    <Link
      href={`/produkt/${encodeURIComponent(product.handle)}`}
      className="block h-full overflow-hidden rounded-2xl border-2 border-yellow-400 bg-black focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#001016]"
    >
      <article className="flex h-full flex-col">
        <div className="relative aspect-square overflow-hidden bg-white">
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
        </div>

        <div className="flex flex-1 flex-col p-3 text-white">
          <h2 className="wrap-break-word text-base">{product.title}</h2>

          <p className="mt-4 text-2xl font-bold">
            {hasPriceRange && <span className="text-base">Fra </span>}
            {formatMoney(minVariantPrice)}
          </p>

          {!product.availableForSale && (
            <p className="mt-2 text-sm text-yellow-400">Utsolgt</p>
          )}

          <span className="mt-auto pt-4 text-sm text-yellow-400">
            Se produkt
          </span>
        </div>
      </article>
    </Link>
  );
}
