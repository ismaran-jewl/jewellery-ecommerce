"use client";

import { useState } from "react";
import { useParams } from "next/navigation";
import { products } from "@/data/products";
import ProductCard from "@/components/ProductCard";
import ProductFilter from "@/components/ProductFilter";

export default function OccasionPage() {
  const params = useParams();
  const occasion = params.occasion;

  const occasionProducts = products.filter(p => p.category === occasion);
  const [filteredProducts, setFilteredProducts] = useState(occasionProducts);

  return (
    <div className="max-w-7xl mx-auto px-6 py-10">
      <h1 className="text-3xl font-bold mb-6">{occasion.toUpperCase()}</h1>

      <ProductFilter products={occasionProducts} onFilter={setFilteredProducts} />

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
        {filteredProducts.map(product => (
          <ProductCard key={product.id} product={product} />
        ))}
      </div>
    </div>
  );
}
