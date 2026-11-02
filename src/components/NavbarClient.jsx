"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { AiFillTikTok } from "react-icons/ai";
import { BsTwitch } from "react-icons/bs";
import { CgProfile } from "react-icons/cg";
import { IoChevronDown, IoClose, IoMenu } from "react-icons/io5";
import PokebuaLogo from "./PokebuaLogo";
import NavbarSearch from "./NavbarSearch";
import Cart from "./Cart";

const socialLinks = [
  {
    href: "https://www.twitch.tv/pokebua",
    label: "Pokébua på Twitch",
    Icon: BsTwitch,
  },
  {
    href: "https://www.tiktok.com/@pokebua.no",
    label: "Pokébua på TikTok",
    Icon: AiFillTikTok,
  },
];

const accountLinks = [
  {
    href: "/konto",
    label: "Min konto",
    Icon: CgProfile,
  },
];

const focusClassName =
  "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#f7b900] focus-visible:ring-offset-4 focus-visible:ring-offset-[#001016]";

const iconClassName = `grid size-11 shrink-0 cursor-pointer place-items-center rounded-full transition-colors hover:bg-[#f7b900]/10 hover:text-white ${focusClassName}`;

const navigationClassName = `flex min-h-11 items-center rounded-sm px-3 py-2 text-sm font-semibold transition-colors hover:bg-[#f7b900]/10 hover:text-white ${focusClassName}`;

