import Image from "next/image";

import navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

const categories = [
  {
    name: "Boosterpacks",
    image: "/images/boosterpacks.jpg",
  },
  {
    name: "ETB / Collection",
    image: "/images/etb.jpg",
  },
  {
    name: "Events",
    image: "/images/events.jpg",
  },
  {
    name: "Gradering",
    image: "/images/gradering.jpg",
  },
  {
    name: "Engelsk",
    image: "/images/engelsk.jpg",
  },
  {
    name: "Japansk",
    image: "/images/japansk.jpg",
  },
  {
    name: "Kinesisk",
    image: "/images/kinesisk.jpg",
  },
];

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
    <main className="min-h-screen bg-white">
      {/* Tomt område øverst */}
      <section className="h-64" />

      {/* Hovedboks */}
      <section className="mx-auto w-[90%] max-w-6xl rounded-xl border-2 border-[#f7b900] bg-[#fff8e7] p-4">
        {/* Kategori */}
        <h2 className="mb-4 text-center text-xl font-bold">Kategori</h2>

        <div className="grid grid-cols-2 gap-3 sm:grid-cols-4 lg:grid-cols-7">
          {categories.map((category) => (
            <article
              key={category.name}
              className="overflow-hidden rounded-lg border-2 border-[#f7b900] bg-white"
            >
              <div className="relative aspect-square">
                <Image
                  src={category.image}
                  alt={category.name}
                  fill
                  className="object-cover"
                />
              </div>

              <p className="bg-black px-2 py-1 text-center text-xs font-bold text-white">
                {category.name}
              </p>
            </article>
          ))}
        </div>

        {/* Linje mellom kategori og nyheter */}
        <div className="my-4 border-t-2 border-[#f7b900]" />

        {/* Nyheter */}
        <h2 className="mb-2 text-center text-xl font-bold">Nyheter</h2>

        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-4">
          {news.map((product) => (
            <article
              key={product}
              className="aspect-square rounded-xl border-2 border-[#f7b900] bg-white"
            >
              <div className="flex h-full items-center justify-center">
                <p className="text-sm text-gray-400">{product}</p>
              </div>
            </article>
          ))}
        </div>

        {/* Nederste linje */}
        <div className="mt-8 border-t-2 border-[#f7b900]" />

        {/* Tom plass nederst */}
        <div className="h-24" />
      </section>

      <div className="h-16" />
    </main>
  );
}
