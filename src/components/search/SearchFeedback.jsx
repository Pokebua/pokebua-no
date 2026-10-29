"use client";

import { useEffect, useState } from "react";

export default function SearchFeedback({
  hasQuery,
  isPending,
  error,
  count,
  onRetry,
  dark = false,
}) {
  const [announcement, setAnnouncement] = useState("");

  let message = "";

  if (hasQuery) {
    if (isPending) {
      message = "Søker etter produkter...";
    } else if (error) {
      message = error;
    } else if (count === 0) {
      message = "Ingen produkter funnet. Prøv et annet produktnavn.";
    } else {
      message = `${count} ${
        count === 1 ? "produkt funnet" : "produkter funnet"
      }.`;
    }
  }

  useEffect(() => {
    const timeout = window.setTimeout(() => {
      setAnnouncement(message);
    }, 400);

    return () => {
      window.clearTimeout(timeout);
    };
  }, [message]);

  const retryClassName = dark
    ? "border-[#f7b900] text-[#f7b900] hover:bg-white/10 focus-visible:outline-[#f7b900]"
    : "border-[#001016] text-[#001016] hover:bg-black/5 focus-visible:outline-[#001016]";

  return (
    <>
      {hasQuery && (
        <div className="mt-4 text-sm">
          <p>{message}</p>

          {error && (
            <button
              type="button"
              onClick={onRetry}
              className={`mt-3 inline-flex min-h-11 cursor-pointer items-center justify-center rounded-md border px-4 py-2 font-semibold focus-visible:outline-2 focus-visible:outline-offset-2 ${retryClassName}`}
            >
              Prøv igjen
            </button>
          )}
        </div>
      )}

      <p role="status" aria-atomic="true" className="sr-only">
        {announcement === message ? announcement : ""}
      </p>
    </>
  );
}