export default function NavbarClient({ productLinks }) {
  const [menuOpen, setMenuOpen] = useState(false);
  const [desktopProductsOpen, setDesktopProductsOpen] = useState(false);
  const [mobileProductsOpen, setMobileProductsOpen] = useState(false);
  const [activePanel, setActivePanel] = useState(null);
  const [searchValue, setSearchValue] = useState("");

  const menuButtonRef = useRef(null);
  const desktopProductsRef = useRef(null);
  const desktopProductsButtonRef = useRef(null);
  const mobileProductsButtonRef = useRef(null);

  const pathname = usePathname();

  const productsActive =
    pathname === "/produkter" || pathname.startsWith("/produkter/");

  const setSearchOpen = useCallback((open) => {
    if (open) {
      setActivePanel("search");
      setMenuOpen(false);
      setDesktopProductsOpen(false);
      setMobileProductsOpen(false);
    } else {
      setActivePanel((current) => (current === "search" ? null : current));
      setSearchValue("");
    }
  }, []);

  const setCartOpen = useCallback((open) => {
    if (open) {
      setActivePanel("cart");
      setSearchValue("");
      setMenuOpen(false);
      setDesktopProductsOpen(false);
      setMobileProductsOpen(false);
    } else {
      setActivePanel((current) => (current === "cart" ? null : current));
    }
  }, []);

  useEffect(() => {
    if (!desktopProductsOpen) return;

    function handlePointerDown(event) {
      if (!desktopProductsRef.current?.contains(event.target)) {
        setDesktopProductsOpen(false);
      }
    }

    document.addEventListener("pointerdown", handlePointerDown);

    return () => {
      document.removeEventListener("pointerdown", handlePointerDown);
    };
  }, [desktopProductsOpen]);

  function isActive(href) {
    if (href === "/" || href === "/produkter") {
      return pathname === href;
    }

    return pathname === href || pathname.startsWith(`${href}/`);
  }

  function closeMenus() {
    setMenuOpen(false);
    setDesktopProductsOpen(false);
    setMobileProductsOpen(false);
    setActivePanel(null);
    setSearchValue("");
  }

  function handleEscape(event) {
    if (event.key !== "Escape") return;

    if (desktopProductsOpen) {
      event.preventDefault();
      setDesktopProductsOpen(false);
      desktopProductsButtonRef.current?.focus();
    } else if (mobileProductsOpen) {
      event.preventDefault();
      setMobileProductsOpen(false);
      mobileProductsButtonRef.current?.focus();
    } else if (menuOpen) {
      event.preventDefault();
      setMenuOpen(false);
      menuButtonRef.current?.focus();
    }
  }

  function renderLink(href, label) {
    const active = isActive(href);

    return (
      <Link
        href={href}
        aria-current={pathname === href ? "page" : undefined}
        onClick={closeMenus}
        className={`${navigationClassName} ${
          active
            ? "text-white underline decoration-[#f7b900] decoration-2 underline-offset-8"
            : "text-[#f7b900]"
        }`}
      >
        {label}
      </Link>
    );
  }

  function renderProductLinks() {
    return productLinks.map(({ href, label, separated }) => (
      <li
        key={href}
        className={
          separated ? "mt-2 border-t border-[#f7b900]/25 pt-2" : undefined
        }
      >
        {renderLink(href, label)}
      </li>
    ));
  }

  function renderSocialLinks() {
    return socialLinks.map(({ href, label, Icon }) => (
      <li key={href}>
        <a
          href={href}
          target="_blank"
          rel="noopener noreferrer"
          aria-label={`${label} (åpnes i en ny fane)`}
          className={iconClassName}
        >
          <Icon aria-hidden="true" className="size-7" />
        </a>
      </li>
    ));
  }

  function renderProductsButton(mobile = false) {
    const open = mobile ? mobileProductsOpen : desktopProductsOpen;

    return (
      <button
        ref={mobile ? mobileProductsButtonRef : desktopProductsButtonRef}
        type="button"
        aria-expanded={open}
        aria-controls={mobile ? "mobile-products" : "desktop-products"}
        onClick={() => {
          setActivePanel(null);
          setSearchValue("");

          if (mobile) {
            setMobileProductsOpen((previous) => !previous);
          } else {
            setDesktopProductsOpen((previous) => !previous);
          }
        }}
        className={`${navigationClassName} cursor-pointer gap-2 ${
          mobile ? "w-full justify-between" : ""
        } ${productsActive ? "text-white" : ""}`}
      >
        Produkter
        <IoChevronDown
          aria-hidden="true"
          className={`size-4 shrink-0 transition-transform motion-reduce:transition-none ${
            open ? "rotate-180" : ""
          }`}
        />
      </button>
    );
  }

  return (
    <header
      className="relative z-30 border-y-2 border-[#f7b900] bg-[#001016] text-[#f7b900]"
      onKeyDown={handleEscape}
    >
      <a
        href="#main-content"
        onClick={closeMenus}
        className="sr-only z-50 rounded-md bg-[#f7b900] px-4 py-3 font-semibold text-[#001016] focus:not-sr-only focus:absolute focus:left-4 focus:top-4 focus:outline-none focus:ring-2 focus:ring-white focus:ring-offset-2 focus:ring-offset-[#001016]"
      >
        Hopp til hovedinnhold
      </a>

      <nav aria-label="Hovedmeny" className="mx-auto max-w-7xl">
        <div className="grid min-h-24 grid-cols-[1fr_auto] items-center gap-2 px-4 py-3 sm:px-8 lg:grid-cols-[1fr_auto_1fr]">
          <div className="min-w-0 justify-self-start" onClick={closeMenus}>
            <PokebuaLogo />
          </div>

          {/* Desktop navigation */}
          <div className="hidden items-center gap-5 lg:flex">
            <ul className="flex items-center gap-1">
              <li>{renderLink("/", "Hjem")}</li>

              <li
                ref={desktopProductsRef}
                className="relative"
                onBlur={(event) => {
                  if (!event.currentTarget.contains(event.relatedTarget)) {
                    setDesktopProductsOpen(false);
                  }
                }}
              >
                {renderProductsButton()}

                <ul
                  id="desktop-products"
                  hidden={!desktopProductsOpen}
                  className="absolute left-0 top-full mt-3 max-h-[70dvh] w-60 space-y-1 overflow-y-auto rounded-lg border border-[#f7b900]/40 bg-[#001016] p-3 shadow-xl"
                >
                  {renderProductLinks()}
                </ul>
              </li>

              <li>{renderLink("/event", "Event")}</li>
            </ul>

            <ul
              aria-label="Sosiale medier"
              className="flex items-center gap-2 border-l border-[#f7b900]/25 pl-5"
            >
              {renderSocialLinks()}
            </ul>
          </div>

          {/* Account actions and mobile menu button */}
          <div className="flex items-center justify-self-end sm:gap-1">
            <NavbarSearch
              searchOpen={activePanel === "search"}
              setSearchOpen={setSearchOpen}
              searchValue={searchValue}
              setSearchValue={setSearchValue}
            />

            {accountLinks.map(({ href, label, Icon }) => (
              <Link
                key={href}
                href={href}
                aria-label={label}
                onClick={closeMenus}
                className={iconClassName}
              >
                <Icon aria-hidden="true" className="size-6" />
              </Link>
            ))}

            <Cart isOpen={activePanel === "cart"} setIsOpen={setCartOpen} />

            <button
              ref={menuButtonRef}
              type="button"
              aria-label={menuOpen ? "Lukk meny" : "Åpne meny"}
              aria-expanded={menuOpen}
              aria-controls="mobile-navigation"
              onClick={() => {
                setMenuOpen((previous) => !previous);
                setMobileProductsOpen(false);
                setDesktopProductsOpen(false);
                setActivePanel(null);
                setSearchValue("");
              }}
              className={`${iconClassName} lg:hidden`}
            >
              {menuOpen ? (
                <IoClose aria-hidden="true" className="size-7" />
              ) : (
                <IoMenu aria-hidden="true" className="size-7" />
              )}
            </button>
          </div>
        </div>

        {/* Mobile navigation */}
        <div
          id="mobile-navigation"
          hidden={!menuOpen}
          className="max-h-[75dvh] overflow-y-auto border-t border-[#f7b900]/25 px-4 py-5 sm:px-8 lg:hidden"
        >
          <ul className="space-y-2">
            <li>{renderLink("/", "Hjem")}</li>

            <li>
              {renderProductsButton(true)}

              <ul
                id="mobile-products"
                hidden={!mobileProductsOpen}
                className="my-3 ml-3 space-y-1 border-l border-[#f7b900]/25 pl-3"
              >
                {renderProductLinks()}
              </ul>
            </li>

            <li>{renderLink("/event", "Event")}</li>
          </ul>

          <div className="mt-5 flex items-center justify-between border-t border-[#f7b900]/25 pt-4">
            <p className="text-sm font-semibold">Følg oss på</p>

            <ul aria-label="Sosiale medier" className="flex items-center gap-2">
              {renderSocialLinks()}
            </ul>
          </div>
        </div>
      </nav>
    </header>
  );
}
