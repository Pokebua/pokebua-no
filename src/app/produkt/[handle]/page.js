import { notFound } from "next/navigation";
import { getProductWithAllVariants } from "@/lib/shopify/products";
import ShopifyProductDetail from "@/components/products/ShopifyProductDetail";

export default async function ProductPage({ params }) {
  const { handle } = await params;

  const product = await getProductWithAllVariants(handle);

  if (!product) {
    notFound();
  }

  return (
    <div className="min-h-screen bg-[#FFF8E6]">
      <ShopifyProductDetail key={product.id} product={product} />
    </div>
  );
}
