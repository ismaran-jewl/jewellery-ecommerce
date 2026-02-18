"use client";

import { useState, useMemo, useEffect, Suspense, useCallback } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import {
    Heart, ShoppingCart, SlidersHorizontal, ChevronDown, X,
    Filter, Star, Truck, Shield, RotateCcw, Tag, ChevronRight,
    Sparkles, ChevronUp, BadgeCheck
} from "lucide-react";
import Link from "next/link";
import { useCart } from "@/hooks/useCart";
import { useWishlist } from "@/hooks/useWishlist";
import { useSession } from "next-auth/react";
import { toast } from "sonner";

/* ─────────────────────────────────────────
   CONSTANTS
───────────────────────────────────────── */
const GENDER_OPTIONS = ["Women", "Men", "Unisex"];

const TRUST_ITEMS = [
    { icon: Truck,      text: "Free Delivery above ₹2,999" },
    { icon: Shield,     text: "BIS Hallmarked" },
    { icon: RotateCcw,  text: "15-Day Returns" },
    { icon: Star,       text: "4.8★ · 10k+ Reviews" },
    { icon: BadgeCheck, text: "Certified Genuine" },
];

/* ─────────────────────────────────────────
   CATEGORY SVG ICONS  — relevant per type
───────────────────────────────────────── */
function CategoryIcon({ name, active, size = 28 }) {
    const color = active ? "#fff" : "#1B4D3E";
    const s = size;
    const icons = {
        rings: (
            <svg width={s} height={s} viewBox="0 0 32 32" fill="none">
                <circle cx="16" cy="16" r="9" stroke={color} strokeWidth="2.5"/>
                <circle cx="16" cy="16" r="5" stroke={color} strokeWidth="1.5" strokeDasharray="2 2"/>
                <path d="M13 7.5 Q16 4 19 7.5" stroke={color} strokeWidth="2" strokeLinecap="round" fill="none"/>
                <circle cx="16" cy="5.5" r="2" fill={color}/>
            </svg>
        ),
        necklaces: (
            <svg width={s} height={s} viewBox="0 0 32 32" fill="none">
                <path d="M6 8 Q16 22 26 8" stroke={color} strokeWidth="2" strokeLinecap="round" fill="none"/>
                <circle cx="16" cy="22" r="4" stroke={color} strokeWidth="2"/>
                <line x1="16" y1="18" x2="16" y2="22" stroke={color} strokeWidth="1.5"/>
                <circle cx="6" cy="8" r="1.5" fill={color}/>
                <circle cx="26" cy="8" r="1.5" fill={color}/>
            </svg>
        ),
        earrings: (
            <svg width={s} height={s} viewBox="0 0 32 32" fill="none">
                <circle cx="11" cy="8" r="2.5" stroke={color} strokeWidth="2"/>
                <path d="M11 10.5 L9 20 L13 20 Z" stroke={color} strokeWidth="1.8" strokeLinejoin="round" fill="none"/>
                <circle cx="21" cy="8" r="2.5" stroke={color} strokeWidth="2"/>
                <path d="M21 10.5 L19 20 L23 20 Z" stroke={color} strokeWidth="1.8" strokeLinejoin="round" fill="none"/>
                <circle cx="11" cy="22" r="1.5" fill={color}/>
                <circle cx="21" cy="22" r="1.5" fill={color}/>
            </svg>
        ),
        bracelets: (
            <svg width={s} height={s} viewBox="0 0 32 32" fill="none">
                <path d="M8 16 Q8 8 16 8 Q24 8 24 16" stroke={color} strokeWidth="2.5" strokeLinecap="round" fill="none"/>
                <path d="M8 16 Q8 24 16 24 Q24 24 24 16" stroke={color} strokeWidth="2" strokeLinecap="round" strokeDasharray="3 2" fill="none"/>
                <circle cx="8" cy="16" r="2" fill={color}/>
                <circle cx="24" cy="16" r="2" fill={color}/>
                <circle cx="16" cy="8" r="1.5" fill={color}/>
            </svg>
        ),
        pendants: (
            <svg width={s} height={s} viewBox="0 0 32 32" fill="none">
                <line x1="16" y1="4" x2="16" y2="11" stroke={color} strokeWidth="2" strokeLinecap="round"/>
                <path d="M10 11 L16 26 L22 11 Z" stroke={color} strokeWidth="2" strokeLinejoin="round" fill="none"/>
                <circle cx="16" cy="18" r="2" fill={color}/>
                <path d="M12 9 Q16 6 20 9" stroke={color} strokeWidth="1.5" strokeLinecap="round" fill="none"/>
            </svg>
        ),
        default: (
            <svg width={s} height={s} viewBox="0 0 32 32" fill="none">
                <polygon points="16,4 20,12 28,13 22,19 24,27 16,23 8,27 10,19 4,13 12,12" stroke={color} strokeWidth="2" fill="none" strokeLinejoin="round"/>
            </svg>
        ),
    };
    const key = name?.toLowerCase().replace(/s$/, "") || "default";
    return icons[key] ?? icons.default;
}

