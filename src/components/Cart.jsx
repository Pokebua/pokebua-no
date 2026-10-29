"use client";

import { useEffect, useRef } from "react";
import { IoCart, IoClose } from "react-icons/io5";

const focusClassName =
  "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#f7b900] focus-visible:ring-offset-4 focus-visible:ring-offset-[#001016]";

const iconClassName = `grid size-11 shrink-0 cursor-pointer place-items-center rounded-full transition-colors hover:bg-[#f7b900]/10 hover:text-white ${focusClassName}`;

export default function Cart({ isOpen, setIsOpen }) {
  const triggerRef = useRef(null);
  const closeButtonRef = useRef(null);
  const cartRef = useRef(null);

  useEffect(() => {
    if (isOpen) {
      closeButtonRef.current?.focus();
    }
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
      className="static shrink-0 lg:relative"
    >
      <button
        ref={triggerRef}
        type="button"
        aria-label={isOpen ? "Lukk handlekurv" : "Åpne handlekurv"}
        aria-expanded={isOpen}
        aria-controls="cart-panel"
        onClick={() => {
          if (isOpen) {
            closeCart();
          } else {
            setIsOpen(true);
          }
        }}
        className={iconClassName}
      >
        <IoCart aria-hidden="true" className="size-6" />
      </button>

      {isOpen && (
        <div
          id="cart-panel"
          role="region"
          aria-labelledby="cart-heading"
          className="absolute right-0 top-full z-50 max-h-[75dvh] w-96 max-w-full overflow-y-auto border border-white/25 bg-[#001016] px-4 py-5 shadow-xl lg:max-w-none lg:px-6"
        >
          <div className="flex items-center justify-between gap-4">
            <h2
              id="cart-heading"
              className="text-xl font-semibold text-[#f7b900]"
            >
              Handlekurv
            </h2>

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
    </div>
  );
}
