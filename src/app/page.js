import ProductCard from "../components/ProductCard";
import products from "../data/products";

export default function Home() {
  return (
    <main className="p-8">
      <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-4">
        {products.map((product) => (
          <ProductCard key={product.id} product={product} />
        ))}
      </div>
    </main>
  );
}
