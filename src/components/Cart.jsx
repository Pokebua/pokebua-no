"use client";

import { useEffect, useRef } from "react";
import { IoCart, IoClose } from "react-icons/io5";
import useCart from "@/hooks/useCart";
import CartItem from "@/components/cart/CartItem";
import { formatNok } from "@/utils/currency";

const focusClassName =
  "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#f7b900] focus-visible:ring-offset-4 focus-visible:ring-offset-[#001016]";

const iconClassName = `grid size-11 shrink-0 cursor-pointer place-items-center rounded-full transition-colors hover:bg-[#f7b900]/10 hover:text-white ${focusClassName}`;

export default function Cart({ isOpen, setIsOpen }) {
  const { lines, itemCount, subtotalInOre } = useCart();

  const triggerRef = useRef(null);
  const closeButtonRef = useRef(null);
  const cartRef = useRef(null);
  const panelRef = useRef(null);

  useEffect(() => {
    if (!isOpen) return;

    const firstProductLink = panelRef.current?.querySelector(
      'a[href]:not([tabindex="-1"])',
    );

    (firstProductLink ?? closeButtonRef.current)?.focus();
  }, [isOpen]);

  useEffect(() => {
    if (!isOpen) return;

    function handleClickOutside(event) {
      if (cartRef.current && !cartRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    }

    document.addEventListener("pointerdown", handleClickOutside);

    return () => {
      document.removeEventListener("pointerdown", handleClickOutside);
    };
  }, [isOpen, setIsOpen]);

  function closeCart() {
    setIsOpen(false);
    triggerRef.current?.focus();
  }

  function handleEscape(event) {
    if (event.key === "Escape" && isOpen) {
      event.preventDefault();
      event.stopPropagation();
      closeCart();
    }
  }

  function handleCartBlur(event) {
    const nextTarget = event.relatedTarget;

    // Outside pointer interactions are handled separately.
    if (!nextTarget) return;

    if (!event.currentTarget.contains(nextTarget)) {
      setIsOpen(false);
    }
  }

  return (
    <div
      ref={cartRef}
      onKeyDown={handleEscape}
      onBlur={handleCartBlur}
      className="static shrink-0 xl:relative"
    >
      <button
        ref={triggerRef}
        type="button"
        aria-label={`${isOpen ? "Lukk handlekurv" : "Åpne handlekurv"}, ${itemCount} ${
          itemCount === 1 ? "vare" : "varer"
        }`}
        aria-expanded={isOpen}
        aria-controls="cart-panel"
        onClick={() => {
          if (isOpen) {
            closeCart();
          } else {
            setIsOpen(true);
          }
        }}
        className={`${iconClassName} relative`}
      >
        <IoCart aria-hidden="true" className="size-6" />

        {itemCount > 0 && (
          <span
            aria-hidden="true"
            className="absolute -right-1 -top-1 grid h-5 min-w-5 place-items-center rounded-full bg-[#f7b900] px-1 text-xs font-bold leading-none text-[#001016]"
          >
            {itemCount > 99 ? "99+" : itemCount}
          </span>
        )}
      </button>

      {isOpen && (
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
              <p className="mt-6 text-sm text-white">
                Handlekurven din er tom.
              </p>
            ) : (
              <>
                <ul aria-label="Produkter i handlekurven" className="mt-4">
                  {lines.map((line) => (
                    <CartItem
                      key={line.id}
                      line={line}
                      onSelect={() => setIsOpen(false)}
                    />
                  ))}
                </ul>

                <dl className="mt-4 flex flex-wrap items-baseline justify-between gap-3 border-t border-white/25 pt-4 text-white">
                  <dt className="font-semibold">Delsum</dt>
                  <dd className="text-lg font-bold text-[#f7b900]">
                    {formatNok(subtotalInOre)}
                  </dd>
                </dl>
              </>
            )}

            <button
              ref={closeButtonRef}
              type="button"
              aria-label="Lukk handlekurv"
              onClick={closeCart}
              className={`${iconClassName} absolute right-4 top-5 xl:right-6`}
            >
              <IoClose aria-hidden="true" className="size-6" />
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
