import { notFound } from "next/navigation";
import ProductDetail from "../../../components/ProductDetail";
import products from "../../../data/products";

export function generateStaticParams() {
  return products.map((product) => ({
    id: String(product.id),
  }));
}

export default async function ProductPage({ params }) {
  const { id } = await params;

  const product = products.find((product) => product.id === Number(id));

  if (!product) {
    notFound();
  }

  return (
    <main>
      <ProductDetail product={product} />
    </main>
  );
}
