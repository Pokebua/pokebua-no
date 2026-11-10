"use client";

import useCart from "@/hooks/useCart";
import useCartPanel from "@/hooks/useCartPanel";
import useCartRemoval from "@/hooks/useCartRemoval";
import CartTrigger from "@/components/cart/CartTrigger";
import CartPanel from "@/components/cart/CartPanel";

const focusClassName =
  "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#f7b900] focus-visible:ring-offset-4 focus-visible:ring-offset-[#001016]";

const iconClassName = `grid size-11 shrink-0 cursor-pointer place-items-center rounded-full transition-colors hover:bg-[#f7b900]/10 hover:text-white ${focusClassName}`;

export default function Cart({ isOpen, setIsOpen }) {
  const {
    lines,
    itemCount,
    subtotal,
    isLoading,
    isBusy,
    cartError,
    warnings,
    removeItem,
    reloadCart,
  } = useCart();

  const {
    triggerRef,
    closeButtonRef,
    cartRef,
    panelRef,
    closeCart,
    dismissCart,
    toggleCart,
    handleEscape,
    handleCartBlur,
  } = useCartPanel({ isOpen, setIsOpen });

  const unavailable = isLoading || isBusy || Boolean(cartError);

  const { removingLineId, removalMessage, removalError, handleRemove } =
    useCartRemoval({
      lines,
      removeItem,
      panelRef,
      closeButtonRef,
      unavailable,
    });

  return (
    <div
      ref={cartRef}
      onKeyDown={handleEscape}
      onBlur={handleCartBlur}
      className="static shrink-0 xl:relative"
    >
      <CartTrigger
        triggerRef={triggerRef}
        isOpen={isOpen}
        itemCount={itemCount}
        onToggle={toggleCart}
        iconClassName={iconClassName}
      />

      {isOpen && (
        <CartPanel
          panelRef={panelRef}
          closeButtonRef={closeButtonRef}
          lines={lines}
          subtotal={subtotal}
          isLoading={isLoading}
          isBusy={isBusy}
          cartError={cartError}
          warnings={warnings}
          unavailable={unavailable}
          removingLineId={removingLineId}
          removalMessage={removalMessage}
          removalError={removalError}
          onReload={reloadCart}
          onSelect={dismissCart}
          onRemove={handleRemove}
          onClose={closeCart}
          iconClassName={iconClassName}
        />
      )}
    </div>
  );
}
