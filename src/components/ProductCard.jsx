// src/components/ProductCard.jsx
"use client";

export default function ProductCard({ product }) {
  return (
    <div className="border rounded-lg p-4 flex flex-col items-center">
      <img src={product.image} alt={product.name} className="w-full h-48 object-cover rounded-lg mb-4" />
      <h2 className="font-semibold">{product.name}</h2>
      <p className="text-[#F8B8A6] font-bold">₹{product.price}</p>
    </div>
  );
}
