import Link from "next/link";
import ShopifyProductCard from "./ShopifyProductCard";

const paginationClassName =
  "inline-flex min-h-11 items-center justify-center rounded-lg border-2 border-yellow-400 bg-[#001016] px-5 py-3 font-semibold text-white hover:bg-gray-800 focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#001016]";

export default function ProductListing({
  title,
  description,
  products,
  basePath,
  hasCursor,
}) {
  const { nodes, pageInfo } = products;

  const nextHref =
    pageInfo.hasNextPage && pageInfo.endCursor
      ? `${basePath}?${new URLSearchParams({
          after: pageInfo.endCursor,
        }).toString()}`
      : null;

  return (
    <div className="min-h-screen bg-[#FFF8E6] px-4 py-12 sm:px-8">
      <section aria-labelledby="products-heading" className="mx-auto max-w-6xl">
        <h1 id="products-heading" className="text-3xl font-bold text-[#001016]">
          {title}
        </h1>

        {description && (
          <p className="mt-4 max-w-3xl whitespace-pre-line text-[#001016]">
            {description}
          </p>
        )}

        {nodes.length > 0 ? (
          <ul className="mt-8 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {nodes.map((product) => (
              <li key={product.id} className="min-w-0">
                <ShopifyProductCard product={product} />
              </li>
            ))}
          </ul>
        ) : (
          <p className="mt-8 text-[#001016]">Ingen produkter å vise.</p>
        )}

        {(hasCursor || nextHref) && (
          <nav
            aria-label="Produktsider"
            className="mt-8 flex flex-wrap justify-center gap-4"
          >
            {hasCursor && (
              <Link href={basePath} className={paginationClassName}>
                Første side
              </Link>
            )}

            {nextHref && (
              <Link href={nextHref} rel="next" className={paginationClassName}>
                Neste side
              </Link>
            )}
          </nav>
        )}
      </section>
    </div>
  );
}
