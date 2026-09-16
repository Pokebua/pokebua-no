"use client";

import { useRef, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { AiFillTikTok } from "react-icons/ai";
import { BsTwitch } from "react-icons/bs";
import { CgProfile } from "react-icons/cg";
import { IoCart, IoClose, IoMenu } from "react-icons/io5";
import { IoIosSearch } from "react-icons/io";
import PokebuaLogo from "./PokebuaLogo";

const navigationLinks = [
  { href: "/", label: "Hjem" },
  { href: "/produkter", label: "Produkter" },
  { href: "/event", label: "Event" },
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

export default function Navbar() {
  const [menuOpen, setMenuOpen] = useState(false);
  const menuButtonRef = useRef(null);
  const pathname = usePathname();

  function isActive(href) {
    return href === "/"
      ? pathname === "/"
      : pathname === href || pathname.startsWith(`${href}/`);
  }

  function handleEscape(event) {
    if (event.key === "Escape" && menuOpen) {
      setMenuOpen(false);
      menuButtonRef.current?.focus();
    }
  }

  function renderNavigationLinks(mobile = false) {
    return navigationLinks.map(({ href, label }) => (
      <li key={href}>
        <Link
          href={href}
          aria-current={isActive(href) ? "page" : undefined}
          onClick={() => setMenuOpen(false)}
          className={`
            flex min-h-11 items-center rounded-sm px-3 py-2
            text-sm font-semibold transition-colors
            hover:bg-[#f7b900]/10 hover:text-white
            ${focusClassName}
            ${mobile ? "w-full" : "justify-center"}
            ${
              isActive(href)
                ? "text-white underline decoration-[#f7b900] decoration-2 underline-offset-8"
                : "text-[#f7b900]"
            }
          `}
        >
          {label}
        </Link>
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

  return (
    <header
      className="border-y-2 border-[#f7b900] bg-[#001016] text-[#f7b900]"
      onKeyDown={handleEscape}
    >
      <nav aria-label="Hovedmeny" className="mx-auto max-w-7xl">
        <div className="grid min-h-24 grid-cols-[1fr_auto] items-center gap-2 px-4 py-3 sm:px-8 lg:grid-cols-[1fr_auto_1fr]">
          {/* Logo */}
          <div className="min-w-0 justify-self-start">
            <PokebuaLogo />
          </div>

          {/* Centered desktop navigation */}
          <div className="hidden items-center gap-5 lg:flex">
            <ul className="flex items-center gap-1">
              {renderNavigationLinks()}
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
            {accountLinks.map(({ href, label, Icon }) => (
              <Link
                key={href}
                href={href}
                aria-label={label}
                onClick={() => setMenuOpen(false)}
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
              onClick={() => setMenuOpen((open) => !open)}
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
          <ul className="space-y-2">{renderNavigationLinks(true)}</ul>

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
