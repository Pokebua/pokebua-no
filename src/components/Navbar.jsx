"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { AiFillTikTok } from "react-icons/ai";
import { BsTwitch } from "react-icons/bs";
import { CgProfile } from "react-icons/cg";
import { IoCart, IoChevronDown, IoClose, IoMenu } from "react-icons/io5";
import { IoIosSearch } from "react-icons/io";
import { categories } from "@/data/categories";
import PokebuaLogo from "./PokebuaLogo";

const productLinks = [
  ...categories.map(({ name, slug }) => ({
    href: `/produkter/${slug}`,
    label: name,
  })),
  { href: "/produkter/tilbehor", label: "Tilbehør" },
];

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
  { href: "/sok", label: "Søk", Icon: IoIosSearch },
  { href: "/konto", label: "Min konto", Icon: CgProfile },
  { href: "/handlekurv", label: "Handlekurv", Icon: IoCart },
];

const focusClassName =
  "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#f7b900] focus-visible:ring-offset-4 focus-visible:ring-offset-[#001016]";

const iconClassName = `grid size-11 shrink-0 place-items-center rounded-full transition-colors hover:bg-[#f7b900]/10 hover:text-white ${focusClassName}`;

const navigationClassName = `flex min-h-11 items-center rounded-sm px-3 py-2 text-sm font-semibold transition-colors hover:bg-[#f7b900]/10 hover:text-white ${focusClassName}`;

export default function Navbar() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [desktopProductsOpen, setDesktopProductsOpen] = useState(false);
  const [mobileProductsOpen, setMobileProductsOpen] = useState(false);

  const menuButtonRef = useRef(null);
  const desktopProductsRef = useRef(null);
  const desktopProductsButtonRef = useRef(null);
  const mobileProductsButtonRef = useRef(null);

  const pathname = usePathname();

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
    return href === "/"
      ? pathname === "/"
      : pathname === href || pathname.startsWith(`${href}/`);
  }

  function closeMenus() {
    setMenuOpen(false);
    setDesktopProductsOpen(false);
    setMobileProductsOpen(false);
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
    return (
      <Link
        href={href}
        aria-current={isActive(href) ? "page" : undefined}
        onClick={closeMenus}
        className={`${navigationClassName} ${
          isActive(href)
            ? "text-white underline decoration-[#f7b900] decoration-2 underline-offset-8"
            : "text-[#f7b900]"
        }`}
      >
        {label}
      </Link>
    );
  }

  function renderProductLinks() {
    return productLinks.map(({ href, label }, index) => (
      <li
        key={href}
        className={
          index === productLinks.length - 1
            ? "mt-2 border-t border-[#f7b900]/25 pt-2"
            : undefined
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
          if (mobile) {
            setMobileProductsOpen((previous) => !previous);
          } else {
            setDesktopProductsOpen((previous) => !previous);
          }
        }}
        className={`${navigationClassName} gap-2 ${
          mobile ? "w-full justify-between" : ""
        } ${isActive("/produkter") ? "text-white" : ""}`}
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
      <nav aria-label="Hovedmeny" className="mx-auto max-w-7xl">
        <div className="grid min-h-24 grid-cols-[1fr_auto] items-center gap-2 px-4 py-3 sm:px-8 lg:grid-cols-[1fr_auto_1fr]">
          {/* Logo */}
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
                  className="absolute left-0 top-full mt-3 w-60 space-y-1 rounded-lg border border-[#f7b900]/40 bg-[#001016] p-3 shadow-xl"
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

          {/* Account actions */}
          <div className="flex items-center justify-self-end sm:gap-1">
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
          className="border-t border-[#f7b900]/25 px-4 py-5 sm:px-8 lg:hidden"
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
