"use client";

import { useRef, useState } from "react";
import useCart from "@/hooks/useCart";

export default function AddToCartButton({ productId, productName }) {
  const { addItem } = useCart();

  const pendingRef = useRef(false);
  const [status, setStatus] = useState("idle");

  async function handleAdd() {
    if (pendingRef.current) return;

    pendingRef.current = true;
    setStatus("pending");

    try {
      await addItem(productId);
      setStatus("success");
    } catch (error) {
      console.error("Adding product to cart failed:", error);
      setStatus("error");
    } finally {
      pendingRef.current = false;
    }
  }

  const isPending = status === "pending";

  return (
    <div className="min-w-0">
      <button
        type="button"
        onClick={handleAdd}
        aria-disabled={isPending}
        className={`min-h-11 w-full rounded-lg border-3 border-yellow-400 bg-black px-6 py-3 font-semibold text-white transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-black ${
          isPending
            ? "cursor-wait opacity-70"
            : "cursor-pointer hover:bg-gray-800"
        }`}
      >
        {isPending ? "Legger til..." : "Legg i handlekurv"}
      </button>

      <p role="status" aria-atomic="true" className="mt-2 text-sm">
        {status === "pending" && "Legger produktet i handlekurven."}
        {status === "success" && `${productName} er lagt i handlekurven.`}
      </p>

      <p role="alert" aria-atomic="true" className="mt-2 text-sm text-red-800">
        {status === "error" &&
          "Kunne ikke legge produktet i handlekurven. Prøv igjen."}
      </p>
    </div>
  );
}
