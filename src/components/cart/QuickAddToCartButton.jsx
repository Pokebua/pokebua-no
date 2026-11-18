"use client";

import { useId, useRef, useState } from "react";
import { IoCartOutline } from "react-icons/io5";
import useCart from "@/hooks/useCart";
import useToast from "@/hooks/useToast";

const MAX_QUANTITY = 2147483647;

const quantityButtonClassName =
  "inline-flex h-11 w-full min-w-0 items-center justify-center rounded-md border border-white/50 bg-black text-lg font-semibold text-white hover:bg-white/10 focus-visible:outline-2 focus-visible:outline-[#f7b900] disabled:cursor-not-allowed disabled:opacity-40";

export default function QuickAddToCartButton({
  variantId,
  productName,
  available,
  quantityAvailable,
}) {
  const { addItem, lines = [], isLoading, isBusy, cartError } = useCart();
  const { showToast } = useToast();

  const inputId = useId();
  const messageId = `${inputId}-message`;
  const pendingRef = useRef(false);

  const [quantityInput, setQuantityInput] = useState("1");
  const [isPending, setIsPending] = useState(false);
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
    ? Math.max(0, Math.min(MAX_QUANTITY, quantityAvailable - quantityInCart))
    : MAX_QUANTITY;

  const quantity = Number(quantityInput);

  const quantityIsValid =
    /^\d+$/.test(quantityInput) &&
    Number.isSafeInteger(quantity) &&
    quantity >= 1 &&
    quantity <= maxQuantity;

  const controlsDisabled =
    !variantId ||
    !available ||
    isPending ||
    isLoading ||
    isBusy ||
    Boolean(cartError);

  const addDisabled = controlsDisabled || !quantityIsValid;

  let quantityMessage = "";

  if (available && maxQuantity === 0) {
    quantityMessage =
      quantityInCart > 0
        ? "Du har allerede hele tilgjengelige antallet i handlekurven."
        : "Ingen flere på lager.";
  } else if (triedToExceedLimit || quantity > maxQuantity) {
    if (!hasStockCount) {
      quantityMessage = `Maks ${MAX_QUANTITY} stk. om gangen.`;
    } else if (quantityInCart > 0) {
      quantityMessage = `Du kan legge til ${maxQuantity} stk. til.`;
    } else {
      quantityMessage = `Kun ${maxQuantity} stk. på lager.`;
    }
  } else if (!quantityIsValid && available) {
    quantityMessage = "Skriv inn et heltall på minst 1.";
  }

  function changeQuantity(value) {
    if (!/^\d*$/.test(value)) return;

    const exceedsLimit = Number(value) > maxQuantity;

    setTriedToExceedLimit(exceedsLimit);
    setQuantityInput(exceedsLimit ? String(maxQuantity) : value);
    setNotice("");
    setError("");
  }

  async function handleAdd() {
    if (pendingRef.current || addDisabled) return;

    pendingRef.current = true;
    setIsPending(true);
    setError("");
    setNotice("");
    setTriedToExceedLimit(false);

    try {
      const result = await addItem(variantId, quantity);

      if (result.warnings?.length) {
        setNotice(result.warnings.map((warning) => warning.message).join(" "));
        return;
      }

      setQuantityInput("1");

      showToast({
        type: "success",
        message: `${productName} er lagt i handlekurven.`,
      });
    } catch (error) {
      setError(error.message || "Kunne ikke legge varen i handlekurven.");
    } finally {
      pendingRef.current = false;
      setIsPending(false);
    }
  }

  const cartLabel = isPending
    ? `Legger ${productName} i handlekurven`
    : `Legg til ${productName} i handlekurven`;

  return (
    <div className="col-span-full w-full min-w-0">
      <label
        htmlFor={inputId}
        className="block text-sm font-semibold text-white"
      >
        Antall<span className="sr-only"> for {productName}</span>
      </label>

      <div className="mt-1 flex min-w-0 flex-col gap-1.5 sm:flex-row sm:flex-wrap sm:items-center sm:gap-2">
        <span className="grid w-full min-w-0 grid-cols-3 gap-1 sm:w-36">
          <button
            type="button"
            aria-label={`Reduser antall for ${productName}`}
            disabled={controlsDisabled || quantity <= 1 || maxQuantity === 0}
            onClick={() =>
              changeQuantity(String(Math.min(quantity - 1, maxQuantity)))
            }
            className={quantityButtonClassName}
          >
            −
          </button>

          <input
            id={inputId}
            type="text"
            inputMode="numeric"
            pattern="[0-9]*"
            value={quantityInput}
            disabled={controlsDisabled || maxQuantity === 0}
            onChange={(event) => changeQuantity(event.target.value)}
            aria-invalid={!quantityIsValid && maxQuantity > 0}
            aria-describedby={quantityMessage ? messageId : undefined}
            className="h-11 w-full min-w-0 rounded-md border border-white/50 bg-[#001016] px-0 text-center text-base font-semibold text-white focus-visible:outline-1 focus-visible:outline-[#f7b900] disabled:opacity-40"
          />

          <button
            type="button"
            aria-label={`Øk antall for ${productName}`}
            disabled={controlsDisabled || maxQuantity === 0}
            onClick={() => changeQuantity(String(quantity + 1))}
            className={quantityButtonClassName}
          >
            +
          </button>
        </span>

        <button
          type="button"
          onClick={handleAdd}
          disabled={addDisabled}
          aria-label={cartLabel}
          title={cartLabel}
          className="inline-flex h-11 w-full min-w-0 items-center justify-center gap-1.5 rounded-md bg-[#f7b900] px-2 text-sm font-semibold text-[#001016] hover:bg-[#ffd04a] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#f7b900] disabled:cursor-not-allowed disabled:opacity-50 sm:w-11 sm:shrink-0 sm:px-0"
        >
          {isPending ? (
            <span aria-hidden="true">…</span>
          ) : (
            <>
              <IoCartOutline aria-hidden="true" className="size-5 shrink-0" />
              <span className="sm:sr-only">Legg til</span>
            </>
          )}
        </button>
      </div>

      <div className="mt-1 min-h-5 wrap-break-word text-sm leading-5">
        <p
          id={messageId}
          role="status"
          aria-atomic="true"
          className="text-yellow-400"
        >
          {!error && (notice || quantityMessage)}
        </p>

        <p role="alert" aria-atomic="true" className="text-red-300">
          {error}
        </p>
      </div>
    </div>
  );
}
