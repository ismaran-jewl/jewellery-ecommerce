"use client";

const GENDER_OPTIONS = ["Women", "Men", "Unisex"];

export default function GenderSelector({ activeGender, onSelect }) {
    return (
        <div className="flex gap-2 sm:gap-3 mb-5 sm:mb-6">
            {GENDER_OPTIONS.map(g => {
                const active = activeGender?.toLowerCase() === g.toLowerCase();
                const icons = { Women: "♀", Men: "♂", Unisex: "⚥" };
                return (
                    <button
                        key={g}
                        type="button"
                        onClick={() => onSelect(active ? null : g)}
                        className={`relative flex items-center gap-2 px-4 sm:px-5 py-2 sm:py-2.5 rounded-full border text-xs sm:text-sm font-bold transition-all duration-300 overflow-hidden
                            ${active
                                ? "bg-gradient-to-r from-[#5FBFA7] to-[#c4a882] border-[#5FBFA7] text-white shadow-[0_4px_20px_rgba(146,98,42,0.5)]"
                                : "bg-white border-[#DDF6F0] text-[#2F5F57] hover:border-[#5FBFA7] hover:text-[#5FBFA7]"}`}
                    >
                        {active && <div className="absolute inset-0 bg-gradient-to-r from-[#7a4f28] to-[#c4a882] pointer-events-none" />}
                        <span className="relative z-10 text-sm">{icons[g]}</span>
                        <span className="relative z-10">{g}</span>
                        {active && (
                            <span className="relative z-10 w-4 h-4 rounded-full bg-white/25 flex items-center justify-center text-[8px] font-black">✓</span>
                        )}
                    </button>
                );
            })}
        </div>
    );
}
