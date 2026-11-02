"use client";

import Link from "next/link";

export default function PageError() {
  return (
    <section
      aria-labelledby="page-error-heading"
      className="min-h-[40vh] bg-[#FFF8E6] px-4 py-12 text-[#001016] sm:px-8"
    >
      <div className="mx-auto max-w-6xl">
        <h1 id="page-error-heading" className="text-3xl font-bold">
          Kunne ikke laste innholdet
        </h1>

        <p className="mt-4">Noe gikk galt. Prøv å laste siden på nytt.</p>

        <div className="mt-6 flex flex-wrap gap-4">
          <button
            type="button"
            onClick={() => window.location.reload()}
            className="min-h-11 cursor-pointer rounded-lg border-2 border-[#f7b900] bg-[#001016] px-5 py-3 font-semibold text-white hover:bg-gray-800 focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#001016]"
          >
            Prøv igjen
          </button>

          <Link
            href="/"
            className="inline-flex min-h-11 items-center rounded-lg px-5 py-3 font-semibold underline underline-offset-4 focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#001016]"
          >
            Til forsiden
          </Link>
        </div>
      </div>
    </section>
  );
}
