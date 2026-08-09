import Link from "next/link";
import { AiFillTikTok } from "react-icons/ai";
import { BsTwitch } from "react-icons/bs";
import PokebuaLogo from "./PokebuaLogo";

function SearchIcon() {
  return (
    <svg
      aria-hidden="true"
      viewBox="0 0 24 24"
      className="size-7"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <circle cx="10.5" cy="10.5" r="6.5" />
      <path d="m15.5 15.5 5 5" />
    </svg>
  );
}

function UserIcon() {
  return (
    <svg
      aria-hidden="true"
      viewBox="0 0 24 24"
      className="size-7"
      fill="currentColor"
    >
      <circle cx="12" cy="7" r="4" />
      <path d="M4 21c0-4.4 3.6-8 8-8s8 3.6 8 8H4Z" />
    </svg>
  );
}

function CartIcon() {
  return (
    <svg
      aria-hidden="true"
      viewBox="0 0 24 24"
      className="size-7"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M3 4h2l2.2 11h10.5l2.3-8H6" />
      <circle cx="9" cy="20" r="1" fill="currentColor" />
      <circle cx="18" cy="20" r="1" fill="currentColor" />
    </svg>
  );
}

export default function Navbar() {
  return (
    <header className="w-full">
      {/* Main navigation */}
      <nav
        aria-label="Main navigation"
        className="mx-auto border-y-2 border-[#f7b900] bg-[#001016]"
      >
        <div className="grid min-h-24 grid-cols-[auto_1fr_auto] items-center gap-x-3 gap-y-3 px-4 py-3 sm:px-8 md:py-0">
          {/*Pokebua Logo */}
          <PokebuaLogo />

          {/* Navigation links */}
          <ul className="col-span-3 row-start-2 flex items-center justify-center gap-4 md:col-span-1 md:col-start-2 md:row-start-1 md:gap-8">
            <li>
              <a
                href="https://www.twitch.tv/pokebua"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Visit Pokébua on Twitch"
                className="grid size-11 place-items-center rounded-full transition-transform hover:scale-110 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#f7b900]"
              >
                <BsTwitch className="size-9 text-pink-400" />
              </a>
            </li>

            <li>
              <Link
                href="/"
                className="rounded-sm px-2 py-2 text-sm font-semibold text-[#f7b900] transition-colors hover:text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#f7b900] sm:text-base"
              >
                Hjem
              </Link>
            </li>

            <li>
              <Link
                href="/produkter"
                className="rounded-sm px-2 py-2 text-sm font-semibold text-[#f7b900] transition-colors hover:text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#f7b900] sm:text-base"
              >
                Produkter
              </Link>
            </li>

            <li>
              <Link
                href="/event"
                className="rounded-sm px-2 py-2 text-sm font-semibold text-[#f7b900] transition-colors hover:text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#f7b900] sm:text-base"
              >
                Event
              </Link>
            </li>
            <li>
              <a
                href="https://www.tiktok.com/@pokebua.no"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Visit Pokébua on TikTok"
                className="grid size-11 place-items-center rounded-full transition-transform hover:scale-110 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#f7b900]"
              >
                <AiFillTikTok className="size-9 text-white" />
              </a>
            </li>
          </ul>

          {/* Account icons */}
          <div className="col-start-3 row-start-1 flex items-center gap-1 text-[#f7b900] sm:gap-2">
            <Link
              href="/sok"
              aria-label="Search"
              className="grid size-10 place-items-center rounded-full transition-colors hover:bg-[#f7b900]/10 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#f7b900] sm:size-11"
            >
              <SearchIcon />
            </Link>

            <Link
              href="/konto"
              aria-label="My account"
              className="grid size-10 place-items-center rounded-full transition-colors hover:bg-[#f7b900]/10 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#f7b900] sm:size-11"
            >
              <UserIcon />
            </Link>

            <Link
              href="/handlekurv"
              aria-label="Shopping cart"
              className="grid size-10 place-items-center rounded-full transition-colors hover:bg-[#f7b900]/10 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#f7b900] sm:size-11"
            >
              <CartIcon />
            </Link>
          </div>
        </div>
      </nav>
    </header>
  );
}
