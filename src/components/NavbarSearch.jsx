"use client";

import { useEffect, useRef, useState } from "react";
import { IoClose } from "react-icons/io5";
import { IoIosSearch } from "react-icons/io";

const focusClassName =
  "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#f7b900] focus-visible:ring-offset-4 focus-visible:ring-offset-[#001016]";

const iconClassName = `grid size-11 shrink-0 place-items-center rounded-full transition-colors hover:bg-[#f7b900]/10 hover:text-white ${focusClassName}`;

export default function NavbarSearch() {
  const [searchOpen, setSearchOpen] = useState(false);

  const searchButtonRef = useRef(null);
  const searchInputRef = useRef(null);

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

  return (
    <>
      <button
        ref={searchButtonRef}
        type="button"
        aria-label={searchOpen ? "Lukk søk" : "Søk"}
        aria-expanded={searchOpen}
        aria-controls="search-panel"
        onClick={() => setSearchOpen((previous) => !previous)}
        className={iconClassName}
      >
        <IoIosSearch aria-hidden="true" className="size-6" />
      </button>

      {searchOpen && (
        <div
          id="search-panel"
          onKeyDown={handleEscape}
          className="absolute left-0 top-full w-full border-t border-[#f7b900]/25 bg-[#001016] px-4 py-5 sm:px-8"
        >
          <div className="mx-auto max-w-3xl">
            <div className="flex items-start justify-between gap-4">
              <label
                htmlFor="navbar-search"
                className="font-semibold text-[#f7b900]"
              >
                Søk etter produkter
              </label>

              <button
                type="button"
                aria-label="Lukk søk"
                onClick={closeSearch}
                className={iconClassName}
              >
                <IoClose aria-hidden="true" className="size-6" />
              </button>
            </div>

            <input
              ref={searchInputRef}
              id="navbar-search"
              type="search"
              className="mt-3 min-h-11 w-full rounded-md bg-white px-4 py-3 text-[#001016]"
            />

            <p className="mt-3 text-sm">Skriv inn et produktnavn for å søke</p>
          </div>
        </div>
      )}
    </>
  );
}
