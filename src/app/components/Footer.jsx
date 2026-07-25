import Link from "next/link";

const legalLinks = [
  {
    href: "/kjopsvilkar",
    label: "Kjøpsvilkår",
  },
  {
    href: "/personvern",
    label: "Personvern",
  },
  {
    href: "/informasjonskapsler",
    label: "Informasjonskapsler",
  },
  {
    href: "/angrerett",
    label: "Angrerett",
  },
  {
    href: "/frakt-og-retur",
    label: "Frakt og retur",
  },
  {
    href: "/kontakt",
    label: "Kontakt oss",
  },
];

export default function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="mt-auto border-t-2 border-[#f7b900] bg-black text-[#f7b900]">
      <div className="mx-auto max-w-7xl px-4 py-10 sm:px-8">
        {/* Overskrift */}
        <h2 className="text-center text-xl font-bold sm:text-2xl">
          Følg oss på
        </h2>

        {/* Sosiale medier og informasjon */}
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

          {/* Tekst i midten */}
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

        {/* Skillelinje */}
        <div className="my-8 border-t border-[#f7b900]/40" />

        {/* Juridiske lenker */}
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

        {/* Bedriftsinformasjon */}
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
      </div>
    </footer>
  );
}
