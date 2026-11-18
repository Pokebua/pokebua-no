import Image from "next/image";
import Link from "next/link";
import { IoCubeOutline } from "react-icons/io5";

const categoryImageSizes =
  "(min-width: 1216px) 143px, (min-width: 1024px) calc((100vw - 216px) / 7), (min-width: 640px) calc(25vw - 42px), calc(50vw - 28px)";

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
    name: "Engelsk",
    collectionTitle: "Engelsk",
    image: "/images/engelsk.png",
  },
  {
    name: "Japansk",
    collectionTitle: "Japansk",
    image: "/images/japansk.png",
  },
  {
    name: "Kinesisk",
    collectionTitle: "Kinesisk",
    image: "/images/kinesisk.png",
  },
  {
    name: "Tilbehør",
    handle: "forhandsbestilling",
    image: "/images/GEMLOADER_og_bla_kortdisplay_med_sleeves.png",
  },
];

function normalizeTitle(title) {
  return title.trim().toLocaleLowerCase("nb-NO");
}

export default function HomeCategories({ collections }) {
  const collectionsByHandle = new Map(
    collections.map((collection) => [collection.handle, collection]),
  );

  const collectionsByTitle = new Map(
    collections.map((collection) => [
      normalizeTitle(collection.title),
      collection,
    ]),
  );

  return (
    <section aria-labelledby="categories-heading">
      <h2
        id="categories-heading"
        className="mb-6 text-center text-4xl leading-tight"
      >
        Kategorier
      </h2>

      <ul className="grid grid-cols-2 gap-3 sm:grid-cols-4 lg:grid-cols-7">
        {homepageCategories.map((category, index) => {
          const collection = category.collectionTitle
            ? collectionsByTitle.get(normalizeTitle(category.collectionTitle))
            : collectionsByHandle.get(category.handle);

          const image = category.image ?? collection?.image?.url;
          const href = collection
            ? `/produkter/${encodeURIComponent(collection.handle)}`
            : "/produkter";

          return (
            <li key={category.name} className="min-w-0">
              <Link
                href={href}
                className="flex h-full flex-col overflow-hidden rounded-lg border-2 border-[#f7b900] bg-white focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#001016]"
              >
                <div className="relative grid aspect-square shrink-0 place-items-center">
                  {image ? (
                    <Image
                      src={image}
                      alt=""
                      fill
                      sizes={categoryImageSizes}
                      loading={index < 2 ? "eager" : "lazy"}
                      fetchPriority={index === 0 ? "high" : undefined}
                      className="object-contain"
                    />
                  ) : (
                    <IoCubeOutline
                      aria-hidden="true"
                      className="size-12 text-[#001016]"
                    />
                  )}
                </div>

                <h3 className="flex min-h-14 flex-1 items-center justify-center bg-[#001016] px-2 py-3 text-center text-sm leading-snug text-[#f7b900] sm:text-base">
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
