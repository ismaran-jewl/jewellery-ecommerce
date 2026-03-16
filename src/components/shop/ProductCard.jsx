"use client";

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
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
            className="group relative flex flex-col bg-white rounded-3xl overflow-hidden border border-stone-100 hover:border-[#B8860B]/30 hover:shadow-[0_20px_40px_rgba(184,134,11,0.1)] transition-all duration-700 h-full"
        >
            {/* The Main Link wrapper */}
            <Link 
                href={`/product/${product.slug || product._id}`} 
                className="flex flex-col flex-grow h-full"
            >
                {/* Image Container with elegant background */}
                <div className="relative aspect-[4/5] overflow-hidden bg-[#FDFCFB]">
                    {product.image ? (
                        <Image
                            src={getImageUrl(product.image)}
                            alt={product.name}
                            fill
                            sizes="(max-width: 640px) 50vw, (max-width: 1024px) 25vw, 20vw"
                            className="w-full h-full object-cover transition-transform duration-[1.5s] ease-out group-hover:scale-110"
                        />
                    ) : (
                        <div className="w-full h-full flex items-center justify-center text-stone-200">
                            <ShoppingBag size={48} strokeWidth={1} />
                        </div>
                    )}

                    {/* Badges: Minimalist */}
                    <div className="absolute top-4 left-4 flex flex-col gap-2 pointer-events-none">
                        {product.isNew && (
                            <span className="px-3 py-1 bg-black text-white text-[9px] font-bold uppercase tracking-[0.2em] rounded-full">
                                New Arrival
                            </span>
                        )}
                    </div>
                    
                    {/* Soft Vignette on Hover */}
                    <div className="absolute inset-0 bg-gradient-to-t from-black/20 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-700 pointer-events-none" />
                </div>

                {/* Elegant Content Section */}
                <div className="p-4 sm:p-6 flex flex-col flex-grow bg-white">
                    <div className="flex items-center justify-between mb-3">
                        <span className="text-[10px] text-stone-400 font-bold uppercase tracking-[0.2em]">
                            {product.category || "Fine Jewellery"}
                        </span>
                        <div className="flex items-center gap-1">
                            <Star size={10} className="text-[#B8860B]" fill="currentColor" />
                            <span className="text-[10px] text-stone-900 font-bold">4.9</span>
                        </div>
                    </div>

                    <h3 className="text-base sm:text-lg font-medium text-stone-900 group-hover:text-[#B8860B] transition-colors line-clamp-1 mb-2" style={{ fontFamily: "var(--font-playfair)" }}>
                        {product.name}
                    </h3>

                    <div className="mt-auto flex items-end justify-between">
                        <div className="flex flex-col">
                            <span className="text-xs text-stone-400 font-medium mb-0.5">Price starting at</span>
                            <span className="text-lg sm:text-xl font-bold text-stone-900">
                                ₹{product.price?.toLocaleString()}
                            </span>
                        </div>
                        
                        <div className="p-2 rounded-full border border-stone-100 text-stone-900 group-hover:bg-[#B8860B] group-hover:text-white group-hover:border-[#B8860B] transition-all duration-500">
                            <ShoppingBag size={14} />
                        </div>
                    </div>
                </div>
            </Link>

            {/* ACTION BUTTONS */}
            <button
                onClick={(e) => {
                    e.preventDefault();
                    e.stopPropagation();
                    onToggleWishlist();
                }}
                className={`absolute top-4 right-4 p-2.5 rounded-full backdrop-blur-md transition-all duration-500 z-20
                    ${isWishlisted 
                        ? "bg-red-500 text-white shadow-lg" 
                        : "bg-white/80 text-stone-900 border border-stone-200/50 hover:bg-white"}`}
            >
                <Heart size={16} fill={isWishlisted ? "currentColor" : "none"} strokeWidth={isWishlisted ? 0 : 1.5} />
            </button>

            {/* Hover Quick View Overlay */}
            <AnimatePresence>
                {isHovered && (
                    <motion.div 
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="absolute inset-x-0 bottom-[140px] px-6 flex flex-col gap-2 z-20 pointer-events-none"
                    >
                        <motion.button 
                            initial={{ y: 20 }}
                            animate={{ y: 0 }}
                            className="w-full py-3 bg-white/90 backdrop-blur-md text-stone-900 rounded-xl text-[10px] font-bold uppercase tracking-widest shadow-2xl pointer-events-auto hover:bg-[#B8860B] hover:text-white transition-all flex items-center justify-center gap-2"
                            onClick={(e) => {
                                e.preventDefault();
                                e.stopPropagation();
                                onToggleCart();
                            }}
                        >
                            {isCartItem ? (
                                <><Trash2 size={12} /> Remove from Bag</>
                            ) : (
                                <><ShoppingBag size={12} /> Add to Bag</>
                            )}
                        </motion.button>
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
