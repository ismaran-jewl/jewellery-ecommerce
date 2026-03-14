"use client";

import { useState } from "react";
import { Heart, ShoppingCart } from "lucide-react";
import Link from "next/link";

export function SkeletonCard() {
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

export function ProductCard({ product, isCartItem, isWishlisted, onToggleWishlist, onToggleCart }) {
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
                    className={`btn-wishlist absolute top-2.5 right-2.5 p-1.5 sm:p-2 rounded-full shadow-lg backdrop-blur-sm
                        ${isWishlisted
                            ? "bg-red-50 border border-red-200 text-red-500 scale-110"
                            : "bg-white/85 border border-white/50 text-[#6FAFA3] hover:text-red-400 hover:scale-110"}`}
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
                    <p className="text-sm sm:text-lg font-bold text-[#5FBFA7] tracking-tight mb-2">
                        ₹{product.price?.toLocaleString("en-IN") ?? "0"}
                    </p>
                    <div className="flex gap-1.5">
                        <Link
                            href={`/product/${product._id}`}
                            className="btn-press flex-1 flex items-center justify-center bg-[#5FBFA7] hover:bg-[#7a5122] text-white text-[9px] sm:text-xs h-7 sm:h-9 rounded-xl font-semibold tracking-wide hover:shadow-[0_4px_16px_rgba(146,98,42,0.5)]"
                        >
                            Explore
                        </Link>
                        <button
                            type="button"
                            onClick={onToggleCart}
                            className={`btn-cart w-7 h-7 sm:w-9 sm:h-9 rounded-xl border flex-shrink-0 flex items-center justify-center
                                ${isCartItem
                                    ? "bg-[#5FBFA7] border-[#5FBFA7] text-white shadow-[0_4px_16px_rgba(146,98,42,0.4)]"
                                    : "border-[#DDF6F0] text-[#6FAFA3] hover:border-[#5FBFA7] hover:text-[#5FBFA7] hover:bg-[#fdf3e7]"}`}
                        >
                            <ShoppingCart className={`w-3 h-3 sm:w-3.5 sm:h-3.5 ${isCartItem ? "fill-white" : ""}`} />
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}
