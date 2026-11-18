import Pagination from "@/components/Pagination";
import ProductSort from "./ProductSort";
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
    <div className="min-h-screen bg-[#FFF8E6] px-2 py-12 sm:px-8">
      <section aria-labelledby="products-heading" className="mx-auto max-w-6xl">
        <div className="flex flex-col gap-4 sm:flex-row sm:flex-wrap sm:items-start sm:justify-between">
          <h1
            id="products-heading"
            className="text-3xl font-bold text-[#001016]"
          >
            {title}
          </h1>

          {sortOptions?.length > 0 && (
            <ProductSort
              basePath={basePath}
              sort={sort}
              options={sortOptions}
            />
          )}
        </div>

        {description && (
          <p className="mt-4 max-w-3xl whitespace-pre-line text-[#001016]">
            {description}
          </p>
        )}

        {nodes.length > 0 && (
          <ul className="mt-8 grid grid-cols-2 gap-2 sm:gap-6 lg:grid-cols-3">
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
