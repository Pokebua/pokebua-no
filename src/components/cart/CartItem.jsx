import Image from "next/image";
import Link from "next/link";
import { formatMoney } from "@/utils/formatMoney";
import CartQuantityControls from "@/components/cart/CartQuantityControls";
import RemoveCartItemButton from "@/components/cart/RemoveCartItemButton";

export default function CartItem({
  line,
  onSelect,
  onRemove,
  removingLineId,
  unavailable,
}) {
  const variant = line.merchandise;
  const product = variant.product;
  const image = variant.image ?? product.featuredImage;

  const href = `/produkt/${encodeURIComponent(product.handle)}`;
  const showVariant = variant.title !== "Default Title";

  const itemName = showVariant
    ? `${product.title} – ${variant.title}`
    : product.title;

  return (
    <li
      data-cart-line-id={line.id}
      className="grid grid-cols-[5rem_minmax(0,1fr)] gap-4 border-b border-white/20 py-4 last:border-b-0"
    >
      <Link
        href={href}
        onClick={onSelect}
        tabIndex={-1}
        aria-label={`Se ${itemName}`}
        className="relative block aspect-square self-start cursor-pointer overflow-hidden rounded-md bg-white"
      >
        {image ? (
          <Image
            src={image.url}
            alt=""
            fill
            sizes="80px"
            className="object-cover object-center"
          />
        ) : (
          <span className="grid h-full place-items-center p-2 text-center text-xs text-[#001016]">
            Bilde kommer snart
          </span>
        )}
      </Link>

      <div className="min-w-0 text-white">
        <h3 className="wrap-break-word font-sans text-base font-semibold">
          <Link
            href={href}
            onClick={onSelect}
            className="rounded-sm hover:underline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#f7b900]"
          >
            {product.title}
          </Link>
        </h3>

        {showVariant && (
          <p className="mt-1 text-sm text-white/80">{variant.title}</p>
        )}

        <p className="mt-2 text-sm">
          Pris per stk.: {formatMoney(line.cost.amountPerQuantity)}
        </p>

        {!variant.availableForSale && (
          <p className="mt-2 text-sm text-[#f7b900]">
            Varen er ikke tilgjengelig for kjøp.
          </p>
        )}

        <CartQuantityControls
          lineId={line.id}
          productName={itemName}
          quantity={line.quantity}
          availableForSale={variant.availableForSale}
        />

        <RemoveCartItemButton
          productName={itemName}
          isPending={removingLineId === line.id}
          unavailable={unavailable || removingLineId !== null}
          onRemove={(button) => onRemove(line.id, button)}
        />

        <p className="mt-2 text-sm font-semibold text-[#f7b900]">
          Sum: {formatMoney(line.cost.totalAmount)}
        </p>
      </div>
    </li>
  );
}
