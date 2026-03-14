"use client";

import { useState, useMemo, useCallback } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { Filter, X, Sparkles } from "lucide-react";
import { useCart } from "@/hooks/useCart";
import { useWishlist } from "@/hooks/useWishlist";
import { useSession } from "next-auth/react";
import { toast } from "sonner";

import HeroBanner from "@/components/shop/HeroBanner";
import TrustStrip from "@/components/shop/TrustStrip";
import GenderSelector from "@/components/shop/GenderSelector";
import CategoryTiles from "@/components/shop/CategoryTiles";
import SortDropdown from "@/components/shop/SortDropdown";
import MidBanner from "@/components/shop/MidBanner";
import MobileFilterDrawer from "@/components/shop/MobileFilterDrawer";
import { ProductCard, SkeletonCard } from "@/components/shop/ProductCard";

const ALL_FILTER_KEYS = ["gender", "category", "type", "material"];

export default function ShopClient({ initialProducts, categories, types, materials }) {
    const searchParams = useSearchParams();
    const router = useRouter();

    const [sortBy, setSortBy] = useState(searchParams.get("sort") || "default");
    const [drawerOpen, setDrawerOpen] = useState(false);

    const { cart, addToCart: addToCartHook, removeFromCart } = useCart();
    const { isInWishlist, toggleWishlist: toggleWishlistHook } = useWishlist();
    const { data: session } = useSession();

    // URL Param Helpers (Synchronized with router)
    const navigate = useCallback((params) => {
        router.push(`?${params.toString()}`, { scroll: false });
    }, [router]);

    const getParamValues = useCallback((key) => {
        const val = searchParams.get(key);
        return val ? val.split(",").map(v => v.trim()).filter(Boolean) : [];
    }, [searchParams]);

    const handleParamToggle = useCallback((key, value) => {
        const params = new URLSearchParams(searchParams.toString());
        const current = getParamValues(key);
        const exists = current.some(v => v.toLowerCase() === value.toLowerCase());
        
        const next = exists 
            ? current.filter(v => v.toLowerCase() !== value.toLowerCase()) 
            : [...current, value];

        if (next.length) params.set(key, next.join(","));
        else params.delete(key);
        
        navigate(params);
    }, [searchParams, getParamValues, navigate]);

    const handleParamSet = useCallback((key, value) => {
        const params = new URLSearchParams(searchParams.toString());
        if (value) params.set(key, value);
        else params.delete(key);
        navigate(params);
    }, [searchParams, navigate]);

    const handleClearAll = useCallback(() => {
        const params = new URLSearchParams(searchParams.toString());
        ALL_FILTER_KEYS.forEach(k => params.delete(k));
        navigate(params);
    }, [searchParams, navigate]);

    const activeFilters = useMemo(() => {
        const filters = {};
        ALL_FILTER_KEYS.forEach(k => {
            filters[k] = getParamValues(k);
        });
        return filters;
    }, [getParamValues]);

    const activeCount = useMemo(() => 
        Object.values(activeFilters).reduce((sum, vals) => sum + vals.length, 0),
    [activeFilters]);

    // Sorting logic (we keep this on client for instant feedback if products are already loaded)
    const sortedProducts = useMemo(() => {
        let result = [...initialProducts];
        if (sortBy === "price-asc")  result.sort((a, b) => (a.price ?? 0) - (b.price ?? 0));
        else if (sortBy === "price-desc") result.sort((a, b) => (b.price ?? 0) - (a.price ?? 0));
        else if (sortBy === "name-asc")   result.sort((a, b) => a.name?.localeCompare(b.name));
        return result;
    }, [initialProducts, sortBy]);

    const firstBatch  = sortedProducts.slice(0, 4);
    const secondBatch = sortedProducts.slice(4);

    const handleToggleWishlist = (product) => {
        if (!session) { toast.error("Please log in to use wishlist"); return; }
        toggleWishlistHook(product);
    };

    const handleToggleCart = (product) => {
        const isCartItem = cart?.some(item => item.id === product._id);
        if (isCartItem) {
            removeFromCart(product._id);
        } else {
            if (!session) { toast.error("Please log in to add items to cart"); return; }
            addToCartHook(product, 1);
        }
    };

    return (
        <>
            <style jsx global>{`
                .btn-press {
                    transition: transform 0.12s cubic-bezier(0.34,1.56,0.64,1), box-shadow 0.12s ease, filter 0.12s ease;
                    cursor: pointer;
                }
                .btn-press:hover { filter: brightness(1.08); }
                .btn-press:active {
                    transform: scale(0.84) !important;
                    filter: brightness(0.92) !important;
                    box-shadow: 0 1px 4px rgba(0,0,0,0.2) !important;
                    transition-duration: 0.06s !important;
                }
                .btn-wishlist:hover { transform: scale(1.2); }
                .btn-wishlist:active { transform: scale(0.9) !important; transition-duration: 0.06s !important; }
                .btn-cart:hover { transform: scale(1.1); }
                .btn-cart:active { transform: scale(0.85) !important; transition-duration: 0.06s !important; }
            `}</style>

            

            <div className="mb-5 sm:mb-7">
                <div className="flex items-center gap-3 mb-1.5">
                    <div className="h-px w-8 bg-[#c4a882]" />
                    <span className="text-[9px] sm:text-[10px] uppercase tracking-[0.3em] text-[#c4a882] font-bold">Curated for you</span>
                </div>
                <h1 className="text-3xl sm:text-5xl font-bold text-[#1e0e06]" style={{ fontFamily: "'Playfair Display', Georgia, serif" }}>
                    Our Collection
                </h1>
            </div>

            <GenderSelector 
                activeGender={activeFilters.gender[0]} 
                onSelect={(val) => handleParamSet("gender", val)} 
            />

            {categories.length > 0 && (
                <CategoryTiles
                    activeCategory={activeFilters.category[0]}
                    categories={categories}
                    onSelect={(val) => handleParamSet("category", val)}
                />
            )}

            {(types.length > 0 || materials.length > 0) && (
                <div className="hidden sm:flex flex-wrap gap-x-6 gap-y-3 mb-6 pb-6 border-b border-[#ede3d8]">
                    {[
                        { key: "type",     label: "Occasion", options: types },
                        { key: "material", label: "Material", options: materials },
                    ].map(group => (
                        <div key={group.key} className="flex items-center gap-2 flex-wrap">
                            <span className="text-[10px] uppercase tracking-[0.2em] text-[#b09070] font-bold">{group.label}:</span>
                            {group.options.map(opt => {
                                const active = activeFilters[group.key].some(v => v.toLowerCase() === opt.toLowerCase());
                                return (
                                    <button key={opt} onClick={() => handleParamToggle(group.key, opt)}
                                        className={`px-3 py-1 rounded-full text-[11px] border font-semibold transition-all duration-150 active:scale-90 select-none
                                            ${active
                                                ? "bg-[#5FBFA7] text-white border-[#5FBFA7] shadow-[0_2px_10px_rgba(146,98,42,0.3)]"
                                                : "bg-white text-[#2F5F57] border-[#DDF6F0] hover:border-[#c4a882]"}`}
                                    >
                                        {opt}
                                    </button>
                                );
                            })}
                        </div>
                    ))}
                    {activeCount > 0 && (
                        <button onClick={handleClearAll} className="text-[10px] text-[#5FBFA7] font-bold uppercase tracking-wider self-center ml-auto">
                            ✕ Clear all
                        </button>
                    )}
                </div>
            )}

            <div className="flex items-center justify-between gap-2 mb-3 sm:mb-4">
                <div className="flex items-center gap-2.5">
                    <button
                        type="button"
                        onClick={() => setDrawerOpen(true)}
                        className="sm:hidden relative flex items-center gap-1.5 px-3 py-2 rounded-xl border border-[#DDF6F0] bg-white text-[10px] text-[#2F5F57] font-bold shadow-sm"
                    >
                        <Filter className="w-3 h-3 text-[#c4a882]" />
                        <span>Filters</span>
                        {activeCount > 0 && (
                            <span className="absolute -top-1.5 -right-1.5 w-4 h-4 rounded-full bg-[#5FBFA7] text-white text-[8px] flex items-center justify-center font-bold">
                                {activeCount}
                            </span>
                        )}
                    </button>
                    <p className="text-[10px] sm:text-sm text-[#6FAFA3]">
                        <span className="font-bold text-[#3d2010]">{sortedProducts.length}</span> pieces
                    </p>
                </div>
                <SortDropdown value={sortBy} onChange={(val) => { setSortBy(val); handleParamSet("sort", val); }} />
            </div>

            {activeCount > 0 && (
                <div className="flex flex-wrap gap-1.5 mb-3 sm:hidden">
                    {ALL_FILTER_KEYS.map(key =>
                        activeFilters[key].map(val => (
                            <button
                                key={`${key}-${val}`}
                                onClick={() => {
                                    if (key === "gender" || key === "category") handleParamSet(key, null);
                                    else handleParamToggle(key, val);
                                }}
                                className="flex items-center gap-1 px-2.5 py-1 rounded-full bg-[#5FBFA7]/10 text-[#5FBFA7] text-[10px] font-bold border border-[#5FBFA7]/25 active:scale-95 transition-transform duration-100"
                            >
                                {val} <X className="w-2.5 h-2.5" />
                            </button>
                        ))
                    )}
                </div>
            )}

            <MobileFilterDrawer
                open={drawerOpen}
                onClose={() => setDrawerOpen(false)}
                activeFilters={activeFilters}
                availableFilters={{ category: categories, type: types, material: materials }}
                onToggle={handleParamToggle}
                onClearAll={() => { handleClearAll(); setDrawerOpen(false); }}
            />

            {sortedProducts.length === 0 ? (
                <div className="flex flex-col items-center justify-center py-24 text-center bg-white/60 rounded-3xl border border-[#ede3d8] backdrop-blur-sm">
                    <div className="w-16 h-16 rounded-full bg-[#f5ede4] flex items-center justify-center mb-5 shadow-inner">
                        <Sparkles className="w-7 h-7 text-[#c4a882]" />
                    </div>
                    <h3 className="text-lg font-bold text-[#1e0e06] mb-1" style={{ fontFamily: "'Playfair Display', Georgia, serif" }}>
                        No pieces found
                    </h3>
                    <p className="text-xs sm:text-sm text-[#6FAFA3] max-w-xs mb-5">
                        Try adjusting or clearing your filters to discover our collection.
                    </p>
                    {activeCount > 0 && (
                        <button onClick={handleClearAll} className="px-6 py-2.5 rounded-full bg-[#5FBFA7] text-white text-xs font-bold hover:bg-[#143a2f] transition-all shadow-[0_4px_166px_rgba(27,77,62,0.3)]">
                            Clear All Filters
                        </button>
                    )}
                </div>
            ) : (
                <>
                    <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-5">
                        {firstBatch.map(product => {
                            const isCartItem = cart?.some(item => item.id === product._id);
                            const isWishlisted = isInWishlist(product._id);
                            return (
                                <ProductCard 
                                    key={product._id} 
                                    product={product}
                                    isCartItem={isCartItem}
                                    isWishlisted={isWishlisted}
                                    onToggleWishlist={() => handleToggleWishlist(product)}
                                    onToggleCart={() => handleToggleCart(product)}
                                />
                            );
                        })}
                    </div>

                    {secondBatch.length > 0 && <MidBanner category={activeFilters.category[0]} gender={activeFilters.gender[0]} />}

                    {secondBatch.length > 0 && (
                        <div className="grid grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-5">
                            {secondBatch.map(product => {
                                const isCartItem = cart?.some(item => item.id === product._id);
                                const isWishlisted = isInWishlist(product._id);
                                return (
                                    <ProductCard 
                                        key={product._id} 
                                        product={product}
                                        isCartItem={isCartItem}
                                        isWishlisted={isWishlisted}
                                        onToggleWishlist={() => handleToggleWishlist(product)}
                                        onToggleCart={() => handleToggleCart(product)}
                                    />
                                );
                            })}
                        </div>
                    )}
                </>
            )}
            <HeroBanner />
            <TrustStrip />
        </>
    );
}
