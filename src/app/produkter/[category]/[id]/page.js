import { notFound } from "next/navigation";
import ProductDetail from "@/components/ProductDetail";
import { productLists, getProductById } from "@/data/products";

export function generateStaticParams() {
  return productLists.flatMap((list) =>
    list.products.map((product) => ({
      category: list.id,
      id: String(product.id),
    })),
  );
}

export default async function ProductPage({ params }) {
  const { category, id } = await params;

  const product = await getProductById(id);

  if (!product || product.category !== category) {
    notFound();
  }

  return (
    <main className="min-h-screen bg-[#FFF8E6]">
      <ProductDetail product={product} />
    </main>
  );
}
