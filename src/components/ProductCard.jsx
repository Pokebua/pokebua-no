import Image from "next/image";

export default function ProductCard({ product }) {
  return (
    <article className="overflow-hidden rounded-2xl border-2 border-yellow-400">
      <div className="aspect-square bg-white">
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

          <button
            type="button"
            aria-label={`Add ${product.name} to cart`}
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
          </button>
        </div>
      </div>
    </article>
  );
}
