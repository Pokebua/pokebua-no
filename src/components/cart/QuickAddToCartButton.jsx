"use client";

import { useRef, useState } from "react";
import { IoCartOutline } from "react-icons/io5";
import useCart from "@/hooks/useCart";
import useToast from "@/hooks/useToast";

export default function QuickAddToCartButton({
  variantId,
  productName,
  available,
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
    isPending ||
    isLoading ||
    isBusy ||
    Boolean(cartError);

  const label = isPending
    ? `Legger ${productName} i handlekurven`
    : !available
      ? `${productName} er utsolgt`
      : cartError
        ? "Åpne handlekurven og last den inn på nytt"
        : `Legg ${productName} i handlekurven`;

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
        aria-label={label}
        title={label}
        aria-disabled={unavailable}
        className={`ml-auto grid size-11 place-items-center rounded-lg border-2 border-[#f7b900] bg-[#f7b900] text-[#001016] transition-colors focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#f7b900] ${
          isPending
            ? "cursor-wait opacity-70"
            : unavailable
              ? "cursor-not-allowed opacity-50"
              : "cursor-pointer hover:bg-[#ffd04a]"
        }`}
      >
        {isPending ? (
          <span aria-hidden="true" className="text-xl font-bold">
            …
          </span>
        ) : (
          <IoCartOutline aria-hidden="true" className="size-6" />
        )}
      </button>

      <p
        role="status"
        aria-atomic="true"
        className={notice ? "mt-2 text-sm text-yellow-400" : "sr-only"}
      >
        {isPending ? `Legger ${productName} i handlekurven.` : notice}
      </p>

      <p
        role="alert"
        aria-atomic="true"
        className={error ? "mt-2 text-sm text-red-300" : "sr-only"}
      >
        {error}
      </p>
    </div>
  );
}
