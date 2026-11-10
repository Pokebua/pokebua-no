import { IoClose } from "react-icons/io5";
import { formatMoney } from "@/utils/formatMoney";
import CartItem from "@/components/cart/CartItem";
import CheckoutButton from "@/components/cart/CheckoutButton";

export default function CartPanel({
  panelRef,
  closeButtonRef,
  lines,
  subtotal,
  isLoading,
  isBusy,
  cartError,
  warnings,
  unavailable,
  removingLineId,
  removalMessage,
  removalError,
  onReload,
  onSelect,
  onRemove,
  onClose,
  iconClassName,
}) {
  function handleReload() {
    if (isLoading || isBusy) return;

    // The retry button disappears after successful recovery.
    closeButtonRef.current?.focus();
    void onReload();
  }

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

        <p role="status" className="mt-3 text-sm text-white">
          {isLoading ? "Laster handlekurven..." : ""}
        </p>

        {cartError && (
          <div className="mt-4">
            <p role="alert" className="text-sm text-red-300">
              {cartError}
            </p>

            <button
              type="button"
              onClick={handleReload}
              aria-disabled={isLoading || isBusy}
              className="mt-2 min-h-11 cursor-pointer rounded-md border border-[#f7b900] px-3 py-2 text-sm text-[#f7b900] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#f7b900]"
            >
              Last inn handlekurven på nytt
            </button>
          </div>
        )}

        {lines.length === 0 ? (
          !isLoading &&
          !cartError && (
            <p className="mt-6 text-sm text-white">Handlekurven din er tom.</p>
          )
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
                  unavailable={unavailable}
                />
              ))}
            </ul>

            {subtotal && (
              <dl className="mt-4 flex flex-wrap items-baseline justify-between gap-3 border-t border-white/25 pt-4 text-white">
                <dt className="font-semibold">Delsum</dt>
                <dd className="text-lg font-bold text-[#f7b900]">
                  {formatMoney(subtotal)}
                </dd>
              </dl>
            )}

            <CheckoutButton />
          </>
        )}

        <div role="status" aria-atomic="true">
          {warnings.length > 0 && (
            <ul className="mt-3 space-y-2 text-sm text-[#f7b900]">
              {warnings.map((warning, index) => (
                <li key={`${warning.code}-${index}`}>{warning.message}</li>
              ))}
            </ul>
          )}
        </div>

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
