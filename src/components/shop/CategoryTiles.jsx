"use client";

import CategoryIcon from "./CategoryIcon";

export default function CategoryTiles({ activeCategory, categories, onSelect }) {
    const allTiles = [
        { label: "All", value: null },
        ...categories.map(cat => ({ label: cat, value: cat })),
    ];

    return (
        <div className="mb-5 sm:mb-7">
            <div className="flex gap-2 sm:gap-3 overflow-x-auto pb-1" style={{ scrollbarWidth: "none" }}>
                {allTiles.map(tile => {
                    const active = activeCategory?.toLowerCase() === tile.value?.toLowerCase();
                    return (
                        <button
                            key={tile.label}
                            type="button"
                            onClick={() => onSelect(active ? null : tile.value)}
                            className={`flex-shrink-0 flex flex-col items-center gap-2 sm:gap-2.5 px-4 sm:px-6 pt-3 sm:pt-4 pb-2.5 sm:pb-3 rounded-2xl border font-semibold transition-all duration-200 min-w-[68px] sm:min-w-[84px] active:scale-95 select-none
                                ${active
                                    ? "bg-gradient-to-b from-[#c4a882] to-[#5FBFA7] border-[#5FBFA7] text-white shadow-[0_8px_24px_rgba(146,98,42,0.45)]"
                                    : "bg-white border-[#ede3d8] text-[#2F5F57] hover:border-[#c4a882] hover:bg-[#fdf6ef] hover:shadow-md"}`}
                        >
                            <div className={`transition-transform duration-300 ${active ? "scale-110" : "group-hover:scale-105"}`}>
                                {tile.value === null
                                    ? <span className="text-xl sm:text-2xl block leading-none">✨</span>
                                    : <CategoryIcon name={tile.value} active={active} size={26} />
                                }
                            </div>
                            <span className="text-[9px] sm:text-[10px] tracking-wide capitalize">{tile.label}</span>
                        </button>
                    );
                })}
            </div>
        </div>
    );
}
