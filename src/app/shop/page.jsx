import FilterSidebar from "@/components/shop/FilterSidebar";
import ProductCard from "@/components/shop/ProductCard";

const products = [
  {
    id: 1,
    name: "Royal Gold Necklace",
    price: "₹24,999",
    image: "/images/product1.jpg",
  },
  {
    id: 2,
    name: "Diamond Ring",
    price: "₹14,999",
    image: "/images/product2.jpg",
  },
];

export default function ShopPage() {
  return (
    <div className="flex">
      <FilterSidebar />

      <div className="flex-1 p-8 grid grid-cols-1 md:grid-cols-3 gap-6">
        {products.map((product) => (
          <ProductCard key={product.id} product={product} />
        ))}
      </div>
    </div>
  );
}
