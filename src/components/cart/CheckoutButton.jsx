"use client";

import { useId, useRef, useState } from "react";
import useCart from "@/hooks/useCart";

export default function CheckoutButton() {
  const {
    checkout,
    itemCount,
    isLoading,
    isBusy,
    isCheckingOut,
    cartError,
    twitchName,
    setTwitchName,
  } = useCart();

  const twitchNameId = useId();
  const pendingRef = useRef(false);
  const [error, setError] = useState("");

  const unavailable =
    itemCount < 1 || isLoading || isBusy || Boolean(cartError);

  async function handleCheckout() {
    if (pendingRef.current || unavailable) return;

    pendingRef.current = true;
    setError("");

    try {
      await checkout();
    } catch (error) {
      setError(error.message || "Kunne ikke åpne kassen. Prøv igjen.");
    } finally {
      pendingRef.current = false;
    }
  }

  return (
    <div className="mt-6">
      <label
        htmlFor={twitchNameId}
        className="block text-sm font-semibold text-white"
      >
        Twitch-navn{" "}
        <span className="font-normal text-white/80">(valgfritt)</span>
      </label>

      <input
        id={twitchNameId}
        type="text"
        value={twitchName}
        onChange={(event) => {
          setTwitchName(event.target.value);
          setError("");
        }}
        maxLength={26}
        autoCapitalize="none"
        spellCheck={false}
        disabled={isCheckingOut}
        className="mb-4 mt-2 min-h-11 w-full rounded-md border border-white/50 bg-[#001016] px-3 text-base text-white focus-visible:outline-2 focus-visible:outline-[#f7b900]"
      />

      <button
        type="button"
        onClick={handleCheckout}
        aria-disabled={unavailable}
        aria-describedby="cart-checkout-help"
        className={`min-h-11 w-full rounded-md bg-[#f7b900] px-5 py-3 text-center font-semibold text-[#001016] transition-colors focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#f7b900] ${
          isCheckingOut
            ? "cursor-wait opacity-70"
            : unavailable
              ? "cursor-not-allowed opacity-60"
              : "cursor-pointer hover:bg-[#ffd04a]"
        }`}
      >
        {isCheckingOut ? "Åpner kassen..." : "Til kassen"}
      </button>

      <p id="cart-checkout-help" className="mt-2 text-sm text-white/80">
        Du går videre til Shopify for å fullføre kjøpet.
      </p>

      <p role="status" aria-atomic="true" className="sr-only">
        {isCheckingOut ? "Åpner Shopify-kassen." : ""}
      </p>

      <p role="alert" aria-atomic="true" className="mt-2 text-sm text-red-300">
        {error}
      </p>
    </div>
  );
}
