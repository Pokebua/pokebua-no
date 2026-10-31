"use client";

import { useEffect, useLayoutEffect, useRef, useState } from "react";
import useCart from "@/hooks/useCart";
import useToast from "@/hooks/useToast";
import CartTrigger from "@/components/cart/CartTrigger";
import CartPanel from "@/components/cart/CartPanel";

const focusClassName =
  "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#f7b900] focus-visible:ring-offset-4 focus-visible:ring-offset-[#001016]";

const iconClassName = `grid size-11 shrink-0 cursor-pointer place-items-center rounded-full transition-colors hover:bg-[#f7b900]/10 hover:text-white ${focusClassName}`;

export default function Cart({ isOpen, setIsOpen }) {
  const { lines, itemCount, subtotalInOre, removeItem } = useCart();
  const { showToast } = useToast();

  const triggerRef = useRef(null);
  const closeButtonRef = useRef(null);
  const cartRef = useRef(null);
  const panelRef = useRef(null);

  const removalPendingRef = useRef(false);
  const removalFocusRef = useRef(null);

  const [removingLineId, setRemovingLineId] = useState(null);
  const [removalMessage, setRemovalMessage] = useState("");
  const [removalError, setRemovalError] = useState("");

  useLayoutEffect(() => {
    const pendingFocus = removalFocusRef.current;

    if (!pendingFocus) return;

    const itemStillExists = lines.some(
      (line) => line.id === pendingFocus.lineId,
    );

    if (itemStillExists) return;

    removalFocusRef.current = null;

    const panel = panelRef.current;
    if (!panel) return;

    const activeElement = document.activeElement;

    // Preserve focus if the user moved to another control while waiting.
    if (
      activeElement !== document.body &&
      activeElement !== pendingFocus.button
    ) {
      return;
    }

    const remainingItems = panel.querySelectorAll("[data-cart-line-id]");
    const nextItem =
      remainingItems[Math.min(pendingFocus.index, remainingItems.length - 1)];

    const nextProductLink = nextItem?.querySelector(
      'a[href]:not([tabindex="-1"])',
    );

    (nextProductLink ?? closeButtonRef.current)?.focus();
  }, [lines]);

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

  async function handleRemove(lineId, button) {
    if (removalPendingRef.current) return;

    const index = lines.findIndex((line) => line.id === lineId);
    if (index === -1) return;

    const productName = lines[index].product.name;

    removalPendingRef.current = true;
    removalFocusRef.current = { lineId, index, button };

    setRemovingLineId(lineId);
    setRemovalMessage(`Fjerner ${productName}...`);
    setRemovalError("");

    try {
      await removeItem(lineId);
    } catch (error) {
      console.error("Removing cart item failed:", error);
      removalFocusRef.current = null;
      setRemovalError("Kunne ikke fjerne varen. Prøv igjen.");
      return;
    } finally {
      removalPendingRef.current = false;
      setRemovingLineId(null);
      setRemovalMessage("");
    }

    showToast({
      type: "success",
      message: `${productName} er fjernet fra handlekurven.`,
    });
  }

  function closeCart() {
    setIsOpen(false);
    triggerRef.current?.focus();
  }

  function toggleCart() {
    if (isOpen) {
      closeCart();
    } else {
      setIsOpen(true);
    }
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
          subtotalInOre={subtotalInOre}
          removingLineId={removingLineId}
          removalMessage={removalMessage}
          removalError={removalError}
          onSelect={() => setIsOpen(false)}
          onRemove={handleRemove}
          onClose={closeCart}
          iconClassName={iconClassName}
        />
      )}
    </div>
  );
}
