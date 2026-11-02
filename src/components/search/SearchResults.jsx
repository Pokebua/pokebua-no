"use client";

import { useRef } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import ShopifyProductCard from "@/components/products/ShopifyProductCard";
import useProductSearch from "@/hooks/useProductSearch";
import SearchFeedback from "@/components/search/SearchFeedback";

const paginationClassName =
  "inline-flex min-h-11 items-center justify-center rounded-md border border-[#001016] px-4 py-2 font-semibold hover:bg-[#001016] hover:text-white focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#001016]";

function createSearchHref(query, after = null) {
  const params = new URLSearchParams({ q: query });

  if (after) {
    params.set("after", after);
  }

  return `/sok?${params}`;
}

export default function SearchResults() {
  const searchParams = useSearchParams();
  const searchInputRef = useRef(null);

  const searchValue = searchParams.get("q") ?? "";
  const query = searchValue.trim();
  const after = searchParams.get("after") || null;

  const { matches, totalCount, pageInfo, hasQuery, isPending, error, retry } =
    useProductSearch(searchValue, true, {
      first: 24,
      after,
    });

  const hasNextPage = pageInfo.hasNextPage && Boolean(pageInfo.endCursor);

  const showResults = hasQuery && !isPending && !error;

  function handleSearchChange(event) {
    const value = event.target.value;
    const url = new URL(window.location.href);

    if (value) {
      url.searchParams.set("q", value);
    } else {
      url.searchParams.delete("q");
    }

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
            after && (
              <p className="mt-6">
                Ingen produkter på denne siden. Gå tilbake til første side.
              </p>
            )
          )}

          {(after || hasNextPage) && (
            <nav
              aria-label="Sider med søkeresultater"
              className="mt-8 flex flex-wrap justify-center gap-4"
            >
              {after && (
                <Link
                  href={createSearchHref(query)}
                  className={paginationClassName}
                >
                  Første side
                </Link>
              )}

              {hasNextPage && (
                <Link
                  href={createSearchHref(query, pageInfo.endCursor)}
                  rel="next"
                  className={paginationClassName}
                >
                  Neste side
                </Link>
              )}
            </nav>
          )}
        </>
      )}
    </section>
  );
}
