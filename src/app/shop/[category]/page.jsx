import React from 'react';
import Link from 'next/link';

// Mock Data - Replace this with your actual product data or database call later
const PRODUCTS = [
  { id: 1, name: 'Classic Gold Ring', category: 'rings', price: 250, metal: 'Yellow Gold', gemstone: 'None' },
  { id: 2, name: 'Diamond Solitaire', category: 'rings', price: 1200, metal: 'White Gold', gemstone: 'Diamond' },
  { id: 3, name: 'Silver Chain', category: 'necklaces', price: 80, metal: 'Sterling Silver', gemstone: 'None' },
  { id: 4, name: 'Pearl Earrings', category: 'earrings', price: 150, metal: 'Yellow Gold', gemstone: 'Pearl' },
  { id: 5, name: 'Platinum Band', category: 'rings', price: 600, metal: 'Platinum', gemstone: 'None' },
  { id: 6, name: 'Ruby Pendant', category: 'necklaces', price: 450, metal: 'Rose Gold', gemstone: 'Ruby' },
  { id: 7, name: 'Sapphire Studs', category: 'earrings', price: 300, metal: 'White Gold', gemstone: 'Sapphire' },
  { id: 8, name: 'Gold Bangle', category: 'bracelets', price: 500, metal: 'Yellow Gold', gemstone: 'None' },
];

export default async function ShopCategoryPage({ params, searchParams }) {
  // Await params and searchParams for Next.js 15 compatibility
  const { category } = await params;
  const filters = await searchParams;

  // Filter Logic
  const filteredProducts = PRODUCTS.filter((product) => {
    // 1. Filter by Category (from URL)
    // If category is 'all' or matches the product category
    if (category !== 'all' && product.category !== category) {
        return false;
    }

    // 2. Filter by Price (from Sidebar)
    if (filters.price) {
      const priceRanges = filters.price.split(',');
      const matchesPrice = priceRanges.some((range) => {
        if (range === 'Under $100') return product.price < 100;
        if (range === '$100 - $300') return product.price >= 100 && product.price <= 300;
        if (range === '$300 - $500') return product.price >= 300 && product.price <= 500;
        if (range === '$500 - $1000') return product.price >= 500 && product.price <= 1000;
        if (range === 'Over $1000') return product.price > 1000;
        return false;
      });
      if (!matchesPrice) return false;
    }

    // 3. Filter by Metal
    if (filters.metal) {
      const selectedMetals = filters.metal.split(',');
      if (!selectedMetals.includes(product.metal)) return false;
    }

    // 4. Filter by Gemstone
    if (filters.gemstone) {
      const selectedGemstones = filters.gemstone.split(',');
      if (!selectedGemstones.includes(product.gemstone)) return false;
    }

    return true;
  });

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-black text-[#2D3436] capitalize">{category} Collection</h1>
        <span className="text-gray-500">{filteredProducts.length} Products</span>
      </div>

      {filteredProducts.length === 0 ? (
        <div className="text-center py-12 bg-gray-50 rounded-xl border border-dashed border-gray-200">
          <p className="text-gray-500 mb-4">No products found matching your filters.</p>
          <Link href={`/shop/${category}`} className="text-[#7FD1B9] font-bold hover:underline">
            Clear Filters
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
          {filteredProducts.map((product) => (
            <Link href={`/product/${product.id}`} key={product.id} className="group block">
              <div className="bg-gray-50 h-80 rounded-xl mb-4 flex items-center justify-center text-gray-300 group-hover:shadow-lg transition duration-300 relative overflow-hidden border border-gray-100 bg-cover bg-center" style={{ backgroundImage: "url('/images/product1.jpg')" }}>
              <h3 className="font-bold text-[#2D3436] text-lg group-hover:text-[#7FD1B9] transition">{product.name}</h3>
              <div className="flex justify-between items-center mt-1">
                 <p className="text-gray-500 text-sm">{product.metal}</p>
                 <p className="text-[#7FD1B9] font-bold">${product.price}</p>
              </div>
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}