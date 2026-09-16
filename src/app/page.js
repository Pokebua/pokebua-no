import Image from "next/image";
import { categories } from "@/data/categories";

const news = [
  "Produkt 1",
  "Produkt 2",
  "Produkt 3",
  "Produkt 4",
  "Produkt 5",
  "Produkt 6",
  "Produkt 7",
  "Produkt 8",
];

export default function Home() {
  return (
    <main className="min-h-screen bg-white px-4 pb-16 pt-16 text-[#001016] sm:px-8 md:pt-64">
      <h1 className="sr-only">Pokébua – Pokémonkort og samleprodukter</h1>

      <div className="mx-auto max-w-6xl rounded-xl border-2 border-[#f7b900] bg-[#fff8e7] p-4 sm:p-6">
        {/* Categories */}
        <section aria-labelledby="categories-heading">
          <h2
            id="categories-heading"
            className="mb-4 text-center text-xl font-bold"
          >
            Kategorier
          </h2>

          <div className="grid grid-cols-2 gap-3 sm:grid-cols-4 lg:grid-cols-7">
            {categories.map((category) => (
              <article
                key={category.name}
                className="overflow-hidden rounded-lg border-2 border-[#f7b900] bg-white"
              >
                <div className="relative aspect-square">
                  <Image
                    src={category.image}
                    alt=""
                    fill
                    loading={
                      category.image === "/images/gradering.png"
                        ? "eager"
                        : "lazy"
                    }
                    sizes="(min-width: 1024px) 160px, (min-width: 640px) 23vw, 45vw"
                    className="object-contain"
                  />
                </div>

                <h3 className="flex min-h-11 items-center justify-center bg-[#001016] px-2 py-2 text-center text-xs font-bold text-[#f7b900]">
                  {category.name}
                </h3>
              </article>
            ))}
          </div>
        </section>

        {/* New products */}
        <section
          aria-labelledby="news-heading"
          className="mt-6 border-t-2 border-[#f7b900] pt-6"
        >
          <h2 id="news-heading" className="mb-4 text-center text-xl font-bold">
            Nyheter
          </h2>

          <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-4">
            {news.map((product) => (
              <article
                key={product}
                className="flex aspect-square items-center justify-center rounded-xl border-2 border-[#f7b900] bg-white p-4"
              >
                <h3 className="text-sm font-medium text-gray-600">{product}</h3>
              </article>
            ))}
          </div>
        </section>

        {/* Bottom spacing and decorative border */}
        <div
          aria-hidden="true"
          className="mt-8 h-24 border-t-2 border-[#f7b900]"
        />
      </div>
    </main>
  );
}
