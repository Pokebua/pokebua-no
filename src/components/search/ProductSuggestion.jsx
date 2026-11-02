import Image from "next/image";
import Link from "next/link";
import { formatMoney } from "@/utils/formatMoney";

export default function ProductSuggestion({ product, onSelect }) {
  const image = product.featuredImage;
  const { minVariantPrice, maxVariantPrice } = product.priceRange;

  const hasPriceRange =
    Number(minVariantPrice.amount) !== Number(maxVariantPrice.amount);

  return (
    <Link
      href={`/produkt/${encodeURIComponent(product.handle)}`}
      onClick={onSelect}
      className="group block h-full rounded-md text-white focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#f7b900]"
    >
      <div className="relative aspect-square overflow-hidden rounded-md bg-white">
        {image ? (
          <Image
            src={image.url}
            alt=""
            fill
            sizes="(min-width: 1280px) 230px, (min-width: 1024px) 20vw, (min-width: 640px) 33vw, 50vw"
            className="object-cover object-center"
          />
        ) : (
          <div className="grid h-full place-items-center p-4 text-center text-sm text-[#001016]">
            Bilde kommer snart
          </div>
        )}
      </div>

      <div className="px-1 pb-2 pt-3 text-center">
        <p className="wrap-break-word text-sm font-semibold transition-colors group-hover:text-[#f7b900]">
          {product.title}
        </p>

        <p className="mt-2 text-sm text-[#f7b900]">
          {hasPriceRange && "Fra "}
          {formatMoney(minVariantPrice)}
        </p>

        {!product.availableForSale && (
          <p className="mt-2 text-sm text-white">Utsolgt</p>
        )}
      </div>
    </Link>
  );
}
