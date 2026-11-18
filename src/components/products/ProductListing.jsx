import Pagination from "@/components/Pagination";
import ShopifyProductCard from "./ShopifyProductCard";

export default function ProductListing({
  title,
  description,
  products,
  basePath,
  currentPage,
  totalPages,
  sort,
  sortOptions,
}) {
  const { nodes } = products;
  const isOutOfRange = currentPage > Math.max(totalPages, 1);

  return (
    <div className="min-h-screen bg-[#FFF8E6] px-4 py-12 sm:px-8">
      <section aria-labelledby="products-heading" className="mx-auto max-w-6xl">
        <div className="flex flex-col gap-4 sm:flex-row sm:flex-wrap sm:items-start sm:justify-between">
          <h1
            id="products-heading"
            className="text-3xl font-bold text-[#001016]"
          >
            {title}
          </h1>

          {sortOptions?.length > 0 && (
            <form
              action={basePath}
              method="get"
              className="flex flex-wrap items-center gap-3 text-[#001016]"
            >
              <label htmlFor="product-sort" className="font-semibold">
                Sorter etter
              </label>

              <select
                key={sort}
                id="product-sort"
                name="sort"
                defaultValue={sort}
                className="min-h-11 rounded-lg border border-[#001016] bg-white px-3 focus-visible:outline-2 focus-visible:outline-offset-[-2px] focus-visible:outline-[#001016]"
              >
                {sortOptions.map(({ value, label }) => (
                  <option key={value} value={value}>
                    {label}
                  </option>
                ))}
              </select>

              <button
                type="submit"
                className="min-h-11 cursor-pointer rounded-lg bg-[#001016] px-4 font-semibold text-[#f7b900] hover:bg-gray-800 focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#001016]"
              >
                Sorter
              </button>
            </form>
          )}
        </div>

        {description && (
          <p className="mt-4 max-w-3xl whitespace-pre-line text-[#001016]">
            {description}
          </p>
        )}

        {nodes.length > 0 && (
          <ul className="mt-8 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {nodes.map((product) => (
              <li key={product.id} className="min-w-0">
                <ShopifyProductCard product={product} />
              </li>
            ))}
          </ul>
        )}

        {nodes.length === 0 && !isOutOfRange && (
          <p className="mt-8 text-[#001016]">Ingen produkter å vise.</p>
        )}

        <Pagination
          currentPage={currentPage}
          totalPages={totalPages}
          basePath={basePath}
          queryParams={{ sort }}
          label="Produktsider"
        />
      </section>
    </div>
  );
}
