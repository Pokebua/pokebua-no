import Image from "next/image";
import Link from "next/link";

export default function ProductSuggestion({ product, onSelect }) {
  return (
    <Link
      href={`/produkter/${product.category}/${product.id}`}
      onClick={onSelect}
      className="group block h-full rounded-md text-white focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#f7b900]"
    >
      <div className="relative aspect-square overflow-hidden rounded-md bg-white">
        <Image
          src={product.image}
          alt=""
          fill
          sizes="(min-width: 1280px) 230px, (min-width: 1024px) 20vw, (min-width: 640px) 33vw, 50vw"
          className="object-cover object-center"
        />
      </div>

      <div className="px-1 pb-2 pt-3 text-center">
        <p className="wrap-break-word text-sm font-semibold transition-colors group-hover:text-[#f7b900]">
          {product.name}
        </p>

        <p className="mt-2 text-sm text-[#f7b900]">
          {product.price.toLocaleString("nb-NO")} kr
        </p>
      </div>
    </Link>
  );
}