/* ─────────────────────────────────────────
   URL PARAM HELPERS  — URL = single source of truth
───────────────────────────────────────── */
function getParam(sp, key) {
    const raw = sp.get(key);
    return raw ? raw.split(",").map(v => v.trim()).filter(Boolean) : [];
}
function isActive(sp, key, value) {
    return getParam(sp, key).some(v => v.toLowerCase() === value.toLowerCase());
}
function toggleParam(sp, key, value) {
    const params = new URLSearchParams(sp.toString());
    const cur  = getParam(sp, key);
    const exists = cur.some(v => v.toLowerCase() === value.toLowerCase());
    const next = exists ? cur.filter(v => v.toLowerCase() !== value.toLowerCase()) : [...cur, value];
    if (next.length) params.set(key, next.join(","));
    else params.delete(key);
    return params;
}
function setParam(sp, key, value) {
    const params = new URLSearchParams(sp.toString());
    if (value) params.set(key, value);
    else params.delete(key);
    return params;
}
function clearAllParams(sp, keys) {
    const params = new URLSearchParams(sp.toString());
    keys.forEach(k => params.delete(k));
    return params;
}

/* ─────────────────────────────────────────
   SKELETON CARD
───────────────────────────────────────── */
function SkeletonCard() {
    return (
        <div className="rounded-2xl overflow-hidden bg-white/80 border border-[#e8ddd4] animate-pulse">
            <div className="h-40 sm:h-60 bg-gradient-to-br from-[#f0e9e2] to-[#e8ddd4]" />
            <div className="p-3 sm:p-4 space-y-2.5">
                <div className="h-2 w-12 bg-[#e0d4c8] rounded-full" />
                <div className="h-4 w-32 bg-[#e0d4c8] rounded-full" />
                <div className="h-5 w-20 bg-[#d4c4b0] rounded-full" />
                <div className="h-8 sm:h-9 w-full bg-[#e0d4c8] rounded-xl mt-2" />
            </div>
        </div>
    );
}

