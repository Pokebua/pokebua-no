import { IoClose } from "react-icons/io5";
import { formatNok } from "@/utils/currency";
import CartItem from "@/components/cart/CartItem";
import CheckoutButton from "@/components/cart/CheckoutButton";

export default function CartPanel({
  panelRef,
  closeButtonRef,
  lines,
  subtotalInOre,
  removingLineId,
  removalMessage,
  removalError,
  onSelect,
  onRemove,
  onClose,
  iconClassName,
}) {
  return (
    <div
      ref={panelRef}
      id="cart-panel"
      role="region"
      aria-labelledby="cart-heading"
      className="absolute right-0 top-full z-50 max-h-[75dvh] w-96 max-w-full overflow-y-auto border border-white/25 bg-[#001016] shadow-xl xl:max-w-none"
    >
      <div className="relative px-4 py-5 xl:px-6">
        <h2
          id="cart-heading"
          className="min-h-11 pr-14 text-xl font-semibold text-[#f7b900]"
        >
          Handlekurv
        </h2>

        {lines.length === 0 ? (
          <p className="mt-6 text-sm text-white">Handlekurven din er tom.</p>
        ) : (
          <>
            <ul aria-label="Produkter i handlekurven" className="mt-4">
              {lines.map((line) => (
                <CartItem
                  key={line.id}
                  line={line}
                  onSelect={onSelect}
                  onRemove={onRemove}
                  removingLineId={removingLineId}
                />
              ))}
            </ul>

            <dl className="mt-4 flex flex-wrap items-baseline justify-between gap-3 border-t border-white/25 pt-4 text-white">
              <dt className="font-semibold">Delsum</dt>
              <dd className="text-lg font-bold text-[#f7b900]">
                {formatNok(subtotalInOre)}
              </dd>
            </dl>

            <CheckoutButton />
          </>
        )}

        <p role="status" aria-atomic="true" className="mt-3 text-sm text-white">
          {removalMessage}
        </p>

        <p
          role="alert"
          aria-atomic="true"
          className="mt-2 text-sm text-red-300"
        >
          {removalError}
        </p>

        <button
          ref={closeButtonRef}
          type="button"
          aria-label="Lukk handlekurv"
          onClick={onClose}
          className={`${iconClassName} absolute right-4 top-5 xl:right-6`}
        >
          <IoClose aria-hidden="true" className="size-6" />
        </button>
      </div>
    </div>
  );
}
