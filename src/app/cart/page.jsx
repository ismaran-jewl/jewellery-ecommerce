"use client";

import { useState, useEffect } from "react";
import { Card, CardHeader, CardTitle, CardContent, CardFooter, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useCart } from "@/hooks/useCart";
import { Minus, Plus, Trash2, ShoppingBag, ArrowRight, ShoppingCart } from "lucide-react";
import Link from "next/link";
import { motion } from "framer-motion";

export default function Page() {
	const { cart, updateQty, removeFromCart, addToCart, isLoaded } = useCart();
	const [products, setProducts] = useState([]);
	const [loading, setLoading] = useState(true);

	useEffect(() => {
		const fetchProducts = async () => {
			try {
				const response = await fetch("/api/products");
				if (response.ok) {
					const data = await response.json();
					setProducts(data);
				}
			} catch (error) {
				console.error("Failed to fetch products:", error);
			} finally {
				setLoading(false);
			}
		};

		fetchProducts();
	}, []);

	const cartItems = cart.map((item) => {
		// Match product by _id (MongoDB) or id (string)
		const product = products?.find((p) => (p._id || p.id) === item.id);
		return product ? { ...product, qty: item.qty } : null;
	}).filter(Boolean);

	const total = cartItems.reduce((sum, item) => sum + (item.price * item.qty), 0);

	const recommendedProducts = products
		.filter((p) => !cart.some((item) => item.id === (p._id || p.id)))
		.slice(0, 4);

	if (!isLoaded || loading) return <main className="min-h-screen bg-[#f8fafc] py-10"><div className="container mx-auto px-4">Loading cart...</div></main>;

	return (
		<main className="min-h-screen bg-[#f8fafc] py-10 relative overflow-hidden">
			{/* Background Motion */}
			<div className="absolute inset-0 z-0 pointer-events-none">
				<motion.div
					animate={{
						scale: [1, 1.2, 1],
						rotate: [0, 90, 0],
						x: [0, 50, 0]
					}}
					transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
					className="absolute -top-20 -left-20 w-[500px] h-[500px] bg-[#F5FFFA] rounded-full blur-[120px] opacity-40"
				/>
				<motion.div
					animate={{
						scale: [1, 1.3, 1],
						y: [0, 100, 0]
					}}
					transition={{ duration: 15, repeat: Infinity, ease: "easeInOut" }}
					className="absolute bottom-0 right-0 w-[600px] h-[600px] bg-[#FFDAB9]/20 rounded-full blur-[150px]"
				/>
			</div>

			<div className="container mx-auto px-4 relative z-10">
				<h1 className="text-3xl font-bold mb-6 text-[#2d1a10]">Your Cart</h1>
				{cartItems.length === 0 ? (
					<div className="flex flex-col items-center justify-center py-16 text-center">
						<motion.div
							initial={{ scale: 0.8, opacity: 0 }}
							animate={{ scale: 1, opacity: 1 }}
							transition={{ duration: 0.5 }}
							className="bg-white p-6 rounded-full shadow-lg mb-6"
						>
							<ShoppingBag className="w-12 h-12 text-[#C59D5F]" />
						</motion.div>
						<h2 className="text-2xl font-serif font-bold text-[#2d1a10] mb-2">Your Cart is Empty</h2>
						<p className="text-[#7c6a58] mb-8 max-w-md">Looks like you haven't added any exquisite pieces to your collection yet.</p>
						<Button asChild className="bg-[#2d1a10] hover:bg-[#4a2c1d] text-white px-8 py-6 rounded-full text-lg group transition-all duration-300 hover:shadow-xl">
							<Link href="/shop" className="flex items-center gap-2">Shop for Elegance <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" /></Link>
						</Button>
					</div>
				) : (
					<div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
						<div className="lg:col-span-2 space-y-6">
							{cartItems.map((item) => (
								<Card key={item.id} className="flex flex-col sm:flex-row items-center gap-4 p-4">
									<img src={item.image} alt={item.name} className="w-24 h-24 object-cover rounded-lg border" />
									<div className="flex-1 text-center sm:text-left">
										<CardTitle>{item.name}</CardTitle>
										<CardDescription className="capitalize text-xs text-[#a78b71]">{item.material} {item.type}</CardDescription>
										<div className="flex items-center justify-center sm:justify-start gap-2 mt-2">
											<Button variant="outline" size="icon" className="h-8 w-8" onClick={() => updateQty(item.id, -1)}>
												<Minus className="w-3 h-3" />
											</Button>
											<span className="w-8 text-center text-[#5c4632] font-medium">{item.qty}</span>
											<Button variant="outline" size="icon" className="h-8 w-8" onClick={() => updateQty(item.id, 1)}>
												<Plus className="w-3 h-3" />
											</Button>
											<Button variant="ghost" size="icon" className="h-8 w-8 text-red-500 hover:text-red-600 hover:bg-red-50" onClick={() => removeFromCart(item.id)}>
												<Trash2 className="w-4 h-4" />
											</Button>
										</div>
									</div>
									<div className="text-right">
										<div className="text-[#5c4632] font-semibold">₹{(item.price * item.qty).toLocaleString()}</div>
									</div>
								</Card>
							))}
						</div>
						<div className="lg:col-span-1">
							<Card className="p-6 h-fit sticky top-24 border-none shadow-lg bg-white/80 backdrop-blur-sm">
								<h3 className="text-xl font-serif font-bold text-[#2d1a10] mb-6">Order Summary</h3>
								<div className="space-y-4 mb-6">
									<div className="flex justify-between text-[#7c6a58]">
										<span>Subtotal</span>
										<span>₹{total.toLocaleString()}</span>
									</div>
									<div className="flex justify-between text-[#7c6a58]">
										<span>Shipping</span>
										<span className="text-green-600">Free</span>
									</div>
									<div className="h-px bg-gray-200 my-4" />
									<div className="flex justify-between text-lg font-bold text-[#2d1a10]">
										<span>Total</span>
										<span>₹{total.toLocaleString()}</span>
									</div>
								</div>
								<Button className="w-full h-12 text-lg" variant="default" asChild>
									<Link href="/checkout">Proceed to Checkout</Link>
								</Button>
							</Card>
						</div>
					</div>
				)}

				{/* Recommended Products */}
				{recommendedProducts.length > 0 && (
					<div className="mt-24">
						<h2 className="text-3xl font-serif font-bold text-[#2d1a10] mb-8">You Might Also Like</h2>
						<div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
							{recommendedProducts.map((product) => (
								<Card key={product._id} className="group hover:shadow-xl transition-all duration-300 border-none shadow-md bg-white">
									<CardHeader className="p-0">
										<div className="aspect-[4/5] overflow-hidden rounded-t-xl bg-gray-100 relative">
											<img
												src={product.image}
												alt={product.name}
												className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
											/>
										</div>
									</CardHeader>
									<CardContent className="p-4">
										<CardTitle className="text-lg mb-1 line-clamp-1 group-hover:text-[#C59D5F] transition-colors">{product.name}</CardTitle>
										<div className="text-[#5c4632] font-semibold">₹{product.price.toLocaleString()}</div>
									</CardContent>
									<CardFooter className="p-4 pt-0 gap-2">
										<Button variant="outline" className="flex-1 hover:bg-[#C59D5F] hover:text-white transition-colors" asChild>
											<Link href={`/product/${product._id}`}>View</Link>
										</Button>
										<Button size="icon" className="bg-[#2d1a10] hover:bg-[#4a2c1d]" onClick={() => addToCart(product, 1)}>
											<ShoppingCart className="w-4 h-4" />
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