/* ─────────────────────────────────────────
   PRODUCT CARD  — elevated luxury feel
───────────────────────────────────────── */
function ProductCard({ product, isCartItem, isWishlisted, onToggleWishlist, onToggleCart }) {
    const [imgLoaded, setImgLoaded] = useState(false);
    return (
        <div className="group relative bg-white rounded-2xl overflow-hidden border border-[#ede3d8] hover:border-[#c4a882] hover:shadow-[0_12px_48px_rgba(180,140,100,0.18)] transition-all duration-500 flex flex-col">
            {/* Image zone */}
            <div className="relative overflow-hidden h-40 sm:h-60 bg-gradient-to-br from-[#fdf6ef] to-[#f0e6dc] flex-shrink-0">
                {!imgLoaded && (
                    <div className="absolute inset-0 bg-gradient-to-br from-[#f0e9e2] to-[#e8ddd4] animate-pulse" />
                )}
                <img
                    src={product.image}
                    alt={product.name}
                    onLoad={() => setImgLoaded(true)}
                    className={`w-full h-full object-cover transition-all duration-700 ${imgLoaded ? "opacity-100" : "opacity-0"}`}
                    style={{ transform: "scale(1)", transition: "transform 0.8s cubic-bezier(0.25,0.46,0.45,0.94), opacity 0.4s" }}
                    onMouseEnter={e => e.currentTarget.style.transform = "scale(1.08)"}
                    onMouseLeave={e => e.currentTarget.style.transform = "scale(1)"}
                />
                {/* Gradient overlay at bottom */}
                <div className="absolute inset-x-0 bottom-0 h-16 bg-gradient-to-t from-black/20 to-transparent pointer-events-none" />

                {/* Wishlist */}
                <button
                    type="button"
                    onClick={onToggleWishlist}
                    className={`absolute top-2.5 right-2.5 p-1.5 sm:p-2 rounded-full shadow-lg backdrop-blur-sm transition-all duration-300
                        ${isWishlisted
                            ? "bg-red-50 border border-red-200 text-red-500 scale-110"
                            : "bg-white/85 border border-white/50 text-[#9c8472] hover:text-red-400 hover:scale-110"}`}
                >
                    <Heart className={`w-3 h-3 sm:w-3.5 sm:h-3.5 ${isWishlisted ? "fill-red-500" : ""}`} />
                </button>

                {/* Material pill */}
                <div className="absolute bottom-2 left-2 px-2 py-0.5 rounded-full bg-black/35 backdrop-blur-md text-white text-[7px] sm:text-[9px] uppercase tracking-[0.15em] font-semibold">
                    {product.material}
                </div>
            </div>

            {/* Info */}
            <div className="p-3 sm:p-4 flex flex-col flex-1">
                <p className="text-[7px] sm:text-[9px] uppercase tracking-[0.2em] text-[#b09070] font-semibold mb-0.5">
                    {product.type}
                </p>
                <h3 className="text-xs sm:text-sm font-semibold text-[#1e0e06] leading-snug line-clamp-2 flex-1 mb-2 sm:mb-3">
                    {product.name}
                </h3>

                <div className="mt-auto pt-2 sm:pt-2.5 border-t border-[#f5ede4]">
                    <p className="text-sm sm:text-lg font-bold text-[#1B4D3E] tracking-tight mb-2">
                        ₹{product.price?.toLocaleString("en-IN") ?? "0"}
                    </p>
                    <div className="flex gap-1.5">
                        <Link
                            href={`/product/${product._id}`}
                            className="flex-1 flex items-center justify-center bg-[#1B4D3E] hover:bg-[#143a2f] text-white text-[9px] sm:text-xs h-7 sm:h-9 rounded-xl font-semibold tracking-wide transition-all duration-300 hover:shadow-[0_4px_16px_rgba(27,77,62,0.4)]"
                        >
                            Explore
                        </Link>
                        <button
                            type="button"
                            onClick={onToggleCart}
                            className={`w-7 h-7 sm:w-9 sm:h-9 rounded-xl border flex-shrink-0 flex items-center justify-center transition-all duration-300
                                ${isCartItem
                                    ? "bg-[#1B4D3E] border-[#1B4D3E] text-white shadow-[0_4px_16px_rgba(27,77,62,0.35)]"
                                    : "border-[#ddd0c0] text-[#9c8472] hover:border-[#1B4D3E] hover:text-[#1B4D3E] hover:bg-[#f0f9f5]"}`}
                        >
                            <ShoppingCart className={`w-3 h-3 sm:w-3.5 sm:h-3.5 ${isCartItem ? "fill-white" : ""}`} />
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}

/* ─────────────────────────────────────────
   SORT DROPDOWN
───────────────────────────────────────── */
function SortDropdown({ value, onChange }) {
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
                className="flex items-center gap-1.5 px-3 sm:px-4 py-2 sm:py-2.5 rounded-xl border border-[#ddd0c0] bg-white/90 backdrop-blur-sm text-[10px] sm:text-xs text-[#5c4632] hover:border-[#c4a882] transition-all font-semibold whitespace-nowrap shadow-sm"
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
                                    ? "bg-[#f0f9f5] text-[#1B4D3E] font-bold"
                                    : "text-[#5c4632] hover:bg-[#fdf8f4]"}`}
                        >
                            {opt.label}
                        </button>
                    ))}
                </div>
            )}
        </div>
    );
}

/* ─────────────────────────────────────────
   MOBILE FILTER DRAWER
───────────────────────────────────────── */
function MobileFilterDrawer({ open, onClose, searchParams, availableFilters, onToggle, onClearAll }) {
    const [expanded, setExpanded] = useState({ gender: true, category: true, type: true, material: false });
    if (!open) return null;

    const ALL_KEYS = ["gender", "category", "type", "material"];
    const hasAny = ALL_KEYS.some(k => getParam(searchParams, k).length > 0);

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
                        const activeVals = getParam(searchParams, group.key);
                        return (
                            <div key={group.key} className="border-b border-[#f0e6dc] last:border-0">
                                <button
                                    onClick={() => setExpanded(p => ({ ...p, [group.key]: !p[group.key] }))}
                                    className="w-full flex items-center justify-between py-3.5"
                                >
                                    <div className="flex items-center gap-2">
                                        <span className="text-sm font-bold text-[#2d1a10]">{group.label}</span>
                                        {activeVals.length > 0 && (
                                            <span className="w-5 h-5 rounded-full bg-[#1B4D3E] text-white text-[9px] flex items-center justify-center font-bold">
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
                                            const active = isActive(searchParams, group.key, opt);
                                            return (
                                                <button key={opt} onClick={() => onToggle(group.key, opt)}
                                                    className={`px-3.5 py-1.5 rounded-full text-xs font-semibold border transition-all duration-200
                                                        ${active
                                                            ? "bg-[#1B4D3E] text-white border-[#1B4D3E] shadow-[0_2px_8px_rgba(27,77,62,0.3)]"
                                                            : "bg-white text-[#5c4632] border-[#ddd0c0] hover:border-[#c4a882]"}`}
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

/* ─────────────────────────────────────────
   HERO BANNER
───────────────────────────────────────── */
function HeroBanner() {
    return (
        <div className="relative w-full rounded-3xl overflow-hidden mb-5 sm:mb-10">
            {/* Background */}
            <div className="absolute inset-0 bg-gradient-to-br from-[#0d2b22] via-[#1B4D3E] to-[#0a1f18]" />
            {/* Noise texture overlay */}
            <div className="absolute inset-0 opacity-[0.04]"
                style={{ backgroundImage: "url(\"data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)' opacity='1'/%3E%3C/svg%3E\")", backgroundSize: "200px" }} />
            {/* Gold circle decoration */}
            <div className="absolute -top-16 -right-16 w-64 sm:w-96 h-64 sm:h-96 rounded-full border border-[#c4a882]/20" />
            <div className="absolute -top-8 -right-8 w-48 sm:w-72 h-48 sm:h-72 rounded-full border border-[#c4a882]/10" />
            <div className="absolute bottom-0 left-0 w-48 h-48 rounded-full bg-[#c4a882]/5" style={{ transform: "translate(-30%, 30%)" }} />

            <div className="relative z-10 flex items-center min-h-[150px] sm:min-h-[280px]">
                <div className="px-6 sm:px-14 py-8 sm:py-12 flex-1">
                    <div className="flex items-center gap-2 mb-3">
                        <div className="h-px w-6 bg-[#c4a882]" />
                        <span className="text-[9px] sm:text-[10px] uppercase tracking-[0.35em] text-[#c4a882] font-bold">New Arrivals · 2025</span>
                    </div>
                    <h2 className="text-2xl sm:text-5xl font-bold text-white leading-[1.1] mb-2 sm:mb-4" style={{ fontFamily: "'Playfair Display', Georgia, serif" }}>
                        Timeless Gold<br />
                        <span className="text-[#c4a882]">&amp; Diamond</span><br className="hidden sm:block" />
                        <span className="hidden sm:inline"> Jewellery</span>
                    </h2>
                    <p className="text-white/50 text-[10px] sm:text-sm mb-4 sm:mb-7 max-w-sm leading-relaxed">
                        Handcrafted with love. BIS certified. Made to be treasured across generations.
                    </p>
                    <div className="flex flex-wrap items-center gap-2 sm:gap-4">
                        <div className="flex items-center gap-2 bg-[#c4a882] text-[#1a0a00] px-4 sm:px-5 py-2 sm:py-2.5 rounded-full text-[10px] sm:text-xs font-bold tracking-wide shadow-[0_4px_20px_rgba(196,168,130,0.4)]">
                            <Tag className="w-3 h-3" />
                            Up to 30% OFF
                        </div>
                        <span className="text-white/35 text-[9px] sm:text-[10px] tracking-wider">No code · Auto-applied at checkout</span>
                    </div>
                </div>

                {/* Right side decorative */}
                <div className="hidden sm:flex flex-col items-center justify-center pr-14 gap-3 opacity-30">
                    <div className="w-24 h-24 rounded-full border-2 border-[#c4a882] flex items-center justify-center">
                        <div className="w-16 h-16 rounded-full border border-[#c4a882] flex items-center justify-center">
                            <CategoryIcon name="rings" active={true} size={36} />
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

/* ─────────────────────────────────────────
   TRUST STRIP
───────────────────────────────────────── */
function TrustStrip() {
    return (
        <div className="mb-5 sm:mb-10 overflow-hidden">
            <div
                className="flex sm:grid sm:grid-cols-5 overflow-x-auto bg-white border border-[#ede3d8] rounded-2xl shadow-sm"
                style={{ scrollbarWidth: "none" }}
            >
                {TRUST_ITEMS.map((item, i) => {
                    const Icon = item.icon;
                    return (
                        <div key={i} className={`flex-shrink-0 flex items-center gap-2.5 px-4 sm:px-5 py-3.5 sm:py-4 ${i < TRUST_ITEMS.length - 1 ? "sm:border-r sm:border-[#f0e6dc]" : ""}`}>
                            <div className="w-8 h-8 rounded-xl bg-[#f0f9f5] flex items-center justify-center flex-shrink-0">
                                <Icon className="w-4 h-4 text-[#1B4D3E]" />
                            </div>
                            <span className="text-[10px] sm:text-[11px] text-[#5c4632] font-semibold leading-tight whitespace-nowrap sm:whitespace-normal">
                                {item.text}
                            </span>
                        </div>
                    );
                })}
            </div>
        </div>
    );
}

/* ─────────────────────────────────────────
   GENDER SELECTOR  — single select radio style
   Clicking selected gender deselects it.
───────────────────────────────────────── */
function GenderSelector({ searchParams, onSelect }) {
    const activeGender = getParam(searchParams, "gender")[0] ?? null;
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
                                ? "bg-[#1B4D3E] border-[#1B4D3E] text-white shadow-[0_4px_20px_rgba(27,77,62,0.3)]"
                                : "bg-white border-[#ddd0c0] text-[#5c4632] hover:border-[#1B4D3E] hover:text-[#1B4D3E]"}`}
                    >
                        {active && <div className="absolute inset-0 bg-gradient-to-r from-[#1B4D3E] to-[#2d7a5f] pointer-events-none" />}
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

