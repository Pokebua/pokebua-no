import ProductCard from "./components/ProductCard";
import products from "./data/products";

export default function Home() {
  return (
    <main className="p-8">
      <div className="grid grid-cols-2 gap-8 md:grid-cols-3 lg:grid-cols-4">
        {products.map((product) => (
          <ProductCard key={product.id} product={product} />
        ))}
      </div>
    </main>
  );
}
