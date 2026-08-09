import Link from "next/link";
import { legalLinks } from "@/data/legalLinks";

export default function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer>
      {/* Heading */}
      <h2>Følg oss på</h2>

      {/* Social media and information */}
      <div className="mt-8 grid gap-10 text-center md:grid-cols-3 md:items-center">
        {/* Twitch */}
        <section aria-labelledby="twitch-heading">
          <h3 id="twitch-heading" className="text-lg font-bold sm:text-xl">
            Twitch
          </h3>

          <a
            href="https://www.twitch.tv/pokebua"
            target="_blank"
            rel="noopener noreferrer"
            className="mt-2 inline-block rounded-sm font-semibold underline decoration-2 underline-offset-4 transition-colors hover:text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#f7b900]"
          >
            twitch.tv/pokebua
          </a>
        </section>

        {/* Text in the middle */}
        <section aria-labelledby="about-heading">
          <h3 id="about-heading" className="sr-only">
            Om Pokébua
          </h3>

          <p className="mx-auto max-w-xs text-lg font-bold leading-relaxed">
            Hos Pokébua sprer vi glede og topphits!
          </p>
        </section>

        {/* TikTok */}
        <section aria-labelledby="tiktok-heading">
          <h3 id="tiktok-heading" className="text-lg font-bold sm:text-xl">
            TikTok
          </h3>

          <a
            href="https://www.tiktok.com/@pokebua.no"
            target="_blank"
            rel="noopener noreferrer"
            className="mt-2 inline-block rounded-sm font-semibold underline decoration-2 underline-offset-4 transition-colors hover:text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#f7b900]"
          >
            tiktok.com/@pokebua.no
          </a>
        </section>
      </div>

      {/* Divider */}
      <div className="my-8 border-t border-[#f7b900]/40" />

      {/* Legal links */}
      <nav aria-label="Juridisk informasjon">
        <ul className="flex flex-wrap justify-center gap-x-6 gap-y-3 text-sm font-semibold">
          {legalLinks.map((link) => (
            <li key={link.href}>
              <Link
                href={link.href}
                className="rounded-sm transition-colors hover:text-white hover:underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#f7b900]"
              >
                {link.label}
              </Link>
            </li>
          ))}
        </ul>
      </nav>

      {/* Company information */}
      <address className="mt-8 text-center text-sm not-italic leading-7 text-white/80">
        <p>Pokébua AS · Org.nr. XXX XXX XXX</p>

        <p>Gateadresse 1 · 6000 Ålesund</p>

        <p>
          <a
            href="mailto:kontakt@pokebua.no"
            className="rounded-sm hover:text-[#f7b900] hover:underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#f7b900]"
          >
            kontakt@pokebua.no
          </a>

          <span aria-hidden="true"> · </span>

          <a
            href="tel:+4712345678"
            className="rounded-sm hover:text-[#f7b900] hover:underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#f7b900]"
          >
            +47 12 34 56 78
          </a>
        </p>
      </address>

      {/* Copyright */}
      <p className="mt-6 text-center text-xs text-white/60">
        © {currentYear} Pokébua. Alle rettigheter reservert.
      </p>
    </footer>
  );
}