/* ─────────────────────────────────────────
   CATEGORY TILES  — relevant SVG icons per category
───────────────────────────────────────── */
function CategoryTiles({ searchParams, categories, onSelect }) {
    const activeCat = getParam(searchParams, "category")[0] ?? null;
    const allTiles = [
        { label: "All", value: null },
        ...categories.map(cat => ({ label: cat, value: cat })),
    ];

    return (
        <div className="mb-5 sm:mb-7">
            <div className="flex gap-2 sm:gap-3 overflow-x-auto pb-1" style={{ scrollbarWidth: "none" }}>
                {allTiles.map(tile => {
                    const active = activeCat === tile.value;
                    return (
                        <button
                            key={tile.label}
                            type="button"
                            onClick={() => onSelect(active ? null : tile.value)}
                            className={`flex-shrink-0 flex flex-col items-center gap-2 sm:gap-2.5 px-4 sm:px-6 pt-3 sm:pt-4 pb-2.5 sm:pb-3 rounded-2xl border font-semibold transition-all duration-300 min-w-[68px] sm:min-w-[84px]
                                ${active
                                    ? "bg-[#1B4D3E] border-[#1B4D3E] text-white shadow-[0_6px_24px_rgba(27,77,62,0.3)]"
                                    : "bg-white border-[#ede3d8] text-[#5c4632] hover:border-[#c4a882] hover:bg-[#fdf6ef] hover:shadow-md"}`}
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

/* ─────────────────────────────────────────
   MID-PAGE PROMO BANNER
───────────────────────────────────────── */
function MidBanner({ searchParams }) {
    const cat    = getParam(searchParams, "category")[0];
    const gender = getParam(searchParams, "gender")[0];
    const banners = {
        Rings:     { title: "Find Your Perfect Ring",     sub: "Solitaires · Stackables · Bands · Cocktail", cta: "Shop Rings",     from: "#3d1540", to: "#6b2d75" },
        Necklaces: { title: "Statement Necklaces",         sub: "Chokers · Chains · Layered · Pendants",      cta: "Shop Necklaces", from: "#0f2d52", to: "#1e5499" },
        Earrings:  { title: "Earrings for Every Occasion", sub: "Studs · Hoops · Drops · Chandbalis",         cta: "Shop Earrings",  from: "#4a2210", to: "#8c4420" },
        Bracelets: { title: "Stacked & Stunning",          sub: "Tennis · Bangles · Charm · Cuffs",           cta: "Shop Bracelets", from: "#0d3030", to: "#1a6060" },
        Men:       { title: "Bold Jewellery for Men",      sub: "Chains · Rings · Bracelets · Pendants",      cta: "Shop Men's",     from: "#111230", to: "#242860" },
        Women:     { title: "Made for Her",                sub: "Elegant pieces for every occasion",           cta: "Shop Women's",   from: "#3d0f28", to: "#7a1f52" },
        default:   { title: "Festival Season Sale",        sub: "Extra 10% off on orders above ₹5,000",       cta: "View Offers",    from: "#0d2b22", to: "#1B4D3E" },
    };
    const b = banners[cat] ?? banners[gender] ?? banners.default;
    return (
        <div
            className="relative rounded-3xl overflow-hidden p-6 sm:p-10 my-5 sm:my-10 flex items-center justify-between"
            style={{ background: `linear-gradient(135deg, ${b.from}, ${b.to})` }}
        >
            {/* Decorative rings */}
            <div className="absolute right-6 top-1/2 -translate-y-1/2 opacity-10 pointer-events-none hidden sm:block">
                <div className="w-36 h-36 rounded-full border-4 border-white" />
                <div className="w-24 h-24 rounded-full border-2 border-white absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2" />
            </div>
            <div className="relative z-10">
                <p className="text-white/50 text-[9px] sm:text-[10px] uppercase tracking-[0.3em] mb-2 font-bold">Curated Collection</p>
                <h3 className="text-lg sm:text-3xl font-bold text-white mb-1.5 sm:mb-2.5" style={{ fontFamily: "'Playfair Display', Georgia, serif" }}>
                    {b.title}
                </h3>
                <p className="text-white/60 text-[10px] sm:text-sm mb-4 sm:mb-5">{b.sub}</p>
                <button className="flex items-center gap-2 bg-white/15 hover:bg-white/25 border border-white/30 text-white px-4 sm:px-6 py-2 sm:py-2.5 rounded-full text-xs sm:text-sm font-bold transition-all backdrop-blur-sm">
                    {b.cta} <ChevronRight className="w-3.5 h-3.5" />
                </button>
            </div>
        </div>
    );
}

/* ─────────────────────────────────────────
   PAGE WRAPPER
───────────────────────────────────────── */
export default function Page() {
    return (
        <div className="min-h-screen" style={{ background: "linear-gradient(180deg, #fdf8f2 0%, #f9f2ea 100%)" }}>
            {/* Gold top bar */}
            <div className="h-0.5 w-full" style={{ background: "linear-gradient(90deg, transparent, #c4a882, #1B4D3E, #c4a882, transparent)" }} />

            <div className="container mx-auto px-3 sm:px-6 lg:px-8 pt-20 sm:pt-28 pb-24 sm:pb-32 max-w-7xl">
                <Suspense fallback={
                    <div className="grid grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-6 mt-8">
                        {[...Array(6)].map((_, i) => <SkeletonCard key={i} />)}
                    </div>
                }>
                    <ShopContent />
                </Suspense>
            </div>
        </div>
    );
}

/* ─────────────────────────────────────────
   SHOP CONTENT
───────────────────────────────────────── */
const ALL_FILTER_KEYS = ["gender", "category", "type", "material"];

function ShopContent() {
    const searchParams = useSearchParams();
    const router       = useRouter();

    const [products, setProducts]     = useState([]);
    const [loading, setLoading]       = useState(true);
    const [sortBy, setSortBy]         = useState("default");
    const [drawerOpen, setDrawerOpen] = useState(false);

    const { cart, addToCart: addToCartHook, removeFromCart } = useCart();
    const { isInWishlist, toggleWishlist: toggleWishlistHook } = useWishlist();
    const { data: session } = useSession();

    useEffect(() => {
        fetch("/api/products")
            .then(r => r.ok ? r.json() : [])
            .then(setProducts)
            .catch(() => {})
            .finally(() => setLoading(false));
    }, []);

    // Build available filter options dynamically from real data
    // Strip gender values out of the category list
    const availableFilters = useMemo(() => {
        const unique = arr => [...new Set(arr.filter(Boolean))].sort();
        const genderLower = GENDER_OPTIONS.map(g => g.toLowerCase());
        return {
            category: unique(products.map(p => p.category).filter(c => c && !genderLower.includes(c.toLowerCase()))),
            type:     unique(products.map(p => p.type)),
            material: unique(products.map(p => p.material)),
        };
    }, [products]);

    const activeCount = useMemo(() =>
        ALL_FILTER_KEYS.reduce((n, k) => n + getParam(searchParams, k).length, 0),
        [searchParams]
    );

    const navigate = useCallback(params => router.push(`?${params.toString()}`, { scroll: false }), [router]);

    // Gender: single-select (set or clear)
    const handleGenderSelect = useCallback(value => {
        navigate(setParam(searchParams, "gender", value));
    }, [searchParams, navigate]);

    // Category: single-select (set or clear)
    const handleCategorySelect = useCallback(value => {
        navigate(setParam(searchParams, "category", value));
    }, [searchParams, navigate]);

    // type/material: multi-select toggle
    const handleToggle = useCallback((key, value) => {
        navigate(toggleParam(searchParams, key, value));
    }, [searchParams, navigate]);

    const handleClearAll = useCallback(() => {
        navigate(clearAllParams(searchParams, ALL_FILTER_KEYS));
    }, [searchParams, navigate]);

    // Filter + sort
    const filteredAndSorted = useMemo(() => {
        const genderLower = GENDER_OPTIONS.map(g => g.toLowerCase());
        let result = products.filter(product => {
            const search = searchParams.get("search")?.toLowerCase();
            if (search && !product.name?.toLowerCase().includes(search)) return false;

            for (const key of ALL_FILTER_KEYS) {
                const filterVals = getParam(searchParams, key);
                if (!filterVals.length) continue;

                if (key === "gender") {
                    // Check product.gender (new field) OR product.category (old data)
                    const fromField    = product.gender?.toLowerCase().trim();
                    const fromCategory = genderLower.includes(product.category?.toLowerCase().trim())
                        ? product.category?.toLowerCase().trim() : null;
                    const effective = fromField || fromCategory;
                    if (!filterVals.some(fv => fv.toLowerCase() === effective)) return false;

                } else if (key === "category") {
                    const catVal = product.category?.toLowerCase().trim();
                    // Skip products whose category is actually a gender value
                    if (genderLower.includes(catVal)) return false;
                    if (!filterVals.some(fv => fv.toLowerCase() === catVal)) return false;

                } else {
                    const pVal = product[key]?.toString().toLowerCase().trim();
                    if (!filterVals.some(fv => fv.toLowerCase() === pVal)) return false;
                }
            }
            return true;
        });

        if (sortBy === "price-asc")  result = [...result].sort((a, b) => (a.price ?? 0) - (b.price ?? 0));
        if (sortBy === "price-desc") result = [...result].sort((a, b) => (b.price ?? 0) - (a.price ?? 0));
        if (sortBy === "name-asc")   result = [...result].sort((a, b) => a.name?.localeCompare(b.name));
        return result;
    }, [products, searchParams, sortBy]);

    const firstBatch  = filteredAndSorted.slice(0, 4);
    const secondBatch = filteredAndSorted.slice(4);

    return (
        <>
            <HeroBanner />
            <TrustStrip />

            {/* Page title */}
            <div className="mb-5 sm:mb-7">
                <div className="flex items-center gap-3 mb-1.5">
                    <div className="h-px w-8 bg-[#c4a882]" />
                    <span className="text-[9px] sm:text-[10px] uppercase tracking-[0.3em] text-[#c4a882] font-bold">Curated for you</span>
                </div>
                <h1 className="text-3xl sm:text-5xl font-bold text-[#1e0e06]" style={{ fontFamily: "'Playfair Display', Georgia, serif" }}>
                    Our Collection
                </h1>
            </div>

            {/* Gender selector — single select */}
            <GenderSelector searchParams={searchParams} onSelect={handleGenderSelect} />

            {/* Category tiles — built from real data, relevant icons */}
            {!loading && availableFilters.category.length > 0 && (
                <CategoryTiles
                    searchParams={searchParams}
                    categories={availableFilters.category}
                    onSelect={handleCategorySelect}
                />
            )}

            {/* Desktop sub-filters: type + material */}
            {(availableFilters.type.length > 0 || availableFilters.material.length > 0) && (
                <div className="hidden sm:flex flex-wrap gap-x-6 gap-y-3 mb-6 pb-6 border-b border-[#ede3d8]">
                    {[
                        { key: "type",     label: "Occasion", options: availableFilters.type },
                        { key: "material", label: "Material", options: availableFilters.material },
                    ].map(group => (
                        <div key={group.key} className="flex items-center gap-2 flex-wrap">
                            <span className="text-[10px] uppercase tracking-[0.2em] text-[#b09070] font-bold">{group.label}:</span>
                            {group.options.map(opt => {
                                const active = isActive(searchParams, group.key, opt);
                                return (
                                    <button key={opt} onClick={() => handleToggle(group.key, opt)}
                                        className={`px-3 py-1 rounded-full text-[11px] border font-semibold transition-all duration-200
                                            ${active
                                                ? "bg-[#1B4D3E] text-white border-[#1B4D3E] shadow-[0_2px_10px_rgba(27,77,62,0.25)]"
                                                : "bg-white text-[#5c4632] border-[#ddd0c0] hover:border-[#c4a882]"}`}
                                    >
                                        {opt}
                                    </button>
                                );
                            })}
                        </div>
                    ))}
                    {activeCount > 0 && (
                        <button onClick={handleClearAll} className="text-[10px] text-[#c4a882] font-bold uppercase tracking-wider self-center ml-auto">
                            ✕ Clear all
                        </button>
                    )}
                </div>
            )}

            {/* Toolbar */}
            <div className="flex items-center justify-between gap-2 mb-3 sm:mb-4">
                <div className="flex items-center gap-2.5">
                    {/* Mobile filter button */}
                    <button
                        type="button"
                        onClick={() => setDrawerOpen(true)}
                        className="sm:hidden relative flex items-center gap-1.5 px-3 py-2 rounded-xl border border-[#ddd0c0] bg-white text-[10px] text-[#5c4632] font-bold shadow-sm"
                    >
                        <Filter className="w-3 h-3 text-[#c4a882]" />
                        <span>Filters</span>
                        {activeCount > 0 && (
                            <span className="absolute -top-1.5 -right-1.5 w-4 h-4 rounded-full bg-[#1B4D3E] text-white text-[8px] flex items-center justify-center font-bold">
                                {activeCount}
                            </span>
                        )}
                    </button>
                    <p className="text-[10px] sm:text-sm text-[#9c8472]">
                        <span className="font-bold text-[#3d2010]">{filteredAndSorted.length}</span> pieces
                    </p>
                </div>
                <SortDropdown value={sortBy} onChange={setSortBy} />
            </div>

            {/* Active chips — mobile */}
            {activeCount > 0 && (
                <div className="flex flex-wrap gap-1.5 mb-3 sm:hidden">
                    {ALL_FILTER_KEYS.map(key =>
                        getParam(searchParams, key).map(val => (
                            <button
                                key={`${key}-${val}`}
                                onClick={() => {
                                    if (key === "gender")   handleGenderSelect(null);
                                    else if (key === "category") handleCategorySelect(null);
                                    else handleToggle(key, val);
                                }}
                                className="flex items-center gap-1 px-2.5 py-1 rounded-full bg-[#1B4D3E]/10 text-[#1B4D3E] text-[10px] font-bold border border-[#1B4D3E]/20"
                            >
                                {val} <X className="w-2.5 h-2.5" />
                            </button>
                        ))
                    )}
                </div>
            )}

            {/* Mobile drawer */}
            <MobileFilterDrawer
                open={drawerOpen}
                onClose={() => setDrawerOpen(false)}
                searchParams={searchParams}
                availableFilters={availableFilters}
                onToggle={(key, val) => {
                    if (key === "gender")        handleGenderSelect(isActive(searchParams, "gender", val) ? null : val);
                    else if (key === "category") handleCategorySelect(isActive(searchParams, "category", val) ? null : val);
                    else handleToggle(key, val);
                }}
                onClearAll={() => { handleClearAll(); setDrawerOpen(false); }}
            />

            {/* Products */}
            {loading ? (
                <div className="grid grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-5">
                    {[...Array(6)].map((_, i) => <SkeletonCard key={i} />)}
                </div>
            ) : filteredAndSorted.length === 0 ? (
                <div className="flex flex-col items-center justify-center py-24 text-center bg-white/60 rounded-3xl border border-[#ede3d8] backdrop-blur-sm">
                    <div className="w-16 h-16 rounded-full bg-[#f5ede4] flex items-center justify-center mb-5 shadow-inner">
                        <Sparkles className="w-7 h-7 text-[#c4a882]" />
                    </div>
                    <h3 className="text-lg font-bold text-[#1e0e06] mb-1" style={{ fontFamily: "'Playfair Display', Georgia, serif" }}>
                        No pieces found
                    </h3>
                    <p className="text-xs sm:text-sm text-[#9c8472] max-w-xs mb-5">
                        Try adjusting or clearing your filters to discover our collection.
                    </p>
                    {activeCount > 0 && (
                        <button onClick={handleClearAll} className="px-6 py-2.5 rounded-full bg-[#1B4D3E] text-white text-xs font-bold hover:bg-[#143a2f] transition-all shadow-[0_4px_16px_rgba(27,77,62,0.3)]">
                            Clear All Filters
                        </button>
                    )}
                </div>
            ) : (
                <>
                    <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-5">
                        {firstBatch.map(product => (
                            <ConnectedCard key={product._id} product={product}
                                cart={cart} isInWishlist={isInWishlist} session={session}
                                addToCartHook={addToCartHook} removeFromCart={removeFromCart}
                                toggleWishlistHook={toggleWishlistHook}
                            />
                        ))}
                    </div>

                    {secondBatch.length > 0 && <MidBanner searchParams={searchParams} />}

                    {secondBatch.length > 0 && (
                        <div className="grid grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-5">
                            {secondBatch.map(product => (
                                <ConnectedCard key={product._id} product={product}
                                    cart={cart} isInWishlist={isInWishlist} session={session}
                                    addToCartHook={addToCartHook} removeFromCart={removeFromCart}
                                    toggleWishlistHook={toggleWishlistHook}
                                />
                            ))}
                        </div>
                    )}
                </>
            )}
        </>
    );
}

/* ─────────────────────────────────────────
   CONNECTED CARD
───────────────────────────────────────── */
function ConnectedCard({ product, cart, isInWishlist, session, addToCartHook, removeFromCart, toggleWishlistHook }) {
    const isCartItem   = cart?.some(item => item.id === product._id);
    const isWishlisted = isInWishlist(product._id);
    return (
        <ProductCard
            product={product}
            isCartItem={isCartItem}
            isWishlisted={isWishlisted}
            onToggleWishlist={() => {
                if (!session) { toast.error("Please log in to use wishlist"); return; }
                toggleWishlistHook(product);
            }}
            onToggleCart={() => {
                if (isCartItem) removeFromCart(product._id);
                else {
                    if (!session) { toast.error("Please log in to add items to cart"); return; }
                    addToCartHook(product, 1);
                }
            }}
        />
    );
}
