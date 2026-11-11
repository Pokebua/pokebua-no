import Link from "next/link";
import { IoMailOutline, IoCallOutline } from "react-icons/io5";

export const metadata = {
  title: "Kontakt oss | Pokébua",
  description:
    "Kontakt Pokébua dersom du har spørsmål om produkter, bestillinger eller retur.",
};

const linkClassName =
  "rounded-sm underline underline-offset-4 hover:decoration-2 focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#001016]";

export default function ContactPage() {
  return (
    <div className="bg-[#FFF8E6] px-4 py-10 text-[#001016] sm:px-8 sm:py-16">
      <article
        aria-labelledby="contact-heading"
        className="mx-auto max-w-[68ch]"
      >
        <Link
          href="/"
          className={`inline-flex min-h-11 items-center text-sm font-semibold ${linkClassName}`}
        >
          Til forsiden
        </Link>

        <header className="mb-8 mt-5 border-b border-[#001016]/20 pb-6 sm:mb-10">
          <h1
            id="contact-heading"
            className="font-sans text-3xl font-bold leading-tight sm:text-4xl"
          >
            Kontakt oss
          </h1>

          <p className="mt-4 text-base leading-relaxed sm:text-lg">
            Har du spørsmål om et produkt, en bestilling eller retur? Ta kontakt
            med oss på e-post eller telefon.
          </p>
        </header>

        <section aria-labelledby="contact-email-heading">
          <h2
            id="contact-email-heading"
            className="font-sans text-xl font-bold sm:text-2xl"
          >
            Send oss en e-post
          </h2>

          <address className="mt-4 not-italic">
            <a
              href="mailto:mail@pokebua.no"
              className={`inline-flex min-h-11 max-w-full items-center gap-3 text-lg font-semibold ${linkClassName}`}
            >
              <IoMailOutline aria-hidden="true" className="size-6 shrink-0" />
              <span className="break-all">mail@pokebua.no</span>
            </a>
          </address>

          <p className="mt-4 text-base leading-relaxed">
            Gjelder henvendelsen en bestilling, oppgi gjerne ordrenummeret og en
            kort beskrivelse av hva du trenger hjelp med. Ikke send passord
            eller betalingskortopplysninger på e-post.
          </p>
        </section>

        <section
          aria-labelledby="contact-company-heading"
          className="mt-10 border-t border-[#001016]/20 pt-8"
        >
          <h2
            id="contact-company-heading"
            className="font-sans text-xl font-bold sm:text-2xl"
          >
            Kontakt- og firmaopplysninger
          </h2>

          <address className="mt-4 text-base not-italic leading-relaxed">
            <p className="font-semibold">Pokébua AS</p>
            <p className="mt-2">Org.nr. 935 401 151</p>

            <p className="mt-2">
              Døliringen 29
              <br />
              2050 Jessheim
            </p>

            <a
              href="tel:+4792617247"
              className={`mt-4 inline-flex min-h-11 items-center gap-3 text-lg font-semibold ${linkClassName}`}
            >
              <IoCallOutline aria-hidden="true" className="size-6 shrink-0" />
              <span>+47 926 17 247</span>
            </a>
          </address>
        </section>

        <section
          aria-labelledby="contact-help-heading"
          className="mt-10 border-t border-[#001016]/20 pt-8"
        >
          <h2
            id="contact-help-heading"
            className="font-sans text-xl font-bold sm:text-2xl"
          >
            Nyttig informasjon
          </h2>

          <ul className="mt-4 space-y-2">
            <li>
              <Link
                href="/policies/shipping-policy"
                className={`inline-flex min-h-11 items-center ${linkClassName}`}
              >
                Frakt og levering
              </Link>
            </li>

            <li>
              <Link
                href="/policies/refund-policy"
                className={`inline-flex min-h-11 items-center ${linkClassName}`}
              >
                Angrerett og retur
              </Link>
            </li>

            <li>
              <Link
                href="/policies/terms-of-service"
                className={`inline-flex min-h-11 items-center ${linkClassName}`}
              >
                Kjøpsvilkår
              </Link>
            </li>
          </ul>
        </section>
      </article>
    </div>
  );
}
