"use client";

import { useLayoutEffect, useRef, useState } from "react";
import useToast from "@/hooks/useToast";

export default function useCartRemoval({
  lines,
  removeItem,
  panelRef,
  closeButtonRef,
}) {
  const { showToast } = useToast();

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
  }, [lines, panelRef, closeButtonRef]);

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

  return {
    removingLineId,
    removalMessage,
    removalError,
    handleRemove,
  };
}
