import { getAllCollections } from "@/lib/shopify/collections";
import { getNewestProducts } from "@/lib/shopify/products";
import HomeCategories from "@/components/home/HomeCategories";
import ShopifyProductCard from "@/components/products/ShopifyProductCard";

export default async function Home() {
  const [collections, newestProducts] = await Promise.all([
    getAllCollections(),
    getNewestProducts({ first: 8 }),
  ]);

  return (
    <div className="min-h-screen bg-white px-4 pb-16 pt-16 text-[#001016] sm:px-8 md:pt-64">
      <h1 className="sr-only">Pokébua – Pokémonkort og samleprodukter</h1>

      <div className="mx-auto max-w-6xl rounded-xl border-2 border-[#f7b900] bg-[#fff8e7] p-4 sm:p-6">
        <HomeCategories collections={collections} />

        <section
          aria-labelledby="news-heading"
          className="mt-6 border-t-2 border-[#f7b900] pt-6"
        >
          <h2 id="news-heading" className="mb-4 text-center text-xl font-bold">
            Nyheter
          </h2>

          {newestProducts.length > 0 ? (
            <ul className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-4">
              {newestProducts.map((product) => (
                <li key={product.id} className="min-w-0">
                  <ShopifyProductCard product={product} headingAs="h3" />
                </li>
              ))}
            </ul>
          ) : (
            <p className="text-center">Ingen produkter å vise akkurat nå.</p>
          )}
        </section>

        <div
          aria-hidden="true"
          className="mt-8 h-24 border-t-2 border-[#f7b900]"
        />
      </div>
    </div>
  );
}
