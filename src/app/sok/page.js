import ProductCard from "@/components/ProductCard";
import { searchProducts } from "@/services/productSearch";

export const metadata = {
  title: "Søk | Pokébua",
  description: "Søk etter produkter hos Pokébua.",
};

export default async function SearchPage({ searchParams }) {
  const params = await searchParams;
  const query = typeof params.q === "string" ? params.q.trim() : "";

  const products = query ? await searchProducts(query) : [];

  return (
    <section
      aria-labelledby="search-heading"
      className="mx-auto max-w-7xl px-4 py-8 sm:px-8"
    >
      <h1 id="search-heading" className="text-3xl">
        {query ? `Søkeresultater for «${query}»` : "Søk etter produkter"}
      </h1>

      {!query ? (
        <p className="mt-4">
          Skriv inn et produktnavn i søket øverst på siden.
        </p>
      ) : (
        <>
          <p className="mt-3">
            {products.length}{" "}
            {products.length === 1 ? "produkt funnet" : "produkter funnet"}
          </p>

          {products.length > 0 && (
            <ul className="mt-6 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {products.map((product) => (
                <li key={product.id} className="min-w-0">
                  <ProductCard product={product} />
                </li>
              ))}
            </ul>
          )}
        </>
      )}
    </section>
  );
}
