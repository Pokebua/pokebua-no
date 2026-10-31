"use client";

import { useEffect, useRef } from "react";

export default function useCartPanel({ isOpen, setIsOpen }) {
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

  function dismissCart() {
    setIsOpen(false);
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
      dismissCart();
    }
  }

  return {
    triggerRef,
    closeButtonRef,
    cartRef,
    panelRef,
    closeCart,
    dismissCart,
    toggleCart,
    handleEscape,
    handleCartBlur,
  };
}
