import Image from "next/image";

const priceFormatter = new Intl.NumberFormat("nb-NO", {
  style: "currency",
  currency: "NOK",
});

export default function CartItem({ line }) {
  const { product, quantity } = line;

  return (
    <li className="grid grid-cols-[5rem_minmax(0,1fr)] gap-4 border-b border-white/20 py-4 last:border-b-0">
      <div className="relative aspect-square overflow-hidden rounded-md bg-white">
        <Image
          src={product.image}
          alt=""
          fill
          sizes="80px"
          className="object-contain"
        />
      </div>

      <div className="min-w-0 text-white">
        <h3 className="wrap-break-word font-sans text-base font-semibold">
          {product.name}
        </h3>

        <p className="mt-2 text-sm">
          Pris per stk.: {priceFormatter.format(product.price)}
        </p>

        <p className="mt-1 text-sm">Antall: {quantity}</p>
      </div>
    </li>
  );
}
