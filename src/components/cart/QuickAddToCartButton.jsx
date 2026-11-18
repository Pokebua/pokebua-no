"use client";

import { useId, useRef, useState } from "react";
import { IoCartOutline } from "react-icons/io5";
import useCart from "@/hooks/useCart";
import useToast from "@/hooks/useToast";

const MAX_QUANTITY = 2147483647;

const focusClassName =
  "focus-visible:outline-2 focus-visible:outline-offset-[-3px] focus-visible:outline-[#f7b900]";

const stepClassName = `grid size-11 shrink-0 place-items-center rounded-lg border border-white/50 text-lg font-semibold text-white enabled:cursor-pointer enabled:hover:bg-white/15 disabled:opacity-50 ${focusClassName}`;

export default function QuickAddToCartButton({
  variantId,
  productName,
  available,
  quantityAvailable,
}) {
  const { addItem, lines, isLoading, isBusy, cartError } = useCart();
  const { showToast } = useToast();
  const inputId = useId();
  const messageId = `${inputId}-message`;

  const pendingRef = useRef(false);
  const [isPending, setIsPending] = useState(false);
  const [quantityInput, setQuantityInput] = useState("1");
  const [triedToExceedLimit, setTriedToExceedLimit] = useState(false);
  const [error, setError] = useState("");
  const [notice, setNotice] = useState("");

  const quantityInCart = lines.reduce(
    (total, line) =>
      line.merchandise?.id === variantId ? total + line.quantity : total,
    0,
  );

  const hasStockCount = Number.isInteger(quantityAvailable);
  const maxQuantity = hasStockCount
    ? Math.min(MAX_QUANTITY, Math.max(0, quantityAvailable - quantityInCart))
    : MAX_QUANTITY;

  const quantity = Number(quantityInput);
  const quantityIsValid =
    Number.isSafeInteger(quantity) && quantity >= 1 && quantity <= maxQuantity;

  const controlsDisabled =
    !variantId ||
    !available ||
    isPending ||
    isLoading ||
    isBusy ||
    Boolean(cartError);

  const unavailable = controlsDisabled || !quantityIsValid;

  let quantityMessage = "";

  if (maxQuantity === 0) {
    quantityMessage =
      quantityInCart > 0
        ? "Du har allerede hele tilgjengelige antallet i handlekurven."
        : "Ingen flere på lager.";
  } else if (quantity > maxQuantity || triedToExceedLimit) {
    if (!hasStockCount) {
      quantityMessage = `Maksimalt antall er ${MAX_QUANTITY} stk.`;
    } else if (quantityInCart > 0) {
      quantityMessage = `Du kan legge til maks ${maxQuantity} stk. til.`;
    } else {
      quantityMessage = `Kun ${maxQuantity} stk. på lager.`;
    }
  } else if (!quantityIsValid) {
    quantityMessage = "Skriv inn et heltall på minst 1.";
  }

  const label = isPending
    ? `Legger ${productName} i handlekurven`
    : cartError
      ? "Åpne handlekurven og last den inn på nytt"
      : `Legg ${productName} i handlekurven`;

  function changeQuantity(value) {
    setQuantityInput(value.replace(/[^0-9]/g, ""));
    setTriedToExceedLimit(false);
    setError("");
    setNotice("");
  }

  function decreaseQuantity() {
    changeQuantity(String(Math.min(quantity - 1, maxQuantity)));
  }

  function increaseQuantity() {
    if (quantity >= maxQuantity) {
      setTriedToExceedLimit(true);
      return;
    }

    changeQuantity(String(quantity + 1));
  }

  async function handleAdd() {
    if (pendingRef.current || unavailable) return;

    pendingRef.current = true;
    setIsPending(true);
    setError("");
    setNotice("");

    try {
      const result = await addItem(variantId, quantity);

      if (result.warnings?.length) {
        setNotice(result.warnings.map((warning) => warning.message).join(" "));
        return;
      }

      changeQuantity("1");

      showToast({
        type: "success",
        message:
          quantity === 1
            ? `${productName} er lagt i handlekurven.`
            : `${quantity} stk. av ${productName} er lagt i handlekurven.`,
      });
    } catch (error) {
      setError(error.message || "Kunne ikke legge varen i handlekurven.");
    } finally {
      pendingRef.current = false;
      setIsPending(false);
    }
  }

  return (
    <div className="min-w-0">
      <label htmlFor={inputId} className="mb-2 block text-sm font-semibold">
        Antall<span className="sr-only"> for {productName}</span>
      </label>

      <div className="flex flex-wrap items-center gap-2">
        <button
          type="button"
          aria-label={`Reduser antall for ${productName}`}
          disabled={controlsDisabled || maxQuantity === 0 || quantity <= 1}
          onClick={decreaseQuantity}
          className={stepClassName}
        >
          −
        </button>

        <input
          id={inputId}
          type="text"
          inputMode="numeric"
          value={quantityInput}
          onChange={(event) => changeQuantity(event.target.value)}
          disabled={controlsDisabled || maxQuantity === 0}
          aria-invalid={!quantityIsValid && maxQuantity > 0}
          aria-describedby={quantityMessage ? messageId : undefined}
          className={`h-11 w-16 shrink-0 rounded-lg border border-white/50 bg-[#001016] px-2 text-center text-white disabled:opacity-50 ${focusClassName}`}
        />

        <button
          type="button"
          aria-label={`Øk antall for ${productName}`}
          disabled={controlsDisabled || maxQuantity === 0}
          onClick={increaseQuantity}
          className={stepClassName}
        >
          +
        </button>

        <button
          type="button"
          onClick={handleAdd}
          aria-label={label}
          title={label}
          aria-disabled={unavailable}
          aria-describedby={quantityMessage ? messageId : undefined}
          className={`grid size-11 shrink-0 place-items-center rounded-lg bg-[#f7b900] text-[#001016] focus-visible:outline-2 focus-visible:outline-offset-[-4px] focus-visible:outline-[#001016] ${
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
      </div>

      <div className="mt-1 grid min-h-5 wrap-break-word text-sm leading-5">
        <p
          id={messageId}
          role="status"
          aria-atomic="true"
          className={`col-start-1 row-start-1 text-yellow-400 ${
            error || notice ? "sr-only" : ""
          }`}
        >
          {quantityMessage}
        </p>

        <p
          role="status"
          aria-atomic="true"
          className={
            notice && !error
              ? "col-start-1 row-start-1 text-yellow-400"
              : "sr-only"
          }
        >
          {isPending ? `Legger ${productName} i handlekurven.` : notice}
        </p>

        <p
          role="alert"
          aria-atomic="true"
          className={error ? "col-start-1 row-start-1 text-red-300" : "sr-only"}
        >
          {error}
        </p>
      </div>
    </div>
  );
}
