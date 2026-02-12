"use client";

import { useSearchParams } from "next/navigation";
import { useMemo } from "react";

const products = [
  { id: 1, name: "Solitaire Diamond Ring", category: "Diamond", price: "2,450" },
  { id: 2, name: "Gold Bridal Necklace", category: "Gold", price: "4,999" },
  { id: 3, name: "Silver Charm Bracelet", category: "Silver", price: "1,999" },
];

export default function SearchContent() {
  const searchParams = useSearchParams();
  const query = searchParams.get("q")?.toLowerCase() || "";

  const filteredProducts = useMemo(() => {
    return products.filter(
      (product) =>
        product.name.toLowerCase().includes(query) ||
        product.category.toLowerCase().includes(query)
    );
  }, [query]);

  return (
    <div className="p-10">
      <h1 className="text-2xl font-bold mb-6">
        Search Results for "{query}"
      </h1>

      {filteredProducts.length === 0 ? (
        <p>No products found.</p>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {filteredProducts.map((product) => (
            <div key={product.id} className="border p-4 rounded-lg">
              <h2 className="font-semibold">{product.name}</h2>
              <p>{product.category}</p>
              <p className="font-bold">₹{product.price}</p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
