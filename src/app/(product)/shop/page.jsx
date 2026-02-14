"use client";

import { useState, useMemo, useEffect, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import { Card, CardHeader, CardTitle, CardContent, CardFooter, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Heart, ShoppingCart } from "lucide-react";
import Link from "next/link";
import { useCart } from "@/hooks/useCart";
import { useWishlist } from "@/hooks/useWishlist";

/**
 * 1. THE PAGE COMPONENT
 * This component MUST NOT use useSearchParams directly.
 * It acts as the boundary.
 */
export default function Page() {
    return (
        <div className="space-y-6">
            <div className="flex justify-between items-end">
                <div>
                    <h1 className="text-3xl font-bold text-[#2d1a10]">Our Collection</h1>
                </div>
            </div>

            <Suspense fallback={<div className="text-center py-20">Loading Shop Content...</div>}>
                <ShopContent />
            </Suspense>
        </div>
    );
}

/**
 * 2. THE CONTENT COMPONENT
 * The hook is called here, safely isolated by the Suspense boundary above.
 */
function ShopContent() {
    const searchParams = useSearchParams();
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(true);
    const { cart, addToCart: addToCartHook, removeFromCart } = useCart();
    const { isInWishlist, toggleWishlist: toggleWishlistHook } = useWishlist();

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

    const filteredProducts = useMemo(() => {
        if (!products) return [];

        return products.filter((product) => {
            const search = searchParams.get("search")?.toLowerCase();
            if (search && !product.name?.toLowerCase().includes(search)) return false;

            const filters = ["category", "material", "type"];
            for (const filter of filters) {
                const paramValue = searchParams.get(filter);
                if (!paramValue) continue;

                const urlValues = paramValue.toLowerCase().split(",");
                const productValue = product[filter]?.toLowerCase();
                
                if (productValue && !urlValues.includes(productValue)) {
                    return false;
                }
            }
            return true;
        });
    }, [products, searchParams]);

    if (loading) return <div className="text-center py-12">Loading products...</div>;

    return (
        <>
            <p className="text-[#7c6a58] mb-4">Showing {filteredProducts.length} items</p>
            {filteredProducts.length === 0 ? (
                <div className="text-center py-20 bg-white rounded-xl border">
                    <p className="text-[#7c6a58]">No jewellery matches your current filters.</p>
                </div>
            ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                    {filteredProducts.map((product) => {
                        const isCartItem = cart?.some((item) => item.id === product._id);
                        const isWishlisted = isInWishlist(product._id);
                        
                        return (
                            <Card key={product._id} className="group hover:shadow-md transition-shadow">
                                <CardHeader className="relative p-0 overflow-hidden rounded-t-xl">
                                    <img 
                                        src={product.image} 
                                        alt={product.name} 
                                        className="w-full h-56 object-cover transition-transform group-hover:scale-105" 
                                    />
                                    <button
                                        type="button"
                                        className="absolute top-3 right-3 p-2 rounded-full bg-white/90 shadow-sm hover:text-red-500"
                                        onClick={() => toggleWishlistHook(product)}
                                    >
                                        <Heart className={`w-4 h-4 ${isWishlisted ? "fill-red-500 text-red-500" : ""}`} />
                                    </button>
                                </CardHeader>
                                <CardContent className="p-4">
                                    <CardDescription className="text-xs uppercase tracking-widest text-[#a78b71]">
                                        {product.material} • {product.type}
                                    </CardDescription>
                                    <CardTitle className="text-lg mt-1">{product.name}</CardTitle>
                                    <p className="text-[#5c4632] font-bold mt-2">
                                        ₹{product.price?.toLocaleString() ?? "0"}
                                    </p>
                                </CardContent>
                                <CardFooter className="p-4 pt-0 gap-2">
                                    <Button className="flex-1 bg-[#1B4D3E] hover:bg-[#143a2f]" asChild>
                                        <Link href={`/product/${product._id}`}>View</Link>
                                    </Button>
                                    <Button 
                                        variant="outline" 
                                        size="icon" 
                                        onClick={() => isCartItem ? removeFromCart(product._id) : addToCartHook(product, 1)}
                                    >
                                        <ShoppingCart className={`w-4 h-4 ${isCartItem ? "fill-current text-[#1B4D3E]" : ""}`} />
                                    </Button>
                                </CardFooter>
                            </Card>
                        );
                    })}
                </div>
            )}
        </>
    );
}