"use client";

import { useState, use } from "react";
import { products } from "@/data/products";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Heart, ShoppingCart, Truck, ShieldCheck, ArrowRight, Minus, Plus, Star } from "lucide-react";
import { toast } from "sonner";
import Link from "next/link";
import { useCart } from "@/hooks/useCart";
import { useWishlist } from "@/hooks/useWishlist";

export default function Page({ params }) {
	const resolvedParams = use(params);
	const id = Number(resolvedParams?.id);
	const product = products.find((p) => p.id === id);
	const [quantity, setQuantity] = useState(1);
	const { addToCart: addToCartHook } = useCart();
	const { isInWishlist, toggleWishlist } = useWishlist();
	const isWishlisted = isInWishlist(id);

	if (!product) {
		return (
			<main className="min-h-screen flex items-center justify-center bg-[#f8fafc]">
				<div className="text-center">
					<h1 className="text-2xl font-bold mb-2">Product Not Found</h1>
					<Link href="/shop" className="text-blue-600 underline">Back to Shop</Link>
				</div>
			</main>
		);
	}

	const relatedProducts = products
		.filter((p) => p.category === product.category && p.id !== product.id)
		.slice(0, 4);

	const addToCart = () => {
		addToCartHook(product, quantity);
	};

	return (
		<main className="min-h-screen bg-[#fffaf6] py-12">
			<div className="container mx-auto px-4">
				<div className="mb-6">
					<Link href="/shop" className="text-[#7c6a58] hover:text-[#2d1a10] flex items-center gap-2 text-sm font-medium">
						<ArrowRight className="w-4 h-4 rotate-180" /> Back to Shop
					</Link>
				</div>

				<div className="grid grid-cols-1 md:grid-cols-2 gap-12 mb-16">
					{/* Image Section */}
					<div className="space-y-4">
						<div className="aspect-square overflow-hidden rounded-2xl border bg-white p-2 shadow-sm">
							<img src={product.image} alt={product.name} className="w-full h-full object-cover rounded-xl hover:scale-105 transition-transform duration-500" />
						</div>
					</div>

					{/* Details Section */}
					<div className="space-y-6">
						<div>
							<Link href={`/category/${product.category}`}>
								<Badge variant="secondary" className="mb-3 capitalize px-3 py-1 hover:bg-secondary/80 transition-colors">{product.category}</Badge>
							</Link>
							<h1 className="text-4xl font-serif font-bold text-[#2d1a10] mb-2">{product.name}</h1>
							<div className="flex items-center gap-2 text-sm text-[#7c6a58]">
								<div className="flex text-yellow-500">
									{[...Array(5)].map((_, i) => <Star key={i} className="w-4 h-4 fill-current" />)}
								</div>
								<span>(4.8 stars)</span>
								<span>•</span>
								<span>120 reviews</span>
							</div>
						</div>

						<div className="text-3xl font-medium text-[#5c4632]">
							₹{product.price.toLocaleString()}
						</div>

						<p className="text-[#7c6a58] leading-relaxed text-lg">
							Elevate your style with this exquisite {product.name}. Handcrafted with precision, this piece features premium {product.material} and a timeless design suitable for any occasion.
						</p>

						<Separator />

						<div className="grid grid-cols-2 gap-4 text-sm">
							<div>
								<span className="font-semibold text-[#2d1a10]">Material:</span> <span className="text-[#7c6a58] capitalize">{product.material}</span>
							</div>
							<div>
								<span className="font-semibold text-[#2d1a10]">Type:</span> <span className="text-[#7c6a58] capitalize">{product.type}</span>
							</div>
							<div>
								<span className="font-semibold text-[#2d1a10]">Availability:</span> <span className="text-green-600 font-medium">In Stock</span>
							</div>
						</div>

						<Separator />

						<div className="flex flex-col sm:flex-row gap-4 pt-2">
							<div className="flex items-center border rounded-md bg-white">
								<Button variant="ghost" size="icon" onClick={() => setQuantity(Math.max(1, quantity - 1))} disabled={quantity <= 1}>
									<Minus className="w-4 h-4" />
								</Button>
								<span className="w-12 text-center font-medium">{quantity}</span>
								<Button variant="ghost" size="icon" onClick={() => setQuantity(quantity + 1)}>
									<Plus className="w-4 h-4" />
								</Button>
							</div>
							<Button className="flex-1 h-10" size="lg" onClick={addToCart}>
								<ShoppingCart className="w-4 h-4 mr-2" /> Add to Cart
							</Button>
							<Button variant="outline" size="icon" className="h-10 w-10" onClick={() => toggleWishlist(product)}>
								<Heart className={`w-5 h-5 ${isWishlisted ? "fill-red-500 text-red-500" : ""}`} />
							</Button>
						</div>

						<div className="flex gap-6 text-sm text-[#7c6a58] pt-4">
							<div className="flex items-center gap-2">
								<Truck className="w-4 h-4" /> Free Shipping
							</div>
							<div className="flex items-center gap-2">
								<ShieldCheck className="w-4 h-4" /> Lifetime Warranty
							</div>
						</div>
					</div>
				</div>

				{/* Related Products */}
				{relatedProducts.length > 0 && (
					<div className="space-y-8 mt-20">
						<div className="flex items-center justify-between">
							<h2 className="text-3xl font-serif font-bold text-[#2d1a10]">You May Also Like</h2>
							<Link href="/shop" className="text-[#C59D5F] hover:underline font-medium">View All</Link>
						</div>
						<div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
							{relatedProducts.map((rp) => (
								<Card key={rp.id} className="group cursor-pointer hover:shadow-xl transition-all duration-300 border-none shadow-md">
									<CardHeader className="p-0">
										<div className="aspect-[4/5] overflow-hidden rounded-t-xl bg-gray-100">
											<img src={rp.image} alt={rp.name} className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" />
										</div>
									</CardHeader>
									<CardContent className="p-5">
										<CardTitle className="text-lg mb-2 group-hover:text-[#C59D5F] transition-colors line-clamp-1">{rp.name}</CardTitle>
										<div className="text-[#5c4632] font-semibold">₹{rp.price.toLocaleString()}</div>
									</CardContent>
									<CardFooter className="p-5 pt-0">
										<Button variant="outline" className="w-full hover:bg-[#C59D5F] hover:text-white transition-colors" asChild>
											<Link href={`/product/${rp.id}`}>View Details</Link>
										</Button>
									</CardFooter>
								</Card>
							))}
						</div>
					</div>
				)}
			</div>
		</main>
	);
}
