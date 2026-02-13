// src/app/shop/[category]/[subcategory]/page.jsx
import React from 'react';
import Link from 'next/link';

export default async function ShopSubCategoryPage({ params }) {
  const { category, subcategory } = await params;

  return (
    <div className="max-w-7xl mx-auto px-6 py-12">
      {/* Breadcrumbs */}
      <div className="text-sm breadcrumbs text-gray-400 mb-6 capitalize">
        <Link href="/" className="hover:text-[#7FD1B9]">Home</Link> / 
        <Link href={`/shop/${category}`} className="hover:text-[#7FD1B9] mx-1">{category}</Link> / 
        <span className="text-[#2D3436] font-bold mx-1">{subcategory}</span>
      </div>

      <h1 className="text-4xl font-black text-[#2D3436] mb-4 capitalize">{subcategory}</h1>
      <p className="text-gray-600 mb-10">
        Browsing {subcategory} for {category === 'occasion' ? 'special moments' : category}.
      </p>

      {/* Product Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6">
        {[1, 2, 3, 4, 5, 6, 7, 8].map((item) => (
          <div key={item} className="group cursor-pointer">
            <div
              className="bg-gray-50 h-80 rounded-xl mb-3 flex items-end justify-center text-gray-300 group-hover:shadow-lg transition duration-300 bg-cover bg-center"
              style={{ backgroundImage: `url('/images/product1.jpg')` }}
            >
              {/* Optional overlay or info */}
            </div>
            <h3 className="font-bold text-[#2D3436]">{`Elegant ${subcategory.slice(0, -1)} ${item}`}</h3>
            <p className="text-[#7FD1B9] font-bold text-sm">$299.00</p>
          </div>
        ))}
      </div>
    </div>
  );
}
