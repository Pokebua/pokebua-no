"use client";

import { useRef } from "react";
import { useSearchParams } from "next/navigation";
import ShopifyProductCard from "@/components/products/ShopifyProductCard";
import useProductSearch from "@/hooks/useProductSearch";
import SearchFeedback from "@/components/search/SearchFeedback";
import SearchPagination from "@/components/search/SearchPagination";

const PAGE_SIZE = 24;
const MAX_PAGE = Math.ceil(1000 / PAGE_SIZE);

export default function SearchResults() {
  const searchParams = useSearchParams();
  const searchInputRef = useRef(null);

  const searchValue = searchParams.get("q") ?? "";
  const query = searchValue.trim();
  const pageValue = Number(searchParams.get("page") ?? "1");

  const currentPage =
    Number.isSafeInteger(pageValue) && pageValue >= 1 && pageValue <= MAX_PAGE
      ? pageValue
      : 1;

  const { matches, totalCount, hasQuery, isPending, error, retry } =
    useProductSearch(searchValue, true, {
      first: PAGE_SIZE,
      page: currentPage,
    });

  const showResults = hasQuery && !isPending && !error;

  function handleSearchChange(event) {
    const value = event.target.value;
    const url = new URL(window.location.href);

    if (value) {
      url.searchParams.set("q", value);
    } else {
      url.searchParams.delete("q");
    }

    url.searchParams.delete("page");
    url.searchParams.delete("after");

    window.history.replaceState(
      null,
      "",
      `${url.pathname}${url.search}${url.hash}`,
    );
  }

  function handleRetry() {
    searchInputRef.current?.focus();
    retry();
  }

  return (
    <section aria-labelledby="search-heading">
      <h1 id="search-heading" className="wrap-break-word text-3xl">
        {hasQuery ? `Søkeresultater for «${query}»` : "Søk etter produkter"}
      </h1>

      <form
        role="search"
        aria-label="Søk i produktresultater"
        onSubmit={(event) => event.preventDefault()}
        className="mt-6 max-w-2xl"
      >
        <label htmlFor="results-search" className="block text-sm font-semibold">
          Søk etter produkter
        </label>

        <input
          ref={searchInputRef}
          id="results-search"
          type="search"
          autoComplete="off"
          value={searchValue}
          onChange={handleSearchChange}
          placeholder="Søk etter produkter..."
          aria-describedby={!hasQuery ? "results-search-help" : undefined}
          className="mt-2 min-h-11 w-full rounded-md border border-gray-500 bg-white px-4 py-3 text-[#001016] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#001016]"
        />
      </form>

      {!hasQuery && (
        <p id="results-search-help" className="mt-4">
          Skriv inn et produktnavn for å søke.
        </p>
      )}

      <SearchFeedback
        hasQuery={hasQuery}
        isPending={isPending}
        error={error}
        count={totalCount}
        onRetry={handleRetry}
      />

      {showResults && (
        <>
          {matches.length > 0 ? (
            <ul className="mt-6 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {matches.map((product) => (
                <li key={product.id} className="min-w-0">
                  <ShopifyProductCard product={product} />
                </li>
              ))}
            </ul>
          ) : (
            currentPage > 1 && (
              <p className="mt-6">
                Ingen produkter på denne siden. Gå tilbake til første side.
              </p>
            )
          )}

          <SearchPagination
            query={query}
            currentPage={currentPage}
            totalCount={totalCount}
            pageSize={PAGE_SIZE}
          />
        </>
      )}
    </section>
  );
}
