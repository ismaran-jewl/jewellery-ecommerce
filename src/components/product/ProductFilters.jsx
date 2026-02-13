"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";

export default function ProductFilters({ availableFilters, onFilterChange, onClearFilters }) {
  const [expandedSections, setExpandedSections] = useState({
    category: true,
    type: true,
    material: false,
  });

  const toggleSection = (section) => {
    setExpandedSections((prev) => ({
      ...prev,
      [section]: !prev[section],
    }));
  };

  return (
    <aside className="w-full md:w-64 bg-white rounded-xl border p-6 shadow-sm h-fit sticky top-20">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-semibold text-[#2d1a10]">Filters</h2>
        <Button size="sm" variant="ghost" onClick={onClearFilters}>
          Clear All
        </Button>
      </div>

      {/* Category Filter */}
      <div className="mb-6">
        <button
          onClick={() => toggleSection("category")}
          className="w-full text-left font-semibold text-[#5c4632] py-2 flex justify-between items-center"
        >
          Category
          <span>{expandedSections.category ? "−" : "+"}</span>
        </button>
        {expandedSections.category && (
          <div className="space-y-2 ml-2">
            {availableFilters.category.map((cat) => (
              <label key={cat} className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  onChange={(e) => onFilterChange("category", cat, e.target.checked)}
                  className="rounded"
                />
                <span className="text-[#7c6a58] capitalize">{cat}</span>
              </label>
            ))}
          </div>
        )}
      </div>

      {/* Type Filter */}
      <div className="mb-6">
        <button
          onClick={() => toggleSection("type")}
          className="w-full text-left font-semibold text-[#5c4632] py-2 flex justify-between items-center"
        >
          Type
          <span>{expandedSections.type ? "−" : "+"}</span>
        </button>
        {expandedSections.type && (
          <div className="space-y-2 ml-2">
            {availableFilters.type.map((type) => (
              <label key={type} className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  onChange={(e) => onFilterChange("type", type, e.target.checked)}
                  className="rounded"
                />
                <span className="text-[#7c6a58] capitalize">{type}</span>
              </label>
            ))}
          </div>
        )}
      </div>

      {/* Material Filter */}
      <div className="mb-6">
        <button
          onClick={() => toggleSection("material")}
          className="w-full text-left font-semibold text-[#5c4632] py-2 flex justify-between items-center"
        >
          Material
          <span>{expandedSections.material ? "−" : "+"}</span>
        </button>
        {expandedSections.material && (
          <div className="space-y-2 ml-2">
            {availableFilters.material.map((mat) => (
              <label key={mat} className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  onChange={(e) => onFilterChange("material", mat, e.target.checked)}
                  className="rounded"
                />
                <span className="text-[#7c6a58] capitalize">{mat}</span>
              </label>
            ))}
          </div>
        )}
      </div>
    </aside>
  );
}
