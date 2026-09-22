import Image from "next/image";

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

        <div className="mt-8 flex flex-col gap-4 sm:flex-row">
          <button
            type="button"
            className="rounded-lg border-3 bg-black cursor-pointer transition-transform hover:scale-105 border-yellow-400 px-6 py-3 font-semibold text-white"
          >
            Kjøp Nå
          </button>

          <button
            type="button"
            className="rounded-lg border-3 bg-black cursor-pointer transition-transform hover:scale-105 border-yellow-400 px-6 py-3 font-semibold text-white"
          >
            Legg i handlekurv
          </button>
        </div>
      </div>
    </section>
  );
}
export default ProductDetail;
