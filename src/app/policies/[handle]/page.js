import Link from "next/link";
import { notFound } from "next/navigation";
import { getShopPolicy } from "@/lib/shopify/policies";

export async function generateMetadata({ params }) {
  const { handle } = await params;
  const policy = await getShopPolicy(handle);

  return {
    title: policy ? `${policy.title} | Pokébua` : "Siden finnes ikke | Pokébua",
  };
}

export default async function PolicyPage({ params }) {
  const { handle } = await params;
  const policy = await getShopPolicy(handle);

  if (!policy) {
    notFound();
  }

  return (
    <div className="bg-[#FFF8E6] px-4 py-10 text-[#001016] sm:px-8 sm:py-16">
      <article
        aria-labelledby="policy-heading"
        className="mx-auto max-w-[68ch]"
      >
        <Link
          href="/"
          className="inline-flex min-h-11 items-center rounded-sm text-sm font-semibold underline underline-offset-4 hover:decoration-2 focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#001016]"
        >
          Til forsiden
        </Link>

        <header className="mb-8 mt-5 border-b border-[#001016]/20 pb-6 sm:mb-10">
          <h1
            id="policy-heading"
            className="wrap-break-word font-sans text-3xl font-bold leading-tight sm:text-4xl"
          >
            {policy.title}
          </h1>
        </header>

        <div
          className="policy-content"
          dangerouslySetInnerHTML={{
            __html: policy.bodyHtml,
          }}
        />

        <div className="mt-12 border-t border-[#001016]/20 pt-6">
          <Link
            href="#policy-heading"
            className="inline-flex min-h-11 items-center rounded-sm text-sm font-semibold underline underline-offset-4 hover:decoration-2 focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#001016]"
          >
            Til toppen
          </Link>
        </div>
      </article>
    </div>
  );
}
