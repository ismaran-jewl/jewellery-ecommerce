"use client";

import { useState, useMemo, useEffect, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import { Card, CardHeader, CardTitle, CardContent, CardFooter, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Heart, ShoppingCart, SlidersHorizontal, ChevronDown, Gem } from "lucide-react";
import Link from "next/link";
import { useCart } from "@/hooks/useCart";
import { useWishlist } from "@/hooks/useWishlist";
import { useSession } from "next-auth/react";
import { toast } from "sonner";

/* ─────────────────────────────────────────
   SKELETON CARD
───────────────────────────────────────── */
function SkeletonCard() {
    return (
        <div className="rounded-2xl overflow-hidden bg-white border border-[#e8ddd4] animate-pulse">
            <div className="h-72 bg-[#f0e9e2]" />
            <div className="p-5 space-y-3">
                <div className="h-3 w-24 bg-[#e0d4c8] rounded-full" />
                <div className="h-5 w-40 bg-[#e0d4c8] rounded-full" />
                <div className="h-5 w-20 bg-[#d4c4b0] rounded-full" />
                <div className="flex gap-2 pt-2">
                    <div className="flex-1 h-10 bg-[#e0d4c8] rounded-xl" />
                    <div className="w-10 h-10 bg-[#e0d4c8] rounded-xl" />
                </div>
            </div>
        </div>
    );
}

/* ─────────────────────────────────────────
   PRODUCT CARD
───────────────────────────────────────── */
function ProductCard({ product, isCartItem, isWishlisted, onToggleWishlist, onToggleCart }) {
    const [imgLoaded, setImgLoaded] = useState(false);

    return (
        <div className="group relative bg-white rounded-2xl overflow-hidden border border-[#e8ddd4] hover:border-[#c4a882] hover:shadow-[0_8px_40px_rgba(180,140,100,0.18)] transition-all duration-500 flex flex-col">
            {/* Image */}
            <div className="relative overflow-hidden h-64 sm:h-72 bg-[#f5ede4]">
                {!imgLoaded && (
                    <div className="absolute inset-0 bg-[#f0e9e2] animate-pulse" />
                )}
                <img
                    src={product.image}
                    alt={product.name}
                    onLoad={() => setImgLoaded(true)}
                    className={`w-full h-full object-cover transition-all duration-700 group-hover:scale-108 ${imgLoaded ? "opacity-100" : "opacity-0"}`}
                    style={{ transform: "scale(1)", transition: "transform 0.7s cubic-bezier(0.25,0.46,0.45,0.94), opacity 0.4s" }}
                    onMouseEnter={e => e.currentTarget.style.transform = "scale(1.07)"}
                    onMouseLeave={e => e.currentTarget.style.transform = "scale(1)"}
                />

                {/* Wishlist btn */}
                <button
                    type="button"
                    onClick={onToggleWishlist}
                    className={`absolute top-3 right-3 p-2.5 rounded-full shadow-md backdrop-blur-sm transition-all duration-300 
                        ${isWishlisted
                            ? "bg-red-50 border border-red-200 text-red-500"
                            : "bg-white/90 border border-white/60 text-[#9c8472] hover:text-red-400 hover:bg-red-50"
                        }`}
                >
                    <Heart className={`w-4 h-4 transition-all ${isWishlisted ? "fill-red-500 scale-110" : ""}`} />
                </button>

                {/* Material badge */}
                <div className="absolute bottom-3 left-3 px-3 py-1 rounded-full bg-black/30 backdrop-blur-sm text-white text-[10px] uppercase tracking-widest font-medium">
                    {product.material}
                </div>
            </div>

            {/* Content */}
            <div className="p-5 flex flex-col flex-1">
                <p className="text-[10px] uppercase tracking-[0.2em] text-[#a78b71] font-medium mb-1">
                    {product.type}
                </p>
                <h3 className="text-base font-semibold text-[#2d1a10] leading-snug mb-3 line-clamp-2 flex-1">
                    {product.name}
                </h3>

                <div className="flex items-center justify-between mt-auto pt-3 border-t border-[#f0e6dc]">
                    <div>
                        <p className="text-[10px] text-[#b09880] uppercase tracking-wider">Price</p>
                        <p className="text-xl font-bold text-[#1B4D3E] tracking-tight">
                            ₹{product.price?.toLocaleString("en-IN") ?? "0"}
                        </p>
                    </div>
                    <div className="flex gap-2">
                        <Button
                            asChild
                            className="bg-[#1B4D3E] hover:bg-[#143a2f] text-white text-sm px-5 h-10 rounded-xl font-medium tracking-wide transition-all duration-300 hover:shadow-[0_4px_20px_rgba(27,77,62,0.35)]"
                        >
                            <Link href={`/product/${product._id}`}>Explore</Link>
                        </Button>
                        <button
                            type="button"
                            onClick={onToggleCart}
                            className={`w-10 h-10 rounded-xl border flex items-center justify-center transition-all duration-300
                                ${isCartItem
                                    ? "bg-[#1B4D3E] border-[#1B4D3E] text-white shadow-[0_4px_20px_rgba(27,77,62,0.3)]"
                                    : "border-[#d4c4b0] text-[#7c6a58] hover:border-[#1B4D3E] hover:text-[#1B4D3E] hover:bg-[#f0f7f5]"
                                }`}
                        >
                            <ShoppingCart className={`w-4 h-4 ${isCartItem ? "fill-white" : ""}`} />
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
        { value: "default", label: "Featured" },
        { value: "price-asc", label: "Price: Low to High" },
        { value: "price-desc", label: "Price: High to Low" },
        { value: "name-asc", label: "Name: A–Z" },
    ];
    const current = options.find(o => o.value === value) ?? options[0];

    return (
        <div className="relative">
            <button
                type="button"
                onClick={() => setOpen(p => !p)}
                className="flex items-center gap-2 px-4 py-2.5 rounded-xl border border-[#d4c4b0] bg-white text-sm text-[#5c4632] hover:border-[#a78b71] transition-colors font-medium"
            >
                <SlidersHorizontal className="w-4 h-4 text-[#a78b71]" />
                <span>{current.label}</span>
                <ChevronDown className={`w-4 h-4 text-[#a78b71] transition-transform ${open ? "rotate-180" : ""}`} />
            </button>
            {open && (
                <div className="absolute right-0 top-12 z-50 w-52 bg-white rounded-xl border border-[#e0d0c0] shadow-xl overflow-hidden">
                    {options.map(opt => (
                        <button
                            key={opt.value}
                            type="button"
                            onClick={() => { onChange(opt.value); setOpen(false); }}
                            className={`w-full text-left px-4 py-3 text-sm transition-colors
                                ${opt.value === value
                                    ? "bg-[#f0f7f5] text-[#1B4D3E] font-semibold"
                                    : "text-[#5c4632] hover:bg-[#faf6f2]"
                                }`}
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
   PAGE WRAPPER
───────────────────────────────────────── */
export default function Page() {
    return (
        <div className="min-h-screen bg-[#fdf8f4]">
            {/* Decorative top bar */}
            <div className="h-1 w-full bg-gradient-to-r from-[#c4a882] via-[#1B4D3E] to-[#c4a882]" />

            <div className="container mx-auto px-4 sm:px-6 lg:px-8 pt-28 sm:pt-36 pb-32 max-w-7xl">
                {/* Page Header */}
                <div className="mb-10">
                    <div className="flex items-center gap-2 mb-2">
                        <Gem className="w-4 h-4 text-[#c4a882]" />
                        <span className="text-xs uppercase tracking-[0.25em] text-[#a78b71] font-medium">Curated for you</span>
                    </div>
                    <h1
                        className="text-4xl sm:text-5xl font-bold text-[#2d1a10] leading-tight"
                        style={{ fontFamily: "'Playfair Display', Georgia, serif" }}
                    >
                        Our Collection
                    </h1>
                    <p className="text-[#9c8472] mt-2 text-sm sm:text-base">
                        Handcrafted pieces made to be treasured forever.
                    </p>
                </div>

                <Suspense fallback={
                    <div>
                        <div className="flex justify-between items-center mb-6">
                            <div className="h-4 w-28 bg-[#e0d4c8] rounded-full animate-pulse" />
                            <div className="h-10 w-40 bg-[#e0d4c8] rounded-xl animate-pulse" />
                        </div>
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5 sm:gap-6">
                            {[...Array(6)].map((_, i) => <SkeletonCard key={i} />)}
                        </div>
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
function ShopContent() {
    const searchParams = useSearchParams();
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [sortBy, setSortBy] = useState("default");
    const { cart, addToCart: addToCartHook, removeFromCart } = useCart();
    const { isInWishlist, toggleWishlist: toggleWishlistHook } = useWishlist();
    const { data: session } = useSession();

    useEffect(() => {
        const fetchProducts = async () => {
            try {
                const response = await fetch("/api/products");
                if (response.ok) {
                    const data = await response.json();
                    setProducts(data);
                }
            } catch (error) {
                console.error("Error fetching products:", error);
            } finally {
                setLoading(false);
            }
        };
        fetchProducts();
    }, []);

    const filteredAndSorted = useMemo(() => {
        if (!products) return [];

        let result = products.filter((product) => {
            const search = searchParams.get("search")?.toLowerCase();
            if (search && !product.name?.toLowerCase().includes(search)) return false;

            const filters = ["category", "material", "type"];
            for (const filter of filters) {
                const paramValue = searchParams.get(filter);
                if (!paramValue) continue;
                const urlValues = paramValue.toLowerCase().split(",");
                const productValue = product[filter]?.toLowerCase();
                if (productValue && !urlValues.includes(productValue)) return false;
            }
            return true;
        });

        // Sort
        if (sortBy === "price-asc") result = [...result].sort((a, b) => (a.price ?? 0) - (b.price ?? 0));
        else if (sortBy === "price-desc") result = [...result].sort((a, b) => (b.price ?? 0) - (a.price ?? 0));
        else if (sortBy === "name-asc") result = [...result].sort((a, b) => a.name?.localeCompare(b.name));

        return result;
    }, [products, searchParams, sortBy]);

    if (loading) {
        return (
            <div>
                <div className="flex justify-between items-center mb-6">
                    <div className="h-4 w-28 bg-[#e0d4c8] rounded-full animate-pulse" />
                    <div className="h-10 w-40 bg-[#e0d4c8] rounded-xl animate-pulse" />
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5 sm:gap-6">
                    {[...Array(6)].map((_, i) => <SkeletonCard key={i} />)}
                </div>
            </div>
        );
    }

    return (
        <>
            {/* Toolbar */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-6">
                <p className="text-sm text-[#9c8472]">
                    Showing <span className="font-semibold text-[#5c4632]">{filteredAndSorted.length}</span> pieces
                </p>
                <SortDropdown value={sortBy} onChange={setSortBy} />
            </div>

            {/* Empty State */}
            {filteredAndSorted.length === 0 ? (
                <div className="flex flex-col items-center justify-center py-24 text-center bg-white rounded-2xl border border-[#e8ddd4]">
                    <div className="w-16 h-16 rounded-full bg-[#f5ede4] flex items-center justify-center mb-4">
                        <Gem className="w-7 h-7 text-[#c4a882]" />
                    </div>
                    <h3 className="text-lg font-semibold text-[#2d1a10] mb-2">No pieces found</h3>
                    <p className="text-sm text-[#9c8472] max-w-xs">
                        No jewellery matches your current filters. Try adjusting your search or clearing filters.
                    </p>
                </div>
            ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5 sm:gap-6">
                    {filteredAndSorted.map((product) => {
                        const isCartItem = cart?.some((item) => item.id === product._id);
                        const isWishlisted = isInWishlist(product._id);

                        return (
                            <ProductCard
                                key={product._id}
                                product={product}
                                isCartItem={isCartItem}
                                isWishlisted={isWishlisted}
                                onToggleWishlist={() => {
                                    if (!session) { toast.error("Please log in to use wishlist"); return; }
                                    toggleWishlistHook(product);
                                }}
                                onToggleCart={() => {
                                    if (isCartItem) {
                                        removeFromCart(product._id);
                                    } else {
                                        if (!session) { toast.error("Please log in to add items to cart"); return; }
                                        addToCartHook(product, 1);
                                    }
                                }}
                            />
                        );
                    })}
                </div>
            )}
        </>
    );
}