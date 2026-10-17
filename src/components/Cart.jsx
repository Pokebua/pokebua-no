"use client";

import { useEffect, useRef, useState } from "react";
import { IoCart, IoClose } from "react-icons/io5";

export default function Cart() {
  const [isOpen, setIsOpen] = useState(false);
  const triggerRef = useRef(null);
  const closeButtonRef = useRef(null);

  useEffect(() => {
    if (!isOpen) return;
    closeButtonRef.current?.focus();

    function handleEscape(event) {
      if (event.key === "Escape") {
        event.preventDefault();
        event.stopPropagation();
        setIsOpen(false);
        triggerRef.current?.focus();
      }
    }

    document.addEventListener("keydown", handleEscape);
    return () => document.removeEventListener("keydown", handleEscape);
  }, [isOpen]);

  const focusClassName =
    "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#f7b900] focus-visible:ring-offset-4 focus-visible:ring-offset-[#001016]";
  const iconClassName = `grid size-11 shrink-0 place-items-center rounded-full transition-colors hover:bg-[#f7b900]/10 hover:text-white ${focusClassName}`;

  function closeCart() {
    setIsOpen(false);
    triggerRef.current?.focus();
  }

  return (
    <div className="relative shrink-0">
      <button
        ref={triggerRef}
        type="button"
        aria-label={isOpen ? "Lukk handlekurv" : "Åpne handlekurv"}
        aria-expanded={isOpen}
        aria-controls="cart-panel"
        onClick={() => (isOpen ? closeCart() : setIsOpen(true))}
        className={iconClassName}
      >
        <IoCart aria-hidden="true" className="size-6" />
      </button>

      {isOpen && (
        <div
          id="cart-panel"
          className="absolute right-0 top-full z-50 w-[min(24rem,calc(100vw-2rem))] border-t border-[#f7b900]/25 bg-[#001016] px-4 py-5 shadow-xl sm:px-6"
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
    </div>
  );
}
