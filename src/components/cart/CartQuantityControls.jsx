"use client";

import { useRef, useState } from "react";
import useCart from "@/hooks/useCart";

const buttonClassName =
  "grid size-11 shrink-0 place-items-center rounded-md border border-white/30 text-xl text-white focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#f7b900]";

export default function CartQuantityControls({
  lineId,
  productName,
  quantity,
}) {
  const { changeQuantity } = useCart();

  const pendingRef = useRef(false);
  const [isPending, setIsPending] = useState(false);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  const decreaseUnavailable = isPending || quantity <= 1;
  const increaseUnavailable = isPending || quantity >= Number.MAX_SAFE_INTEGER;

  async function handleChange(change) {
    if (pendingRef.current) return;
    if (change === -1 && quantity <= 1) return;
    if (change === 1 && quantity >= Number.MAX_SAFE_INTEGER) return;

    pendingRef.current = true;
    setIsPending(true);
    setMessage("");
    setError("");

    try {
      const updatedLines = await changeQuantity(lineId, change);
      const updatedLine = updatedLines.find((line) => line.id === lineId);

      if (updatedLine) {
        setMessage(`Antall for ${productName} er nå ${updatedLine.quantity}.`);
      }
    } catch (error) {
      console.error("Updating cart quantity failed:", error);
      setError("Kunne ikke endre antallet. Prøv igjen.");
    } finally {
      pendingRef.current = false;
      setIsPending(false);
    }
  }

  return (
    <div className="mt-3">
      <div
        role="group"
        aria-label={`Antall for ${productName}`}
        className="flex flex-wrap items-center gap-2"
      >
        <button
          type="button"
          aria-label={`Reduser antall for ${productName}`}
          aria-disabled={decreaseUnavailable}
          onClick={() => handleChange(-1)}
          className={`${buttonClassName} ${
            decreaseUnavailable
              ? "cursor-not-allowed opacity-40"
              : "cursor-pointer hover:bg-white/10"
          }`}
        >
          <span aria-hidden="true">−</span>
        </button>

        <span className="min-w-8 text-center text-sm text-white">
          <span className="sr-only">Antall: </span>
          {quantity}
        </span>

        <button
          type="button"
          aria-label={`Øk antall for ${productName}`}
          aria-disabled={increaseUnavailable}
          onClick={() => handleChange(1)}
          className={`${buttonClassName} ${
            increaseUnavailable
              ? "cursor-not-allowed opacity-40"
              : "cursor-pointer hover:bg-white/10"
          }`}
        >
          <span aria-hidden="true">+</span>
        </button>
      </div>

      <p role="status" aria-atomic="true" className="mt-2 text-sm text-white">
        {isPending ? "Oppdaterer antall..." : message}
      </p>

      <p role="alert" aria-atomic="true" className="mt-2 text-sm text-red-300">
        {error}
      </p>
    </div>
  );
}
