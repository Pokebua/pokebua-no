import Image from "next/image";
import Link from "next/link";

export default function ProductCard({ product }) {
  return (
    <Link
      href={`/product/${product.id}`}
      className="block overflow-hidden rounded-2xl border-2 border-yellow-400 bg-yellow-100"
    >
      <article>
        <div className="aspect-square bg-yellow-100 p-1">
          <Image
            src={product.image}
            alt={product.name}
            width={500}
            height={500}
            className="h-full w-full object-contain"
          />
        </div>

        <div className="bg-black p-3 text-white">
          <h2 className="text-base">{product.name}</h2>

          <div className="mt-4 flex items-end justify-between">
            <p className="text-2xl font-bold">
              {product.price.toLocaleString("nb-NO")} kr
            </p>

            <span
              aria-label={`View ${product.name}`}
              className="text-yellow-400"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                className="h-6 w-6"
                aria-hidden="true"
              >
                <path d="M3 3h2l2.4 10.2a2 2 0 0 0 2 1.6h7.7a2 2 0 0 0 2-1.6L21 7H6" />
                <circle cx="10" cy="20" r="1" />
                <circle cx="18" cy="20" r="1" />
              </svg>
            </span>
          </div>
        </div>
      </article>
    </Link>
  );
}
