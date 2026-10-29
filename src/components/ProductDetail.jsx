import Image from "next/image";
import AddToCartButton from "@/components/cart/AddToCartButton";

function ProductDetail({ product }) {
  return (
    <section className="mx-auto grid max-w-6xl grid-cols-1 gap-8 p-6 font-sans md:grid-cols-2">
      <div className="relative aspect-square overflow-hidden rounded-2xl border-2 border-yellow-400 bg-yellow-100">
        <Image
          src={product.image}
          alt={product.name}
          fill
          sizes="(min-width: 768px) 50vw, 100vw"
          className="object-cover"
        />
      </div>

      <div className="flex flex-col justify-between rounded-2xl border-2 border-yellow-400 bg-yellow-100 p-6 text-black">
        <div>
          <h1 className="text-3xl font-bold">{product.name}</h1>

          <p className="mt-6 text-base leading-relaxed">
            {product.description}
          </p>
        </div>

        <div className="mt-8 grid grid-cols-1 items-start gap-4 sm:grid-cols-[auto_minmax(0,1fr)]">
          <button
            type="button"
            className="min-h-11 cursor-pointer whitespace-nowrap rounded-lg border-3 border-yellow-400 bg-black px-6 py-3 font-semibold text-white transition-colors hover:bg-gray-800 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-black"
          >
            Kjøp Nå
          </button>

          <AddToCartButton
            key={product.id}
            productId={product.id}
            productName={product.name}
          />
        </div>
      </div>
    </section>
  );
}
export default ProductDetail;
