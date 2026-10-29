"use client";

import { useEffect, useRef, useState } from "react";
import { IoClose } from "react-icons/io5";
import { IoIosSearch } from "react-icons/io";

const focusClassName =
  "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#f7b900] focus-visible:ring-offset-4 focus-visible:ring-offset-[#001016]";

const iconClassName = `grid size-11 shrink-0 cursor-pointer place-items-center rounded-full transition-colors hover:bg-[#f7b900]/10 hover:text-white ${focusClassName}`;

export default function NavbarSearch() {
  const [searchOpen, setSearchOpen] = useState(false);
  const [searchValue, setSearchValue] = useState("");

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
          className="absolute left-0 top-full w-full border-t border-[#f7b900]/25 bg-[#001016] px-4 py-5 sm:px-8"
        >
          <div className="mx-auto max-w-3xl">
            <div className="grid grid-cols-[minmax(0,1fr)_auto] items-center gap-x-4">
              <label
                htmlFor="navbar-search"
                className="col-start-1 row-start-1 font-semibold text-[#f7b900]"
              >
                Søk etter produkter
              </label>

              <div className="relative col-span-2 col-start-1 row-start-2 mt-3 min-w-0">
                <input
                  ref={searchInputRef}
                  id="navbar-search"
                  type="search"
                  value={searchValue}
                  onChange={(event) => setSearchValue(event.target.value)}
                  placeholder="Søk etter produkter..."
                  aria-describedby="navbar-search-help"
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

            <p id="navbar-search-help" className="mt-3 text-sm">
              Skriv inn et produktnavn for å søke
            </p>
          </div>
        </div>
      )}
    </>
  );
}
