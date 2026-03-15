"use client";

import { useState } from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { Heart, ShoppingBag, Eye, Star, Trash2 } from "lucide-react";
import { toast } from "sonner";
import { getImageUrl } from "@/lib/utils";

export default function ProductCard({ 
    product, 
    isCartItem, 
    isWishlisted, 
    onToggleWishlist, 
    onToggleCart 
}) {
    const [isHovered, setIsHovered] = useState(false);

    return (
        <motion.div
            layout
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9 }}
            onMouseEnter={() => setIsHovered(true)}
            onMouseLeave={() => setIsHovered(false)}
            className="group relative flex flex-col bg-white rounded-2xl overflow-hidden border-[3px] border-[#B8860B]/40 hover:border-[#B8860B] shadow-sm hover:shadow-[0_0_25px_rgba(184,134,11,0.4)] transition-all duration-500 h-full"
        >
            {/* The Main Link wrapper - wraps the whole card except buttons */}
            <Link 
                href={`/product/${product.slug || product._id}`} 
                className="flex flex-col flex-grow h-full"
            >
                {/* Image Container */}
                <div className="relative aspect-square overflow-hidden bg-[#F9F6F3]">
                    {product.image ? (
                        <img
                            src={getImageUrl(product.image)}
                            alt={product.name}
                            className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                            loading="lazy"
                        />
                    ) : (
                        <div className="w-full h-full flex items-center justify-center text-gray-300">
                            <ShoppingBag size={48} strokeWidth={1} />
                        </div>
                    )}

                    {/* Badges */}
                    <div className="absolute top-3 left-3 flex flex-col gap-1.5 pointer-events-none">
                        {product.isNew && (
                            <span className="px-2 py-1 bg-black text-white text-[10px] font-bold uppercase tracking-wider rounded-md">
                                New
                            </span>
                        )}
                    </div>
                    
                    {/* Visual Overlay */}
                    <div className="absolute inset-0 bg-black/0 group-hover:bg-black/5 transition-colors duration-500 pointer-events-none" />
                </div>

                {/* Content */}
                <div className="p-3 sm:p-4 flex flex-col flex-grow">
                    <div className="flex items-center gap-1 mb-2">
                        <div className="flex text-amber-500">
                            {[...Array(5)].map((_, i) => (
                                <Star key={i} size={10} fill={i < 4 ? "currentColor" : "none"} />
                            ))}
                        </div>
                        <span className="text-[10px] text-gray-400 font-medium">(24)</span>
                    </div>

                    <h3 className="text-sm sm:text-base font-semibold text-gray-900 group-hover:text-[#B8860B] transition-colors line-clamp-1 mb-1" style={{ fontFamily: "var(--font-playfair)" }}>
                        {product.name}
                    </h3>
                    
                    <p className="text-[11px] text-gray-400 uppercase tracking-widest mb-3">
                        {product.category}
                    </p>

                    <div className="mt-auto flex items-center justify-between">
                        <div className="flex items-baseline gap-2">
                            <span className="text-base sm:text-lg font-bold text-gray-900">
                                ₹{product.price?.toLocaleString()}
                            </span>
                        </div>
                    </div>
                </div>
            </Link>

            {/* ACTION BUTTONS - Positioned absolutely outside the Link but inside motion.div */}
            {/* Wishlist Button */}
            <button
                onClick={(e) => {
                    e.preventDefault();
                    e.stopPropagation();
                    onToggleWishlist();
                }}
                className={`absolute top-3 right-3 p-2.5 rounded-full backdrop-blur-md transition-all duration-300 z-20
                    ${isWishlisted 
                        ? "bg-red-500 text-white shadow-lg" 
                        : "bg-white/80 text-gray-900 border border-gray-100/50 hover:bg-white"}`}
            >
                <Heart size={16} fill={isWishlisted ? "currentColor" : "none"} strokeWidth={isWishlisted ? 0 : 2} />
            </button>

            {/* Hover Quick Actions */}
            <AnimatePresence>
                {isHovered && (
                    <motion.div 
                        initial={{ opacity: 0, y: 15 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: 15 }}
                        className="absolute inset-x-0 bottom-[140px] px-4 flex gap-2 z-20"
                    >
                        {isCartItem ? (
                            <>
                                <button
                                    onClick={(e) => {
                                        e.preventDefault();
                                        e.stopPropagation();
                                        onToggleCart();
                                    }}
                                    className="p-3 bg-white text-red-500 rounded-xl hover:bg-red-50 transition-all duration-300 shadow-xl border-2 border-red-50"
                                    title="Remove from Cart"
                                >
                                    <Trash2 size={16} />
                                </button>
                                <Link
                                    href="/cart"
                                    onClick={(e) => e.stopPropagation()}
                                    className="flex-1 flex items-center justify-center gap-2 py-3 bg-stone-900 text-white rounded-xl text-xs font-bold transition-all duration-300 shadow-xl border-2 border-stone-900 hover:bg-[#B8860B] hover:border-[#B8860B]"
                                >
                                    <ShoppingBag size={14} />
                                    Go to Cart
                                </Link>
                            </>
                        ) : (
                            <button
                                onClick={(e) => {
                                    e.preventDefault();
                                    e.stopPropagation();
                                    onToggleCart();
                                }}
                                className="flex-1 flex items-center justify-center gap-2 py-3 bg-white text-stone-900 rounded-xl text-xs font-bold transition-all duration-300 shadow-xl border-2 border-white hover:bg-stone-900 hover:text-white"
                            >
                                <ShoppingBag size={14} />
                                Add to Cart
                            </button>
                        )}
                    </motion.div>
                )}
            </AnimatePresence>
        </motion.div>
    );
}

export function SkeletonCard() {
    return (
        <div className="bg-white rounded-2xl overflow-hidden border border-gray-100 animate-pulse">
            <div className="aspect-square bg-gray-100" />
            <div className="p-5 space-y-3">
                <div className="h-3 w-1/3 bg-gray-100 rounded" />
                <div className="h-5 w-full bg-gray-100 rounded" />
                <div className="h-4 w-1/2 bg-gray-100 rounded" />
            </div>
        </div>
    );
}
