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

const ALL_FILTER_KEYS = ["gender", "category", "type", "material", "maxPrice"];

export default function ShopClient({ initialProducts, pagination, categories, types, materials }) {
    const searchParams = useSearchParams();
    const router = useRouter();
    const { data: session } = useSession();

    const [viewMode, setViewMode] = useState("grid");

    const { cart, addToCart: addToCartHook, removeFromCart } = useCart();
    const { isInWishlist, toggleWishlist: toggleWishlistHook } = useWishlist();

    // URL Sync Logic
    const navigate = useCallback((params) => {
        router.push(`?${params.toString()}`, { scroll: true });
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
        
        params.set("page", "1"); // Reset to page 1 on filter change
        navigate(params);
    }, [searchParams, getParamValues, navigate]);

    const handleSortChange = (newSort) => {
        const params = new URLSearchParams(searchParams.toString());
        params.set("sort", newSort);
        params.set("page", "1");
        navigate(params);
    };

    const handlePageChange = (newPage) => {
        const params = new URLSearchParams(searchParams.toString());
        params.set("page", newPage.toString());
        navigate(params);
    };

    const handleClearAll = useCallback(() => {
        const params = new URLSearchParams(searchParams.toString());
        ALL_FILTER_KEYS.forEach(k => params.delete(k));
        params.set("page", "1");
        navigate(params);
    }, [searchParams, navigate]);

    const activeFilters = useMemo(() => {
        const filters = {};
        ALL_FILTER_KEYS.forEach(k => {
            filters[k] = getParamValues(k);
        });
        return filters;
    }, [getParamValues]);

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
                            Showing <span className="text-black font-bold">{initialProducts.length}</span> of <span className="text-black font-bold">{pagination.total}</span> unique pieces
                        </p>
                        
                        <div className="flex items-center justify-between sm:justify-end gap-4 w-full sm:w-auto order-1 sm:order-2">
                            {/* View Mode Icons */}
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
                                    value={searchParams.get("sort") || "newest"} 
                                    onChange={(e) => handleSortChange(e.target.value)}
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
                        {initialProducts.length === 0 ? (
                            <EmptyState key="empty" onClearAll={handleClearAll} />
                        ) : (
                            <div className="space-y-16">
                                <motion.div 
                                    key="grid-container"
                                    initial={{ opacity: 0 }}
                                    animate={{ opacity: 1 }}
                                    exit={{ opacity: 0 }}
                                    className="flex flex-col gap-12"
                                >
                                    {/* First Grid: up to 8 products */}
                                    <div className={`grid gap-4 sm:gap-6 ${
                                        viewMode === "grid" 
                                            ? "grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6" 
                                            : "grid-cols-1"
                                    }`}>
                                        {initialProducts.slice(0, 8).map((product) => {
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

                                    {/* Ad Banner: Full Width */}
                                    {viewMode === "grid" && (
                                        <div className="w-full">
                                            <AdBanner />
                                        </div>
                                    )}

                                    {/* Second Grid: remaining products */}
                                    {initialProducts.length > 8 && (
                                        <div className={`grid gap-4 sm:gap-6 ${
                                            viewMode === "grid" 
                                                ? "grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6" 
                                                : "grid-cols-1"
                                        }`}>
                                            {initialProducts.slice(8).map((product) => {
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
                                </motion.div>


                                {/* Pagination Controls */}
                                {pagination.totalPages > 1 && (
                                    <div className="flex items-center justify-center gap-4 pt-8 border-t border-gray-100">
                                        <button
                                            onClick={() => handlePageChange(pagination.page - 1)}
                                            disabled={pagination.page <= 1}
                                            className="px-6 py-2 rounded-full bg-stone-100 text-stone-600 font-bold text-xs uppercase tracking-widest hover:bg-black hover:text-white disabled:opacity-50 disabled:hover:bg-stone-100 disabled:hover:text-stone-600 transition-all"
                                        >
                                            Previous
                                        </button>
                                        <div className="flex items-center gap-2">
                                            {[...Array(pagination.totalPages)].map((_, i) => {
                                                const p = i + 1;
                                                // Only show current, first, last, and one around current
                                                if (p === 1 || p === pagination.totalPages || Math.abs(p - pagination.page) <= 1) {
                                                    return (
                                                        <button
                                                            key={p}
                                                            onClick={() => handlePageChange(p)}
                                                            className={`w-8 h-8 rounded-full text-xs font-bold transition-all ${pagination.page === p ? "bg-black text-white" : "hover:bg-stone-100 text-stone-400"}`}
                                                        >
                                                            {p}
                                                        </button>
                                                    );
                                                }
                                                if (p === 2 || p === pagination.totalPages - 1) {
                                                    return <span key={p} className="text-stone-300">...</span>;
                                                }
                                                return null;
                                            }).filter(Boolean)}
                                        </div>
                                        <button
                                            onClick={() => handlePageChange(pagination.page + 1)}
                                            disabled={pagination.page >= pagination.totalPages}
                                            className="px-6 py-2 rounded-full bg-stone-100 text-stone-600 font-bold text-xs uppercase tracking-widest hover:bg-black hover:text-white disabled:opacity-50 disabled:hover:bg-stone-100 disabled:hover:text-stone-600 transition-all"
                                        >
                                            Next
                                        </button>
                                    </div>
                                )}
                            </div>
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
