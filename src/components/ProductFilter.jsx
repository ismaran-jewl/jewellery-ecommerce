// src/components/ProductFilter.jsx
"use client";

import { useState } from "react";

export default function ProductFilter({ products, onFilter }) {
  const [material, setMaterial] = useState("");
  const [maxPrice, setMaxPrice] = useState("");

  const handleFilter = () => {
    let filtered = products;

    if (material) {
      filtered = filtered.filter((p) => p.material === material);
    }

    if (maxPrice) {
      filtered = filtered.filter((p) => p.price <= parseInt(maxPrice));
    }

    onFilter(filtered);
  };

  return (
    <div className="p-4 border rounded-lg mb-6 space-y-4">
      <div>
        <label>Material:</label>
        <select
          value={material}
          onChange={(e) => setMaterial(e.target.value)}
          className="ml-2 border rounded px-2 py-1"
        >
          <option value="">All</option>
          <option value="gold">Gold</option>
          <option value="silver">Silver</option>
          <option value="diamond">Diamond</option>
          <option value="platinum">Platinum</option>
          <option value="pearl">Pearl</option>
          <option value="rose-gold">Rose Gold</option>
        </select>
      </div>
      <div>
        <label>Max Price:</label>
        <input
          type="number"
          value={maxPrice}
          onChange={(e) => setMaxPrice(e.target.value)}
          className="ml-2 border rounded px-2 py-1"
        />
      </div>
      <button
        onClick={handleFilter}
        className="bg-[#F8B8A6] text-white px-4 py-2 rounded-lg"
      >
        Apply Filter
      </button>
    </div>
  );
}
