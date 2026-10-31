import Image from "next/image";
import Link from "next/link";
import { formatNok, toOre } from "@/utils/currency";
import CartQuantityControls from "@/components/cart/CartQuantityControls";

export default function CartItem({ line, onSelect }) {
  const { product, quantity } = line;

  const unitPriceInOre = toOre(product.price);
  const lineTotalInOre = unitPriceInOre * quantity;

  return (
    <li className="grid grid-cols-[5rem_minmax(0,1fr)] gap-4 border-b border-white/20 py-4 last:border-b-0">
      <Link
        href={`/produkter/${product.category}/${product.id}`}
        onClick={onSelect}
        tabIndex={-1}
        aria-label={`Se ${product.name}`}
        className="relative block aspect-square cursor-pointer overflow-hidden rounded-md bg-white"
      >
        <Image
          src={product.image}
          alt=""
          fill
          sizes="80px"
          className="object-cover object-center"
        />
      </Link>

      <div className="min-w-0 text-white">
        <h3 className="wrap-break-word font-sans text-base font-semibold">
          <Link
            href={`/produkter/${product.category}/${product.id}`}
            onClick={onSelect}
            className="rounded-sm hover:underline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#f7b900]"
          >
            {product.name}
          </Link>
        </h3>

        <p className="mt-2 text-sm">
          Pris per stk.: {formatNok(unitPriceInOre)}
        </p>

        <CartQuantityControls
          lineId={line.id}
          productName={product.name}
          quantity={quantity}
        />

        <p className="mt-2 text-sm font-semibold text-[#f7b900]">
          Sum: {formatNok(lineTotalInOre)}
        </p>
      </div>
    </li>
  );
}
