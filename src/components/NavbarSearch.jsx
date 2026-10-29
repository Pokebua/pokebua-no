"use client";

import { useEffect, useRef, useState } from "react";
import { IoClose } from "react-icons/io5";
import { IoIosSearch } from "react-icons/io";
import useProductSearch from "@/hooks/useProductSearch";
import ProductSuggestion from "@/components/search/ProductSuggestion";

const focusClassName =
  "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#f7b900] focus-visible:ring-offset-4 focus-visible:ring-offset-[#001016]";

const iconClassName = `grid size-11 shrink-0 cursor-pointer place-items-center rounded-full transition-colors hover:bg-[#f7b900]/10 hover:text-white ${focusClassName}`;

const SUGGESTION_LIMIT = 5;

export default function NavbarSearch() {
  const [searchOpen, setSearchOpen] = useState(false);
  const [searchValue, setSearchValue] = useState("");
  const { matches, hasQuery } = useProductSearch(searchValue, searchOpen);
  const totalMatches = matches.length;
  const suggestions = matches.slice(0, SUGGESTION_LIMIT);

  const searchButtonRef = useRef(null);
  const searchInputRef = useRef(null);
  const searchPanelRef = useRef(null);

  useEffect(() => {
    if (searchOpen) {
      searchInputRef.current?.focus();
    }
  }, [searchOpen]);

  function closeSearch() {
    setSearchOpen(false);

    requestAnimationFrame(() => {
      searchButtonRef.current?.focus();
    });
  }

  function handleEscape(event) {
    if (event.key === "Escape" && searchOpen) {
      event.preventDefault();
      closeSearch();
    }
  }

  function handleSearchBlur(event) {
    const nextTarget = event.relatedTarget;

    if (
      !searchPanelRef.current?.contains(nextTarget) &&
      !searchButtonRef.current?.contains(nextTarget)
    ) {
      setSearchOpen(false);
    }
  }

  useEffect(() => {
    if (!searchOpen) return;

    function handleClickOutside(event) {
      if (
        !searchPanelRef.current?.contains(event.target) &&
        !searchButtonRef.current?.contains(event.target)
      ) {
        setSearchOpen(false);
      }
    }

    document.addEventListener("pointerdown", handleClickOutside);

    return () => {
      document.removeEventListener("pointerdown", handleClickOutside);
    };
  }, [searchOpen]);

  return (
    <>
      <button
        ref={searchButtonRef}
        onBlur={handleSearchBlur}
        type="button"
        aria-label={searchOpen ? "Lukk søk" : "Søk"}
        aria-expanded={searchOpen}
        aria-controls="search-panel"
        onClick={() => {
          if (searchOpen) {
            closeSearch();
          } else {
            setSearchOpen(true);
          }
        }}
        className={iconClassName}
      >
        <IoIosSearch aria-hidden="true" className="size-6" />
      </button>

      {searchOpen && (
        <div
          ref={searchPanelRef}
          id="search-panel"
          onKeyDown={handleEscape}
          onBlur={handleSearchBlur}
          className="absolute left-0 top-full z-50 max-h-[75dvh] w-full overflow-y-auto border-t border-[#f7b900]/25 bg-[#001016] shadow-xl"
        >
          <div className="mx-auto max-w-7xl px-4 py-5 sm:px-8">
            <div className="grid grid-cols-[minmax(0,1fr)_auto] items-center gap-x-4">
              <label
                htmlFor="navbar-search"
                className="col-start-1 row-start-1 font-semibold text-[#f7b900]"
              >
                Søk etter produkter
              </label>

              <div className="col-span-2 col-start-1 row-start-2 mt-3 min-w-0">
                <input
                  ref={searchInputRef}
                  id="navbar-search"
                  type="search"
                  autoComplete="off"
                  value={searchValue}
                  onChange={(event) => setSearchValue(event.target.value)}
                  placeholder="Søk etter produkter..."
                  aria-describedby={
                    !hasQuery ? "navbar-search-help" : undefined
                  }
                  className="min-h-11 w-full rounded-md bg-white px-4 py-3 text-[#001016] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#f7b900]"
                />
              </div>

              <button
                type="button"
                aria-label="Lukk søk"
                onClick={closeSearch}
                className={`${iconClassName} col-start-2 row-start-1`}
              >
                <IoClose aria-hidden="true" className="size-6" />
              </button>
            </div>

            {!hasQuery ? (
              <p id="navbar-search-help" className="mt-3 text-sm">
                Skriv inn et produktnavn for å søke
              </p>
            ) : (
              totalMatches > 0 && (
                <section
                  aria-labelledby="navbar-suggestions-heading"
                  className="mt-6"
                >
                  <h2
                    id="navbar-suggestions-heading"
                    className="border-b border-[#f7b900]/25 pb-3 text-base text-[#f7b900]"
                  >
                    Produkter
                  </h2>

                  <ul className="mt-4 grid grid-cols-2 gap-x-4 gap-y-6 p-1 sm:grid-cols-3 lg:grid-cols-5">
                    {suggestions.map((product) => (
                      <li key={product.id} className="min-w-0">
                        <ProductSuggestion
                          product={product}
                          onSelect={() => setSearchOpen(false)}
                        />
                      </li>
                    ))}
                  </ul>
                </section>
              )
            )}
          </div>
        </div>
      )}
    </>
  );
}
