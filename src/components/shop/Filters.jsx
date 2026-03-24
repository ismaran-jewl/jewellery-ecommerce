"use client";

import { motion } from "framer-motion";
import { Filter, X, ChevronDown } from "lucide-react";

export default function Filters({ 
    activeFilters, 
    categories, 
    types, 
    materials, 
    onToggle, 
    onClearAll,
    activeCount
}) {
    return (
        <div className="flex flex-col gap-4">
            {/* Header & Main Actions */}
            <div className="flex items-center justify-between gap-4">
                <div className="flex items-center gap-2">
                    <Filter size={18} className="text-[#B8860B]" />
                    <h2 className="text-lg font-bold text-gray-900" style={{ fontFamily: "var(--font-playfair)" }}>
                        Filters
                    </h2>
                </div>
                
                {activeCount > 0 && (
                    <button 
                        onClick={onClearAll}
                        className="text-[10px] font-bold uppercase tracking-widest text-red-500 hover:text-red-600 transition-colors"
                    >
                        Clear
                    </button>
                )}
            </div>

            {/* Filter Groups */}
            <div className="flex flex-col gap-6">
                <FilterGroup 
                    label="Jewellery Type" 
                    options={types} 
                    activeValues={activeFilters.type} 
                    onToggle={(val) => onToggle("type", val)} 
                />
                <FilterGroup 
                    label="Gender" 
                    options={["Women", "Men", "Unisex"]} 
                    activeValues={activeFilters.gender} 
                    onToggle={(val) => onToggle("gender", val)} 
                />
                <FilterGroup 
                    label="Category" 
                    options={categories} 
                    activeValues={activeFilters.category} 
                    onToggle={(val) => onToggle("category", val)} 
                />
                <FilterGroup 
                    label="Material" 
                    options={materials} 
                    activeValues={activeFilters.material} 
                    onToggle={(val) => onToggle("material", val)} 
                />
            </div>

            {/* Active Tags (Horizontal Scroll on Mobile) */}
            {activeCount > 0 && (
                <div className="flex flex-wrap gap-2 items-center pt-4 border-t border-gray-50">
                    <span className="text-[10px] font-bold uppercase tracking-widest text-gray-400 mr-2">Active:</span>
                    {Object.entries(activeFilters).map(([key, values]) => 
                        values.map(val => (
                            <button
                                key={`${key}-${val}`}
                                onClick={() => onToggle(key, val)}
                                className="flex items-center gap-1.5 px-3 py-1.5 bg-gray-50 hover:bg-gray-100 text-gray-700 rounded-full text-[11px] font-medium transition-colors border border-gray-100 group"
                            >
                                {val}
                                <X size={12} className="text-gray-400 group-hover:text-red-500 transition-colors" />
                            </button>
                        ))
                    )}
                </div>
            )}
        </div>
    );
}

function FilterGroup({ label, options, activeValues, onToggle }) {
    if (!options || options?.length === 0) return null;

    return (
        <div className="space-y-4">
            <span className="text-[10px] font-bold uppercase tracking-[0.2em] text-gray-400 flex items-center gap-2">
                {label}
                <div className="h-px flex-grow bg-gray-100" />
            </span>
            <div className="flex flex-wrap gap-2">
                {options.map(opt => {
                    const isActive = activeValues.some(v => v.toLowerCase() === opt.toLowerCase());
                    return (
                        <button
                            key={opt}
                            onClick={() => onToggle(opt)}
                            className={`px-4 py-2 rounded-xl text-xs font-semibold transition-all duration-300
                                ${isActive 
                                    ? "bg-black text-white shadow-lg shadow-black/10 scale-105" 
                                    : "bg-white text-gray-600 border border-gray-100 hover:border-gray-300 hover:bg-gray-50"}`}
                        >
                            {opt}
                        </button>
                    );
                })}
            </div>
        </div>
    );
}
