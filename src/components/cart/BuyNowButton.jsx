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
  const { isLoading, isBusy } = useCart();

  const pendingRef = useRef(false);
  const [error, setError] = useState("");
  const [warnings, setWarnings] = useState([]);

  const unavailable =
    !variantId ||
    !available ||
    requiresSellingPlan ||
    isPending ||
    isLoading ||
    isBusy;

  async function handleBuyNow() {
    if (pendingRef.current || unavailable) return;

    pendingRef.current = true;
    onPendingChange(true);
    setError("");
    setWarnings([]);

    try {
      const response = await fetch("/api/checkout/buy-now", {
        method: "POST",
        credentials: "same-origin",
        cache: "no-store",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ variantId }),
        signal: AbortSignal.timeout(20000),
      });

      const result = await response.json();

      if (!response.ok) {
        setWarnings(result.warnings ?? []);

        throw new Error(result.error || "Kunne ikke åpne kassen. Prøv igjen.");
      }

      if (typeof result.checkoutUrl !== "string" || !result.checkoutUrl) {
        throw new Error("Kunne ikke åpne kassen. Prøv igjen.");
      }

      // Keep the purchase controls locked while leaving the page.
      window.location.assign(result.checkoutUrl);
    } catch (error) {
      setError(
        error.name === "TimeoutError"
          ? "Det tok for lang tid å åpne kassen. Prøv igjen."
          : error instanceof TypeError
            ? "Kunne ikke kontakte kassen. Kontroller nettforbindelsen og prøv igjen."
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
        aria-describedby="buy-now-help"
        className={`min-h-11 w-full rounded-lg border-3 border-yellow-400 bg-[#f7b900] px-6 py-3 font-semibold text-[#001016] transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-black ${
          isPending
            ? "cursor-wait opacity-70"
            : unavailable
              ? "cursor-not-allowed opacity-60"
              : "cursor-pointer hover:bg-[#ffd04a]"
        }`}
      >
        {isPending ? "Åpner kassen..." : "Kjøp nå"}
      </button>

      <p id="buy-now-help" className="mt-2 text-sm">
        Kjøp én av valgt variant direkte. Varer i handlekurven beholdes.
      </p>

      <p role="status" aria-atomic="true" className="sr-only">
        {isPending ? "Åpner Shopify-kassen for valgt variant." : ""}
      </p>

      <div
        role="alert"
        aria-atomic="true"
        className="mt-2 text-sm text-red-800"
      >
        {error && <p>{error}</p>}

        {warnings.length > 0 && (
          <ul className="mt-2 list-disc space-y-1 pl-5">
            {warnings.map((warning, index) => (
              <li key={`${warning.code}-${index}`}>{warning.message}</li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}
