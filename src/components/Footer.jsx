import Link from "next/link";
import { AiFillTikTok } from "react-icons/ai";
import { BsTwitch } from "react-icons/bs";
import { legalLinks } from "@/data/legalLinks";
import PokebuaLogo from "./PokebuaLogo";

export default function Footer() {
  const currentYear = new Date().getFullYear();

  const linkClassName =
    "inline-flex min-h-11 items-center rounded-sm text-sm transition-colors hover:text-[#f7b900] hover:underline underline-offset-4 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#f7b900] focus-visible:ring-offset-4 focus-visible:ring-offset-[#001016]";

  return (
    <footer className="border-t-2 border-[#f7b900] bg-[#001016] text-white">
      <div className="mx-auto max-w-7xl px-4 pb-6 pt-12 sm:px-8 lg:pt-16">
        {/* Brand, social media and contact */}
        <div className="grid gap-10 md:grid-cols-3 md:gap-8">
          {/* Brand */}
          <div className="flex flex-col items-start gap-5">
            <PokebuaLogo />

            <p className="max-w-xs text-lg font-semibold leading-relaxed text-[#f7b900]">
              Hos Pokébua sprer vi glede og topphits!
            </p>
          </div>

          {/* Social media */}
          <section aria-labelledby="footer-social-heading">
            <h2
              id="footer-social-heading"
              className="text-lg font-bold text-[#f7b900]"
            >
              Følg oss på
            </h2>

            <ul className="mt-4 space-y-2">
              <li>
                <a
                  href="https://www.twitch.tv/pokebua"
                  target="_blank"
                  rel="noopener noreferrer"
                  className={`${linkClassName} gap-3`}
                >
                  <BsTwitch
                    aria-hidden="true"
                    className="size-6 shrink-0 text-pink-400"
                  />
                  <span>Twitch</span>
                  <span className="sr-only">(åpnes i en ny fane)</span>
                </a>
              </li>

              <li>
                <a
                  href="https://www.tiktok.com/@pokebua.no"
                  target="_blank"
                  rel="noopener noreferrer"
                  className={`${linkClassName} gap-3`}
                >
                  <AiFillTikTok
                    aria-hidden="true"
                    className="size-6 shrink-0 text-white"
                  />
                  <span>TikTok</span>
                  <span className="sr-only">(åpnes i en ny fane)</span>
                </a>
              </li>
            </ul>
          </section>

          {/* Company information */}
          <section aria-labelledby="footer-contact-heading">
            <h2
              id="footer-contact-heading"
              className="text-lg font-bold text-[#f7b900]"
            >
              Kontakt oss
            </h2>

            <address className="mt-4 text-sm not-italic leading-7 text-white/80">
              <p className="font-semibold text-white">Pokébua AS</p>
              <p>Org.nr. XXX XXX XXX</p>
              <p>Gateadresse 1 · 6000 Ålesund</p>

              <div className="mt-3 flex flex-col items-start">
                <a
                  href="mailto:kontakt@pokebua.no"
                  className={`${linkClassName} break-all`}
                >
                  kontakt@pokebua.no
                </a>

                <a href="tel:+4712345678" className={linkClassName}>
                  +47 12 34 56 78
                </a>
              </div>
            </address>
          </section>
        </div>

        {/* Legal information */}
        <div className="mt-10 border-t border-[#f7b900]/25 pt-5 lg:mt-12">
          <nav aria-label="Juridisk informasjon">
            <ul className="flex flex-wrap gap-x-6 gap-y-1">
              {legalLinks.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className={`${linkClassName} text-white/80`}
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>

          <p className="mt-5 text-xs leading-relaxed text-white/60">
            © {currentYear} Pokébua. Alle rettigheter reservert.
          </p>
        </div>
      </div>
    </footer>
  );
}
