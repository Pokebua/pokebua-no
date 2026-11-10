"use client";

import { useRef, useState } from "react";
import useCart from "@/hooks/useCart";

const MAX_QUANTITY = 2147483647;

const buttonClassName =
  "grid size-11 shrink-0 place-items-center rounded-md border border-white/30 text-xl text-white focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#f7b900]";

export default function CartQuantityControls({
  lineId,
  productName,
  quantity,
  availableForSale,
}) {
  const { changeQuantity, isLoading, isBusy, cartError } = useCart();

  const pendingRef = useRef(false);
  const [isPending, setIsPending] = useState(false);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  const unavailable = isPending || isLoading || isBusy || Boolean(cartError);

  const decreaseUnavailable = unavailable || quantity <= 1;
  const increaseUnavailable =
    unavailable || !availableForSale || quantity >= MAX_QUANTITY;

  async function handleChange(change) {
    if (pendingRef.current || unavailable) return;
    if (change === -1 && decreaseUnavailable) return;
    if (change === 1 && increaseUnavailable) return;

    pendingRef.current = true;
    setIsPending(true);
    setMessage("");
    setError("");

    try {
      const result = await changeQuantity(lineId, change);
      const updatedLine = result.cart.lines.find((line) => line.id === lineId);

      if (updatedLine && !result.warnings?.length) {
        setMessage(`Antall for ${productName} er nå ${updatedLine.quantity}.`);
      }
    } catch (error) {
      setError(error.message || "Kunne ikke endre antallet.");
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

      <p
        role="status"
        aria-atomic="true"
        className={isPending ? "mt-2 text-sm text-white" : "sr-only"}
      >
        {isPending ? "Oppdaterer antall..." : message}
      </p>

      <p role="alert" aria-atomic="true" className="mt-2 text-sm text-red-300">
        {error}
      </p>
    </div>
  );
}
