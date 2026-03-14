"use client";

import { useState } from "react";
import { X, ChevronUp, ChevronDown } from "lucide-react";

const GENDER_OPTIONS = ["Women", "Men", "Unisex"];

export default function MobileFilterDrawer({ open, onClose, activeFilters, availableFilters, onToggle, onClearAll }) {
    const [expanded, setExpanded] = useState({ gender: true, category: true, type: true, material: false });
    if (!open) return null;

    const hasAny = Object.values(activeFilters).some(arr => arr.length > 0);

    const groups = [
        { key: "gender",   label: "For",      options: GENDER_OPTIONS },
        { key: "category", label: "Category", options: availableFilters.category },
        { key: "type",     label: "Type",      options: availableFilters.type },
        { key: "material", label: "Material",  options: availableFilters.material },
    ];

    return (
        <>
            <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-40 sm:hidden" onClick={onClose} />
            <div className="fixed bottom-0 left-0 right-0 z-50 bg-[#fdf8f4] rounded-t-3xl shadow-2xl sm:hidden max-h-[85vh] flex flex-col">
                <div className="flex justify-center pt-3 pb-1 flex-shrink-0">
                    <div className="w-10 h-1 rounded-full bg-[#d4c4b0]" />
                </div>
                <div className="flex items-center justify-between px-5 py-3 border-b border-[#ede3d8] flex-shrink-0">
                    <h3 className="text-sm font-bold text-[#1e0e06]" style={{ fontFamily: "'Playfair Display', Georgia, serif" }}>
                        Refine Results
                    </h3>
                    <div className="flex items-center gap-3">
                        {hasAny && (
                            <button onClick={onClearAll} className="text-[10px] text-[#c4a882] font-bold uppercase tracking-wider">
                                Clear all
                            </button>
                        )}
                        <button onClick={onClose} className="w-7 h-7 rounded-full bg-[#f0e6dc] flex items-center justify-center">
                            <X className="w-3.5 h-3.5 text-[#7c6a58]" />
                        </button>
                    </div>
                </div>
                <div className="overflow-y-auto px-5 py-2 pb-10 space-y-0">
                    {groups.map(group => {
                        const isExp = expanded[group.key];
                        const activeVals = activeFilters[group.key] || [];
                        return (
                            <div key={group.key} className="border-b border-[#f0e6dc] last:border-0">
                                <button
                                    onClick={() => setExpanded(p => ({ ...p, [group.key]: !p[group.key] }))}
                                    className="w-full flex items-center justify-between py-3.5"
                                >
                                    <div className="flex items-center gap-2">
                                        <span className="text-sm font-bold text-[#2d1a10]">{group.label}</span>
                                        {activeVals.length > 0 && (
                                            <span className="w-5 h-5 rounded-full bg-[#5FBFA7] text-white text-[9px] flex items-center justify-center font-bold">
                                                {activeVals.length}
                                            </span>
                                        )}
                                    </div>
                                    {isExp
                                        ? <ChevronUp className="w-4 h-4 text-[#c4a882]" />
                                        : <ChevronDown className="w-4 h-4 text-[#c4a882]" />}
                                </button>
                                {isExp && (
                                    <div className="flex flex-wrap gap-2 pb-4">
                                        {group.options.map(opt => {
                                            const active = activeVals.some(v => v.toLowerCase() === opt.toLowerCase());
                                            return (
                                                <button key={opt} onClick={() => onToggle(group.key, opt)}
                                                    className={`px-3.5 py-1.5 rounded-full text-xs font-semibold border transition-all duration-150 active:scale-90 select-none
                                                        ${active
                                                            ? "bg-[#5FBFA7] text-white border-[#5FBFA7] shadow-[0_2px_12px_rgba(146,98,42,0.4)]"
                                                            : "bg-white text-[#2F5F57] border-[#DDF6F0] hover:border-[#c4a882]"}`}
                                                >
                                                    {opt}
                                                </button>
                                            );
                                        })}
                                    </div>
                                )}
                            </div>
                        );
                    })}
                </div>
            </div>
        </>
    );
}
