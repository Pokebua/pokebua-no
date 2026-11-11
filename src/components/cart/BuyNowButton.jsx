"use client";

import { useRef, useState } from "react";
import useCart from "@/hooks/useCart";

export default function BuyNowButton({
  variantId,
  available,
  requiresSellingPlan,
  isPending,
  onPendingChange,
}) {
  const { buyNow, checkout, isLoading, isBusy, cartError } = useCart();

  const pendingRef = useRef(false);
  const [itemAdded, setItemAdded] = useState(false);
  const [error, setError] = useState("");

  const unavailable =
    !variantId ||
    (!itemAdded && (!available || requiresSellingPlan)) ||
    isPending ||
    isLoading ||
    isBusy ||
    Boolean(cartError);

  async function handleBuyNow() {
    if (pendingRef.current || unavailable) return;

    pendingRef.current = true;
    onPendingChange(true);
    setError("");

    try {
      if (itemAdded) {
        await checkout();
      } else {
        await buyNow(variantId);
      }
    } catch (error) {
      if (error.itemAdded) {
        setItemAdded(true);
      }

      setError(
        error.itemAdded
          ? `Handlekurven er oppdatert. ${error.message || "Kunne ikke åpne kassen."}`
          : error.message || "Kunne ikke åpne kassen. Prøv igjen.",
      );

      onPendingChange(false);
    } finally {
      pendingRef.current = false;
    }
  }

  return (
    <div className="min-w-0">
      <button
        type="button"
        onClick={handleBuyNow}
        aria-disabled={unavailable}
        className={`min-h-11 w-full rounded-lg border-3 border-yellow-400 bg-[#f7b900] px-6 py-3 font-semibold text-[#001016] transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-black ${
          isPending
            ? "cursor-wait opacity-70"
            : unavailable
              ? "cursor-not-allowed opacity-60"
              : "cursor-pointer hover:bg-[#ffd04a]"
        }`}
      >
        {isPending ? "Åpner kassen..." : itemAdded ? "Til kassen" : "Kjøp nå"}
      </button>

      <p role="status" aria-atomic="true" className="sr-only">
        {isPending ? "Oppdaterer handlekurven og åpner Shopify-kassen." : ""}
      </p>

      <p
        role="alert"
        aria-atomic="true"
        className={error ? "mt-2 text-sm text-red-800" : "sr-only"}
      >
        {error}
      </p>
    </div>
  );
}
