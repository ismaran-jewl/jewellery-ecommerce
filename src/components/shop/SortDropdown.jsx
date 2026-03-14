"use client";

import { useState } from "react";
import { SlidersHorizontal, ChevronDown } from "lucide-react";

export default function SortDropdown({ value, onChange }) {
    const [open, setOpen] = useState(false);
    const options = [
        { value: "default",    label: "Featured" },
        { value: "price-asc",  label: "Price: Low → High" },
        { value: "price-desc", label: "Price: High → Low" },
        { value: "name-asc",   label: "Name: A–Z" },
    ];
    const current = options.find(o => o.value === value) ?? options[0];
    return (
        <div className="relative">
            <button
                type="button"
                onClick={() => setOpen(p => !p)}
                className="flex items-center gap-1.5 px-3 sm:px-4 py-2 sm:py-2.5 rounded-xl border border-[#DDF6F0] bg-white/90 backdrop-blur-sm text-[10px] sm:text-xs text-[#2F5F57] hover:border-[#c4a882] transition-all font-semibold whitespace-nowrap shadow-sm"
            >
                <SlidersHorizontal className="w-3 h-3 text-[#c4a882]" />
                <span>{current.label}</span>
                <ChevronDown className={`w-3 h-3 text-[#c4a882] transition-transform ${open ? "rotate-180" : ""}`} />
            </button>
            {open && (
                <div className="absolute right-0 top-10 sm:top-11 z-50 w-44 sm:w-48 bg-white rounded-2xl border border-[#e8ddd4] shadow-2xl overflow-hidden">
                    {options.map(opt => (
                        <button key={opt.value} type="button"
                            onClick={() => { onChange(opt.value); setOpen(false); }}
                            className={`w-full text-left px-4 py-3 text-xs transition-colors font-medium
                                ${opt.value === value
                                    ? "bg-[#fdf3e7] text-[#5FBFA7] font-bold"
                                    : "text-[#2F5F57] hover:bg-[#fdf8f4]"}`}
                        >
                            {opt.label}
                        </button>
                    ))}
                </div>
            )}
        </div>
    );
}
