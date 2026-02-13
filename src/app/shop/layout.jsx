import React from 'react';
import FilterSidebar from '../../components/FilterSidebar';

export default function ShopLayout({ children }) {
  return (
    <div className="max-w-7xl mx-auto px-6 py-8">
      <div className="flex flex-col md:flex-row gap-8">
        {/* Sidebar */}
        <aside className="w-full md:w-64 flex-shrink-0">
          <div className="sticky top-24">
            <FilterSidebar />
          </div>
        </aside>

        {/* Product Grid Area */}
        <main className="flex-1">
          {children}
        </main>
      </div>
    </div>
  );
}