"use client";

import { useEffect, useRef, useState } from "react";
import { IoCart, IoClose } from "react-icons/io5";

export default function NavbarCart() {
  const [cartOpen, setCartOpen] = useState(false);
  const cartButtonRef = useRef(null);
  const closeButtonRef = useRef(null);

  useEffect(() => {
    if (cartOpen) {
      closeButtonRef.current?.focus();
    }
  }, [cartOpen]);

  const focusClassName =
    "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#f7b900] focus-visible:ring-offset-4 focus-visible:ring-offset-[#001016]";

  const iconClassName = `grid size-11 shrink-0 place-items-center rounded-full transition-colors hover:bg-[#f7b900]/10 hover:text-white ${focusClassName}`;

  function closeCart() {
    setCartOpen(false);

    requestAnimationFrame(() => {
      cartButtonRef.current?.focus();
    });
  }

  useEffect(() => {
    if (!cartOpen) return;

    function handleEscape(event) {
      if (event.key === "Escape") {
        event.preventDefault();
        closeCart();
      }
    }

    document.addEventListener("keydown", handleEscape);

    return () => {
      document.removeEventListener("keydown", handleEscape);
    };
  }, [cartOpen]);

  return (
    <>
      <button
        ref={cartButtonRef}
        type="button"
        aria-label={cartOpen ? "Lukk handlekurv" : "Åpne handlekurv"}
        aria-expanded={cartOpen}
        aria-controls="cart-panel"
        onClick={() => {
          if (cartOpen) {
            closeCart();
          } else {
            setCartOpen(true);
          }
        }}
        className={iconClassName}
      >
        <IoCart aria-hidden="true" className="size-6" />
      </button>

      {cartOpen && (
        <div
          id="cart-panel"
          className="absolute right-0 top-full w-full border-t border-[#f7b900]/25 bg-[#001016] px-4 py-5 shadow-xl sm:w-96 sm:px-6"
        >
          <div className="flex items-center justify-between gap-4">
            <h2 className="text-xl font-semibold text-[#f7b900]">Handlekurv</h2>

            <button
              ref={closeButtonRef}
              type="button"
              aria-label="Lukk handlekurv"
              onClick={closeCart}
              className={iconClassName}
            >
              <IoClose aria-hidden="true" className="size-6" />
            </button>
          </div>

          <p className="mt-6 text-sm text-white">Handlekurven din er tom.</p>
        </div>
      )}
    </>
  );
}
