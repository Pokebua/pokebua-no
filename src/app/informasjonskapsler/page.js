import Link from "next/link";

export const metadata = {
  title: "Informasjonskapsler | Pokébua",
  description:
    "Informasjon om informasjonskapsler brukt i Pokébua sin handlekurv.",
};

const linkClassName =
  "rounded-sm underline underline-offset-4 hover:decoration-2 focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#001016]";

export default function CookiesPage() {
  return (
    <div className="bg-[#FFF8E6] px-4 py-10 text-[#001016] sm:px-8 sm:py-16">
      <article
        aria-labelledby="cookies-heading"
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
            id="cookies-heading"
            className="font-sans text-3xl font-bold leading-tight sm:text-4xl"
          >
            Informasjonskapsler
          </h1>
        </header>

        <div className="policy-content">
          <p>
            Informasjonskapsler er små tekstfiler som lagres i nettleseren din.
            På denne nettsiden bruker vi en informasjonskapsel for å huske
            hvilken handlekurv som tilhører nettleseren din.
          </p>

          <h2>Handlekurven din</h2>

          <p>
            Når en handlekurv opprettes, lagrer vi en referanse til den i
            nettleseren. Det gjør at vi kan hente handlekurven fra Shopify når
            du laster siden på nytt eller kommer tilbake senere.
          </p>

          <dl className="my-6 space-y-5 rounded-xl border border-[#001016]/20 p-5">
            <div>
              <dt className="font-semibold">Navn</dt>
              <dd className="mt-1 break-all font-mono text-sm">
                pokebua-shopify-cart
              </dd>
            </div>

            <div>
              <dt className="font-semibold">Formål</dt>
              <dd className="mt-1">
                Knytte nettleseren til handlekurven din hos Shopify.
              </dd>
            </div>

            <div>
              <dt className="font-semibold">Innhold</dt>
              <dd className="mt-1">
                En handlekurvreferanse. Selve produktlisten lagres hos Shopify.
              </dd>
            </div>

            <div>
              <dt className="font-semibold">Lagringstid</dt>
              <dd className="mt-1">
                Inntil 14 dager fra informasjonskapselen sist ble lagret.
                Perioden fornyes når nettsiden lagrer handlekurvreferansen på
                nytt, blant annet ved endringer i handlekurven.
              </dd>
            </div>
          </dl>

          <h2>Hvis du sletter eller blokkerer informasjonskapsler</h2>

          <p>
            Du kan slette eller blokkere informasjonskapsler i innstillingene
            til nettleseren din. Hvis du sletter handlekurvens
            informasjonskapsel, mister denne nettleseren koblingen til den
            lagrede handlekurven. Hvis du blokkerer den, kan handlekurv og
            checkout slutte å fungere som forventet.
          </p>

          <h2>Shopify-kassen og kundekontoen</h2>

          <p>
            Når du går til kassen eller åpner kundekontoen din, bruker du sider
            som driftes av Shopify. Disse sidene kan bruke egne
            informasjonskapsler for blant annet innlogging og gjennomføring av
            kjøpet.
          </p>

          <h2>Personvern</h2>

          <p>
            Les mer om behandling av personopplysninger i vår{" "}
            <Link href="/policies/privacy-policy" className={linkClassName}>
              personvernerklæring
            </Link>
            .
          </p>
        </div>
      </article>
    </div>
  );
}
