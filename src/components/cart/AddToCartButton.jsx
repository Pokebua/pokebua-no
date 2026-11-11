"use client";

import { useRef, useState } from "react";
import useCart from "@/hooks/useCart";
import useToast from "@/hooks/useToast";

export default function AddToCartButton({
  variantId,
  productName,
  available = false,
  requiresSellingPlan = false,
  disabled = false,
}) {
  const { addItem, isLoading, isBusy, cartError } = useCart();
  const { showToast } = useToast();

  const pendingRef = useRef(false);
  const [isPending, setIsPending] = useState(false);
  const [error, setError] = useState("");
  const [notice, setNotice] = useState("");

  const unavailable =
    !variantId ||
    !available ||
    requiresSellingPlan ||
    disabled ||
    isPending ||
    isLoading ||
    isBusy ||
    Boolean(cartError);

  async function handleAdd() {
    if (pendingRef.current || unavailable) return;

    pendingRef.current = true;
    setIsPending(true);
    setError("");
    setNotice("");

    let result;

    try {
      result = await addItem(variantId);
    } catch (error) {
      setError(error.message || "Kunne ikke legge varen i handlekurven.");
      return;
    } finally {
      pendingRef.current = false;
      setIsPending(false);
    }

    if (result.warnings?.length) {
      setNotice(result.warnings.map((warning) => warning.message).join(" "));
      return;
    }

    showToast({
      type: "success",
      message: `${productName} er lagt i handlekurven.`,
    });
  }

  return (
    <div className="min-w-0">
      <button
        type="button"
        onClick={handleAdd}
        aria-disabled={unavailable}
        className={`min-h-11 w-full rounded-lg border-3 border-yellow-400 bg-black px-6 py-3 font-semibold text-white transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-black ${
          unavailable
            ? "cursor-not-allowed opacity-60"
            : "cursor-pointer hover:bg-gray-800"
        }`}
      >
        {isPending
          ? "Legger til..."
          : !available
            ? "Utsolgt"
            : "Legg til i handlekurv"}
      </button>

      {requiresSellingPlan && (
        <p className="mt-2 text-sm">
          Denne varen krever en kjøpsplan og kan ikke legges til her ennå.
        </p>
      )}

      {cartError && (
        <p className="mt-2 text-sm text-red-800">
          Åpne handlekurven og last den inn på nytt før du fortsetter.
        </p>
      )}

      <p role="status" aria-atomic="true" className="mt-2 text-sm">
        {isPending ? "Legger produktet i handlekurven." : notice}
      </p>

      <p role="alert" aria-atomic="true" className="mt-2 text-sm text-red-800">
        {error}
      </p>
    </div>
  );
}
