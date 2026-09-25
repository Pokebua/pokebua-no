import { notFound } from "next/navigation";
import ProductCard from "@/components/ProductCard";
import { productLists, getProductList } from "@/data/products";

export function generateStaticParams() {
  return productLists.map(({ id }) => ({
    category: id,
  }));
}

export default async function CategoryPage({ params }) {
  const { category: categoryId } = await params;

  const category = await getProductList(categoryId);

  if (!category) {
    notFound();
  }

  if (!category) {
    notFound();
  }

  return (
    <main className="min-h-screen bg-[#FFF8E6] px-4 py-12 sm:px-8">
      <section aria-labelledby="category-heading" className="mx-auto max-w-6xl">
        <h1
          id="category-heading"
          className="mb-8 text-3xl font-bold text-[#001016]"
        >
          {category.heading}
        </h1>

        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {category.products.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      </section>
    </main>
  );
}
