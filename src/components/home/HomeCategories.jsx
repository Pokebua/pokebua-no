import Image from "next/image";
import Link from "next/link";

const homepageCategories = [
  {
    name: "Boosterpacks",
    handle: "booster-packs",
    image: "/images/boosterpakker.png",
  },
  {
    name: "ETB / Collection",
    handle: "etb",
    image: "/images/collectionboxetb.png",
  },
  {
    name: "Events",
    handle: "andre-produkter",
    image: "/images/event.png",
  },
  {
    name: "Gradering",
    handle: "cgc-gradering",
    image: "/images/gradering.png",
  },
  {
    name: "Engelsk",
    handle: null,
    image: "/images/engelsk.png",
  },
  {
    name: "Japansk",
    handle: null,
    image: "/images/japansk.png",
  },
  {
    name: "Kinesisk",
    handle: null,
    image: "/images/kinesisk.png",
  },
];

export default function HomeCategories({ collections }) {
  const collectionsByHandle = new Map(
    collections.map((collection) => [collection.handle, collection]),
  );

  return (
    <section aria-labelledby="categories-heading">
      <h2
        id="categories-heading"
        className="mb-4 text-center text-xl font-bold"
      >
        Kategorier
      </h2>

      <ul className="grid grid-cols-2 gap-3 sm:grid-cols-4 lg:grid-cols-7">
        {homepageCategories.map((category) => {
          const collection = collectionsByHandle.get(category.handle);

          const href = collection
            ? `/produkter/${encodeURIComponent(collection.handle)}`
            : "/produkter";

          return (
            <li key={category.name} className="min-w-0">
              <Link
                href={href}
                className="block h-full overflow-hidden rounded-lg border-2 border-[#f7b900] bg-white focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#001016]"
              >
                <div className="relative aspect-square">
                  <Image
                    src={category.image}
                    alt=""
                    fill
                    loading={category.name === "Gradering" ? "eager" : "lazy"}
                    sizes="(min-width: 1024px) 160px, (min-width: 640px) 23vw, 45vw"
                    className="object-contain"
                  />
                </div>

                <h3 className="flex min-h-11 items-center justify-center bg-[#001016] px-2 py-2 text-center text-xs font-bold text-[#f7b900]">
                  {category.name}
                </h3>

                {!collection && (
                  <span className="sr-only"> – viser alle produkter</span>
                )}
              </Link>
            </li>
          );
        })}
      </ul>
    </section>
  );
}
