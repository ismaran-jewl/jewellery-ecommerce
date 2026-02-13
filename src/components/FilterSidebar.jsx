'use client';

import React, { useState } from 'react';
import { ChevronDown, ChevronUp, Filter } from 'lucide-react';
import { useRouter, useSearchParams, usePathname } from 'next/navigation';

const FilterSection = ({ title, options, type = 'checkbox', selectedValues = [], onFilterChange }) => {
  const [isOpen, setIsOpen] = useState(true);

  return (
    <div className="border-b border-gray-100 py-4 last:border-0">
      <button 
        className="flex items-center justify-between w-full text-left mb-2 group"
        onClick={() => setIsOpen(!isOpen)}
      >
        <span className="font-bold text-[#2D3436] group-hover:text-[#7FD1B9] transition">{title}</span>
        {isOpen ? <ChevronUp size={16} className="text-gray-400" /> : <ChevronDown size={16} className="text-gray-400" />}
      </button>
      
      {isOpen && (
        <div className="space-y-2 mt-2">
          {options.map((option, idx) => {
            const isChecked = selectedValues.includes(option);
            return (
            <label key={idx} className="flex items-center gap-2 cursor-pointer group/item">
              <input 
                type={type} 
                name={title} 
                className="rounded border-gray-300 text-[#2D3436] focus:ring-[#7FD1B9]" 
                checked={isChecked}
                onChange={(e) => onFilterChange(title, option, e.target.checked)}
              />
              <span className={`text-sm group-hover/item:text-[#7FD1B9] transition ${isChecked ? 'text-[#2D3436] font-medium' : 'text-gray-600'}`}>{option}</span>
            </label>
          )})}
        </div>
      )}
    </div>
  );
};

export default function FilterSidebar() {
  const [mobileFiltersOpen, setMobileFiltersOpen] = useState(false);
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  // Helper to get selected values from URL
  const getSelectedValues = (key) => {
    const params = searchParams.get(key);
    return params ? params.split(',') : [];
  };

  // Handle filter changes
  const handleFilterChange = (sectionTitle, option, isChecked) => {
    // Map titles to URL param keys
    const keyMap = {
      "Price Range": "price",
      "Metal Type": "metal",
      "Gemstone": "gemstone",
      "Style": "style",
      "Occasion": "occasion",
      "Availability": "availability"
    };
    
    const key = keyMap[sectionTitle] || sectionTitle.toLowerCase();
    const current = new URLSearchParams(Array.from(searchParams.entries()));
    const currentValues = current.get(key) ? current.get(key).split(',') : [];

    let newValues;
    if (isChecked) {
      newValues = [...currentValues, option];
    } else {
      newValues = currentValues.filter(v => v !== option);
    }

    if (newValues.length > 0) {
      current.set(key, newValues.join(','));
    } else {
      current.delete(key);
    }

    const search = current.toString();
    const query = search ? `?${search}` : "";

    router.push(`${pathname}${query}`, { scroll: false });
  };

  return (
    <div className="bg-white p-4 rounded-xl border border-gray-100 shadow-sm">
      {/* Mobile Filter Toggle */}
      <button 
        className="md:hidden flex items-center gap-2 font-bold text-[#2D3436] w-full mb-2"
        onClick={() => setMobileFiltersOpen(!mobileFiltersOpen)}
      >
        <Filter size={20} />
        {mobileFiltersOpen ? 'Hide Filters' : 'Show Filters'}
      </button>

      <div className={`${mobileFiltersOpen ? 'block' : 'hidden'} md:block`}>
        <div className="flex items-center justify-between mb-4 border-b border-gray-100 pb-2">
            <h2 className="text-lg font-black text-[#2D3436] hidden md:block">Filters</h2>
            {searchParams.toString() && (
                <button 
                    onClick={() => router.push(pathname, { scroll: false })}
                    className="text-xs text-red-500 hover:underline hidden md:block"
                >
                    Clear All
                </button>
            )}
        </div>
        
        <FilterSection 
            title="Price Range" 
            options={['Under $100', '$100 - $300', '$300 - $500', '$500 - $1000', 'Over $1000']} 
            selectedValues={getSelectedValues('price')}
            onFilterChange={handleFilterChange}
        />
        
        <FilterSection 
            title="Metal Type" 
            options={['Yellow Gold', 'White Gold', 'Rose Gold', 'Platinum', 'Sterling Silver']} 
            selectedValues={getSelectedValues('metal')}
            onFilterChange={handleFilterChange}
        />
        
        <FilterSection 
            title="Gemstone" 
            options={['Diamond', 'Sapphire', 'Ruby', 'Emerald', 'Pearl', 'None']} 
            selectedValues={getSelectedValues('gemstone')}
            onFilterChange={handleFilterChange}
        />
        
        <FilterSection 
            title="Style" 
            options={['Modern', 'Vintage', 'Classic', 'Bohemian', 'Minimalist']} 
            selectedValues={getSelectedValues('style')}
            onFilterChange={handleFilterChange}
        />

        <FilterSection 
            title="Occasion" 
            options={['Wedding', 'Engagement', 'Anniversary', 'Birthday', 'Just Because']} 
            selectedValues={getSelectedValues('occasion')}
            onFilterChange={handleFilterChange}
        />
        
        <FilterSection 
            title="Availability" 
            options={['In Stock', 'Pre-order']} 
            selectedValues={getSelectedValues('availability')}
            onFilterChange={handleFilterChange}
        />
      </div>
    </div>
  );
}