"use client";

import { useState, useMemo, useCallback, Fragment } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { useCart } from "@/hooks/useCart";
import { useWishlist } from "@/hooks/useWishlist";
import { useSession } from "next-auth/react";
import { toast } from "sonner";
import { motion, AnimatePresence } from "framer-motion";
import { LayoutGrid, List, MessageSquare } from "lucide-react";


import ProductCard from "@/components/shop/ProductCard";
import EmptyState from "@/components/shop/EmptyState";
import AdBanner from "@/components/shop/AdBanner";

const ALL_FILTER_KEYS = ["gender", "category", "type", "material"];

export default function ShopClient({ initialProducts, categories, types, materials }) {
    const searchParams = useSearchParams();
    const router = useRouter();
    const { data: session } = useSession();

    const [sortBy, setSortBy] = useState(searchParams.get("sort") || "newest");
    const [viewMode, setViewMode] = useState("grid");

    const { cart, addToCart: addToCartHook, removeFromCart } = useCart();
    const { isInWishlist, toggleWishlist: toggleWishlistHook } = useWishlist();

    // URL Sync Logic
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

    // Client-side sorting for instant feedback
    const sortedProducts = useMemo(() => {
        let result = [...initialProducts];
        if (sortBy === "price-asc") result.sort((a, b) => (a.price ?? 0) - (b.price ?? 0));
        else if (sortBy === "price-desc") result.sort((a, b) => (b.price ?? 0) - (a.price ?? 0));
        else if (sortBy === "name-asc") result.sort((a, b) => a.name?.localeCompare(b.name));
        else if (sortBy === "newest") result.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
        return result;
    }, [initialProducts, sortBy]);

    const handleToggleWishlist = async (product) => {
        if (!session) {
            toast.error("Please login to save items to your wishlist", {
                action: { label: "Login", onClick: () => router.push("/login") }
            });
            return;
        }
        try {
            await toggleWishlistHook(product);
        } catch (error) {
            toast.error("Something went wrong. Please try again.");
        }
    };

    const handleToggleCart = (product) => {
        const isCartItem = cart?.some(item => item.id === product._id);
        if (isCartItem) {
            removeFromCart(product._id);
            toast.success("Removed from cart");
        } else {
            addToCartHook(product, 1);
            toast.success("Added to cart", {
                action: { label: "View Cart", onClick: () => router.push("/cart") }
            });
        }
    };

    return (
        <>
            <div className="flex flex-col p-4">
                <div className="w-full">
                    {/* Sorting and View Controls */}
                    <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-6 pb-4 border-b border-gray-100">
                        <p className="text-xs sm:text-sm text-gray-500 order-2 sm:order-1">
                            Showing <span className="text-black font-bold">{sortedProducts.length}</span> unique pieces
                        </p>
                        
                        <div className="flex items-center justify-between sm:justify-end gap-4 w-full sm:w-auto order-1 sm:order-2">
                            {/* View Mode Icons - Visible on small screens now too but smaller gap */}
                            <div className="flex items-center gap-1 sm:gap-2 sm:pr-6 sm:border-r border-gray-100">
                                <button 
                                    onClick={() => setViewMode("grid")}
                                    className={`p-2 rounded-lg transition-colors ${viewMode === "grid" ? "bg-black text-white" : "text-gray-400 hover:text-black"}`}
                                >
                                    <LayoutGrid size={16} />
                                </button>
                                <button 
                                    onClick={() => setViewMode("list")}
                                    className={`p-2 rounded-lg transition-colors ${viewMode === "list" ? "bg-black text-white" : "text-gray-400 hover:text-black"}`}
                                >
                                    <List size={16} />
                                </button>
                            </div>

                            <div className="flex items-center gap-2 sm:gap-3 bg-stone-50 sm:bg-transparent px-3 py-1.5 sm:p-0 rounded-full sm:rounded-none border border-stone-200 sm:border-none">
                                <span className="text-[10px] sm:text-xs font-bold uppercase tracking-widest text-gray-400 whitespace-nowrap">Sort By</span>
                                <select 
                                    value={sortBy} 
                                    onChange={(e) => setSortBy(e.target.value)}
                                    className="bg-transparent text-[11px] sm:text-sm font-bold text-gray-900 border-none focus:ring-0 cursor-pointer outline-none min-w-[100px]"
                                >
                                    <option value="newest">Newest</option>
                                    <option value="price-asc">Price: Low</option>
                                    <option value="price-desc">Price: High</option>
                                    <option value="name-asc">A-Z</option>
                                </select>
                            </div>
                        </div>
                    </div>

                    <AnimatePresence mode="wait">
                        {sortedProducts.length === 0 ? (
                            <EmptyState key="empty" onClearAll={handleClearAll} />
                        ) : (
                            <motion.div 
                                key="grid"
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                exit={{ opacity: 0 }}
                                className={`grid gap-4 sm:gap-6 ${
                                    viewMode === "grid" 
                                        ? "grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6" 
                                        : "grid-cols-1"
                                }`}
                            >
                                {sortedProducts.map((product, idx) => {
                                    const isCartItem = cart?.some(item => item.id === product._id);
                                    const isWishlisted = isInWishlist(product._id);
                                    
                                    return (
                                        <Fragment key={product._id}>
                                            <ProductCard 
                                                product={product}
                                                isCartItem={isCartItem}
                                                isWishlisted={isWishlisted}
                                                onToggleWishlist={() => handleToggleWishlist(product)}
                                                onToggleCart={() => handleToggleCart(product)}
                                            />
                                            {/* Insert AdBanner after the 8th product in grid mode */}
                                            {idx === 7 && viewMode === "grid" && (
                                                <AdBanner key="promo-banner" />
                                            )}
                                        </Fragment>
                                    );
                                })}
                                {/* If there are fewer than 8 products, show the banner at the end of the grid */}
                                {sortedProducts.length < 8 && sortedProducts.length > 0 && viewMode === "grid" && (
                                    <AdBanner key="promo-banner-end" />
                                )}
                            </motion.div>
                        )}
                    </AnimatePresence>
                </div>
            </div>
            
            <div className="fixed bottom-8 right-8 z-50">
                <button className="flex items-center gap-2 p-4 bg-[#B8860B] text-white rounded-full shadow-2xl hover:scale-110 transition-transform group">
                    <MessageSquare size={20} />
                    <span className="max-w-0 overflow-hidden group-hover:max-w-xs transition-all duration-500 whitespace-nowrap font-bold text-sm">
                        Expert Consulation
                    </span>
                </button>
            </div>
        </>
    );
}
